import * as EmployeesSevice from "../services/employees.service.js";
import { devLog } from "../utils/devlogger.js";

export const getEmployeesAttendanceDataController = async (req, res) => {
  try {
    const result = await EmployeesSevice.getEmployeesAttendanceDataService();

    devLog(`get Employees AttendanceData Controller`, {
      level: "s",
    });

    res.status(200).json(result);
  } catch (error) {
    devLog(`get Employees AttendanceData Controller`, {
      level: "err",
      data: error,
    });
    res
      .status(500)
      .json({
        success: false,
        message: "get Employees AttendanceData Controller Error",
      });
  }
};
