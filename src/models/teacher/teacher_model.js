import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const nanoIDs = customAlphabet("1234567890ABCD", 5);

const nameSetFun = function (value) {
  return value
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

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
      // default: "N/A",
    },
    date_of_birth: {
      type: Date,
      // default: "N/A",
    },

    address: { type: String, default: "N/A", set: nameSetFun },

    qualifications: [String], // e.g., ["B.Ed", "M.Sc"]

    joined_at: {
      type: Date,
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

const TeacherAuth = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true },
  password: { type: String }, // 🔒 Hash it before saving
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

/* --------------------------------------------
   Payment Schema (Embedded in StaffSalary)
-------------------------------------------- */

 const salaryPayments = new mongoose.Schema(
  {
    salary_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StaffSalary",
      // required: true,
    },
    payment_amount: { type: Number, required: true },
    payment_date: { type: Date, default: Date.now },
    payment_mode: {
      type: String,
      enum: ["Cash", "Bank Transfer", "UPI", "Cheque"],
      default: "Cash",
    },
    transaction_id: { type: String, default: "" },
  },
  { timestamps: true }
);

export const salaryPaymentsModel = mongoose.model(
  "salaryPayments",
  salaryPayments
);

/* --------------------------------------------
   Staff Salary Schema
-------------------------------------------- */
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
    // pending_amount:{type:Number , default:0} ,
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
      default: new Date().getMonth() + 1,
    }, // Month (1-12)
    year: { type: Number, required: true, default: new Date().getFullYear() }, // Year e.g. 2025
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "salaryPayments" }],
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* --------------------------------------------
   Prevent duplicate salary entries
-------------------------------------------- */
teacherSalarySchema.index(
  { teacher_id: 1, month: 1, year: 1 },
  { unique: true }
);

/* --------------------------------------------
 Auto calculate net salary on SAVE
-------------------------------------------- */
teacherSalarySchema.pre("save", function (next) {
  this.net_salary =
    (this.base_salary || 0) + (this.bonuses || 0) - (this.deductions || 0);

  const totalPaid = this.payments.reduce((sum, p) => sum + p.payment_amount, 0);

  this.status = totalPaid >= this.net_salary ? "paid" : "pending";

  next();
});

// Auto calculate net_salary
teacherSalarySchema.pre("save", function(next) {
  this.net_salary = (this.base_salary || 0) + (this.bonuses || 0) - (this.deductions || 0);
  next();
});


// const salary = await StaffSalary.findById(salaryId)
//   .populate({ path: 'payments', select: 'payment_amount payment_date payment_mode transaction_id' });

// salary.populatedPayments = salary.payments;
// console.log("Pending:", salary.pending_amount);


/* --------------------------------------------
   Pre-update: Auto calculate net salary on UPDATE
-------------------------------------------- */
teacherSalarySchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  const doc = await this.model.findOne(this.getQuery());

  // merge (do not overwrite) payments
  if (update.$push?.payments) {
    update.payments = [...doc.payments, update.$push.payments];
    delete update.$push;
  }

  // Correct calculation for partial updates
  const base = update.base_salary ?? doc.base_salary;
  const bonus = update.bonuses ?? doc.bonuses;
  const ded = update.deductions ?? doc.deductions;

  update.net_salary = base + bonus - ded;

  // recalc status if payments updated
  if (update.payments) {
    const totalPaid = update.payments.reduce(
      (sum, p) => sum + p.payment_amount,
      0
    );
    update.status = totalPaid >= update.net_salary ? "paid" : "pending";
  }

  next();
});

/* --------------------------------------------
   Virtual: Pending amount (not stored in DB)
-------------------------------------------- */
teacherSalarySchema.virtual("pending_amount").get(function () {
  if (!this.populatedPayments) return undefined;

  const paid = this.payments.reduce((sum, p) => sum + p.payment_amount, 0);
  return this.net_salary - paid;
});

export const StaffSalary = mongoose.model("StaffSalary", teacherSalarySchema);

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
