import mongoose, { Types } from "mongoose";
import { Schema } from "mongoose";
import { customAlphabet } from "nanoid";

const nanoIDs = customAlphabet("1234567890ABCD", 5)



// Sub-schema for academic info

const ParentsInfoSchema = new mongoose.Schema({

    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },

    father_name: { type: String, },
    father_number: { type: String, },
    father_occupation: { type: String, },
    father_image: { type: String, },

    mother_name: { type: String, },
    mother_number: { type: String, },
    mother_occupation: { type: String, },
    mother_image: { type: String, },

    guardian_name: { type: String, },
    guardian_image: { type: String, },
    guardian_number: { type: String, },

})

export const ParentsInfo = mongoose.model("ParentsInfo", ParentsInfoSchema)

const basicInfoSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    form_number: { type: String },
    dob: { type: Date, },
    // student_dob: { type: Date, },
    academic_year: { type: String },
    admission_year: { type: String },
    admission_number: { type: String },
    admission_date: { type: Date, default: Date.now },
    any_special_talent: { type: String, },
    area_of_interest: { type: String, },

    gender: { type: String, enum: ["Female", "Male", "EWS", "Transgender"] },
    category: { type: String, enum: ["General", "OBC", "SC", "ST", "EWS"] },
    blood_group: { type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
    religion: { type: String, },
    mother_tongue: { type: String, },
    nationality: { type: String, },
    local_address: { type: String, },
    permanent_address: { type: String, },
    // city: { type: String, },
    // state: { type: String, },
    // zip_code: { type: String, },

});

export const BasicInfo = mongoose.model("BasicInfo", basicInfoSchema)

const advancedInfoSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
    },


    aadhar_number: { type: String, },

    bank_name: { type: String, },
    account_number: { type: String, },
    ifsc_code: { type: String, },
    branch_name: { type: String, },
    pen: { type: String, },
    sssmid: { type: String, },

    disability: { type: String, enum: ["None", "Visual", "Hearing", "Locomotor", "Mental"] },
    health_issues: { type: String },
    apaar_id: { type: String },


    // previous Acdemic records 
    previous_school: { type: String, },
    previous_class: { type: String, },
    previous_year: { type: String, },
    previous_percentage: { type: String, },
    previous_results: { type: String },
    transfer_certificate_number: { type: String, },


    // documents images

    birth_certificate_image: { type: String, },
    aadhar_card_student_image: { type: String, },
    aadhar_card_father_image: { type: String, },
    aadhar_card_mother_image: { type: String, },
    bank_passbook_image: { type: String, },
    sssmid_card_image: { type: String, },
    transfer_certificate_image: { type: String, },
    pen_image: { type: String, },
    apaarid_image: { type: String, },
    rtl_letter_image: { type: String, },

    // any_other: { type: String, },

});
export const AdvancedInfo = mongoose.model("AdvancedInfo", advancedInfoSchema)

const feesInfo = new mongoose.Schema({
    student_id: {
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
        }]
}, { timestamps: true })

export const FeesInfo = mongoose.model("FeesInfo", feesInfo)

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
    status: { type: String, enum: ["P", "A", "H", "S"], required: true },
    // ["Present", "Absent", "Holiday", "Sunday"]
    remark: {
        type: String,
        default: ""
    }
}, { timestamps: true })
// Duplicate se bachane ke liye
attendanceInfoSchema.index({ student_id: 1, date: 1 }, { unique: true });
export const StudentsAttendance = mongoose.model("StudentsAttendance", attendanceInfoSchema)

// Class
const ClassSchema = new mongoose.Schema({
    class_name: { type: String, required: true },  // e.g. "1th" ,"2th"
    section: String, // A,B,C
    class_teacher: String,
    // class_teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teachers" }


}, 
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
)

// 👇 Virtual populate for subjects
ClassSchema.virtual("subjects", {
    ref: "Subject",              // Model to populate from
    localField: "_id",           // Class _id
    foreignField: "class_id"     // Subject.class_id
});


export const Class = mongoose.model("Class", ClassSchema)

// Subjects
const subjectsSchema = new mongoose.Schema({
    subject_name: { type: String, required: true },  // e.g. "Math" ,"Hindi"
    subject_code: { type: String },



    // teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teachers" },

    class_id: { type: new mongoose.Schema.Types.ObjectId, ref: "Class" },
    max_marks: { type: Number, default: 100 },
    grade: { type: String }
})

export const Subject = mongoose.model("Subject", subjectsSchema)


const StudentSubjectSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    marks: Number,
    grade: String
});

export const StudentSubject = mongoose.model("StudentSubject", StudentSubjectSchema)

const StudentAuthSchema = new mongoose.Schema({
    createStudentTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teachers' },

    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    activeStatus: { type: Boolean, default: true }
});

export const StudentAuth = mongoose.model("StudentAuth", StudentAuthSchema)



// Main Student Schema
const StudentSchema = new Schema(
    {
        //---- basicInfo ------

        student_code: { type: String, default: () => nanoIDs(), unique: true },
        student_name: { type: String, },
        roll_number: { type: String, },
        select_class: { type: String, },
      
        student_image: { type: String, },
        student_subjects: [
            {
                subject_name: String,
                marks: Number,

            }
        ],

        // ++++++++ References To other Modules +++++++++

        basic_info: { type: mongoose.Schema.Types.ObjectId, ref: "BasicInfo", default: null }, // admissonInfo inn form data, address, etc 

        advanced_info: { type: mongoose.Schema.Types.ObjectId, ref: "AdvancedInfo", default: null }, // healthInfo, documentsInfo, etc government id, bank details

        parents_info: { type: mongoose.Schema.Types.ObjectId, ref: "ParentsInfo", default: null },

        fees_info: { type: mongoose.Schema.Types.ObjectId, ref: "FeesInfo", default: null },


        attendances: { type: mongoose.Schema.Types.ObjectId, ref: "StudentsAttendance", default: null },

        exam_info: { type: mongoose.Schema.Types.ObjectId, ref: "ExamInfo", default: null },

        homework_info: { type: mongoose.Schema.Types.ObjectId, ref: "HomeworkInfo", default: null },

        extraCurricularInfo: { type: mongoose.Schema.Types.ObjectId, ref: "ExtraCurricularInfo", default: null },

        auth: { type: mongoose.Schema.Types.ObjectId, ref: "StudentAuth", default: null },







        // schoolUserInfo: { type: mongoose.Schema.Types.ObjectId, ref: "SchoolUserInfo",required:true },

        // academicInfo: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicInfo", default: null },







        // aadharCard

        // ---- otherInfo ------
        // photo

        // --- FeesInfo -----
        // feeStructure
        // feePayments

        // ----

        // address
        // contactInfo
        // subjects
        // parents

        // calssId:

        // -----attendanceInfo---

        // ----ExtraCurricularInfo---
        //----ExamInfo---


        //---- academicInfo ------
        // dateOfBirth: { type: Date, required: true },
        // gender: { type: String, enum: ["Female", "Male", "EWS",], required: true },
        // healthInfo
        // admissionInfo
        // documentsInfo - aadhar, bank,ifsc,sssmid,per

        // ---- Documents images -----
        // birthCe
        //---- SchoolUserInfo---
        // username
        // password
        // role
        //activeStatus
    },
    { timestamps: true });
export const Student = mongoose.model("Student", StudentSchema); 




// | Old Name             | Suggested New Name        |
// | -------------------- | ------------------------- |
// | `Student`            | `StudentProfile`          |
// | `BasicInfo`          | `StudentBasicInfo`        |
// | `AdvancedInfo`       | `StudentAdvancedInfo`     |
// | `ParentsInfo`        | `StudentParentsInfo`      |
// | `FeesInfo`           | `StudentFeesInfo`         |
// | `StudentsAttendance` | `StudentAttendanceRecord` |
// | `Class`              | `SchoolClass`             |
// | `Subject`            | `ClassSubject`            |
// | `StudentSubject`     | `StudentSubjectRecord`    |
// | `StudentAuth`        | `StudentAuthInfo`         |
