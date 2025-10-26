import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const nanoIDs = customAlphabet("1234567890ABCD", 5);

const TeachersBasic = new mongoose.Schema(
  {
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherProfile",
      required: true,
    },
    // qualifications: { type: String,default: null},
    years_of_experience: { type: String, default: null },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: null,
    },
    date_of_birth: {
      type: Date,
      default: null,
    },

    // salary: { type: Number, default: 0 },

    address: String,

    qualifications: [String], // e.g., ["B.Ed", "M.Sc"]

    joined_at: {
      type: Date,
      default: Date.now,
    },
    // ✅ New additions:
    isVerified: { type: Boolean, default: false },
    profile_roll: {
      type: String,
      enum: ["teacher", "admin", "principal", "hod", "staff", "other"],
      default: "teacher",
    },
  },
  { timestamps: true }
);

export const TeachersBasicInfo = mongoose.model(
  "TeachersBasicInfo",
  TeachersBasic
);

const TeacherAuth = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true, default: null },
  password: { type: String, default: null }, // 🔒 Hash it before saving
  accountStatus: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  }, // Account activity status
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

const teacherSalarySchema = new mongoose.Schema(
  {
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherProfile",
      required: true,
    },
    base_salary: { type: Number, default: 0 }, // Fixed salary per month
    bonuses: { type: Number, default: 0 }, // Extra bonuses (if any)
    deductions: { type: Number, default: 0 }, // Penalties or deductions
    net_salary: { type: Number, default: 0 }, // Calculated net salary (base + bonus - deductions)
    month: { type: Number, required: true, default: new Date().getMonth() + 1 }, // Month (1-12)
    year: { type: Number, required: true, default: new Date().getFullYear() }, // Year e.g. 2025
    payments: [
      // Salary payments history (usually one per month)
      {
        payment_amount: Number, // Paid amount in that transaction
        payment_date: { type: Date, default: Date.now }, // Payment date
        payment_mode: String, // Cash, bank transfer, etc.
        transaction_id: String, // Optional bank transaction or reference ID
      },
    ],
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Auto calculate net salary
teacherSalarySchema.pre("save", function (next) {
  this.net_salary =
    (this.base_salary || 0) + (this.bonuses || 0) - (this.deductions || 0);
  next();
});

export const StaffSalary = mongoose.model("StaffSalary", teacherSalarySchema);

const TeacherSchema = new mongoose.Schema(
  {
    teacher_code: { type: String, unique: true, default: () => nanoIDs() },
    profile_image: { type: String, default: "" },
    name: {
      first: { type: String, default: null },
      last: { type: String, default: null },
    },
    full_name: { type: String, required: true },
    subject: { type: String },
    teacher_phone_no: {
      type: String,
      // required: true,
      match: /^[0-9]{10}$/,
      default: null, // Optional: simple validation
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
