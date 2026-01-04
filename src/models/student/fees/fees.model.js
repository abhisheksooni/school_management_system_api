import mongoose, { Schema } from "mongoose";



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
