import * as Employees from "../repository/employeesRepo.js";
import { devLog } from "../utils/devlogger.js";

export const getEmployeesAttendanceDataService = async (data) => {
 
     devLog(`Employees Attendance Data Service`, {
    level: "r",
  });
 
    const result = await Employees.getEmployeesAttendanceFilterRepo();

  const count = await Employees.employeesCount();

  return {
    success: true,
    total_count: count,
    data: result,
    message: "Get All Teachers successfully",
  };
};
