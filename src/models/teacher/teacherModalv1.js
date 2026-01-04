import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

// 🔹 Generate unique teacher codes like "123AB"
const nanoIDs = customAlphabet("1234567890ABCD", 5);

/**
 * =========================
 * Teachers Basic Info Model 
 * =========================
 */
const TeachersBasic = new mongoose.Schema(
  {
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherProfile",
      required: true,
    },

    // Academic & Professional details
    qualifications: [String], // e.g., ["B.Ed", "M.Sc"]
    years_of_experience: { type: String, default: null },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: null,
    },
    date_of_birth: { type: Date, default: null },
    address: { type: String },

    // Employment info
    joined_at: { type: Date, default: Date.now },
    role: {
      type: String,
      enum: ["teacher", "admin", "principal", "staff", "dev", "accountant", "bus_staff"],
      default: "teacher", // High-level roles only
    },
    isVerified: { type: Boolean, default: false }, // Account verification flag
  },
  { timestamps: true }
);

export const TeachersBasicInfo = mongoose.model("TeachersBasicInfo", TeachersBasic);




/**
 * =========================
 * Teacher Authentication Model
 * =========================
 */
const TeacherAuth = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true, default: null },
  password: { type: String, default: null }, // 🔒 Hash before saving
  accountStatus: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },

  // ✅ Permissions flags instead of creating many roles
  permissions: {
    can_create_student: { type: Boolean, default: false },
    can_manage_attendance: { type: Boolean, default: false },
    can_manage_salary: { type: Boolean, default: false },
    can_edit_grades: { type: Boolean, default: false },
    can_view_reports: { type: Boolean, default: false },
    // Add more permissions as needed
  },
});

export const TeacherAuthModel = mongoose.model("TeacherAuth", TeacherAuth);

/**
 * =========================
 * Teacher Salary Model
 * =========================
 */

const teacherSalarySchema = new mongoose.Schema(
  {
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherProfile",
      required: true,
    },
    base_salary: { type: Number, default: 0 },
    bonuses: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    net_salary: { type: Number, default: 0 }, // auto-calculated

    month: { type: Number, required: true, default: new Date().getMonth() + 1 },
    year: { type: Number, required: true, default: new Date().getFullYear() },

    // Payment history
    payments: [
      {
        payment_amount: Number,
        payment_date: { type: Date, default: Date.now },
        payment_mode: String, // e.g., Cash, Bank
        transaction_id: String,
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

// 🔹 Auto-calculate net salary before saving
teacherSalarySchema.pre("save", function (next) {
  this.net_salary = (this.base_salary || 0) + (this.bonuses || 0) - (this.deductions || 0);
  next();
});

export const StaffSalary = mongoose.model("StaffSalary", teacherSalarySchema);




/**
 * =========================
 * Teacher Profile Model
 * =========================
 */
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
      match: /^[0-9]{10}$/,
      default: null,
    },

    // References
    school_class_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SchoolClass",
        default: null,
      },
    ],
    class_subjects_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClassSubject",
        default: null,
      },
    ],
    basic_info_id: { type: mongoose.Schema.Types.ObjectId, ref: "TeachersBasicInfo", default: null },
    teacher_auth_id: { type: mongoose.Schema.Types.ObjectId, ref: "TeacherAuth", default: null },
    staff_Salary_id: { type: mongoose.Schema.Types.ObjectId, ref: "StaffSalary", default: null },
  },
  { timestamps: true }
);

export const TeacherProfile = mongoose.model("TeacherProfile", TeacherSchema);