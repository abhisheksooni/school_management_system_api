import dayjs from "dayjs";
import mongoose from "mongoose";
import { StudentAttendanceRecord } from "../models/student/attendance.model.js";
import {
  SchoolClass,
  StudentProfile,
} from "../models/student/student_model.js";
import * as studentAttendanceRepos from "../repository/studentAttendanceRepo.js";
import { findStudentByIdAttendanceData } from "../repository/studentRepo.js";
import { devLog } from "../utils/devlogger.js";

// Example
const date = new Date("2025-12-07T18:30:00.000Z");
const formatted = dayjs(date).format("DD-MM-YYYY"); // 07-12-2025



/**
 * 📅 Mark Bulk Attendance (single students or whole class)
 *
 * Expected body:
 * {
 *    date: "2025-12-25",
 *    class_id: "6948148a71e2432adc9109f5", // optional
 *    records: [  // optional if class_id present
 *      { student_id: "...", status: "P|A|H|S", remark: "..." }
 *    ],
 *    recorded_by: "teacher_id"
 * }
 */

export const createStudentAttendance = async (data) => {
  devLog(`Student mark Bulk Attendance`, {
    level: "p",
  });

  const { date, records, class_id, recorded_by } = data.body;

  if (!date) {
    throw "Date required";
  }

  // Normalize date to midnight
  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  let finalRecords = [];

  // CASE 1: Class holiday
  if (class_id && (!records || records.length === 0)) {
    // Mark all students in class as holiday by default
    const students = await StudentProfile.find({ class_id }).select("_id");
    finalRecords = students.map((s) => ({
      student_id: s._id,
      class_id,
      date: attendanceDate,
      status: "H", // Holiday
      remark: "Class Holiday",
      recorded_by: recorded_by || null,
    }));
  } else if (records && records.length > 0) {
    const validStatuses = ["P", "A", "H", "S"];
    for (const r of records) {
      if (!r.student_id || !validStatuses.includes(r.status)) {
        throw new Error(`Invalid record: ${JSON.stringify(r)}`);
      }
    }

    finalRecords = records.map((r) => ({
      student_id: r.student_id,
      class_id,
      date: attendanceDate,
      status: r.status,
      remark: r.remark || "",
      recorded_by: recorded_by || null,
    }));
  } else {
    throw new Error("Records or class_id required");
  }

  // Prepare bulk operations
  const bulkOps = finalRecords.map((record) => ({
    updateOne: {
      filter: {
        student_id: record.student_id,
        class_id: record.class_id,
        date: record.date,
      },

      update: { $set: record },
      upsert: true, // insert if not exists
    },
  }));
  // await StudentAttendanceRecord.bulkWrite(bulkOps);
  const result = await studentAttendanceRepos.createBulkAttendance(bulkOps);

  devLog(`Attendance marked for ${finalRecords.length} students`, {
    level: "s",
    // data:bulkOps
  });

  // console.log("bulkOps",bulkOps);
  // console.log("finalRecords",finalRecords);

  return {
    success: true,
    message: `${finalRecords.length} Students Attendance Marked`,
    // failed: failedRecords || []
  };
};

export const bulkCreateAttendance = async (data) => {
  const { class_id, date, attendance } = data.body;

  devLog(`Student mark bulkCreateAttendance bulkCreateAttendance`, {
    level: "p",
  });
  if (!class_id || !date || !attendance || !attendance.length) {
    throw "All fields are required";
  }

  const formattedDate = dayjs(date).startOf("day").toDate();

  const bulkOperations = attendance.map((att) => {
    return {
      updateOne: {
        filter: { student_id: att.student_id, class_id },
        update: {
          $push: {
            attedancesData: {
              date: formattedDate,
              status: att.status,
              remark: att.remark || null,
              recorded_by: att.recorded_by,
            },
          },
        },
        upsert: true, // Create if not exists
      },
    };
  });

  const result = await StudentAttendanceRecord.bulkWrite(bulkOperations);

  return {
    message: "Attendance saved successfully",
    data: result,
  };
};

// Ek student ki monthly / weekly attendance
export const getAttendanceByStudent = async (data) => {
  devLog(`Find -Service- getAttendanceByStudent  `, {
    level: "p",
  });
  const { studentId, from, to } = data.query;

  const findStudent = await findStudentByIdAttendanceData(studentId);

  if (!findStudent) {
    throw new Error("Student not Find");
  }

  const query = {
    //  student_id: studentId,
    student_id: new mongoose.Types.ObjectId(studentId),
    is_active: true,
  };
  if (from && to) {
    query.date = {
      $gte: new Date(from),
      $lte: new Date(to),
    };
  }

  // Aggregation
  const result = await StudentAttendanceRecord.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$student_id",
        present: { $sum: { $cond: [{ $eq: ["$status", "P"] }, 1, 0] } },
        absent: { $sum: { $cond: [{ $eq: ["$status", "A"] }, 1, 0] } },
        holiday: { $sum: { $cond: [{ $eq: ["$status", "H"] }, 1, 0] } },
        sunday: { $sum: { $cond: [{ $eq: ["$status", "S"] }, 1, 0] } },
        total_days: { $sum: 1 },
        records: {
          $push: { date: "$date", status: "$status", remark: "$remark" },
        },
      },
    },
    {
      $addFields: {
        working_days: { $add: ["$present", "$absent"] }, // holidays & Sundays excluded
        percentage: {
          $cond: [
            { $eq: [{ $add: ["$present", "$absent"] }, 0] },
            0,
            {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: ["$present", { $add: ["$present", "$absent"] }],
                    },
                    100,
                  ],
                },
                2, // 2 decimal places
              ],
            },
          ],
        },
      },
    },

    {
      $project: {
        _id: 0, // remove MongoDB _id
        // student_id: "$_id",
        present: 1,
        absent: 1,
        holiday: 1,
        sunday: 1,
        total_days: 1,
        working_days: 1,
        percentage: 1,
        records: 1,
      },
    },
  ]);

  // Format dates in DD-MM-YYYY
  if (result[0] && result[0].records) {
    result[0].records = result[0].records.map((r) => ({
      ...r,
      date: dayjs(r.date).format("DD-MM-YYYY"),
    }));
  }

  // const result = await studentAttendanceRepos.getAttendanceByStudent(query)

  devLog(`Find -Service- getAttendanceByStudent  `, {
    level: "s",
  });

  return {
    status: 200,
    message: "Attendance fetched successfully",
    data: {
      attendance: result[0] || {
        present: 0,
        absent: 0,
        holiday: 0,
        sunday: 0,
        total_days: 0,
        working_days: 0,
        percentage: 0,
        records: [],
        // student: ,
      },
      student: findStudent || null,
    },
  };
};

export const getAttendanceByClassService = async (data) => {
  let { classIds, classId, date, from, to } = data.query;

  devLog(`Find -Service- getAttendanceByClassService  `, {
    level: "r",
    data: data.query,
  });

  // Validate: require at least one
  if (!classId && !classIds) {
    throw new Error("classId or classIds is required");
  }


  const buildDateFilter = () => {
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return {
      $gte: new Date(start.getTime() - 5.5 * 60 * 60 * 1000),
      $lte: new Date(end.getTime() - 5.5 * 60 * 60 * 1000),
    };
  }

  if (from && to) {
    return {
      $gte: new Date(from),
      $lte: new Date(to),
    };
  }

  return null;
};
  devLog(`Find -Service- getAttendanceByClassService  `, {
    level: "r",
  });

  let result = null;

  // Singal Class result
  if (classId) {

    console.log("Single class if");

    const query = {
      class_id: new mongoose.Types.ObjectId(classId),
      is_active: true,
    };

    const dateFilter = buildDateFilter();

    if (dateFilter) query.date = dateFilter;
    // result = await studentAttendanceRepos.getAttendanceByClass(query);
    let res = await StudentAttendanceRecord.aggregate([
      { $match: query },

      // Lookup student info
      {
        $lookup: {
          from: "studentprofiles",
          localField: "student_id",
          foreignField: "_id",
          as: "student_info",
        },
      },
      { $unwind: "$student_info" },

      // Lookup class info
      {
        $lookup: {
          from: "schoolclasses",
          localField: "class_id",
          foreignField: "_id",
          as: "class_info",
        },
      },
      { $unwind: "$class_info" },

      // Group by student + class
      {
        $group: {
          _id: { class_id: "$class_id", student_id: "$student_id" },
          class_name: { $first: "$class_info.name" },
          class_section: { $first: "$class_info.section" },
          student_name: { $first: "$student_info.full_name" },
          student_roll_number: { $first: "$student_info.roll_number" },
          profile_image: { $first: "$student_info.profile_image" },

          present: {
            $sum: { $cond: [{ $eq: ["$status", "P"] }, 1, 0] },
          },
          absent: { $sum: { $cond: [{ $eq: ["$status", "A"] }, 1, 0] } },
          holiday: { $sum: { $cond: [{ $eq: ["$status", "H"] }, 1, 0] } },
          sunday: { $sum: { $cond: [{ $eq: ["$status", "S"] }, 1, 0] } },
          total_days: { $sum: 1 },
          records: {
            $push: { date: "$date", status: "$status", remark: "$remark" },
          },
        },
      },

      // Calculate percentages
      {
        $addFields: {
          working_days: { $add: ["$present", "$absent"] },
          present_percentage: {
            $cond: [
              { $eq: [{ $add: ["$present", "$absent"] }, 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          "$present",
                          { $add: ["$present", "$absent"] },
                        ],
                      },
                      100,
                    ],
                  },
                  2,
                ],
              },
            ],
          },
          absent_percentage: {
            $cond: [
              { $eq: [{ $add: ["$present", "$absent"] }, 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: ["$absent", { $add: ["$present", "$absent"] }],
                      },
                      100,
                    ],
                  },
                  2,
                ],
              },
            ],
          },
        },
      },

      // Group by class
      {
        $group: {
          _id: "$_id.class_id",
          class_name: { $first: "$class_name" },
          class_section: { $first: "$class_section" },
          students: {
            $push: {
              student_id: "$_id.student_id",
              student_name: "$student_name",
              student_roll_number: "$student_roll_number",
              profile_image: "$profile_image",
              present: "$present",
              absent: "$absent",
              holiday: "$holiday",
              sunday: "$sunday",
              total_days: "$total_days",
              working_days: "$working_days",
              present_percentage: "$present_percentage",
              absent_percentage: "$absent_percentage",
              records: "$records",
            },
          },
        },
      },

      // Final project
      {
        $project: {
          _id: 0,
          class_id: "$_id",
          class_name: 1,
          class_section: 1,
          students: 1,
        },
      },
    ]);

    result = res[0];
  }

  // MULTI_CLASS result
  if (classIds) {
 console.log("Many class if");
    if (!Array.isArray(classIds)) {
      classIds = classIds.split(",").map((id) => id.trim());
    }

    const classObjectIds = classIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const query = {
      class_id: { $in: classObjectIds },
      is_active: true,
    };

    const dateFilter = buildDateFilter();
    if (dateFilter) query.date = dateFilter;

    result = await studentAttendanceRepos.getClassAttendanceRepo(query);
    console.log("classId:", result);
  }

  // Format dates in DD-MM-YYYY
  // if (result[0] && result[0].records) {
  //   result[0].records = result[0]?.records?.map((r) => ({
  //     ...r,
  //     date: dayjs(r?.date).format("DD-MM-YYYY hh:mm A"),
  //   }));
  // }

  return {
    status: 200,
    message: `Class Base Attendance Successfully`,
    data: result,
  };
};

export const getStudentMonthlyAttendanceSevice = async (data) => {
  const { classId, date, from, to, studentId, month, year } = data.query;

  let query = {
    student_id: new mongoose.Types.ObjectId(studentId),
    is_active: true,
  };

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);
  query.date = { $gte: start, $lte: end };

  const result =
    await studentAttendanceRepos.getStudentMonthlyAttendance(query);

  // console.log("aaa",result);

  return {
    status: 200,
    message: `Student Monthly Attendance Successfully`,
    data: result,
  };
};
