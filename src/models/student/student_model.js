import dayjs from "dayjs";
import mongoose, { Schema } from "mongoose";
import { customAlphabet } from "nanoid";
const nanoIDs = customAlphabet("1234567890ABCDEFGHIJKLMOPQRSTUVW", 5);

/* =====================================================
   🧍‍♂️ STUDENT PARENT INFORMATION
   ===================================================== */

const ParentsInfoSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },

    father: {
      name: { type: String, default: "N/A" },
      number: { type: String, default: "N/A" },
      occupation: { type: String, default: "N/A" },
      image: { type: String, default: "N/A" },
    },
    mother: {
      name: { type: String, default: "N/A" },
      number: { type: String, default: "N/A" },
      occupation: { type: String, default: "N/A" },
      image: { type: String, default: "N/A" },
    },
    guardian: {
      name: { type: String, default: "N/A" },
      image: { type: String, default: "N/A" },
      number: { type: String, default: "N/A" },
    },
  },
  { timestamps: true }
);

export const StudentParentsInfo = mongoose.model(
  "StudentParentsInfo",
  ParentsInfoSchema
);

/* =====================================================
   📘 STUDENT BASIC INFORMATION
   ===================================================== */
const basicInfoSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
    },
    admission_form_number: { type: String, default: "" },
    date_of_birth: { type: Date, default: "" },

    academic_year: {
      type: String,
      default: () => {
        const year = dayjs().year();
        return `${year}-${year + 1}`;
      },
    },

    admission_date: { type: Date, default: Date.now },
    // admission_year: { type: String },
    admission_number: { type: String, default: "N/A" },

    special_talent: { type: String, default: "N/A" },
    interest: { type: String, default: "N/A" },

    gender: {
      type: String,
      enum: ["female", "male", "transgender"],
      lowercase: true,
      // required:true
    },

    //category
    caste_category: {
      type: String,
      enum: ["general", "obc", "sc", "st", "ews"],
      lowercase: true,
      // required:true
    },
    blood_group: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      // required:true
    },
    religion: {
      type: String,
      enum: [
        "hindu",
        "muslim",
        "christian",
        "sikh",
        "buddhist",
        "jain",
        "other",
      ],
      // required:true,
      // trim: true,
      lowercase: true, // ✅ optional: if you want consistent data storage
    },
    mother_tongue: { type: String, default: "Hindi" },
    nationality: {
      type: String,
      enum: ["indian", "Other"],
      lowercase: true, // ✅ Recommended for consistent storage
      default: "indian", // optional: agar mostly Indian students hi hain
    },

    address_local: { type: String, default: "N/A" },
    address_permanent: { type: String, default: "N/A" },
    // city: { type: String, },
    // state: { type: String, },
    // zip_code: { type: String, },
  },
  { timestamps: true }
);

export const StudentBasicInfo = mongoose.model(
  "StudentBasicInfo",
  basicInfoSchema
);

/* =====================================================
   📗 STUDENT ADDITIONAL / ADVANCED INFORMATION
   ===================================================== */
const advancedInfoSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
    },

    created_by_teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherProfile",
    },

    aadhar_number: { type: String },
    apaar_id: { type: String },
    pen_number: { type: String },
    sssmid_number: { type: String },

    bank_name: { type: String },
    bank_account_number: { type: String },
    bank_ifsc_code: { type: String },
    bank_branch_name: { type: String },

    disability_type: {
      type: String,
      enum: ["none", "visual", "hearing", "locomotor", "mental"],
      lowercase: true,
    },
    health_issues: { type: String },

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
    doc_pan: { type: String },
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
  },
  { timestamps: true }
);
export const StudentAdvancedInfo = mongoose.model(
  "StudentAdvancedInfo",
  advancedInfoSchema
);

/* =====================================================
   💰 STUDENT FEE RECORD
   ===================================================== */
const StudentFeesPayment = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: null,
      // required: true,
    },
    feesInfo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentFeesInfo",
      default: null,
      // required: true,
    },

    payment_amount: { type: Number, default: null },
    payment_date: { type: Date, default: dayjs().toDate() },
    payment_mode: {
      type: String,
      enum: ["Cash", "Online", "Cheque", "Card", "Other"],
      default: "Cash",
    },
    note: { type: String, default: "" },
    receipt_number: { type: String, default: "N/A" },
  },
  { timestamps: true }
);

export const StudentFeesPaymentsInfo = mongoose.model(
  "StudentFeesPaymentsInfo",
  StudentFeesPayment
);

const feesInfo = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    total_fee: { type: Number, default: 0 },
    amount_paid: { type: Number, default: 0 },
    amount_due: { type: Number, default: 0 },

    payments: [StudentFeesPayment],
  },
  { timestamps: true }
);
export const StudentFeesInfo = mongoose.model("StudentFeesInfo", feesInfo);

/* =====================================================
   📅 STUDENT ATTENDANCE
   ===================================================== */
const attendanceInfoSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    date: {
      type: Date,
      // default: Date.now,
      required: true,
    },
    status: {
      type: String,
      enum: ["P", "A", "L", "H", "S"],
      required: true,
    },
    // ["Present", "Absent","Late", "Holiday", "Sunday"]
    remark: {
      type: String,
      default: "",
    },
    class_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SchoolClass",
          required: true,
          // index: true,
        },
       
        recorded_by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "TeacherProfile", // Kaun mark kar raha tha
          required: true,
        },
    
        is_active: {
          type: Boolean,
          default: true, // Soft delete / deactivated attendance
        },
  },
  { timestamps: true }


); 
/// ✅ Prevent duplicate attendance
attendanceInfoSchema.index(
  { student_id: 1, class_id: 1, date: 1 },
  { unique: true }
);

// 🔹 Optional index for class-wide queries: fast filter by class/date
attendanceInfoSchema.index({ class_id: 1, date: 1 });


export const StudentAttendanceRecord = mongoose.model(
  "StudentAttendanceRecord",
  attendanceInfoSchema
);

/* =====================================================
   🏫 CLASS SCHEMA
   ===================================================== */
const ClassSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Class Name "1th" ,"2th"
    section: { type: String, default: "N/A" }, // A,B,C
    class_teacher_name: { type: String, default: "N/A" }, // A,B,C

    subjects_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClassSubject",
        required: true,
        default: null,
        // default:"N/A"
      },
    ],
    // students_ids: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "StudentProfile",
    //     required: true,
    //     default: null,
    //   },
    // ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// 👇 Virtual populate for subjects
ClassSchema.virtual("subjects", {
  ref: "ClassSubject", // Model to populate from
  localField: "_id", // Class _id
  foreignField: "class_id", // Subject.class_id
});
export const SchoolClass = mongoose.model("SchoolClass", ClassSchema);

/* =====================================================
   📘 SUBJECT SCHEMA
   ===================================================== */
const subjectsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "Math" ,"Hindi"
    subject_code: { type: String, default: "N/A" },
    max_marks: { type: Number, default: null },
    grade: { type: String, default: "N/A" },
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherProfile",
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
  },
  { timestamps: true }
);
export const ClassSubject = mongoose.model("ClassSubject", subjectsSchema);

/* =====================================================
   📚 STUDENT SUBJECT RECORD
   ===================================================== */
const StudentSubjectSchema = new mongoose.Schema(
  {
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "StudentProfile" },
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "ClassSubject" },
    obtained_marks: { type: Number, default: null },
    grade: { type: String, default: "N/A" },
  },
  { timestamps: true }
);
export const StudentSubject = mongoose.model(
  "StudentSubject",
  StudentSubjectSchema
);

/* =====================================================
   🔐 STUDENT ACCOUNT / AUTH INFO
   ===================================================== */
const StudentAuthSchema = new mongoose.Schema(
  {
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "StudentProfile" },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    active_status: { type: Boolean, default: true },
  },
  { timestamps: true }
);
export const StudentAuthInfo = mongoose.model(
  "StudentAuthInfo",
  StudentAuthSchema
);

/* =====================================================
   🧍‍♂️ MAIN STUDENT SCHEMA
   ===================================================== */
const StudentSchema = new Schema(
  {
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true },
    },
    full_name: { type: String },
    roll_number: { type: String, unique: true },
    student_code: { type: String, default: () => nanoIDs(), unique: true },
    profile_image: { type: String, default: "N/A" }, // student_image

    enrolled_subjects: [
      //student_subjects
      {
        subject_name: String,
        marks: Number,
      },
    ],

    // ++++++++ References To other Modules +++++++++
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchoolClass",
      required: true,
      default: null,
    }, // Class ID Adminson

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
