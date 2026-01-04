import * as employeesAttendances from "../services/employees.attendance.service.js"
import { devLog } from "../utils/devlogger.js";


export const employeesMarkBulkAttendanceController = async (req, res) => {
  try {

    const result = await employeesAttendances.createEmployeesAttendanceSevice(req);
// console.log("Run");

 devLog(`employees mark Bulk Attendance`, {
    level: "s",
  });

    res.status(200).json(result);
  } catch (error) {
    console.error("Bulk Attendance Error:", error);
    // Duplicate key ka special error handle
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate attendance detected for same student/date",
      });
    }

    res
      .status(500)
      .json({ success: false, message: "Students Bulk attendance Error" });
  }
};
export const updateEmployeesMarkBulkAttendanceController = async (req, res) => {
  try {

    const result = await employeesAttendances.updateEmployeesAttendanceService(req);

 devLog(`employees mark Bulk Attendance`, {
    level: "s",
  });

    res.status(200).json(result);
  } catch (error) {
     devLog(`update employees mark Bulk Attendance`, {
    level: "err",
    data:error
  });
    // Duplicate key ka special error handle
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate attendance detected for same student/date",
      });
    }

    res
      .status(500)
      .json({ success: false, message: "Students Bulk attendance Error" });
  }
};


export const getEmployeesAttendanceController = async (req,res)=>{
try {
    const result = await employeesAttendances.getEmployeesAttendanceSevice(req);
        return res.status(200).json(result);
} catch (error) {
    devLog(`Error EmployeesAttendance controller `, {
          level: "err",
          data: error,
        });
        return res.status(500).json({
          success: false,
          message: "All Student Attendance Not found",
          error: error.message,
        });
}
}