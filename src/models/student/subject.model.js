import mongoose from "mongoose";









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