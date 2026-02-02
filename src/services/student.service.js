import mongoose from "mongoose";
import * as studentRepo from "../repository/studentRepo.js";
import { devLog } from "../utils/devlogger.js";
import { generateNanoID } from "../utils/nanoidGenerator.js";
import { StudentAdvancedInfo, StudentAuthInfo, StudentBasicInfo, StudentFeesInfo, StudentParentsInfo, StudentProfile } from "../models/student/student_model.js";

let logname = ` Student -service- `

//  =============  GET BY ID STUDENT FULL DATA  ==============
export const getByIdStudents = async (data) => {
    devLog(`Find Student getByIdStudents`, {
    level: "p",
  });

        const { id } = req.params;
      const student_id = id;
  
  const result = await studentRepo.findStudentByIdAllData(student_id);
//   const count = await studentRepo.countStudents();

if (!result) {
  throw new Error(` ${logname} Student Not found`)
}

  return {
    success: true,
      message: "Find Student getByIdStudents",
      data: result,
  };
};


export const getAllStudents = async ({page,limit}) => {
devLog(` ${logname} getAllStudents `, {
    level: "r",
  });

   const skip = (page - 1) * limit;
 const students = await studentRepo.findStudentsBasicInfo(
    skip,
    limit
  );


  // const students = await studentRepo.findStudentsBasicInfo();
  const count = await studentRepo.countStudents();

devLog(`${logname} getAllStudents `, {
    level: "s",
  });
  return {
    success: true,
    length: count,
     pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
    data: students,
    message: "All students found",
  };
};


export const getAllDataStudent = async (data) => {
devLog(` ${logname} getAllDataStudent `, {
    level: "r",
  });



  const students = await studentRepo.findStudentsBasicInfo();
  const count = await studentRepo.countStudents();

devLog(`${logname} getAllDataStudent `, {
    level: "s",
  });
  return {
    success: true,
    length: count,
    data: students,
    message: "All students found",
  };
};

// CREATE V1.1
export const createStudentNew = async(data)=>{
 
}

//  =============  CREATE STUDENT  ==============
export const createStudentWithAllData = async (data) => {
  const {
    first_name,
    last_name,
    roll_number,
    select_class,
    profile_image,

    // STUDENT PARENT INFORMATION
    father_name,
    father_number,
    father_occupation,
    father_image,
    mother_name,
    mother_number,
    mother_occupation,
    mother_image,
    guardian_name,
    guardian_number,
    guardian_image,

    // STUDENT BASIC INFORMATION
    admission_form_number,
    date_of_birth,
    academic_year,
    admission_year,
    admission_number,
    admission_date,
    special_talent,
    interest,
    gender,
    caste_category,
    blood_group,
    religion,
    mother_tongue,
    nationality,
    address_local,
    address_permanent,

    // STUDENT ADVANCED INFORMATION
    aadhar_number,
    apaar_id,
    pen_number,
    sssmid_number,
    teacher_id,
    bank_name,
    bank_account_number,
    bank_ifsc_code,
    bank_branch_name,

    disability_type,
    health_issues,
    // previous Academic records
    prev_school_name,
    prev_class_name,
    prev_academic_year,
    prev_score_percentage,
    prev_exam_results,
    transfer_certificate_no,
    // documents images
    doc_birth_certificate,
    doc_aadhaar_student,
    doc_aadhaar_father,
    doc_aadhaar_mother,
    doc_bank_passbook,
    doc_sssmid_card,
    doc_transfer_certificate,
    doc_pan,
    doc_apaar_id,
    doc_rtl_letter,

    // 💰 STUDENT FEE RECORD
    total_fee_amount,
    account_active_status,
    // amount_paid,

    // 🏫 CLASS SCHEMA
    // class_id,
    // students_ids save student_id

    //  🔐 STUDENT ACCOUNT / AUTH INFO

    // Ids --
    // class_id,
    // basic_info_id,
    // advanced_info_id,
    // parents_info_id,
    // fees_info_id,
    // attendance_record_id,
    // exam_record_id,
    // homework_record_id,
    // auth_info_id,
  } = data;

//   const section = await mongoose.startSession();
// section.startTransaction();


  devLog(` ${logname} createStudentWithAllData `, {
    level: "r",
  });


    const rollNumberCheck = await studentRepo.findStudentOne({ roll_number });
  
      if (rollNumberCheck) {
      const err = new Error("Roll Number already exists. Please use a different Roll Number");
  err.statusCode = 409; // conflict
  throw err;
      }


       //  Create Student
          const createStudent = await studentRepo.createStudent({
            name: {
              first: first_name || null,
              last: last_name || null,
            },
            full_name: `${first_name} ${last_name}`,
            roll_number,
            profile_image: profile_image ? profile_image : undefined,
            class_id:  select_class ? select_class.trim() : null,
      
            // basic_info_id: basicInfoDoc?._id || null,
            // advanced_info_id: advancedInfoDoc?._id || null,
            // parents_info_id: parentsInfoDoc?._id || null,
            // fees_info_id: null,
            // attendance_info_id: null,
            // exam_info_id: null,
            // homework_info_id: null,
            // extraCurricularInfo_id: null,
            // auth_info_id: null,
            // add more references here as needed
          });



          // STUDENT PARENT INFORMATION
              const createParentsInfo = await studentRepo.createParentsInfo({
                student_id: createStudent._id,
                father: {
                  name: father_name,
                  number: father_number,
                  occupation: father_occupation,
                  image: father_image || null,
                  // image: father_image ? father_image.path : "null",
                },
                mother: {
                  name: mother_name,
                  number: mother_number,
                  occupation: mother_occupation,
                  image: mother_image || null
                },
                guardian: {
                  name: guardian_name,
                  number: guardian_number,
                  image: guardian_image || null
                },
                // createdAt:NativeDate
              }
               );
              createStudent.parents_info_id = createParentsInfo._id;


 // STUDENT BASIC INFORMATION
    const createBasicInfo = await studentRepo.createBasicInfo({
      student_id: createStudent._id,
      admission_form_number,
      date_of_birth,
      academic_year,
      admission_date,
      // admission_number
      special_talent,
      interest,
      gender,
      caste_category,
      blood_group,
      religion,
      mother_tongue,
      // nationality,

      address_local,
      address_permanent,
    } );
    createStudent.basic_info_id = createBasicInfo._id;


    // STUDENT ADDITIONAL / ADVANCED INFORMATION
    const createAdvancedInfo = await studentRepo.createAdvancedInfo({
      student_id: createStudent._id,
      created_by_teacher_id: teacher_id,
      aadhar_number,
      apaar_id,
      pen_number,
      sssmid_number,

      bank_name,
      bank_ifsc_code,
      bank_branch_name,
      bank_account_number,

      disability_type,
      health_issues,

      prev_school_name,
      prev_class_name,
      prev_academic_year,
      prev_score_percentage,
      prev_exam_results,
      transfer_certificate_no,

      // documents images
      doc_birth_certificate,
      doc_aadhaar_student,
      doc_aadhaar_father,
      doc_aadhaar_mother,
      doc_bank_passbook,
      doc_sssmid_card,
      doc_transfer_certificate,
      doc_pan,
      doc_apaar_id,
      doc_rtl_letter,
    } );

    createStudent.advanced_info_id = createAdvancedInfo._id;


    // STUDENT FEE RECORD
    const createFeesInfo = await studentRepo.createFeesInfo({
      student_id: createStudent._id,
      total_fee: total_fee_amount,
    } );
    createStudent.fees_info_id = createFeesInfo._id;

    // STUDENT🔐 STUDENT ACCOUNT / AUTH INFO
    const createStudentAuthInfo = await studentRepo.createAuthInfo({
      student_id: createStudent._id,
      active_status:true,
      username: `${first_name}${generateNanoID()}`,
      password: `${first_name}${generateNanoID({ length: 6 })}`,
      // role,
    } );
    createStudent.auth_info_id = createStudentAuthInfo._id;




    // ✅ Commit
    // await session.commitTransaction();
await createStudent.save();
    await createBasicInfo.save();
    await createAdvancedInfo.save();
    await createFeesInfo.save();
    await createParentsInfo.save();
    await createStudentAuthInfo.save();
    


const findStudent = await studentRepo.findStudentByIdAllData(createStudent._id)



 devLog(` ${logname} createStudentWithAllData `, {
      level: "s",
      id: createStudent._id,
    });



  return {
    success: true,
    message: "Student created successfully",
    student: findStudent,
  };
};


//  =============  UPDATE  STUDENT  ==============
export const updateStudentWithAllData = async (data)=>{
 const { student_id } = data?.params;
 const {
    first_name,
    last_name,
    roll_number,
    select_class,
    profile_image,

    // STUDENT PARENT INFORMATION
    father_name,
    father_number,
    father_occupation,
    father_image,
    mother_name,
    mother_number,
    mother_occupation,
    mother_image,
    guardian_name,
    guardian_number,
    guardian_image,

    // STUDENT BASIC INFORMATION
    admission_form_number,
    date_of_birth,
    academic_year,
    admission_year,
    admission_number,
    admission_date,
    special_talent,
    interest,
    gender,
    caste_category,
    blood_group,
    religion,
    mother_tongue,
    nationality,
    address_local,
    address_permanent,

    // STUDENT ADVANCED INFORMATION
    aadhar_number,
    apaar_id,
    pen_number,
    sssmid_number,
    teacher_id,
    bank_name,
    bank_account_number,
    bank_ifsc_code,
    bank_branch_name,

    disability_type,
    health_issues,
    // previous Academic records
    prev_school_name,
    prev_class_name,
    prev_academic_year,
    prev_score_percentage,
    prev_exam_results,
    transfer_certificate_no,
    // documents images
    doc_birth_certificate,
    doc_aadhaar_student,
    doc_aadhaar_father,
    doc_aadhaar_mother,
    doc_bank_passbook,
    doc_sssmid_card,
    doc_transfer_certificate,
    doc_pan,
    doc_apaar_id,
    doc_rtl_letter,

    // 💰 STUDENT FEE RECORD
    total_fee_amount,
    account_active_status,
    // amount_paid,

    // 🏫 CLASS SCHEMA
    // class_id,
    // students_ids save student_id

    //  🔐 STUDENT ACCOUNT / AUTH INFO

    // Ids --
    // class_id,
    // basic_info_id,
    // advanced_info_id,
    // parents_info_id,
    // fees_info_id,
    // attendance_record_id,
    // exam_record_id,
    // homework_record_id,
    // auth_info_id,
  } = data.body;

devLog(` ${logname} updateStudentWithAllData`, {
    id: student_id,
    level: "p",
  });


  //  1️⃣ Find existing student
    const student = await studentRepo.findByIdStudent({ _id: student_id });

    if (!student) {
        const err = new Error("Student not found");
  err.statusCode = 409; // conflict
  throw err;
    
    }


     const rollNumberCheck = await studentRepo.findStudentOne({ roll_number });
  
      if (rollNumberCheck && rollNumberCheck._id.toString() !== student_id) {
     const err = new Error("Roll Number already exists. Please use a different Roll Number");
  err.statusCode = 409; // conflict
  throw err;
      }


  
 const updateStudent = await studentRepo.updateStudent(
    student_id,
    {
      $set: {
        "name.first": first_name || student.name.first,
        "name.last": last_name || student.name.last,
        full_name: `${first_name || student.name.first} ${last_name || student.name.last}`,
        roll_number: roll_number || student.roll_number,
        class_id: select_class || student.class_id,
        profile_image: profile_image || student.profile_image,
      },
    },
    { new: true } // updated document return kare
  );

// 2️⃣ Helper function for images (keep existing if not updated)
  const getUpdatedImage = (newImage, existingImage) => {
    return newImage ? newImage : existingImage;
  };

  const parentsInfo = await StudentParentsInfo.findById(
    student.parents_info_id
  );
  if (!parentsInfo) {
    throw("Parents info not found for this student" );
  }


  // 4️⃣ Update Parents Info
  const parentsInfos = await studentRepo.updateParentsInfo(
    student.parents_info_id,
    {
      $set: {
        "father.name": father_name || parentsInfo.father.name,
        "father.number": father_number || parentsInfo.father.number,
        "father.occupation": father_occupation || parentsInfo.father.occupation,
        "father.image": getUpdatedImage(father_image, parentsInfo.father.image),

        "mother.name": mother_name || parentsInfo.mother.name,
        "mother.number": mother_number || parentsInfo.mother.number,
        "mother.occupation": mother_occupation || parentsInfo.mother.occupation,
        "mother.image": getUpdatedImage(mother_image, parentsInfo.mother.image),

        "guardian.name": guardian_name || parentsInfo.guardian.name,
        "guardian.number": guardian_number || parentsInfo.guardian.number,
        "guardian.image": getUpdatedImage(
          guardian_image,
          parentsInfo.guardian.image
        ),
      },
    },
    { new: true } // updated document return kare
  );

 // 5️⃣ Update Basic Info
  const basicInfo = await StudentBasicInfo.findById(student.basic_info_id);
  if (!basicInfo) {
     throw ("basic info not found for this studentt" );
   
  }


  const updatebasicInfo = await StudentBasicInfo.findByIdAndUpdate(
    student.basic_info_id,
    {
      $set: {
        admission_form_number:
          admission_form_number || basicInfo.admission_form_number,
        date_of_birth: date_of_birth || basicInfo.date_of_birth,
        academic_year: academic_year || basicInfo.academic_year,
        admission_date: admission_date || basicInfo.admission_date,
        special_talent: special_talent || basicInfo.special_talent,
        interest: interest || basicInfo.interest,
        gender: gender || basicInfo.gender,
        caste_category: caste_category || basicInfo.caste_category,
        blood_group: blood_group || basicInfo.blood_group,
        religion: religion || basicInfo.religion,
        mother_tongue: mother_tongue || basicInfo.mother_tongue,
        address_local: address_local || basicInfo.address_local,
        address_permanent: address_permanent || basicInfo.address_permanent,
      },
    },
    { new: true }
  );


 // 6️⃣ Update Advanced Info
  
    const advancedInfo = await StudentAdvancedInfo.findById(
      student.advanced_info_id
    );
  
    if (!advancedInfo) {
       throw { status: 404, message: "Parents info not found for this student" };
   
    }
  
    const updateadvancedInfo = await StudentAdvancedInfo.findByIdAndUpdate(
      student.advanced_info_id,
      {
        $set: {
          created_by_teacher_id: teacher_id || advancedInfo.created_by_teacher_id,
          aadhar_number: aadhar_number || advancedInfo.aadhar_number,
          apaar_id: apaar_id || advancedInfo.apaar_id,
          pen_number: pen_number || advancedInfo.pen_number,
          sssmid_number: sssmid_number || advancedInfo.sssmid_number,
          bank_name: bank_name || advancedInfo.bank_name,
          bank_account_number:
            bank_account_number || advancedInfo.bank_account_number,
          bank_ifsc_code: bank_ifsc_code || advancedInfo.bank_ifsc_code,
          bank_branch_name: bank_branch_name || advancedInfo.bank_branch_name,
          disability_type: disability_type || advancedInfo.disability_type,
          health_issues: health_issues || advancedInfo.health_issues,
          prev_school_name: prev_school_name || advancedInfo.prev_school_name,
          prev_class_name: prev_class_name || advancedInfo.prev_class_name,
          prev_academic_year:
            prev_academic_year || advancedInfo.prev_academic_year,
          prev_score_percentage:
            prev_score_percentage || advancedInfo.prev_score_percentage,
          prev_exam_results: prev_exam_results || advancedInfo.prev_exam_results,
          transfer_certificate_no:
            transfer_certificate_no || advancedInfo.transfer_certificate_no,
        },
      },
      { new: true }
    );
  
    // 7️⃣ Update Fees
    const feesInfo = await StudentFeesInfo.findById(student.fees_info_id);
  
    if (!feesInfo) {
       throw { status: 404, message: "fees info not found for this student" };
    }
    const updadateFeesInfo = await StudentFeesInfo.findByIdAndUpdate(
      student.fees_info_id,
      {
        total_fee: total_fee_amount || feesInfo.total_fee,
      }
    );
  
    // 8️⃣ Update Auth Info
    const authInfo = await StudentAuthInfo.findById(student.auth_info_id);
  
    if (!authInfo) {
       throw { status: 404, message: "auth not found for this student" };
    }
  
    const updateAuthInfo = await StudentAuthInfo.findByIdAndUpdate(
      student.auth_info_id,
  
      {
        $set: {
          active_status: account_active_status ?? authInfo.active_status,
          // optionally update username/password
        },
      },
      { new: true }
    );
  

  //   // documents
  //   // advancedInfo.doc_birth_certificate = getUpdatedImage(doc_birth_certificate, advancedInfo.doc_birth_certificate);
  //   // advancedInfo.doc_aadhaar_student = getUpdatedImage(doc_aadhaar_student, advancedInfo.doc_aadhaar_student);
  //   // advancedInfo.doc_aadhaar_father = getUpdatedImage(doc_aadhaar_father, advancedInfo.doc_aadhaar_father);
  //   // advancedInfo.doc_aadhaar_mother = getUpdatedImage(doc_aadhaar_mother, advancedInfo.doc_aadhaar_mother);
  //   // advancedInfo.doc_bank_passbook = getUpdatedImage(doc_bank_passbook, advancedInfo.doc_bank_passbook);
  //   // advancedInfo.doc_sssmid_card = getUpdatedImage(doc_sssmid_card, advancedInfo.doc_sssmid_card);
  //   // advancedInfo.doc_transfer_certificate = getUpdatedImage(doc_transfer_certificate, advancedInfo.doc_transfer_certificate);
  //   // advancedInfo.doc_pan = getUpdatedImage(doc_pan, advancedInfo.doc_pan);
  //   // advancedInfo.doc_apaar_id = getUpdatedImage(doc_apaar_id, advancedInfo.doc_apaar_id);
  //   // advancedInfo.doc_rtl_letter = getUpdatedImage(doc_rtl_letter, advancedInfo.doc_rtl_letter);

const Student = await  studentRepo.findStudentByIdAllData(student._id)

devLog(` ${logname} Update Full Student by updateFullStudent`, {
    id: student_id,
    level: "s",
  });


  return{
    success: true,
    message: "Student Update successfully",
    data: Student,
  };

}

// ==============  DELETE STUDENT  ===============

export const deleteStudentWithAllData = async(data)=>{

   const student = await StudentProfile.findById(data.params.id);
  
      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      devLog(` ${logname} DELETE Student by deleteStudentWithAllData`, {
    id: student?._id,
    level: "s",
  });


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

// Finally delete the main StudentProfile
    await StudentProfile.findByIdAndDelete(req.params.id);


   return {
      success: true,
      message: "Student and all related data deleted successfully",
      // data: dd,
    };


}