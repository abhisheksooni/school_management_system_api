
import { StudentProfile,StudentAdvancedInfo, StudentAuthInfo, StudentBasicInfo, StudentFeesInfo, StudentParentsInfo, } from "../../models/student/student_model.js";
import { devLog } from "../../utils/devlogger.js";
import { generateNanoID } from "../../utils/nanoidGenerator.js";


export const CreateFullStudent = async (data) => {

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

     devLog(`Start Create Student createWithAllDataStudent `, {
      level: "p",

      // data: error,
    });



    const rollNumberCheck = await StudentProfile.findOne({ roll_number });

    if (rollNumberCheck) {
       throw { status: 404, message: "Roll Number already exists. Please use a different Roll Number" };
    }

    // / Create Student
    const createStudent = await StudentProfile.create({
      name: {
        first: first_name || null,
        last: last_name || null,
      },
      full_name: `${first_name} ${last_name}`,
      roll_number,
      profile_image: profile_image ? profile_image : undefined,
      class_id: select_class.trim(),

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
    const createParentsInfo = await StudentParentsInfo.create({
      student_id: createStudent._id,
      father: {
        name: father_name,
        number: father_number,
        occupation: father_occupation,
        image: father_image ? father_image : "null",
        // image: father_image ? father_image.path : "null",
      },
      mother: {
        name: mother_name,
        number: mother_number,
        occupation: mother_occupation,
        image: mother_image ? mother_image : "null",
      },
      guardian: {
        name: guardian_name,
        number: guardian_number,
        image: guardian_image ? guardian_image : "null",
      },
      // createdAt:NativeDate
    });
    createStudent.parents_info_id = createParentsInfo._id;

    // STUDENT BASIC INFORMATION
    const createBasicInfo = await StudentBasicInfo.create({
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
    });
    createStudent.basic_info_id = createBasicInfo._id;

    // STUDENT ADDITIONAL / ADVANCED INFORMATION
    const createAdvancedInfo = await StudentAdvancedInfo.create({
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
    });

    createStudent.advanced_info_id = createAdvancedInfo._id;

    // STUDENT FEE RECORD
    const createFeesInfo = await StudentFeesInfo.create({
      student_id: createStudent._id,
      total_fee: total_fee_amount,
    });
    createStudent.fees_info_id = createFeesInfo._id;

    // STUDENT🔐 STUDENT ACCOUNT / AUTH INFO
    const createStudentAuthInfo = await StudentAuthInfo.create({
      student_id: createStudent._id,
      active_status:true,
      username: `${first_name}${generateNanoID()}`,
      password: `${first_name}${generateNanoID({ length: 6 })}`,
      // role,
    });
    createStudent.auth_info_id = createStudentAuthInfo._id;

    await createStudent.save();
    await createBasicInfo.save();
    await createAdvancedInfo.save();
    await createFeesInfo.save();
    await createParentsInfo.save();
    await createStudentAuthInfo.save();
    // await create.save();




// 4. Return fully populated student
 const  students = await StudentProfile.findById(createStudent._id).populate([
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


     devLog(`Create Student createWithAllDataStudent `, {
      level: "s",
      id: students._id,
      // data: error,
    });

    return students


};





// export const createWithAllDataStudent2 = async (req, res) => {
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

//     console.log("res -- ", req.body);
//     // console.log("res files -- ", req.files);
//     // console.log("res restze files -- ", req.files);
//     // console.log("res file -- ",req.file);

//     // uploads\\students\\2025\\user_ravi_adam_20251029_C9DF0CA0\\1761759659049-male.jpg
//     // uploads/students/2025/user_ravi_adam_20251029_C9DF0CA0/1761759659049-male.jpg
//     // `/uploads/${type}/${year}`;
//     // const existingStudent = await Student.findById(req.params.id);
//     //   if (!existingStudent) {
//     //     return res.status(404).json({ message: "Student not found" });
//     //   }
//     //    // ✅ Agar resize ke baad `req.body[field]` set hua hai to wo lo
//     //   const getUpdatedPath = (field, existingPath) => {
//     //     return req.body?.[field] || existingPath || "";
//     //   };

//     // const father_image = getUpdatedPath?.father_image
//     //   ? `uploads/staff/${getUpdatedPath.father_image[0].filename}`
//     //   : existingStudent.father_image;

//     // const mother_image = getUpdatedPath?.mother_image
//     //   ? `uploads/staff/${getUpdatedPath.mother_image[0].filename}`
//     //   : existingStudent.mother_image;

//     // const guardian_image = getUpdatedPath?.guardian_image
//     //   ? `uploads/staff/${getUpdatedPath.guardian_image[0].filename}`
//     //   : existingStudent.guardian_image;

//     // const profile_image = getUpdatedPath?.profile_image
//     //   ? `uploads/staff/${getUpdatedPath.profile_image[0].filename}`
//     //   : existingStudent.profile_image;

//     const rollNumberCheck = await FindStudentsHandler({ roll_number });
//     // const rollNumberCheck = await StudentProfile.findOne({ roll_number });

//     if (rollNumberCheck) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Roll Number already exists. Please use a different Roll Number.",
//       });
//     }

//     // Create Student
//     const createStudent = await StudentProfile.create({
//       name: {
//         first: first_name || null,
//         last: last_name || null,
//       },
//       full_name: `${first_name} ${last_name}`,
//       roll_number,
//       profile_image: profile_image ? profile_image : undefined,
//       class_id: select_class.trim(),

//       // basic_info_id: basicInfoDoc?._id || null,
//       // advanced_info_id: advancedInfoDoc?._id || null,
//       // parents_info_id: parentsInfoDoc?._id || null,
//       // fees_info_id: null,
//       // attendance_info_id: null,
//       // exam_info_id: null,
//       // homework_info_id: null,
//       // extraCurricularInfo_id: null,
//       // auth_info_id: null,
//       // add more references here as needed
//     });

//     // STUDENT PARENT INFORMATION
//     const createParentsInfo = await StudentParentsInfo.create({
//       student_id: createStudent._id,
//       father: {
//         name: father_name,
//         number: father_number,
//         occupation: father_occupation,
//         image: father_image ? father_image : "null",
//         // image: father_image ? father_image.path : "null",
//       },
//       mother: {
//         name: mother_name,
//         number: mother_number,
//         occupation: mother_occupation,
//         image: mother_image ? mother_image : "null",
//       },
//       guardian: {
//         name: guardian_name,
//         number: guardian_number,
//         image: guardian_image ? guardian_image : "null",
//       },
//       // createdAt:NativeDate
//     });
//     createStudent.parents_info_id = createParentsInfo._id;

//     // STUDENT BASIC INFORMATION
//     const createBasicInfo = await StudentBasicInfo.create({
//       student_id: createStudent._id,
//       admission_form_number,
//       date_of_birth,
//       academic_year,
//       admission_date,
//       // admission_number
//       special_talent,
//       interest,
//       gender,
//       caste_category,
//       blood_group,
//       religion,
//       mother_tongue,
//       // nationality,

//       address_local,
//       address_permanent,
//     });
//     createStudent.basic_info_id = createBasicInfo._id;

//     // STUDENT ADDITIONAL / ADVANCED INFORMATION
//     const createAdvancedInfo = await StudentAdvancedInfo.create({
//       student_id: createStudent._id,
//       created_by_teacher_id: teacher_id,
//       aadhar_number,
//       apaar_id,
//       pen_number,
//       sssmid_number,

//       bank_name,
//       bank_ifsc_code,
//       bank_branch_name,
//       bank_account_number,

//       disability_type,
//       health_issues,

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
//     });

//     createStudent.advanced_info_id = createAdvancedInfo._id;

//     // STUDENT FEE RECORD
//     const createFeesInfo = await StudentFeesInfo.create({
//       student_id: createStudent._id,
//       total_fee: total_fee_amount,
//     });
//     createStudent.fees_info_id = createFeesInfo._id;

//     // STUDENT🔐 STUDENT ACCOUNT / AUTH INFO
//     const createStudentAuthInfo = await StudentAuthInfo.create({
//       student_id: createStudent._id,
//       active_status: account_active_status,
//       username: `${first_name}${generateNanoID()}`,
//       password: `${first_name}${generateNanoID({ length: 6 })}`,
//       // role,
//     });
//     createStudent.auth_info_id = createStudentAuthInfo._id;

//     await createStudent.save();
//     await createBasicInfo.save();
//     await createAdvancedInfo.save();
//     await createFeesInfo.save();
//     await createParentsInfo.save();
//     await createStudentAuthInfo.save();
//     // await create.save();

//     const students = await StudentProfile.findById(createStudent._id).populate([
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

//     const student = await FindStudentsHandler(
//       { findById: createStudent._id },
//       {
//         populate: [
//           { path: "basic_info_id" },
//           {
//             path: "advanced_info_id",
//             populate: {
//               path: "created_by_teacher_id",
//               select: "full_name , _id",
//             },
//           },
//           { path: "parents_info_id" },
//           { path: "fees_info_id" },
//           { path: "auth_info_id" },
//           {
//             path: "class_id",
//             populate: {
//               path: "subjects_ids",
//               select: "name subject_code",
//             },
//           },
//         ],
//       }
//     );

//     // console.log("res -- ", student);

//     return res.status(201).json({
//       success: true,
//       message: "Student created successfully",
//       student: student,
//     });
//   } catch (error) {
//     console.error("Create Student Error:", error);
//     return res.status(400).json({
//       success: false,
//       message: "Student creation failed",
//       error: error.message,
//     });
//   }
// };