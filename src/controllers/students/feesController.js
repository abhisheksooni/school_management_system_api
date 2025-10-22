import { FeesInfo, Student } from "../../models/student/student_model.js";


// Create FeesInfo for a student (Jab Student Bane ya Alag Se)
export const createFeesInfo = async (req, res) => {
    try {
        const { id } = req.params
        const student_id = id;

        const { total_fee, fee_paid = 0, payment } = req.body;

        const searchStudent = await Student.findById(student_id)

        if (!searchStudent) {
            return res.status(404).json({ message: "Student not found" });
        }



        // Calculate fee_due from total_fee - fee_paid

        const fee_due = total_fee - fee_paid;


        // Create the record
        const feesInfo = await FeesInfo.create({
            student_id,
            total_fee,
            fee_paid,
            fee_due,
            payment: payment || []  // optional initial payment(s)
        });

        await feesInfo.save();
        searchStudent.fees_info = feesInfo._id;
        await searchStudent.save();


        return res.status(200).json({
            success: true,
            message: "Fees Info created successfully",
            data: feesInfo
        });


    } catch (error) {
        console.error("Error in createFeesInfo:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while creating fees info"
        });
    }

};

// Add a Payment (Update fees & payments)
export const addPaymentToFeesInfo = async (req, res) => {
    try {
        const { id } = req.params
        const student_id = id;
        const { amount, mode, fee_receipt_number } = req.body;

        const feesInfo = await FeesInfo.findOne({ student_id });

        if (!feesInfo) {
            return res.status(404).json({ message: "Fees Info not found for student" });
        }

        // Check if payment exceeds total fee
        if (feesInfo.fee_paid + amount > feesInfo.total_fee) {
            return res.status(400).json({
                success: false,
                message: "Payment exceeds total fee"
            });
        }

        // Update values
        feesInfo.fee_paid += amount;
        feesInfo.fee_due = feesInfo.total_fee - feesInfo.fee_paid
        // Add to payment history
        feesInfo.payment.push({
            amount,
            mode,
            fee_receipt_number
        });

        await feesInfo.save();

        return res.status(200).json({
            success: true,
            message: "Payment added successfully",
            data: feesInfo
        });

    } catch (error) {
        console.error("Error in addPaymentToFeesInfo:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while adding payment"
        });
    }
}





// Reset or Delete Fees Info
export const deleteFeesInfo = async (req, res) => {
    try {
        const { student_id } = req.params;

        const deleted = await FeesInfo.findOneAndDelete({ student_id });

        if (!deleted) {
            return res.status(404).json({ message: "Fees Info not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Fees Info deleted successfully"
        });

    } catch (error) {
        console.error("Error in deleteFeesInfo:", error);
        return res.status(500).json({
            success: false,
            message: "Error deleting fees info"
        });
    }
};

// 📜 Get All Years' Fees for a Student
export const getAllFeesInfoForStudent = async (req, res) => {
    try {
        const { student_id } = req.params.id;

        const allFees = await FeesInfo.find(student_id);

        res.status(200).json({
            success: true,
            data: allFees
        });
    } catch (error) {
        console.error("Error in getAllFeesInfoForStudent:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch all fees info"
        });
    }
};





// Update payment/Fees INFO for a student
// export const addPayment = async (req, res) => {
//     try {
//         const { studentId } = req.params;
//         const { payment } = req.body;

//         const feesInfo = await FeesInfo.findOne({ student: studentId });

//         if (!feesInfo) {
//             return res.status(404).json({ message: "FeesInfo not found" });
//         }

//         // Push new payment
//         feesInfo.payment.push(payment);

//         // Optional: update fee_paid and fee_due automatically
//         feesInfo.fee_paid = (feesInfo.fee_paid || 0) + payment.amount;
//         feesInfo.fee_due = (feesInfo.total_fee || 0) - feesInfo.fee_paid;

//         await feesInfo.save();

//         res.json({ success: true, feesInfo });

//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };


// // Delete a payment from a student's fee record
// export const deletePayment = async (req, res) => {
//     try {
//         const { studentId, paymentId } = req.body; // paymentId to identify which payment to delete
//         const feesInfo = await FeesInfo.findOne({ student: studentId });

//         if (!feesInfo) {
//             return res.status(404).json({ message: "FeesInfo not found" });
//         }
//         // Find the payment to be deleted
//         const paymentToDelete = feesInfo.payment.id(paymentId);
//         if (!paymentToDelete) {
//             return res.status(404).json({ message: "Payment not found" });
//         }
//         // Update fee_paid and fee_due
//         feesInfo.fee_paid -= paymentToDelete.amount;
//         feesInfo.fee_due += paymentToDelete.amount;
//         // Remove the payment
//         paymentToDelete.remove();
//         await feesInfo.save();

//         res.json({ success: true, feesInfo });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };