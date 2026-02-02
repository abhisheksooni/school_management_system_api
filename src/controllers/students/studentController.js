// import { CreateFullStudent } from "../../helper/createFullStudent.js";

import { data, FindStudentsHandler } from "../../helper/student/studentApiCaller.js";
import { CreateFullStudent } from "../../helper/student/createFullStudent.js";
import {
  UpdateFullStudent,
} from "../../helper/student/updateFullStudent.js";
import {
  StudentAdvancedInfo,
  StudentAttendanceRecord,
  StudentAuthInfo,
  StudentBasicInfo,
  StudentFeesInfo,
  StudentParentsInfo,
  StudentProfile,
} from "../../models/student/student_model.js";
import { devLog } from "../../utils/devlogger.js";
import { generateNanoID } from "../../utils/nanoidGenerator.js";
import { responseHandler } from "../../utils/index.js";

//  =============  POST/ CREATE STUDENT  ==============
 
export const createWithAllDataStudent = async (req, res) => {
  try {
   
    const student = await CreateFullStudent(req.body);
   
    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      student: student,
    });
  } catch (error) {
    devLog(`Create Student Error createWithAllDataStudent `, {
      level: "err",
      data: error,
    });
    return res.status(400).json({
      success: false,
      message: "Student creation failed",
      error: error.message,
    });
  }
};

//  =============  GET ALL STUDENT getStudentBasicInfo() { id, fullnsme , rollnumber , }  ==============

// export const getAllStudents = async (req, res) => {
//   try {
//     const students = await StudentProfile.find();

//     return res.status(200).json({
//       success: true,
//       message: "All Student found",
//       data: students,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "All Student Not found",
//       error: error.message,
//     });
//   }
// };
//  =============  GET ALL STUDENT  ==============

export const getAllStudents = async (req, res) => {
  try {
    
    // const students = await StudentProfile.find();
    const lengthStudents = await StudentProfile.countDocuments();

    const Students = await FindStudentsHandler({
      aggregate: [
        {
          $project: {
            roll_number: 1,
            _id: 1,
            full_name: 1,
            student_code: 1,
            profile_image: 1,
          },
        },
      ],
    });

   
    return res.status(200).json({
      success: true,
      length: lengthStudents,
      data: Students,
      message: "All Student found",
      // data1: students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "All Student Not found",
      error: error.message,
    });
  }
};

//  =============  GET BY ID STUDENT  ==============

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student_id = id;

    const student = await FindStudentsHandler({
      findById: student_id,
    });

    // const student = await StudentProfile.findById(student_id);
    // // .populate("feesInfo");
    // if (!student) return res.status(404).json({ message: "Student not found" });

    return res.status(200).json({
      success: true,
      message: "Student found",
      data: student,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Student Not found",
      error: error.message,
    });
  }
};

//  =============  POST/UPDATE BY ID STUDENT  ==============

export const updateStudentWithAllData = async (req, res) => {
  try {

    const updatedStudent = await UpdateFullStudent(req); // res id ,

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      // student1: updateStudent,
      data: updatedStudent,
    });
  } catch (error) {
    devLog("Update Student Error", { level: "err", data: error.message });

    return res.status(500).json({
      success: false,
      message: "Student update  failed",
      error: error.message,
    });
  }
};

//  =============  GET BY ID STUDENT FULL DATA  ==============

export const getAllDataStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student_id = id;

    const student = await StudentProfile.findById(student_id).populate([
      { path: "basic_info_id" },
      {
        path: "advanced_info_id",
        populate: {
          path: "created_by_teacher_id",
          select: "full_name , _id",
        },
      },
      { path: "parents_info_id" },
      { path: "fees_info_id" },
      { path: "auth_info_id" },
      {
        path: "class_id",
        populate: {
          path: "subjects_ids",
          select: "name subject_code",
        },
      },

      // { path: "created_by_teacher_id" },
      // { path: "attendances" },  // ⛔️ This may need to change — see below
      // { path: "exam_info" },
      // { path: "homework_info" },
      // { path: "extraCurricularInfo" }
    ]);

    // .populate("feesInfo");
    if (!student) return res.status(404).json({ message: "Student not found" });

    return res.status(200).json({
      success: true,
      message: "Student found",
      data: student,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Student Not found",
      error: error.message,
    });
  }
};

//  =============  DELETE BY ID STUDENT  ==============

export const deleteStudentWithAllData = async (req, res) => {
  try {
    const student = await StudentProfile.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    console.log("Deleting student:", student._id);

    // Helper function for safe delete with logging
    const safeDelete = async (Model, id, name) => {
      if (!id) {
        console.warn(`⚠️  ${name} ID not found, skipping delete`);
        return;
      }
      const result = await Model.findByIdAndDelete(id);
      if (result) {
        console.log(`✅ Deleted ${name}:`, id);
      } else {
        console.warn(`⚠️  ${name} not found with ID:`, id);
      }
    };

    await safeDelete(
      StudentBasicInfo,
      student?.basic_info_id?._id || student?.basic_info_id,
      "Student Basic Info"
    );
    await safeDelete(
      StudentAdvancedInfo,
      student?.advanced_info_id?._id || student?.advanced_info_id,
      "Student Advanced Info"
    );
    await safeDelete(
      StudentParentsInfo,
      student?.parents_info_id?._id || student?.parents_info_id,
      "Student Parents Info"
    );
    await safeDelete(
      StudentAttendanceRecord,
      student?.attendance_record_id?._id || student?.attendance_record_id,
      "Student Attendance Record"
    );
    await safeDelete(
      StudentFeesInfo,
      student?.fees_info_id?._id || student?.fees_info_id,
      "Student Fees Info"
    );
    await safeDelete(
      StudentAuthInfo,
      student?.auth_info_id?._id || student?.auth_info_id,
      "Student Auth Info"
    );

    // await StudentFeesInfo
    // StudentParentsInfo
    // StudentAdvancedInfo,
    // StudentAuthInfo
    // StudentAttendanceRecord,
    // StudentBasicInfo
    // StudentSubject

    // const StudentBasicInfoData = StudentBasicInfo.findByIdAndDelete()

    // Finally delete the main StudentProfile
    await StudentProfile.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Student and all related data deleted successfully",
      // data: dd,
    });
  } catch (error) {
    console.error("❌ Delete error:", error);

    return res.status(500).json({
      success: false,
      message: "Student could not be deleted ",
      error: error.message,
    });
  }
};
