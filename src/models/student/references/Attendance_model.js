import mongoose, { trusted } from "mongoose";
import { Schema } from "mongoose";
import { customAlphabet } from "nanoid"

import dotenv from "dotenv";
dotenv.config();

const nanoID = customAlphabet("123456789a", 8);

const attendanceInfoSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: { type: String, enum: ["Present", "Absent"] },
    remark: {
        type: String,
        default: ""
    }
}, { timestamps: true })

// Duplicate se bachane ke liye
attendanceInfoSchema.index({ student_id: 1, date: 1 }, { unique: true });

const AttendanceInfo = mongoose.model("StudentsAttendance", attendanceInfoSchema)

export default AttendanceInfo;