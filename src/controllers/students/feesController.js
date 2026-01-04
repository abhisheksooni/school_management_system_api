import mongoose from "mongoose";


import {
  StudentFeesInfo,
  StudentProfile,
} from "../../models/student/student_model.js";
import { devLog } from "../../utils/devlogger.js";

// Create FeesInfo for a student (Jab Student Bane ya Alag Se)
export const createFeesInfo = async (req, res) => {

  devLog(`student create FeesInfo req data`, { id:req.params.id, level:'s',data:req.body});
  try {
    // const { id } = req.params;
    // const student_id = id;

    // const { total_fee, amount_paid = 0, payments = [] } = req.body;

    // const student = await StudentProfile.findById(student_id);

    // if (!student) {
    //   return res.status(404).json({ message: "Student not found" });
    // }

    // const amount_due = total_fee - amount_paid;

    // console.log(`Create free--> `, {
    //   total_fee,
    // });

    // // Create the record
    // const feesInfo = await StudentFeesInfo.create({
    //   student_id,
    //   total_fee,
    //   amount_paid,
    //   amount_due,
    //   payments, // optional initial payment(s)
    // });

    // await feesInfo.save();
    // student.fees_info_id = feesInfo._id;
    // await student.save();

    // return res.status(200).json({
    //   success: true,
    //   data: feesInfo,
    //   message: "Fees Info created successfully",
    // });
  } catch (error) {
    console.error("Error in createFeesInfo:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create fees info",
    });
  }
};

// Add Payment (Update fees & payments)
export const addPaymentToFeesInfo = async (req, res) => {
  console.log(`addPaymentToFeesInfo -- ${req.params.id} `, req.body);
  try {
    const { id } = req.params;
    const student_id = id;
    const {
      payment_amount,
      payment_mode = "Cash",
      payment_date,
      receipt_number,
    } = req.body;

    const feesInfo = await StudentFeesInfo.findOne({ student_id });

    if (!feesInfo) {
      return res
        .status(404)
        .json({ message: "Fees Info not found for student" });
    }

    // Check if payment exceeds total fee
    if (feesInfo.amount_paid + payment_amount > feesInfo.total_fee) {
      return res.status(400).json({
        success: false,
        message: "Payment exceeds total fee",
      });
    }

    // const payment_date = daysAgo
    //   ? dayjs().subtract(daysAgo, "day").toDate()
    //   : dayjs().toDate();

    // Update values
    feesInfo.amount_paid += payment_amount;

    feesInfo.amount_due = feesInfo.total_fee - feesInfo.amount_paid;

    // Add to payment history
    //  await StudentFeesPaymentsInfo.create( )

    console.log(`desaa---`, {
      total_fee: feesInfo.total_fee,
      amount_paid: feesInfo.amount_paid,
      payment_amount,
    });

    feesInfo.payments.push({
      feesInfo_id: feesInfo._id,
      payment_amount,
      payment_mode,
      payment_date,
      receipt_number,
    });

    await feesInfo.save();

    return res.status(200).json({
      success: true,
      data: feesInfo,
      message: "Payment added successfully",
    });
  } catch (error) {
    console.error("Error in addPaymentToFeesInfo:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding payment",
    });
  }
};

// Reset or Delete Fees Info
export const deleteFeesInfo = async (req, res) => {
  try {
    const { student_id } = req.params;

    const deleted = await StudentFeesInfo.findOneAndDelete({ student_id });

    if (!deleted) {
      return res.status(404).json({ message: "Fees Info not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Fees Info deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteFeesInfo:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting fees info",
    });
  }
};

// 📜 Get  Fees for a One Student
export const getStudentFeesFullInfo = async (req, res) => {
  try {
    const student_id = req.params.id;

    // console.log(`student_id --- `,student_id);
    // console.log(`student_id --- `,req.params);

    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: "student_id is required",
      });
    }

    // 🧩 1. Find student info
    // const student = await StudentProfile.findById(student_id).select(
    //   "full_name roll_number"
    // );
    const student = await StudentProfile.findById(student_id)
      .select("full_name roll_number")
      .populate([
        { path: "fees_info_id" },
        { path: "parents_info_id" },
        {
          path: "class_id",
          select: "name , class_teacher_name , id",
          // populate: {
          //   // path: "subjects_ids",
          // },
        },
      ]);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const result = await StudentFeesInfo.aggregate([
      {
        $match: { student_id: new mongoose.Types.ObjectId(student_id) },
      },
      {
        $lookup: {
          from: "studentprofiles", // 👈 collection name (lowercase + plural)
          localField: "student_id",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
      {
        $lookup: {
          from: "payments", // 👈 if you have a separate payments collection
          localField: "_id",
          foreignField: "fees_info_id",
          as: "payments",
        },
      },
      {
        $project: {
          _id: 1,
          total_fee: 1,
          amount_paid: 1,
          amount_due: 1,
          "student.full_name": 1,
          "student.roll_number": 1,
          payments: 1,
        },
      },
    ]);

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No fees found for this student",
      });
    }

    return res.status(200).json({
      success: true,
      data: student,
      // data: result,
      message: "Fetched student fee info successfully",
    });

    // 🧾 2. Find all fees info related to this student
    // const allFees = await StudentFeesInfo.find({ student_id }).sort({
    //   createdAt: -1,
    // });

    // const allFees = await StudentFeesInfo.find(student_id)

    // const student  = await StudentProfile.findById(student_id).populate("fees_info_id")
    // const allFees = await StudentFeesInfo.aggregate([]);

    // return res.status(200).json({
    //   success: true,
    //   // student,
    //   // data: allFees,

    //   data: {
    //     allFees,
    //     student,
    //     payments: allFees.payments || [], // ✅ Always array
    //   },

    //   message: "fetch all fees info",
    // });
  } catch (error) {
    console.error("Error in getAllFeesInfoForStudent:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all fees info",
    });
  }
};
// 📜 Get Fees for a All Students
export const getStudentsFeesFullInfo = async (req, res) => {
  try {
    // const { student_id } = req.params.id;

    // $project: {
    //   _id: 1,
    //   full_name: 1,
    //   profile_image: 1,
    //   teacher_phone_no: 1,
    //   subject: 1,
    //   teacher_code: 1,
    // },
    const allStudents = await StudentFeesInfo.find();
    const lengthStudent = await StudentFeesInfo.countDocuments();
    const allStudent = await StudentFeesInfo.aggregate([
      {
        $project: {
          _id: 1,
          student_id: 1,
          total_fee: 1,
          amount_paid: 1,
          amount_due: 1,
          "payments.payment_amount": 1,
          "payments.payment_date": 1,
          "payments.payment_mode": 1,
          "payments.receipt_number": 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      length: lengthStudent,
      data: allStudent,
      data2: allStudents,
      message: "Fetch all Student With fees info",
    });
  } catch (error) {
    console.error("Error in getAllFeesInfoForStudent:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all fees info",
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
