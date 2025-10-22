import mongoose from "mongoose";
import { Student, StudentsAttendance } from "../../models/student/student_model.js";


export const markBulkAttendance = async (req, res) => {
    try {

        const { date, records } = req.body;

        if (!date || !records || !records.length) {
            return res.status(400).json({ message: "Date aur records required hai" });
        }

        //  Har student ke liye ek update operation
        const bulkOps = await records.map(record => ({
            updateOne: {
                filter: { student_id: new mongoose.Types.ObjectId(record.student_id), date },
                update: {
                    $set: {
                        status: record.status,
                        remark: record.remark || ''
                    }
                },
                upsert: true // agar record nahi mila to naya banega
            }
        }));

        await StudentsAttendance.bulkWrite(bulkOps);


        res.status(200).json({
            success: true,
            message: `${records.length} Students Attendance Marked`
        });



    } catch (error) {
        console.error("Bulk Attendance Error:", error);
        // Duplicate key ka special error handle
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "Duplicate attendance detected for same student/date" });
        }

        res.status(500).json({ success: false, message: "Students Bulk attendance Error" });
    }
}


// Monthly Attendance Report for a Student

export const getMonthlyAttendance = async (req, res) => {
    try {
        const { student_id, month, year } = req.query; // req query hai bhaiya aram se

        if (!student_id || !month || !year) {
            return res.status(400).json({ message: "student_id, month aur year required hai" });
        }

        const findstudent = await Student.findById(student_id) 

       


        // Month start & end
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0); // last day of month
        endDate.setHours(23, 59, 59, 999);

        const attendance = await StudentsAttendance.find({
            student_id: new mongoose.Types.ObjectId(student_id),

            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });

        // Count Present/Absent Summary

        const summary = attendance.reduce(
            (acc, record) => {
                if (record.status === "P") acc.present += 1;
                else if (record.status === "A") acc.absent += 1;
                else if (record.status === "H") acc.holiday += 1;
                else if (record.status === "S") acc.sunday += 1;
                return acc;
            },
            { present: 0, absent: 0 ,holiday:0, sunday:0 }
        );

        // Total working day = Present + absent
        const total = summary.present + summary.absent;
        // percentage
        const percentage = total ? ((summary.present / total) * 100).toFixed(2) : 0;

        return res.status(200).json({
            student_id,
            student:findstudent,
            month,
            year,
            total_days: total,
            present: summary.present,
            absent: summary.absent,
            holiday: summary.holiday,
            sunday: summary.sunday,
            attendance_percentage: percentage,
            records: attendance
        });


    } catch (error) {
        console.error("Monthly Attendance Error:", error);
        return res.status(500).json({ success: false, message: "Error fetching monthly attendance" });
    }
}