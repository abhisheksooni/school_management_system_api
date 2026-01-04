import {
  StudentAdvancedInfo,
  StudentAuthInfo,
  StudentBasicInfo,
  StudentFeesInfo,
  StudentParentsInfo,
  StudentProfile,
} from "../../models/student/student_model.js";
import { devLog } from "../../utils/devlogger.js";

export const UpdateFullStudent = async (data, res, err) => {
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

  devLog(`Start Start Full Student by updateFullStudent`, {
    id: student_id,
    level: "p",
  });

  //  1️⃣ Find existing student
  const student = await StudentProfile.findById({ _id: student_id });
  if (!student) {
    return res = json({ success: false, message: "Student not found" });
  }

  const updateStudent = await StudentProfile.findByIdAndUpdate(
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

  // // 1️⃣ Find existing student
  // const student = await StudentProfile.findById({_id:student_id})
  // if (!student) {
  //   return res
  //     .status(404)
  //     .json({ success: false, message: "Student not found" });
  // }
  const rollNumberCheck = await StudentProfile.findOne({ roll_number });
  if (rollNumberCheck && rollNumberCheck._id.toString() !== student_id) {
  throw { status: 400, message: "Roll Number already exists. Please use a different Roll Number." };
  }

  // 2️⃣ Helper function for images (keep existing if not updated)
  const getUpdatedImage = (newImage, existingImage) => {
    return newImage ? newImage : existingImage;
  };

  const parentsInfo = await StudentParentsInfo.findById(
    student.parents_info_id
  );
  if (!parentsInfo) {
    throw { status: 404, message: "Parents info not found for this student" };
    
  }

  // 4️⃣ Update Parents Info
  const parentsInfos = await StudentParentsInfo.findByIdAndUpdate(
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
     throw { status: 404, message: "basic info not found for this studentt" };
   
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

  // // 6️⃣ Update Advanced Info

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

  const Student = await StudentProfile.findById(student._id).populate([
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
  ]);

  devLog(`Update Full Student by updateFullStudent`, {
    id: student_id,
    level: "s",
  });

  return Student;
};

// Old Fun

// export const updateStudentWithAllData2 = async (req, res) => {
//   const { student_id } = req.params;
//   console.log("student_id --- ", student_id);
//   try {
//     const {
//       first_name,
//       last_name,
//       roll_number,
//       select_class,
//       profile_image,

//       // STUDENT PARENT INFORMATION
//       father_name,
//       father_number,
//       father_occupation,
//       father_image,
//       mother_name,
//       mother_number,
//       mother_occupation,
//       mother_image,
//       guardian_name,
//       guardian_number,
//       guardian_image,

//       // STUDENT BASIC INFORMATION
//       admission_form_number,
//       date_of_birth,
//       academic_year,
//       admission_year,
//       admission_number,
//       admission_date,
//       special_talent,
//       interest,
//       gender,
//       caste_category,
//       blood_group,
//       religion,
//       mother_tongue,
//       nationality,
//       address_local,
//       address_permanent,

//       // STUDENT ADVANCED INFORMATION
//       aadhar_number,
//       apaar_id,
//       pen_number,
//       sssmid_number,
//       teacher_id,
//       bank_name,
//       bank_account_number,
//       bank_ifsc_code,
//       bank_branch_name,

//       disability_type,
//       health_issues,
//       // previous Academic records
//       prev_school_name,
//       prev_class_name,
//       prev_academic_year,
//       prev_score_percentage,
//       prev_exam_results,
//       transfer_certificate_no,
//       // documents images
//       doc_birth_certificate,
//       doc_aadhaar_student,
//       doc_aadhaar_father,
//       doc_aadhaar_mother,
//       doc_bank_passbook,
//       doc_sssmid_card,
//       doc_transfer_certificate,
//       doc_pan,
//       doc_apaar_id,
//       doc_rtl_letter,

//       // 💰 STUDENT FEE RECORD
//       total_fee_amount,
//       account_active_status,
//       // amount_paid,

//       // 🏫 CLASS SCHEMA
//       // class_id,
//       // students_ids save student_id

//       //  🔐 STUDENT ACCOUNT / AUTH INFO

//       // Ids --
//       // class_id,
//       // basic_info_id,
//       // advanced_info_id,
//       // parents_info_id,
//       // fees_info_id,
//       // attendance_record_id,
//       // exam_record_id,
//       // homework_record_id,
//       // auth_info_id,
//     } = req.body;

//     console.log("update res -- ", req.body);

//     //  1️⃣ Find existing student
//     const student = await StudentProfile.findById({ _id: student_id });
//     if (!student) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Student not found" });
//     }

//     const updateStudent = await StudentProfile.findByIdAndUpdate(
//       student_id,
//       {
//         $set: {
//           "name.first": first_name || student.name.first,
//           "name.last": last_name || student.name.last,
//           full_name: `${first_name || student.name.first} ${last_name || student.name.last}`,
//           roll_number: roll_number || student.roll_number,
//           class_id: select_class || student.class_id,
//           profile_image: profile_image || student.profile_image,
//         },
//       },
//       { new: true } // updated document return kare
//     );

//     // // 1️⃣ Find existing student
//     // const student = await StudentProfile.findById({_id:student_id})
//     // if (!student) {
//     //   return res
//     //     .status(404)
//     //     .json({ success: false, message: "Student not found" });
//     // }
//     const rollNumberCheck = await StudentProfile.findOne({ roll_number });
//     if (rollNumberCheck) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Roll Number already exists. Please use a different Roll Number.",
//       });
//     }

//     // 2️⃣ Helper function for images (keep existing if not updated)
//     const getUpdatedImage = (newImage, existingImage) => {
//       return newImage ? newImage : existingImage;
//     };

//     const parentsInfo = await StudentParentsInfo.findById(
//       student.parents_info_id
//     );
//     if (!parentsInfo) {
//       return res.status(404).json({
//         success: false,
//         message: "Parents info not found for this student",
//       });
//     }

//     // 4️⃣ Update Parents Info
//     const parentsInfos = await StudentParentsInfo.findByIdAndUpdate(
//       student.parents_info_id,
//       {
//         $set: {
//           "father.name": father_name || parentsInfo.father.name,
//           "father.number": father_number || parentsInfo.father.number,
//           "father.occupation":
//             father_occupation || parentsInfo.father.occupation,
//           "father.image": getUpdatedImage(
//             father_image,
//             parentsInfo.father.image
//           ),

//           "mother.name": mother_name || parentsInfo.mother.name,
//           "mother.number": mother_number || parentsInfo.mother.number,
//           "mother.occupation":
//             mother_occupation || parentsInfo.mother.occupation,
//           "mother.image": getUpdatedImage(
//             mother_image,
//             parentsInfo.mother.image
//           ),

//           "guardian.name": guardian_name || parentsInfo.guardian.name,
//           "guardian.number": guardian_number || parentsInfo.guardian.number,
//           "guardian.image": getUpdatedImage(
//             guardian_image,
//             parentsInfo.guardian.image
//           ),
//         },
//       },
//       { new: true } // updated document return kare
//     );

//     // 5️⃣ Update Basic Info
//     const basicInfo = await StudentBasicInfo.findById(student.basic_info_id);
//     if (!basicInfo) {
//       return res.status(404).json({
//         success: false,
//         message: "basic info not found for this student",
//       });
//     }

//     const updatebasicInfo = await StudentBasicInfo.findByIdAndUpdate(
//       student.basic_info_id,
//       {
//         $set: {
//           admission_form_number:
//             admission_form_number || basicInfo.admission_form_number,
//           date_of_birth: date_of_birth || basicInfo.date_of_birth,
//           academic_year: academic_year || basicInfo.academic_year,
//           admission_date: admission_date || basicInfo.admission_date,
//           special_talent: special_talent || basicInfo.special_talent,
//           interest: interest || basicInfo.interest,
//           gender: gender || basicInfo.gender,
//           caste_category: caste_category || basicInfo.caste_category,
//           blood_group: blood_group || basicInfo.blood_group,
//           religion: religion || basicInfo.religion,
//           mother_tongue: mother_tongue || basicInfo.mother_tongue,
//           address_local: address_local || basicInfo.address_local,
//           address_permanent: address_permanent || basicInfo.address_permanent,
//         },
//       },
//       { new: true }
//     );

//     // // 6️⃣ Update Advanced Info

//     const advancedInfo = await StudentAdvancedInfo.findById(
//       student.advanced_info_id
//     );

//     if (!advancedInfo) {
//       return res.status(404).json({
//         success: false,
//         message: "Parents info not found for this student",
//       });
//     }

//     const updateadvancedInfo = await StudentAdvancedInfo.findByIdAndUpdate(
//       student.advanced_info_id,
//       {
//         $set: {
//           created_by_teacher_id:
//             teacher_id || advancedInfo.created_by_teacher_id,
//           aadhar_number: aadhar_number || advancedInfo.aadhar_number,
//           apaar_id: apaar_id || advancedInfo.apaar_id,
//           pen_number: pen_number || advancedInfo.pen_number,
//           sssmid_number: sssmid_number || advancedInfo.sssmid_number,
//           bank_name: bank_name || advancedInfo.bank_name,
//           bank_account_number:
//             bank_account_number || advancedInfo.bank_account_number,
//           bank_ifsc_code: bank_ifsc_code || advancedInfo.bank_ifsc_code,
//           bank_branch_name: bank_branch_name || advancedInfo.bank_branch_name,
//           disability_type: disability_type || advancedInfo.disability_type,
//           health_issues: health_issues || advancedInfo.health_issues,
//           prev_school_name: prev_school_name || advancedInfo.prev_school_name,
//           prev_class_name: prev_class_name || advancedInfo.prev_class_name,
//           prev_academic_year:
//             prev_academic_year || advancedInfo.prev_academic_year,
//           prev_score_percentage:
//             prev_score_percentage || advancedInfo.prev_score_percentage,
//           prev_exam_results:
//             prev_exam_results || advancedInfo.prev_exam_results,
//           transfer_certificate_no:
//             transfer_certificate_no || advancedInfo.transfer_certificate_no,
//         },
//       },
//       { new: true }
//     );

//     // 7️⃣ Update Fees
//     const feesInfo = await StudentFeesInfo.findById(student.fees_info_id);

//     if (!feesInfo) {
//       return res.status(404).json({
//         success: false,
//         message: "fees info not found for this student",
//       });
//     }
//     const updadateFeesInfo = await StudentFeesInfo.findByIdAndUpdate(
//       student.fees_info_id,
//       {
//         total_fee: total_fee_amount || feesInfo.total_fee,
//       }
//     );

//     // 8️⃣ Update Auth Info
//     const authInfo = await StudentAuthInfo.findById(student.auth_info_id);

//     if (!authInfo) {
//       return res.status(404).json({
//         success: false,
//         message: "fees info not found for this student",
//       });
//     }

//     const updateAuthInfo = await StudentAuthInfo.findById(
//       student.auth_info_id,
//       {
//         active_status: account_active_status ?? authInfo.active_status,
//         // username ,
//         // password
//       }
//     );

//     //   // documents
//     //   // advancedInfo.doc_birth_certificate = getUpdatedImage(doc_birth_certificate, advancedInfo.doc_birth_certificate);
//     //   // advancedInfo.doc_aadhaar_student = getUpdatedImage(doc_aadhaar_student, advancedInfo.doc_aadhaar_student);
//     //   // advancedInfo.doc_aadhaar_father = getUpdatedImage(doc_aadhaar_father, advancedInfo.doc_aadhaar_father);
//     //   // advancedInfo.doc_aadhaar_mother = getUpdatedImage(doc_aadhaar_mother, advancedInfo.doc_aadhaar_mother);
//     //   // advancedInfo.doc_bank_passbook = getUpdatedImage(doc_bank_passbook, advancedInfo.doc_bank_passbook);
//     //   // advancedInfo.doc_sssmid_card = getUpdatedImage(doc_sssmid_card, advancedInfo.doc_sssmid_card);
//     //   // advancedInfo.doc_transfer_certificate = getUpdatedImage(doc_transfer_certificate, advancedInfo.doc_transfer_certificate);
//     //   // advancedInfo.doc_pan = getUpdatedImage(doc_pan, advancedInfo.doc_pan);
//     //   // advancedInfo.doc_apaar_id = getUpdatedImage(doc_apaar_id, advancedInfo.doc_apaar_id);
//     //   // advancedInfo.doc_rtl_letter = getUpdatedImage(doc_rtl_letter, advancedInfo.doc_rtl_letter);

//     const updatedStudent = await StudentProfile.findById(student._id).populate([
//       { path: "basic_info_id" },
//       {
//         path: "advanced_info_id",
//         populate: {
//           path: "created_by_teacher_id",
//           select: "full_name , _id",
//         },
//       },
//       { path: "parents_info_id" },
//       { path: "fees_info_id" },
//       { path: "auth_info_id" },
//       {
//         path: "class_id",
//         populate: {
//           path: "subjects_ids",
//           select: "name subject_code",
//         },
//       },

//       // { path: "created_by_teacher_id" },
//       // { path: "attendances" },  // ⛔️ This may need to change — see below
//       // { path: "exam_info" },
//       // { path: "homework_info" },
//       // { path: "extraCurricularInfo" }
//     ]);

//     // console.log("res -- ", updatedStudent);

//     return res.status(200).json({
//       success: true,
//       message: "Student updated successfully",
//       // student1: updateStudent,
//       data: updatedStudent,
//     });
//   } catch (error) {
//     console.error("Update Student Error:", error);
//     return res.status(400).json({
//       success: false,
//       message: "Student update  failed",
//       error: error.message,
//     });
//   }
// };





