import mongoose from "mongoose";
import { Schema } from "mongoose";
import { customAlphabet } from "nanoid";
import dotenv from "dotenv";
dotenv.config();
const nanoID = customAlphabet("1234567890a", 8);

const academicInfoSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoID(),
    required: true,
  },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },

  dateOfBirth: { type: Date },

  admissionDate: { type: Date },
  subjects: [{ type: String }],
  registrationNumber: { type: String },

  // section:String,
});

const AcademicInfo = mongoose.model("AcademicInfo", academicInfoSchema);
export default AcademicInfo;
