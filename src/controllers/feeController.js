import dayjs from "dayjs";
import {
  SchoolClass,
  StudentProfile,
} from "../models/student/student_model.js";
import {
  FeeTemplate,
  StudentFeeStructure,
} from "../models/studentsFeesModel.js";

import { CreateStudentFeeTemplatebreakdown } from "../helper/student/studentFees.js";
import { generateReceiptNumber } from "../utils/nanoidGenerator.js";
import { devLog } from "../utils/devlogger.js";

// ✅ Create createFeeTemplatebreakdown
export const createFeeTemplatebreakdown = async (req, res) => {
  try {
    devLog(` createFeeTemplatebreakdown req body `, { level: "r",data:req.body });
    devLog(` createFeeTemplatebreakdown `, { level: "r" });

  //  const breakdown = await FeeTemplate.create(req.body)

    const breakdown = await CreateStudentFeeTemplatebreakdown(req.body.data, {
        create: true,
      });
      
    return res.status(201).json({ success: true,
       data: breakdown
       });
  } catch (error) {
    devLog(`breakdown err`, { level: "err", data: error });
    return res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Get All createFeeTemplatebreakdown
export const getAllFeeTemplatebreakdown = async (req, res) => {
  try {
    devLog(` getAllFeeTemplatebreakdown `, { level: "r" });

    const classes = await SchoolClass.aggregate([
      {
        $project: {
          name: 1,
        },
      },
    ]);

    const breakdown = await CreateStudentFeeTemplatebreakdown("data", {
      getall: true,
      populate: [
        {
          path: "class",
          select: "name section",
        },
      ],
    });

    return res
      .status(201)
      .json({ success: true, data: breakdown, class: classes });
  } catch (error) {
    devLog(`Get All Breakdown err`, { level: "err", data: error });
    return res.status(500).json({ success: false, message: error.message });
  }
};
// ✅ Get All createFeeTemplatebreakdown
export const getOneFeeTemplatebreakdown = async (req, res) => {
  try {
    devLog(` getOneFeeTemplatebreakdown `, { level: "r" });




    let breakdown = await FeeTemplate.findById(req.params.id).populate([
      { path: "class", select: "section name" },
    ]);

    // if (!breakdown) {
    // breakdown  = await FeeTemplate.findById(req.params.id).populate([
    //   { path: "class", select: "section name" },
    // ]);
    // }


    // if (!breakdown) {
    //   breakdown = await FeeTemplate.findOne({class:req.params.id}).populate([
    //   { path: "class", select: "section name" },
    // ]);
    // }
   

    return res.status(201).json({ success: true, data: breakdown });
  } catch (error) {
    devLog(`Get All Breakdown err`, { level: "err", data: error });
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get And Update createFeeTemplatebreakdown
export const updateFeeTemplatebreakdown = async (req, res) => {
  try {
    devLog(` updateFeeTemplatebreakdown `, { level: "r" });

    const template = await FeeTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    let oldItems = template.breakdown;
    let newItems = req.body.breakdown;

    let final = [];

    // Loop through new items coming from frontend
    newItems.forEach((item) => {
      if (item._id) {
        // UPDATE EXISTING
        const existing = oldItems.id(item._id);

        if (existing) {
          existing.name = item.name;
          existing.amount = item.amount;
          final.push(existing);
        }
      } else {
        // ADD NEW
        final.push(item); // mongoose auto _id generate karega
      }
    });

    template.breakdown = final;

    // const aa = await FeeTemplate.findByIdAndUpdate()

    await template.save();

    devLog(`update data`, { id: req.params.id, data: req.body });
    devLog(`updated data`, { id: req.params.id, level:"s" });
    // devLog(`update data`, { data: req.body });

    // const breakdown = await FeeTemplate.findByIdAndUpdate(req.params.id,req.body)

    // const breakdown = await CreateStudentFeeTemplatebreakdown(req, {
    //   update: true,
    // });

    return res
      .status(201)
      .json({
        success: true,
        // data: breakdown,
        message: "Breakdown updated + new items added",
      });
  } catch (error) {
    devLog(`Get All Breakdown err`, { level: "err", data: error });
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get And Update createFeeTemplatebreakdown
export const deleteFeeTemplatebreakdown = async (req, res) => {
  try {
    devLog(` DeleteFeeTemplatebreakdown `, { level: "r" });
    const breakdown = await CreateStudentFeeTemplatebreakdown(req, {
      deleted: true,
    });

    return res.status(201).json({ success: true, data: breakdown });
  } catch (error) {
    devLog(`Get All Breakdown err`, { level: "err", data: error });
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==================================================================================================================================

// ✅ Create new fee structure
export const createStudentFeeStructure = async (req, res) => {
  devLog(`🧾 createStudentFeeStructure `, { level: "r" });

  try {
    const {
      studentId,
      class: studentClass,
      frequency,
      discount = 0,
      filter,
    } = req.body;

    console.log("➡️ Creating fee structure for:", {
      studentId,
      studentClass,
      filter,
      discount,
    });

    let result = null;

    // 🧩 1️⃣ Filter priority logic
    if (filter === "onestudent" && studentId) {
      result = await FeeTemplate.findOne({
        filter: "onestudent",
        student_id: studentId,
      });
    }

    if (!result && filter === "classbase" && studentClass) {
      result = await FeeTemplate.findOne({
        filter: "classbase",
        class: studentClass,
      });
    }

    if (!result && filter === "allstudents") {
      result = await FeeTemplate.findOne({ filter: "allstudents" });
    }

    if (!result && studentClass) {
      result = await FeeTemplate.findOne({
        filter: "classbase",
        class: studentClass,
      });
    }

    if (!result) {
      result = await FeeTemplate.findOne({ filter: "allstudents" });
    }

    // 🧩 3️⃣ Handle not found case
    if (!result) {
      throw new Error("No fee template found for this student/class");
    }

    console.log("✅ Template found:", result?._id);

    // 4️⃣ Calculate total fee
    const totalFee = result?.breakdown.reduce((sum, f) => sum + f.amount, 0);
    const discountedFee = totalFee - (totalFee * discount) / 100;

    // 5️⃣ Create new fee record
    const newFee = new StudentFeeStructure({
      studentId,
      class: studentClass,
      frequency, // monthly
      discount,
      total_fee: discountedFee,
      breakdown: result.breakdown,
    });

    await newFee.save();

    return res.status(201).json({
      success: true,
      message: "✅ Fee structure created successfully",
      data: newFee,
    });
    return;
  } catch (error) {
    devLog(`Error creating fee structure`, { level: "err", data: error });

    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all fees
export const getAllFees = async (req, res) => {
  try {
    const data = await StudentFeeStructure.find().populate("studentId");
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get single student fees
export const getStudentFee = async (req, res) => {
  try {
    const fee = await StudentFeeStructure.findOne({
      studentId: req.params.id,
    }).populate("studentId");

    if (!fee)
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });

    res.json({ success: true, data: fee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all students by class
export const getClassFees = async (req, res) => {
  try {
    const fees = await StudentFeeStructure.find({
      class: req.params.className,
    });
    res.json({ success: true, data: fees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Add new payment to student
export const addPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_amount, payment_mode, note } = req.body;

    // 🔹 Get student profile to know their class, etc.
    const student = await StudentProfile.findById(id);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // const studentFee = await StudentFeeStructure.find(id);

    const structure = await StudentFeeStructure.findOne({
      $or: [
        { applyType: "student", studentId: student._id },
        { applyType: "class", class: student.class },
        { applyType: "global" },
      ],
    }).sort({ applyType: 1 }); // priority: student > class > global

    if (!structure)
      return res
        .status(404)
        .json({ success: false, message: "Fee record not found" });

    const newPayment = {
      payment_amount,
      payment_mode,
      note,
      payment_date: dayjs().toDate(),
      receipt_number: generateReceiptNumber(), // generateCustomID("STU-", 6)
    };

    structure.payments.push(newPayment);
    await structure.save(); // triggers pre-save hook (auto update paid/due/status)

    res.json({
      success: true,
      message: "Payment added successfully",
      data: structure,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete specific payment (rollback)
export const deletePayment = async (req, res) => {
  try {
    const { id, receiptNo } = req.params;

    const studentFee = await StudentFeeStructure.findById(id);
    if (!studentFee)
      return res
        .status(404)
        .json({ success: false, message: "Fee record not found" });

    studentFee.payments = studentFee.payments.filter(
      (p) => p.receipt_number !== receiptNo
    );
    await studentFee.save();

    res.json({
      success: true,
      message: "Payment deleted successfully",
      data: studentFee,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// | Task           | Method   | Route                              | Description                 |
// | -------------- | -------- | ---------------------------------- | --------------------------- |
// | Create Fee     | `POST`   | `/api/fees/create`                 | Add new class/student fee   |
// | Get All Fees   | `GET`    | `/api/fees/`                       | List all fee records        |
// | Student Fee    | `GET`    | `/api/fees/student/:id`            | Get one student’s fee       |
// | Class Fees     | `GET`    | `/api/fees/class/:className`       | Get all students of a class |
// | Add Payment    | `POST`   | `/api/fees/pay/:id`                | Add new payment             |
// | Delete Payment | `DELETE` | `/api/fees/payment/:id/:receiptNo` | Delete one payment          |

// POST → /api/fees/pay/:id

// {
//   "payment_amount": 2000,
//   "payment_mode": "Online",
//   "note": "April month payment"
// }

// POST → /api/fees/create

// {
//   "applyType": "student",
//   "class": "10th",
//   "studentId": "671a4e58bdf9c2a3a78fd132",
//   "total_fee": 12000,
//   "discount": 10,
//   "frequency": "monthly",
//   "breakdown": [
//     { "name": "Tuition Fee", "amount": 8000 },
//     { "name": "Transport Fee", "amount": 4000 }
//   ]
// }
