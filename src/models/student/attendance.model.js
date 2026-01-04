import mongoose from "mongoose";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);
/* =====================================================
   📅 STUDENT ATTENDANCE
   =====================================================
*/

const attedanceSchema  = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudentProfile",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ["P", "A", "H", "S"], // P=Present, A=Absent, H=Holiday, S=Sunday
    required: true,
  },
  // ["Present", "Absent", "Holiday", "Sunday"]
  remark: {
    type: String,
    default: null,
    trim: true,
    maxlength: 200, // Prevent huge remarks
  },

});

export const studentsAttendanceData = mongoose.model("StudentsAttendanceData", attedanceSchema );

const attendanceInfoSchema = new mongoose.Schema(
  {
     student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudentProfile",
    required: true,
  },
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchoolClass",
      required: true,
      // index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["P", "A", "H", "S"], // P=Present, A=Absent, H=Holiday, S=Sunday
      required: true,
    },
    // ["Present", "Absent", "Holiday", "Sunday"]
    remark: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200, // Prevent huge remarks
    },
    recorded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherProfile", // Kaun mark kar raha tha
      required: true,
    },

    // attendance: [attedanceSchema],

  recorded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeacherProfile", // Kaun mark kar raha tha
    // required: true,
  },
    is_active: {
      type: Boolean,
      default: true, // Soft delete / deactivated attendance
    },
  },
  { timestamps: true }
);

attendanceInfoSchema.index(
  { student_id: 1, class_id: 1, date: 1 },
  { unique: true }
);

export const StudentAttendanceRecord =
  mongoose.models.StudentAttendanceRecord ||
  mongoose.model("StudentAttendanceRecord", attendanceInfoSchema);
// export const StudentAttendanceRecord = mongoose.model(
//   "StudentAttendanceRecord",
//   attendanceInfoSchema
// );
