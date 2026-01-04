import mongoose from "mongoose";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import dayjs from "dayjs";



dayjs.extend(utc);
dayjs.extend(timezone);

const attendanceDate = "2025-12-18"; // yyyy-mm-dd string

const employeesAttendanceSchema = new mongoose.Schema({
  // employees_id: {
  //    type:String
  // },
  employees_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeacherProfile",
    default:null,
    // required: true,
  },
 
  date: {
    type: Date,
    // default: Date.now,
    required: true,
  },
  // date: dayjs.tz(attendanceDate, "Asia/Kolkata").startOf("day").toDate(), // Time set to 00:00 IST
  //  date: dayjs.tz("Asia/Kolkata").startOf("day").toDate(), // Time set to 00:00 IST
  status: {
    type: String,
    enum: ["P", "A", "L", "H", "S"],
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true, // Soft delete / deactivated attendance
  },
});

/// ✅ Prevent duplicate attendance
employeesAttendanceSchema.index(
  { employees_id: 1,date: 1 },
  { unique: true }
);

export const employeesAttendance = mongoose.model("employeesAttendance",employeesAttendanceSchema);