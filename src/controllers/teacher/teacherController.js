import mongoose from "mongoose";
import {
  StaffSalary,
  TeacherAuthModel,
  TeacherProfile,
  TeachersBasicInfo,
} from "../../models/teacher/teacher_model.js";
import slug from "slug";
import { customAlphabet } from "nanoid";

// Create Teacher with all data ---------------
export const createTeacherAllDataController = async (req, res) => {
  const nanoIDs = customAlphabet("1234567890ABCD", 6);
  try {
    const {
      first_name,
      last_name,
      subject,
      phone_no,
      // profile_image,
      school_class_id,
      gender,
      dob,
      qualifications,
      profile_roll,
      address,
      years_of_experience,
      salary,
      joined_date,
      studentCreatePermissionStatus, //boolean
      studentAttendanceStatus, //boolean
    } = req.body;

    const profile_image = req.file
      ? `/uploads/teachers-profile-images/${req.file.filename}`
      : "";

    const teacherProfile = await TeacherProfile.create({
      full_name: `${first_name} ${last_name}`,
      subject,
      name: {
        first: first_name || null,
        last: last_name || null,
      },
      school_class_ids: school_class_id || null,
      teacher_phone_no: phone_no || null,
      profile_image: profile_image || "",
      // class_subjects_id:"subjects_id" || [] ,
    });
    // const teacherSave = await teacherProfile.save();

    // ================== TeachersBasicInfo ===================
    const teachersBasicInfo = await TeachersBasicInfo.create({
      teacher_id: teacherProfile._id,
      qualifications,
      years_of_experience,
      gender,
      date_of_birth: dob,
      address,
      joined_at: new Date(joined_date),
      profile_roll: profile_roll,
    });

    teacherProfile.basic_info_id = teachersBasicInfo._id;

    // ================== TeacherAuthModel ===================
    const teacherAuth = await TeacherAuthModel.create({
      username: `${first_name}${teacherProfile.teacher_code}`,
      password: `${first_name}${nanoIDs()}`,
      addStudentPermissionStatus: studentCreatePermissionStatus,
      studentAttendanceStatus: studentAttendanceStatus,
      // accountStatus: ,
    });
    teacherProfile.teacher_auth_id = teacherAuth._id;

    // ================== Staff Salary ===================
    const staffSalary = await StaffSalary.create({
      teacher_id: teacherProfile._id,
      base_salary: salary, // FIXED AMOUNT SALARY
      // bonuses: 0,
    });

    teacherProfile.staff_Salary_id = staffSalary._id;

    await teacherProfile.save();

    return res.status(201).json({
      success: true,
      message: "Teacher Profile created successfully",
      data: teacherProfile,
      teachersBasicInfo: teachersBasicInfo,
      teacherAuth: teacherAuth,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Teacher Error in UPDATE" });
  }
};
// End Create Teacher with all data ---------------

export const createTeacherController = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      full_name,
      subject,
      phone_no,
      profile_image,
      school_class_id,
      gender,
      dob,
      qualifications,
      username,
      password,
      role,
      address,
      years_of_experience,
      subjects_id,
    } = req.body;

    console.log("create teacher data-- ", req.body);

    const teacherProfile = await TeacherProfile.create({
      full_name: slug(`${first_name} ${last_name}`),
      subject,
      name: {
        first: first_name || null,
        last: last_name || null,
      },
      school_class_ids: school_class_id || null,
      teacher_phone_no: phone_no || null,
      profile_image: profile_image || "",
      // class_subjects_id:"subjects_id" || [] ,
    });

    await teacherProfile.save();

    return res.status(201).json({
      success: true,
      message: "Teacher Profile created successfully",
      data: teacherProfile,
    });
  } catch (error) {
    await section.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ message: "Teacher Error in create POST" });
  }
};

export const getAllTeachersController = async (req, res) => {
  try {
    // const allTeachers = await TeacherProfile.find().populate('TeachersBasicInfo');
    const allTeachers = await TeacherProfile.find();
    return res.status(200).json({
      success: true,
      message: "Get All Teachers successfully",
      data: allTeachers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "All Teacher Error in GET" });
  }
};

export const getTeacherByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher_id = id;

    const getTeacher = await TeacherProfile.findById(teacher_id)
      .populate("basic_info_id")
      .populate("staff_Salary_id")
      .populate("teacher_auth_id");

    if (!getTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Teacher get successfully",
      data: getTeacher,
    });

    // const allTeachers = await Teachers.find
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Teacher Error in GET" });
  }
};

export const updateTeacherProfileController = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher_id = id;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Teacher Error in UPDATE" });
  }
};
export const updateTeacherBasicInfoController = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher_id = id;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Teacher Error in UPDATE" });
  }
};

// End Create Teacher with all data ---------------
//  Get Teacher with Role  & preview List data only  ---------------

export const getTeachersByPreviewListController = async (req, res) => {
  try {
    const teachersList = await TeacherProfile.find()
      .populate("basic_info_id") // profile_roll,
      .populate("teacher_auth_id") // studentAttendanceStatus , addStudentPermissionStatus , accountStatus
      .populate("school_class_ids"); // school_class_ids list

    const previewList = teachersList.map((teacher) => ({
      _id: teacher._id,
      full_name: teacher.full_name,
      teacher_code: teacher.teacher_code,
      profile_role: teacher.basic_info_id.profile_roll,
  
      studentAttendanceStatus: teacher.teacher_auth_id.studentAttendanceStatus,
      addStudentPermissionStatus: teacher.teacher_auth_id.addStudentPermissionStatus,
      accountStatus: teacher.teacher_auth_id.accountStatus,
      school_class_ids : teacher.school_class_ids
    }));

    return res.status(200).json({
      success: true,
      message: "Get Teachers Preview List successfully",
      data: previewList,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Teacher Error in getTeachersByPreviewListController" });
  }
};

// const salary = new TeacherSalary({
//   teacher_id: someTeacherId,
//   base_salary: 40000,
//   bonuses: 5000,
//   deductions: 2000,
//   month: 10,
//   year: 2025,
//   payments: [
//     { payment_amount: 43000, payment_mode: "bank_transfer", transaction_id: "TX12345" }
//   ],
//   status: "paid"
// });

// await salary.save();
