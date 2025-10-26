import mongoose, { Schema } from "mongoose";
import { customAlphabet } from "nanoid";

const nanoIDs = customAlphabet("1234567890ABCD", 5);

// Sub-schema for academic info

const ParentsInfoSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudentProfile",
    required: true,
  },

  father: {
    name: { type: String },
    number: { type: String },
    occupation: { type: String },
    image: { type: String },
  },
  mother: {
    name: { type: String },
    number: { type: String },
    occupation: { type: String },
    image: { type: String },
  },
  guardian: {
    name: { type: String },
    image: { type: String },
    number: { type: String },
  },

  // father_name: { type: String, },
  // father_number: { type: String, },
  // father_occupation: { type: String, },
  // father_image: { type: String, },

  // mother_name: { type: String, },
  // mother_number: { type: String, },
  // mother_occupation: { type: String, },
  // mother_image: { type: String, },

  // guardian_name: { type: String, },
  // guardian_image: { type: String, },
  // guardian_number: { type: String, },
});

export const StudentParentsInfo = mongoose.model(
  "StudentParentsInfo",
  ParentsInfoSchema
);

const basicInfoSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  admission_form_number: { type: String },
  date_of_birth: { type: Date },
  // student_dob: { type: Date, },
  academic_year: { type: String },
  admission_year: { type: String },
  admission_number: { type: String },
  admission_date: { type: Date, default: Date.now },
  special_talent: { type: String },
  interest: { type: String },

  gender: { type: String, enum: ["Female", "Male", "EWS", "Transgender"] },
  //category
  caste_category: { type: String, enum: ["General", "OBC", "SC", "ST", "EWS"] },
  blood_group: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  religion: { type: String },
  mother_tongue: { type: String },
  nationality: { type: String },

  address_local: { type: String },
  address_permanent: { type: String },
  // city: { type: String, },
  // state: { type: String, },
  // zip_code: { type: String, },
});

export const StudentBasicInfo = mongoose.model(
  "StudentBasicInfo",
  basicInfoSchema
);

const advancedInfoSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
  },

  aadhar_number: { type: String },

  bank_name: { type: String },
  bank_account_number: { type: String },
  bank_ifsc_code: { type: String },
  bank_branch_name: { type: String },

  pen_number: { type: String },
  sssmid_number: { type: String },

  disability_type: {
    type: String,
    enum: ["None", "Visual", "Hearing", "Locomotor", "Mental"],
  },

  health_issues: { type: String },
  apaar_id: { type: String },

  // previous Academic records
  prev_school_name: { type: String },
  prev_class_name: { type: String },
  prev_academic_year: { type: String },
  prev_score_percentage: { type: String },
  prev_exam_results: { type: String },
  transfer_certificate_no: { type: String },

  // documents images
  doc_birth_certificate: { type: String },
  doc_aadhaar_student: { type: String },
  doc_aadhaar_father: { type: String },
  doc_aadhaar_mother: { type: String },
  doc_bank_passbook: { type: String },
  doc_sssmid_card: { type: String },
  doc_transfer_certificate: { type: String },
  doc_pen: { type: String },
  doc_apaar_id: { type: String },
  doc_rtl_letter: { type: String },

  // birth_certificate_image: { type: String, },
  // aadhar_card_student_image: { type: String, },
  // aadhar_card_father_image: { type: String, },
  // aadhar_card_mother_image: { type: String, },
  // bank_passbook_image: { type: String, },
  // sssmid_card_image: { type: String, },
  // transfer_certificate_image: { type: String, },
  // pen_image: { type: String, },
  // apaarid_image: { type: String, },
  // rtl_letter_image: { type: String, },

  // any_other: { type: String, },
});
export const StudentAdvancedInfo = mongoose.model(
  "StudentAdvancedInfo",
  advancedInfoSchema
);

const feesInfo = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    total_fee_amount: { type: Number, default: 0 },
    amount_paid: { type: Number, default: 0 },
    amount_due: { type: Number, default: 0 },
    payments: [
      {
        payment_amount: Number,
        payment_date: { type: Date, default: Date.now },
        payment_mode: String,
        receipt_number: String,
      },
    ],
  },
  { timestamps: true }
);

export const StudentFeesInfo = mongoose.model("StudentFeesInfo", feesInfo);

const attendanceInfoSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    attendance_status: {
      type: String,
      enum: ["P", "A", "H", "S"],
      required: true,
    },
    // ["Present", "Absent", "Holiday", "Sunday"]
    remark: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
// Duplicate se bachane ke liye
attendanceInfoSchema.index({ student_id: 1, date: 1 }, { unique: true });
export const StudentAttendanceRecord = mongoose.model(
  "StudentAttendanceRecord",
  attendanceInfoSchema
);

// Class
const ClassSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Class Name "1th" ,"2th"
    section: String, // A,B,C
    class_teacher_name: String,
    subjects_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClassSubject",
        required: true,
        default: null,
      },
    ],
    students_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudentProfile",
        required: true,
        default: null,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 👇 Virtual populate for subjects
ClassSchema.virtual("subjects", {
  ref: "ClassSubject", // Model to populate from
  localField: "_id", // Class _id
  foreignField: "class_id", // Subject.class_id
});

export const SchoolClass = mongoose.model("SchoolClass", ClassSchema);

// Subjects
const subjectsSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Math" ,"Hindi"
  subject_code: { type: String },
  max_marks: { type: Number, default: 100 },
  grade: { type: String },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teachers",

    default: null,
  },
  class_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchoolClass",
      required: true,
      default: null,
    },
  ],
});

export const ClassSubject = mongoose.model("ClassSubject", subjectsSchema);

const StudentSubjectSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "StudentProfile" },
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "ClassSubject" },
  obtained_marks: Number,
  grade: String,
});

export const StudentSubject = mongoose.model(
  "StudentSubject",
  StudentSubjectSchema
);

const StudentAuthSchema = new mongoose.Schema(
  {
    createStudentTeacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherProfile",
    },

    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    activeStatus: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "TeacherProfile" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const StudentAuthInfo = mongoose.model(
  "StudentAuthInfo",
  StudentAuthSchema
);

// Main Student Schema
const StudentSchema = new Schema(
  {
    //---- basicInfo ------

    student_code: { type: String, default: () => nanoIDs(), unique: true },
    name: {
      first: { type: String },
      last: { type: String },
    },
    full_name: { type: String },
    roll_number: { type: String },
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchoolClass",
      required: true,
      default: null,
    }, // Class ID

    profile_image: { type: String }, // student_image
    enrolled_subjects: [
      //student_subjects
      {
        subject_name: String,
        marks: Number,
      },
    ],

    // ++++++++ References To other Modules +++++++++

    basic_info_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentBasicInfo",
      default: null,
    }, // admissonInfo inn form data, address, etc

    advanced_info_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentAdvancedInfo",
      default: null,
    }, // healthInfo, documentsInfo, etc government id, bank details

    parents_info_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentParentsInfo",
      default: null,
    },

    fees_info_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentFeesInfo",
      default: null,
    },

    //   attendances
    attendance_record_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentAttendanceRecord",
      default: null,
    },
    // exam _info
    exam_record_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamInfo",
      default: null,
    },

    // Homework_info
    homework_record_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HomeworkInfo",
      default: null,
    },
    //extraCurricularInfo

    auth_info_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentAuthInfo",
      default: null,
    },

    // StudentAuthInfo

    // schoolUserInfo: { type: mongoose.Schema.Types.ObjectId, ref: "SchoolUserInfo",required:true },

    // academicInfo: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicInfo", default: null },

    // ---- otherInfo ------
    // photo

    // -----attendanceInfo---

    // ----ExtraCurricularInfo---
    //----ExamInfo---
  },
  { timestamps: true }
);
export const StudentProfile = mongoose.model("StudentProfile", StudentSchema);

// | Old Name             | Suggested New Name        |
// | -------------------- | ------------------------- |
// | `Student`            | `StudentProfile`          |
// | `BasicInfo`          | `StudentBasicInfo`        |
// | `AdvancedInfo`       | `StudentAdvancedInfo`     |
// | `ParentsInfo`        | `StudentParentsInfo`      |
// | `FeesInfo`           | `StudentFeesInfo`         |
// | `StudentsAttendance` | `StudentAttendanceRecord` |
// | `Class`              | `SchoolClass`             |
// | `Subject`            | `ClassSubject`            |
// | `StudentSubject`     | `StudentSubjectRecord`    |
// | `StudentAuth`        | `StudentAuthInfo`         |
