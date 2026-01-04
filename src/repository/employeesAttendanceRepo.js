import { employeesAttendance } from "../models/employees/employees-attendance.model.js";

/*
GET /attendance/teacher/:teacherId?date=2025-12-07

Teacher‑wise attendance (kis teacher ne mark ki)

*/

export const getAttendanceByTeacher = async (teacherId, date) => {
  const query = {
    recorded_by: teacherId,
    is_active: true,
  };

  if (date) {
    query.date = new Date(date);
  }

  return StudentAttendanceRecord.find(query)
    .populate("class_id", "class_name")
    .lean();
};

export const getEmployeesAttendances = async (data) => {
  console.log("dataRepo", data);

  return await employeesAttendance.aggregate([
    // Match only active + optional filters
    { $match: data },

    // Lookup TeacherProfiles
    {
      $lookup: {
        from: "teacherprofiles",
        localField: "employees_id",
        foreignField: "_id",
        as: "employee",
      },
    },

    { $unwind: "$employee" },

    // Group by employee
    {
      $group: {
        // _id: 1,
        _id: "$employees_id",
        employee_name: { $first: "$employee.full_name" },
        employee_profile_image: { $first: "$employee.profile_image" },
        totalPresent: { $sum: { $cond: [{ $eq: ["$status", "P"] }, 1, 0] } },
        totalAbsent: { $sum: { $cond: [{ $eq: ["$status", "A"] }, 1, 0] } },
        totalHolidays: { $sum: { $cond: [{ $eq: ["$status", "H"] }, 1, 0] } },
        total_days: { $sum: 1 },
        records: {
          $push: {
            date: "$date",
            status: "$status",
            remark: "$remark",
          },
          // $push: {
          //   $cond: [
          //     {
          //       $and: [
          //         { $gte: ["$date", data.date ? data.date.$gte : new Date(0)] },
          //         { $lte: ["$date", data.date ? data.date.$lte : new Date()] }
          //       ]
          //     },
          //     { date: "$date", status: "$status", remark: "$remark" },
          //     "$$REMOVE"
          //   ]
          // }
        },
      },
    },

    // Add fields like working_days and percentage
    {
      $addFields: {
        working_days: { $add: ["$totalPresent", "$totalAbsent"] },
        percentage: {
          $cond: [
            { $eq: [{ $add: ["$totalPresent", "$totalAbsent"] }, 0] },
            0,
            {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: [
                        "$totalPresent",
                        { $add: ["$totalPresent", "$totalAbsent"] },
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
        // Absent %
        absent_percentage: {
          $cond: [
            { $eq: [{ $add: ["$totalPresent", "$totalAbsent"] }, 0] },
            0,
            {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: [
                        "$totalAbsent",
                        { $add: ["$totalPresent", "$totalAbsent"] },
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
      },
    },

    // Sort by employee name
    { $sort: { employee_name: 1 } },

    // Final projection
    {
      $project: {
        _id: 0,
        employee_id: "$_id",
        employee_profile_image: 1,
        employee_name: 1,
        totalPresent: 1,
        totalAbsent: 1,
        totalHolidays: 1,
        total_days: 1,
        working_days: 1,
        percentage: 1,
        absent_percentage: 1,
        records: 1,
      },
    },
  ]);
};

// 2️⃣ Date-wise Attendance List (Full Data)
export const getEmployeesAttendancesList = async () => {
  return await employeesAttendance.aggregate([
    { $match: { is_active: true } },

    {
      $lookup: {
        from: "teacherprofiles",
        localField: "employees_id",
        foreignField: "_id",
        as: "employee",
      },
    },

    { $unwind: "$employee" },

    {
      $addFields: {
        employee_name: {
          $concat: ["$employee.first_name", " ", "$employee.last_name"],
        },
      },
    },

    {
      $project: {
        _id: 1,
        date: 1,
        status: 1,
        employees_id: 1,
        employee_name: 1,
      },
    },

    { $sort: { date: -1 } }, // latest first
  ]);
};
