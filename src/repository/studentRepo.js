import { StudentAdvancedInfo, StudentAuthInfo, StudentBasicInfo, StudentFeesInfo, StudentParentsInfo, StudentProfile } from "../models/student/student_model.js";



// ================== FIND ==================

// All students
export const findStudent = async () => {
  return await StudentProfile.find();
};

// FindById student
export const findByIdStudent = async (id) => {
  return  StudentProfile.findById(id);
};
// One student by filter
export const findStudentOne = async (data) => {
  return  StudentProfile.findOne(data);
};

// Only basic info
export const findStudentsBasicInfo = async (skip, limit) => {
  return await StudentProfile.aggregate([
    {
      $project: {
        _id: 1,
        roll_number: 1,
        full_name: 1,
        student_code: 1,
        profile_image: 1,
      },
    },
      { $skip: skip },
    { $limit: limit },
  ]);
};


// By ID with full populate
export const findStudentByIdAllData = async (id) => {
  return await StudentProfile.findById(id).populate([
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
};

export const findStudentByIdAttendanceData = async (id) => {
  return await StudentProfile.findById(id).populate([
      { path: "basic_info_id" },
      {
        path: "advanced_info_id",
        // populate: {
        //   path: "created_by_teacher_id",
        //   select: "full_name , _id",
        // },
      },
      { path: "parents_info_id" },
      { path: "fees_info_id" },
      // { path: "auth_info_id" },
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
    ]); // lean() will return plain JS object;
};

// ================== CREATE ==================


export const createStudent = async (data ) => {
  return (await StudentProfile.create(data));
};

export const createParentsInfo = async (data ) => {
  return await StudentParentsInfo.create(data);
};

export const createBasicInfo = async (data ) => {
  return await StudentBasicInfo.create(data);
};

export const createAdvancedInfo = async (data ) => {
  return await StudentAdvancedInfo.create(data);
};

export const createAuthInfo = async (data ) => {
  return await StudentAuthInfo.create(data);
};

// fees
export const createFeesInfo = async (data ) => {
  return await StudentFeesInfo.create(data);
};
// update section


// ================== UPDATE ==================

export const updateStudent = async (data ) => {
  return await StudentProfile.findByIdAndUpdate(data);
};


export const updateParentsInfo = async (data ) => {
  return await StudentParentsInfo.findByIdAndUpdate(data);
};

export const updateBasicInfo = async (data ) => {
  return await StudentBasicInfo.findByIdAndUpdate(data);
};

export const updateAdvancedInfo = async (data ) => {
  return await StudentAdvancedInfo.findByIdAndUpdate(data);
};

export const updateAuthInfo = async (data ) => {
  return await StudentAuthInfo.findByIdAndUpdate(data);
};





// ================== DELETE ==================
export const deleteStudent = async (id) => {
  return await StudentProfile.findByIdAndDelete(id);
};



// Delete with cascade (parents, fees, auth, etc)
export const deleteStudentWithAllData = async (studentId) => {
  const session = await mongoose.startSession();

  try {
    
    session.startTransaction();

    const student = await StudentProfile.findById(studentId).session(session);

    if (!student) throw new Error("Student not found");

    await StudentParentsInfo.deleteOne({ student_id: studentId }).session(session);

    await StudentBasicInfo.deleteOne({ student_id: studentId }).session(session);
    
    await StudentAdvancedInfo.deleteOne({ student_id: studentId }).session(session);
    
    await StudentFeesInfo.deleteOne({ student_id: studentId }).session(session);
    
    await StudentAuthInfo.deleteOne({ student_id: studentId }).session(session);

    await StudentProfile.deleteOne({ _id: studentId }).session(session);

    await session.commitTransaction();
    return { success: true };

  } catch (error) {
    
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};






// ================== COUNT ==================
export const countStudents = async () => {
  return await StudentProfile.countDocuments();
};
