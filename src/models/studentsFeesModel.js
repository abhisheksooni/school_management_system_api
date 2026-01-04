import dayjs from "dayjs";
import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import { generateNanoID } from "../utils/nanoidGenerator.js";


const currentYear = dayjs().year(); // e.g. 2025
const nextYear = currentYear + 1;

// 🧾 Fee Component Schema
const feeComponentSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. Tuition Fee
  amount: { type: Number, required: true,min:0 },
});

// 🏫 Fee Template Schema
const FeeTemplateSchema = new mongoose.Schema({
  filter: {
    type: String,
    enum: ["onestudent", "allstudents", "classbase"],
    required: true,
  },

  class: {
    // type:String,
    type: mongoose.Schema.Types.ObjectId,
    ref: "SchoolClass",
    default: null,
  },
  // student_id: { type: mongoose.Schema.Types.ObjectId, ref: "StudentProfile" },
  breakdown: [feeComponentSchema],
  total_fee_amount:{
    type:Number,
     default: 0,
  }
  // breakdown: [
  //   {
  //     name: { type: String, required: true }, // e.g. Tuition Fee
  //     amount: { type: Number, required: true },
  //   },
  // ],
});

/* 🔹 Auto calculate total on SAVE */
FeeTemplateSchema.pre("save", function (next) {
  this.total_fee_amount = this.breakdown.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  next();
});


export const FeeTemplate = mongoose.model("FeeTemplate", FeeTemplateSchema);

const paymentSchema = new mongoose.Schema({
  payment_amount: { type: Number },
  payment_date: { type: Date, default: dayjs().toDate() },
  payment_mode: {
    type: String,
    enum: ["Cash", "Online", "Cheque", "Card", "Other"],
    default: "Cash",
  },
  note: { type: String },
  receipt_number: {
    type: String,
    default: () => `RCP-${dayjs().format("YYMMDD")}-${generateNanoID()} `,
    unique: true,
  },
});

const StudentFeeStructureSchema = new mongoose.Schema(
  {
    // 🔹 Kis base par ye fee apply hoti hai
    applyType: {
      type: String,
      enum: ["class", "student", "global"], // class -> whole class | student -> one student | global -> all students
      default: "global",
    },

    // 🔹 Class level
    class: { type: String }, // e.g. "10", "Nursery" etc.

    // 🔹 Student level (agar applyType = "student" hai)
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "StudentProfile" },

    academic_year: { type: String, default: `${currentYear}–${nextYear}` },

    frequency: {
      type: String,
      enum: ["monthly", "quarterly", "half-yearly", "yearly"],
      // default: "monthly",
    },
    //  filter: { type: String, enum: ["onestudent", "allstudents", "classbase"] ,  required: true,},
    // 🔹 Fee details

    total_fee: { type: Number, required: true },
    discount: { type: Number, default: 0 }, // in %

    amount_paid: { type: Number, default: 0 },
    amount_due: { type: Number, default: 0 },

    // 🔹 Optional discount

    status: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },

    breakdown: [feeComponentSchema],
//     breakdown: [{
//   name: { type: String, required: true }, // e.g. Tuition Fee
//   amount: { type: Number, required: true },
// }],
    payments: [paymentSchema],
  },
  { timestamps: true }
);

// 🔹 Pre-save hook for auto calculation and overpayment prevention
StudentFeeStructureSchema.pre("save", function (next) {
  // Total paid so far
  const totalPaid = this.payments.reduce(
    (sum, p) => sum + (p.payment_amount || 0),
    0
  );
  this.amount_paid = totalPaid;

  // Discount calculation
  const discountAmount = (this.total_fee * this.discount) / 100;
  this.amount_due = this.total_fee - totalPaid - discountAmount;
  this.status = this.amount_due <= 0 ? "paid" : "unpaid";

  // Total due
  const totalDue = this.total_fee - discountAmount;

  // ❌ Prevent overpayment
  if (totalPaid > totalDue) {
    const overpay = totalPaid - totalDue;
    return next(
      new Error(
        `Overpayment of ₹${overpay} not allowed. Total due is ₹${totalDue}.`
      )
    );
  }

  // ✅ Auto-update fields
  this.amount_paid = totalPaid;
  this.amount_due = totalDue - totalPaid;
  this.status = this.amount_due <= 0 ? "paid" : "unpaid";

  next();
});

export const StudentFeeStructure = mongoose.model(
  "StudentFeeStructureSchema",
  StudentFeeStructureSchema
);
