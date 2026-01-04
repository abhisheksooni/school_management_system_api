import mongoose from "mongoose";
import { Schema } from "mongoose";
import { customAlphabet } from "nanoid";
import dotenv from "dotenv";
dotenv.config();

const nanoID = customAlphabet("1234567890a", 8);

const CreateStudentFeeInfoSchema = new Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    total_fee: { type: Number, default: 0 },
    fee_paid: { type: Number, default: 0 },
    fee_due: { type: Number, default: 0 },
    payment: [
      {
        amount: Number,
        date: { type: Date, default: Date.now },
        mode: String,
        fee_receipt_number: String,
      },
    ],
  },
  { timestamps: true }
);

const FeesInfo = mongoose.model("FeesInfo", CreateStudentFeeInfoSchema);

export default FeesInfo;
