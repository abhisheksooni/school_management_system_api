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
      profile_image,
      school_class_id,
      gender,
      dob,
      qualifications,
      role,
      address,
      years_of_experience,
      salary,
      joined_date,
      studentCreatePermissionStatus, //boolean
      studentAttendanceStatus, //boolean
    } = req.body;

    console.log("req---", req.body);

    // const profile_image = await req.files?.profile_image
    //   ? `uploads/staff/${req.files.profile_image[0].filename}`
    //   : existingStudent.profile_image;
    // const profile_image = await req.files?.profile_image
    //   ? `uploads/staff/${req.files.profile_image[0].filename}`
    //   : existingStudent.profile_image;

    // const profile_image = req.file
    //   ? `/uploads/teachers-profile-images/${req.file.filename}`
    //   : "";

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
      role,
    });

    teacherProfile.basic_info_id = teachersBasicInfo._id;

    // ================== TeacherAuthModel ===================
    const teacherAuth = await TeacherAuthModel.create({
      username: `${first_name}${teacherProfile.teacher_code}`,
      password: `${first_name}${nanoIDs()}`,
      addStudentPermissionStatus: studentCreatePermissionStatus
        ? studentCreatePermissionStatus
        : false,
      studentAttendanceStatus: studentAttendanceStatus
        ? studentAttendanceStatus
        : false,
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
    // const teachers = await TeacherProfile.find();

    //     const { page = 1, limit = 10, search = "" } = req.query;

    // const query = search
    //   ? { full_name: { $regex: search, $options: "i" } }
    //   : {};

    // const teachers = await TeacherProfile.find(query)
    //   .skip((page - 1) * limit)
    //   .limit(Number(limit));

    const teachers = await TeacherProfile.aggregate([
      {
        $project: {
          _id: 1,
          full_name: 1,
          profile_image: 1,
          teacher_phone_no: 1,
          subject: 1,
          teacher_code: 1,
        },
      },
    ]);

    const lengthTeachers = await TeacherProfile.countDocuments();

    return res.status(200).json({
      success: true,
      length: lengthTeachers,
      data: teachers,
      message: "Get All Teachers successfully",
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

export const updateTeacherAllDataController = async (req, res) => {

  console.log(req.body);

  try {
    const { id } = req.params;
    const teacher_id = id;

    const {
      first_name,
      last_name,
      subject,
      phone_no,
      profile_image,
      school_class_id,
      gender,
      dob,
      qualifications,
      role,
      address,
      years_of_experience,
      salary,
      joined_date,
      studentCreatePermissionStatus, //boolean
      studentAttendanceStatus, //boolean
    } = req.body;

    console.log("teacher update controler -- > ", req.body);

    // ================== 1️⃣ Find existing teacher ===================
    const teacherProfile = await TeacherProfile.findById(teacher_id);
    if (!teacherProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });
    }

    // ================== 2️⃣ Update TeacherProfile ===================
    const updateTeacherProfile = await TeacherProfile.findByIdAndUpdate(
      teacher_id,
      {
        $set: {
          "name.first": first_name || teacherProfile.name.first,
          "name.last": last_name || teacherProfile.name.last,
          full_name: `${first_name || teacherProfile.name.first} ${last_name || teacherProfile.name.last}`,
          subject: subject || teacherProfile.subject,
          teacher_phone_no: phone_no || teacherProfile.teacher_phone_no,
          profile_image: profile_image || teacherProfile.profile_image,
          school_class_ids: school_class_id || teacherProfile.school_class_ids,
        },
      },
      { new: true }
    );

    // ================== 3️⃣ Update TeachersBasicInfo ===================
    if (teacherProfile.basic_info_id) {
      await TeachersBasicInfo.findByIdAndUpdate(
        teacherProfile.basic_info_id,
        {
          $set: {
            qualifications: qualifications,
            years_of_experience: years_of_experience,
            gender: gender,
            date_of_birth: dob,
            address: address,
            joined_at: joined_date
              ? new Date(joined_date)
              : teacherProfile.joined_at,
            role: role,
          },
        },
        { new: true }
      );
    } else {
      const teachersBasicInfo = await TeachersBasicInfo.create({
        teacher_id: teacherProfile._id,
        qualifications,
        years_of_experience,
        gender,
        date_of_birth: dob,
        address,
        joined_at: joined_date ? new Date(joined_date) : new Date(),
        role,
      });
      teacherProfile.basic_info_id = teachersBasicInfo._id;
    }

    // ================== 4️⃣ Update TeacherAuthModel ===================
    if (teacherProfile.teacher_auth_id) {
      await TeacherAuthModel.findByIdAndUpdate(
        teacherProfile.teacher_auth_id,
        {
          $set: {
            addStudentPermissionStatus:
              typeof studentCreatePermissionStatus === "boolean"
                ? studentCreatePermissionStatus
                : false,
            studentAttendanceStatus:
              typeof studentAttendanceStatus === "boolean"
                ? studentAttendanceStatus
                : false,
          },
        },
        { new: true }
      );
    }

    // ================== 5️⃣ Update StaffSalary ===================
    if (teacherProfile.staff_Salary_id) {
      await StaffSalary.findByIdAndUpdate(
        teacherProfile.staff_Salary_id,
        {
          $set: { base_salary: salary },
        },
        { new: true }
      );
    } else {
      const staffSalary = await StaffSalary.create({
        teacher_id: teacherProfile._id,
        base_salary: salary,
      });
      teacherProfile.staff_Salary_id = staffSalary._id;
    }

    // ================== 6️⃣ Save final teacher profile ===================
    await teacherProfile.save();

    // 7️⃣ Repopulate for full response
    const updatedTeacher = await TeacherProfile.findById(teacher_id)
      .populate("basic_info_id")
      .populate("teacher_auth_id")
      .populate("staff_Salary_id")
      .populate("school_class_ids");

    // ================== 7️⃣ Send Response ===================

    return res.status(200).json({
      success: true,
      message: "Teacher Profile updated successfully",
      data: updatedTeacher,
    });
  } catch (error) {
    console.error("Teacher update error:", error);
    return res.status(500).json({
      success: false,
      message: "Teacher Error in UPDATE",
      error: error.message,
    });
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

export const deleteTeacherProfileWithAllData = async (req, res) => {
  try {
    const teacherProfile = await TeacherProfile.findById(req.params.id);

    if (!teacherProfile) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }
    console.log("Deleting TEacher Id - :", teacherProfile._id);

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
      TeachersBasicInfo,
      teacherProfile?.basic_info_id || teacherProfile?.basic_info_id,
      "Teacher Basic Info"
    );

    await safeDelete(
      TeacherAuthModel,
      teacherProfile?.teacher_auth_id || teacherProfile?.teacher_auth_id,
      "Teacher Auth Info"
    );

    await safeDelete(
      StaffSalary,
      teacherProfile?.staff_Salary_id || teacherProfile?.staff_Salary_id,
      "Teacher staff_Salary_id Info"
    );

    await TeacherProfile.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Teacher and all related data deleted successfully",
      // data: dd,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Teacher could not be deleted ",
      error: error.message,
    });
  }
};

// End Create Teacher with all data ---------------
//  Get Teacher with Role  & preview List data only  ---------------

export const getTeachersByPreviewListController = async (req, res) => {
  try {

    const lengthPreviewList = await TeacherProfile.countDocuments()

   const previewList = await TeacherProfile.aggregate([
      {
        $lookup: {
          from: "teachersbasicinfos", // replace with your actual collection name
          localField: "basic_info_id",
          foreignField: "_id",
          as: "basic_info",
        },
      },
      {
        $lookup: {
          from: "teacherauths", // replace with your actual collection name
          localField: "teacher_auth_id",
          foreignField: "_id",
          as: "auth_info",
        },
      },
      // {
      //   $lookup: {
      //     from: "schoolclasses", // replace with your actual collection name
      //     localField: "school_class_ids",
      //     foreignField: "_id",
      //     as: "classes",
      //   },
      // },
      {
        $project: {
          full_name: 1,
          teacher_code: 1,
          profile_role: { $arrayElemAt: ["$basic_info.role", 0] },
          studentAttendanceStatus: { $arrayElemAt: ["$auth_info.studentAttendanceStatus", 0] },
          addStudentPermissionStatus: { $arrayElemAt: ["$auth_info.addStudentPermissionStatus", 0] },
          accountStatus: { $arrayElemAt: ["$auth_info.accountStatus", 0] },
          // school_class_ids: "$classes",
        },
        // $project: {
        //   full_name: 1,
        //   teacher_code: 1,
        //   profile_role: { $arrayElemAt: ["$basic_info.profile_roll", 0] },
        //   studentAttendanceStatus: { $arrayElemAt: ["$auth_info.studentAttendanceStatus", 0] },
        //   addStudentPermissionStatus: { $arrayElemAt: ["$auth_info.addStudentPermissionStatus", 0] },
        //   accountStatus: { $arrayElemAt: ["$auth_info.accountStatus", 0] },
        //   school_class_ids: "$classes",
        // },
      },
    ]); 
    //  const teachersLists = await TeacherProfile.find()
    //   .populate("basic_info_id") // profile_roll,
    //   .populate("teacher_auth_id") // studentAttendanceStatus , addStudentPermissionStatus , accountStatus
    //   .populate("school_class_ids"); // school_class_ids list

    // const previewLists = await teachersList.map((teacher) => ({
    //   _id: teacher._id,
    //   full_name: teacher.full_name,
    //   teacher_code: teacher.teacher_code,
    //   profile_role: teacher.basic_info_id.profile_roll,

    //   studentAttendanceStatus: teacher.teacher_auth_id.studentAttendanceStatus,
    //   addStudentPermissionStatus:
    //     teacher.teacher_auth_id.addStudentPermissionStatus,
    //   accountStatus: teacher.teacher_auth_id.accountStatus,
    //   school_class_ids: teacher.school_class_ids,
    // }));

    return res.status(200).json({
      success: true,
      message: "Teachers Preview List fetched successfully",
      data: previewList,
      length: lengthPreviewList,
    });
  } catch (error) {
    console.error("Error in getTeachersByPreviewListController:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching teachers preview list",
    });
  };

}

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

// await salary.save()
