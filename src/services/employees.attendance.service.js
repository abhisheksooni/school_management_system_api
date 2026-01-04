import { employeesAttendance } from "../models/employees/employees-attendance.model.js";
import { devLog } from "../utils/devlogger.js";
import * as employeesAttendanceRepo from "../repository/employeesAttendanceRepo.js"
import mongoose from "mongoose";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

export const createEmployeesAttendanceSevice = async (data) => {
  devLog(`Employees mark Bulk Attendance Sevice`, {
    level: "p",
  });


//   employees_id , date , status, is_active
  const {date, records,} = data.body;


 if (!date) {
    throw new Error("Date is required");
  }

 // Normalize date to midnight
  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

    const validStatuses = ["P", "A", "L", "H", "S"];

  const finalRecords = [];


  // Validate each record
  for (const r of records) {
    if (!r.employees_id || !validStatuses.includes(r.status)) {
      throw new Error(`Invalid record: ${JSON.stringify(r)}`);
    }

    finalRecords.push({
      employees_id: r.employees_id,
      date: dayjs.tz(attendanceDate, "Asia/Kolkata").startOf("day").toDate(), // Time set to 00:00 IST
      // date: attendanceDate,
      status: r.status,
      is_active: true,
    //   recorded_by: recorded_by || null,
    });
  }


  // Prepare bulkWrite operations
  const bulkOps = finalRecords.map((record) => ({
    updateOne: {
      filter: {
        employees_id: record.employees_id,
        date: record.date,
      },
      update: { $set: record },
      upsert: true, // insert if not exists
    },
  }));


  // Execute bulk write
  const result = await employeesAttendance.bulkWrite(bulkOps);

 return {
    success: true,
    message: `${finalRecords.length} Employees Attendance Marked`,
    data:result,
  };


};

export const updateEmployeesAttendanceService = async (data) => {
  devLog(`Employees Bulk Attendance Update Service`, { level: "p" });

  const { date, records } = data.body;

  if (!date) throw new Error("Date is required");
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error("Records are required");
  }

  // Normalize date
  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  const validStatuses = ["P", "A", "L", "H", "S"];

  const bulkOps = [];
  const employeeIds = [];

  for (const r of records) {
    if (!r.employees_id || !validStatuses.includes(r.status)) {
      throw new Error(`Invalid record: ${JSON.stringify(r)}`);
    }

    employeeIds.push(r.employees_id);

    bulkOps.push({
      updateOne: {
        filter: {
          employees_id: r.employees_id,
          date: attendanceDate,
          is_active: true,
        },
        update: {
          $set: {
            status: r.status,
            updated_at: new Date(),
          },
        },
        upsert: false,
      },
    });
  }

  const result = await employeesAttendance.bulkWrite(bulkOps);

  // 🔎 Find which records were missing
  const existingRecords = await employeesAttendance.find({
    employees_id: { $in: employeeIds },
    date: attendanceDate,
    is_active: true,
  }).select("employees_id");

  const existingIds = existingRecords.map(r => String(r.employees_id));

  const notFound = employeeIds.filter(
    id => !existingIds.includes(String(id))
  );

  if (notFound.length > 0) {
    throw new Error(
      `Attendance not found for employees: ${notFound.join(", ")}`
    );
  }

  return {
    success: true,
    message: `${result.modifiedCount} Employees Attendance Updated`,
    data:result,
  };
};


export const getEmployeesAttendanceSevice = async (data) => {
 devLog(`Find -Service- getEmployeesAttendanceSevice  `, {
    level: "r",
  });
// = dayjs().month() + 1 , = dayjs().year() 
   const { date,type, employees_id, from_date, to_date,month,year} = data.query;


// const month = dayjs().month() + 1;
// console.log(month); // 1–12




// console.log("Mark === ", data.query);


  const filter = { is_active: true };


   // 🔹 Single date filter
  if (date) {
    const start = dayjs.utc(date).startOf("day").toDate();
  const end = dayjs.utc(date).endOf("day").toDate();
    filter.date = { $gte: start, $lte: end };
  }


    // 🔹 Date range filter (overrides single date if both provided)
  if (from_date && to_date) {
  //   const from = dayjs(from_date).startOf("day").toDate(); // Date object
  // const to = dayjs(to_date).endOf("day").toDate();       // Date object
    const from = dayjs.tz(from_date, "Asia/Kolkata").startOf("day").toDate();
  const to = dayjs.tz(to_date, "Asia/Kolkata").endOf("day").toDate();

    filter.date = { $gte: from, $lte: to };
  }


  // 🔹 Last month filter
  if (month === "last") {
    const startLastMonth = dayjs.tz("Asia/Kolkata").subtract(1, "month").startOf("month").toDate();
    const endLastMonth = dayjs.tz("Asia/Kolkata").subtract(1, "month").endOf("month").toDate();
    filter.date = { $gte: startLastMonth, $lte: endLastMonth };
  }

  // 🔹 Month-only filter (all years)
  // if (month) {
  //   filter.$expr = { $eq: [{ $month: "$date" }, Number(month)] };
  // }


  // 🔹 If month and year provided, filter by month
//   if (month && year) {
//     const startMonth = new Date(year, month - 1, 1); // month-1 kyunki JS me 0-indexed
// const endMonth = new Date(year, month, 0, 23, 59, 59, 999); // last day of month
// filter.date = { $gte: startMonth, $lte: endMonth };

    // const start = dayjs(`${year}-${month}-01`).startOf("month").toDate();
    // const end = dayjs(`${year}-${month}-01`).endOf("month").toDate();
    // filter.date = { $gte: start, $lte: end };
  // }

// 🔹 Specific month filter (not 'last') with year
 // 🔹 Specific month & year filter
  else if (month && year) {
    const startMonth = dayjs.tz(`${year}-${month}-01`, "Asia/Kolkata").startOf("month").toDate();
    const endMonth = dayjs.tz(`${year}-${month}-01`, "Asia/Kolkata").endOf("month").toDate();
    filter.date = { $gte: startMonth, $lte: endMonth };
  }

// 🔹 Year-only filter
  else if (year && !month) {
    const startYear = dayjs.tz(`${year}-01-01`, "Asia/Kolkata").startOf("year").toDate();
    const endYear = dayjs.tz(`${year}-12-31`, "Asia/Kolkata").endOf("year").toDate();
    filter.date = { $gte: startYear, $lte: endYear };
  }



   // 🔹 Convert employee_id to ObjectId if provided
  if (employees_id) {
    filter.employees_id = new mongoose.Types.ObjectId(employees_id);
  }




// console.log("aaaa",filter);

  
  const result = await employeesAttendanceRepo.getEmployeesAttendances(filter)


// Format dates with time for all employees and all records
result.forEach(employee => {
  if (employee.records && employee.records.length) {
    employee.records = employee.records.map(r => ({
      ...r,
      date: dayjs(r.date).tz("Asia/Kolkata").format("DD-MM-YYYY hh:mm A"), // or "DD-MM-YYYY hh:mm A" for 12h AM/PM
    }));
  }
});

  // console.log("attendance",result);
  return {
    success: true,
    count: result.length,
    data: result,
  };

}
