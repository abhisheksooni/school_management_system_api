import { TeacherAuthModel } from "../../models/teacher/teacher_model.js";
import { devLog } from "../../utils/devlogger.js";

/*  
===========================================================
+++++++++++++++ Employee Access Controller ++++++++++++++++
===========================================================
--------  NOTE  -------------
TEacher Auth modal me data hai 
*/
// {
//     "accountStatus": "active",
//     "addStudentPermissionStatus": true,
//     "studentAttendanceStatus": true
// }

export const updateEmployeeAccessController = async (req, res) => {
  try {
    let { id } = req.params;

    console.log("idddddd---", id);

    const {
      //   username,
      //   password,
      accountStatus, // active , inactive String
      addStudentPermissionStatus, //Boolean
      studentAttendanceStatus, //Boolean
    } = req.body;

    devLog(`update EmployeeAccessController`, {
      level: "r",
      id,
      data: req.body,
    });
    // Find teacher first
    const findData = await TeacherAuthModel.findById(id);

    if (!findData) {
      devLog(`update EmployeeAccessController`, { id, level: "err" });
      return res.status(404).json({
        success: false,
        message: "Employee data not found",
      });
    }

    const updateData = await TeacherAuthModel.findByIdAndUpdate(
      id,
      {
        $set: {
          // username:username?username:,
          // password,
          // accountStatus:accountStatus?accountStatus:findData.accountStatus,
          // addStudentPermissionStatus:addStudentPermissionStatus?addStudentPermissionStatus:findData.addStudentPermissionStatus,
          // studentAttendanceStatus:studentAttendanceStatus?studentAttendanceStatus:findData.studentAttendanceStatus,
          accountStatus, // active , inactive String
          addStudentPermissionStatus, //Boolean
          studentAttendanceStatus, //Boolean
        },
      },
      { new: true }
    );

    devLog(`update EmployeeAccessController`, {
      level: "s",
      id,
      data: updateData,
    });
    return res.status(200).json({
      success: true,
      message: "Employee Access updated successfully",
      data: updateData,
    });
  } catch (error) {
    devLog("Employee Access updated Err: ", { data: error, level: "err" });
    return res.status(500).json({
      success: false,
      message: "Employee Access updated Err:",
      error: error.message,
    });
  }
};



export const getOneEmployeeAccessController = async (req, res) => {
  let { id } = req.params;
  try {
    devLog(`GET EmployeeAccessController`, { level: "r", id });
    // Find teacher first
    const findData = await TeacherAuthModel.findById(id);

    devLog(`GET EmployeeAccessController`, { level: "s" });
    return res.status(200).json({
      success: true,
      message: "Employee Access updated successfully",
      data: findData,
    });
  } catch (error) {
    devLog("Employee Access GET Err: ", { data: error, level: "err" });
    return res.status(500).json({
      success: false,
      message: "Employee Access GET Err:",
      error: error.message,
    });
  }
};
