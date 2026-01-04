import mongoose, { Schema } from "mongoose";


/**
 * =========================
 * Teacher Basic Info Model
 * =========================
 */
const TeachersBasic = new mongoose.Schema(
  {
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherProfile",
      required: true,
    },
    // teacher_id: {
    //   type:String
    // },
    // qualifications: { type: String,default: null},
    years_of_experience: { type: String, default: null },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      // default: "N/A",
    },
    date_of_birth: {
      type: String,
      // default: "N/A",
    },

    address: { type: String, default: "N/A", set: nameSetFun },

    qualifications: [String], // e.g., ["B.Ed", "M.Sc"]

    joined_at: {
      type: String,
      default: Date.now,
    },
    // ✅ New additions:
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: [
        "teacher",
        "admin",
        "principal",
        "staff",
        "dev",
        "accountant",
        "bus_staff",
      ],
      // enum: ["teacher", "admin", "principal", "hod", "staff", "other"],
      default: "teacher",
    },
  },
  { timestamps: true }
);

export const TeachersBasicInfo = mongoose.model(
  "TeachersBasicInfo",
  TeachersBasic
);



/**
 * =========================
 * Teacher Auth Model
 * =========================
 */

const TeacherAuth = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true },
  password: { type: String }, // 🔒 Hash it before saving
  accountStatus: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  }, // Account activity status
  
// accountStatus: {
//     type: Boolean,
//     default: true,
//   },
  addStudentPermissionStatus: {
    type: Boolean,
    default: false,
  },
  studentAttendanceStatus: {
    type: Boolean,
    default: false,
  },
});

export const TeacherAuthModel = mongoose.model("TeacherAuth", TeacherAuth);




/**
 * =========================
 * Teacher Profile Model
 * =========================
 */


const TeacherSchema = new mongoose.Schema(
  {
    teacher_code: { type: String, unique: true, default: () => nanoIDs() },
    profile_image: { type: String, default: null },
    name: {
      first: { type: String, default: null },
      last: { type: String, default: null },
    },
    full_name: {
      type: String,
      required: true,
      set: nameSetFun,
    },
    subject: { type: String, default: null, set: nameSetFun },
    teacher_phone_no: {
      type: String,
      // required: true,
      match: /^[0-9]{10}$/,
      default: 0, // Optional: simple validation
    },

    // ✅ Reference to Class(es) they teach
    school_class_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SchoolClass",
        default: null,
      },
    ],

    // ✅ Subjects they teach
    class_subjects_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClassSubject",
        default: null,
      },
    ],

    basic_info_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeachersBasicInfo",
      default: null,
    },

    teacher_auth_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherAuth",
      default: null,
    },
    staff_Salary_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StaffSalary",
      default: null,
    },
  },
  { timestamps: true }
);

export const TeacherProfile = mongoose.model("TeacherProfile", TeacherSchema);
