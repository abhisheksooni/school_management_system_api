import mongoose from "mongoose";
import { StudentAttendanceRecord } from "../models/student/attendance.model.js";

// =============== Create ===============
export const createBulkAttendance = async (bulkOps) => {
  return await StudentAttendanceRecord.bulkWrite(bulkOps);
};

export const createBulkAttendances = async (bulkOps) => {
  return await StudentAttendanceRecord.bulkWrite(bulkOps);
};

// =============== FIND ===============
// export const findAllStudentsAttendance = async () => {
//   return await StudentAttendanceRecord.find();
// };

/*
GET /attendance/student/:studentId?from=2025-12-01&to=2025-12-31

1️⃣ Student ki attendance (date range ke saath)
🔹 Use case

Ek student ki monthly / weekly attendance
*/

export const getAttendanceByStudent = async (data) => {
  return StudentAttendanceRecord.aggregate(data);
};

/*
API == GET /attendance/class/:classId?date=2025-12-07

Class‑wise attendance (ek date ya range)
🔹 Use case -- Aaj class 10A me kaun present / absent
*/
export const getAttendanceByClass = async (data) => {
 return await StudentAttendanceRecord.aggregate([
    // 1️⃣ Match classes and date
    { $match: data },

    // 2️⃣ Lookup student info
    {
      $lookup: {
        from: "studentprofiles",
        localField: "student_id",
        foreignField: "_id",
        as: "student_info",
      },
    },
    { $unwind: "$student_info" },

    // 3️⃣ Lookup class info
    {
      $lookup: {
        from: "schoolclasses",
        localField: "class_id",
        foreignField: "_id",
        as: "class_info",
      },
    },
    { $unwind: "$class_info" },

    // 4️⃣ Group by class and student
    {
      $group: {
        _id: { class_id: "$class_id", student_id: "$student_id" },
        class_name: { $first: "$class_info.name" },
        class_section: { $first: "$class_info.section" },
        student_name: { $first: "$student_info.full_name" },
        student_roll_number: { $first: "$student_info.roll_number" },
        profile_image: { $first: "$student_info.profile_image" },

        present: { $sum: { $cond: [{ $eq: ["$status", "P"] }, 1, 0] } },
        absent: { $sum: { $cond: [{ $eq: ["$status", "A"] }, 1, 0] } },
        holiday: { $sum: { $cond: [{ $eq: ["$status", "H"] }, 1, 0] } },
        sunday: { $sum: { $cond: [{ $eq: ["$status", "S"] }, 1, 0] } },
        total_days: { $sum: 1 },
        records: { $push: { date: "$date", status: "$status", remark: "$remark" } },
      },
    },

    // 5️⃣ add Calculate percentages
    {
      $addFields: {
        working_days: { $add: ["$present", "$absent"] },
        present_percentage: {
          $cond: [
            { $eq: [{ $add: ["$present", "$absent"] }, 0] },
            0,
            {
              $round: [
                { $multiply: [{ $divide: ["$present", { $add: ["$present", "$absent"] }] }, 100] },
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
                { $multiply: [{ $divide: ["$absent", { $add: ["$present", "$absent"] }] }, 100] },
                2,
              ],
            },
          ],
        },
      },
    },

    // 6️⃣ Group by class to get all students under each class
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

    // 7️⃣ Final project
    {
      $project: {
        _id: 0,
        class_id: "$_id",
        class_name: 1,
        class_section: 1,
        students: 1,
      },
    },
  ])
  // return await StudentAttendanceRecord.aggregate([
  //   // 1️⃣ Filter by class / date / active status
  //   { $match: data },

  //   // 2️⃣ Lookup student info from StudentProfile
  //   {
  //     $lookup: {
  //       from: "studentprofiles", // MongoDB collection name (lowercase + plural)collection
  //       localField: "student_id",
  //       foreignField: "_id",
  //       as: "student_info",
  //     },
  //   },
  //   // 2️⃣ Lookup Class info from StudentProfile
  //   {
  //     $lookup: {
  //       from: "schoolclasses", // MongoDB collection name (lowercase + plural)collection
  //       localField: "class_id",
  //       foreignField: "_id",
  //       as: "class_info",
  //     },
  //   },
  //   // 3️⃣ Unwind student_info array to get single object
  //   { $unwind: "$class_info" },

  //   // 1️⃣ Group by class + student
  //   {
  //     // $group: {
  //     //   _id: "$class_id",
  //     //   class: {
  //     //     $first: {
  //     //       name: "$class_info.name",
  //     //       section: "$class_info.section",
  //     //     },
  //     //   },
  //     //   student_id: "$student_id",
  //     //   student_name: "$student_info.full_name",
  //     //   student_roll_number: "$student_info.roll_number",
  //     //   profile_image: "$student_info.profile_image",
  //     //   present: { $sum: { $cond: [{ $eq: ["$status", "P"] }, 1, 0] } },
  //     //   absent: { $sum: { $cond: [{ $eq: ["$status", "A"] }, 1, 0] } },
  //     //   holiday: { $sum: { $cond: [{ $eq: ["$status", "H"] }, 1, 0] } },
  //     //   sunday: { $sum: { $cond: [{ $eq: ["$status", "S"] }, 1, 0] } },
  //     //   total_days: { $sum: 1 },
  //     //   records: {
  //     //     $push: {
  //     //       date: "$date",
  //     //       status: "$status",
  //     //       remark: "$remark",

  //     //       // student: {
  //     //       //   full_name: "$student_info.full_name",
  //     //       //   roll_number: "$student_info.roll_number",
  //     //       //   profile_image: "$student_info.profile_image",
  //     //       // },
  //     //     },
  //     //   },
  //     // },
     
  //     $group: {
  //   _id: "$class_id",
  //   class: { $first: { name: "$class_info.name", section: "$class_info.section" } },
  //   students: {
  //     $push: {
  //       student_id: "$student_id",
  //       student_name: "$student_info.full_name",
  //       student_roll_number: "$student_info.roll_number",
  //       profile_image: "$student_info.profile_image",
  //       present: { $sum: { $cond: [{ $eq: ["$status", "P"] }, 1, 0] } },
  //       absent: { $sum: { $cond: [{ $eq: ["$status", "A"] }, 1, 0] } },
  //       holiday: { $sum: { $cond: [{ $eq: ["$status", "H"] }, 1, 0] } },
  //       sunday: { $sum: { $cond: [{ $eq: ["$status", "S"] }, 1, 0] } },
  //       total_days: { $sum: 1 },
  //       records: {
  //         $push: {
  //           date: "$date",
  //           status: "$status",
  //           remark: "$remark",
  //         }
  //       }
  //     }
  //   }
  // }
  //   },

  //   // 2️⃣ Student level calculations
  //   {
  //     $addFields: {
  //       working_days: { $add: ["$present", "$absent"] }, // holidays & Sundays excluded
  //       present_percentage: {
  //         $cond: [
  //           { $eq: [{ $add: ["$present", "$absent"] }, 0] },
  //           0,
  //           {
  //             $round: [
  //               {
  //                 $multiply: [
  //                   {
  //                     $divide: ["$present", { $add: ["$present", "$absent"] }],
  //                   },
  //                   100,
  //                 ],
  //               },
  //               2, // 2 decimal places
  //             ],
  //           },
  //         ],
  //       },
  //       absent_percentage: {
  //         $cond: [
  //           { $eq: [{ $add: ["$present", "$absent"] }, 0] },
  //           0,
  //           {
  //             $round: [
  //               {
  //                 $multiply: [
  //                   {
  //                     $divide: ["$absent", { $add: ["$present", "$absent"] }],
  //                   },
  //                   100,
  //                 ],
  //               },
  //               2, // 2 decimal places
  //             ],
  //           },
  //         ],
  //       },
  //     },
  //   },
  //   // 4️⃣ Final shape
  //   {
  //     $project: {
  //       _id: 0, // remove MongoDB _id
  //       class_id: "$_id",
  //       // class: 1,
  //       class_name: "$class.name",
  //       class_section: "$class.section",
  //       students: 1,
  //       student_name: 1,
  //       profile_image: 1,
  //       student_roll_number: 1,
  //       present: 1,
  //       absent: 1,
  //       holiday: 1,
  //       sunday: 1,
  //       total_days: 1,
  //       working_days: 1,
  //       present_percentage: 1,
  //       absent_percentage: 1,
  //       records: 1,
  //     },
  //   },
  // ]);
};

/*
GET /attendance/class/:classId/summary?date=2025-12-07

3️⃣ Class Attendance Summary (Present / Absent count)
Use case

Dashboard pe summary

*/

export const getClassAttendanceSummary = async (classId, date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  return StudentAttendanceRecord.aggregate([
    {
      $match: {
        class_id: new mongoose.Types.ObjectId(classId),
        date: d,
        is_active: true,
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
};

/**
 * GET /attendance/student/:studentId/monthly?month=12&year=2025

 * 4️⃣ Monthly Attendance Percentage (Student‑wise)
 * 🔹 Use case

Report card / progress report
 * 
 * 
 */
export const getStudentMonthlyAttendance = async (data) => {
  // const start = new Date(year, month - 1, 1);
  // const end = new Date(year, month, 0, 23, 59, 59);

  return await StudentAttendanceRecord.aggregate([
    {
      $match: data,
    },
    {
      $group: {
        _id: "$student_id",
        present: {
          $sum: { $cond: [{ $eq: ["$status", "P"] }, 1, 0] },
        },
        total: { $sum: 1 },
      },
    },
    {
      $project: {
        present: 1,
        total: 1,
        percentage: {
          $round: [
            { $multiply: [{ $divide: ["$present", "$total"] }, 100] },
            2,
          ],
        },
      },
    },
  ]);
};

/*
6️⃣ Soft‑deleted records ignore karna
{ is_active: true }
*/

/*

*/

export const getMonthlyAttendanceold = async (data) => {
  return await StudentAttendanceRecord.find(data);
  //  const attendance = await StudentAttendanceRecord.find({
  //       student_id: new mongoose.Types.ObjectId(student_id),

  //       date: { $gte: startDate, $lte: endDate },
  //     }).sort({ date: 1 });
};
// All students




export const getClassAttendanceRepo = async (data)=>{
  return await StudentAttendanceRecord.aggregate([
    {
        // $match: {
        //   class_id: new mongoose.Types.ObjectId(classId),
        //   date: { $gte: startDate, $lte: endDate },
        //   status: { $in: ["P", "A"] },
        //   is_active: true,
        // },
        $match:data
      },
      {
        $group: {
          _id: "$class_id",
          presentCount: {
            $sum: { $cond: [{ $eq: ["$status", "P"] }, 1, 0] },
          },
          absentCount: {
            $sum: { $cond: [{ $eq: ["$status", "A"] }, 1, 0] },
          },
          total: { $sum: 1 },
        },
      },
      {
        $addFields: {
          presentPercentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$presentCount", "$total"] },
                  100,
                ],
              },
              0,
            ],
          },
          absentPercentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$absentCount", "$total"] },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },
      {
        $lookup: {
          from: "schoolclasses",
          localField: "_id",
          foreignField: "_id",
          as: "class",
        },
      },
      {
        $unwind: "$class",
      },
      {
        $project: {
          _id: 0,
          classId: "$_id",
          className: "$class.name",
          classSection: "$class.section",
          presentCount: 1,
          absentCount: 1,
          presentPercentage: 1,
          absentPercentage: 1,
        },
      },
  ])
}