import mongoose from "mongoose";
import { customAlphabet } from "nanoid";



const nanoIDs = customAlphabet("1234567890ABCD", 5)

const TeachersBasicInfo = new mongoose.Schema({
    teacher_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teachers",
        required: true,
    },
    qualifications: { type: String, },
    years_of_experience: { type: String, },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"]
    },
    dob: {
        type: Date
    },
    address: String,

    qualifications: [String],  // e.g., ["B.Ed", "M.Sc"]

    joined_at: {
        type: Date,
        default: Date.now
    },
    // ✅ New additions:
    isVerified: { type: Boolean, default: false },
    role: {
        type: String,
        enum: ["teacher", "admin", "principal", "hod"],
        default: "teacher"
    }


},{ timestamps: true });

export const TeachersBasic = mongoose.model("TeachersBasic", TeachersBasicInfo);


const TeacherAuth = new mongoose.Schema({
    username: { type: String, unique: true, sparse: true },
    password: { type: String },  // 🔒 Hash it before saving
    status: { type: String, enum: ["active", "inactive"], default: "active" }, // Account activity status
    addStudentPermissionStatus: { type: String, enum: ["granted", "denied"], default: "denied" },
    studentAttendanceStatus: { type: String, enum: ["granted", "denied"], default: "denied" }
})

export const TeacherAuthModel = mongoose.model("TeacherAuth", TeacherAuth);


const TeacherSchema = new mongoose.Schema({
    teacher_code: { type: String, unique: true, default: () => nanoIDs() },
    image: { type: String, },
    name: {
        first: { type: String, required: true },
        last: { type: String, required: true }
    },
    full_name: { type: String, },
    subject: { type: String, },
    phone: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/  // Optional: simple validation
    },

    // ✅ Reference to Class(es) they teach
    classes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class"
    }],

    // ✅ Subjects they teach
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
    }],


    basicInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TeachersBasic",
        default: null
    },


    auth: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TeacherAuth",
        default: null
    }

});

export const Teachers = mongoose.model("Teachers", TeacherSchema);


