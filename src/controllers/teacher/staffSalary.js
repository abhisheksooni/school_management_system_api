import {
  salaryPaymentsModel,
  StaffSalary,
  TeacherProfile,
} from "../../models/teacher/teacher_model.js";
import { devLog } from "../../utils/devlogger.js";

// URL with filters: /salary?month=11&year=2025&status=pending&teacher_name=Abhi&page=1&limit=10
// Method: GET
// Body: None
export const getTeachersSalaryProfilesList = async (req, res) => {
  try {
    devLog(`Staff Salary getTeachersSalaryProfilesList `, { level: "r" });
    //     const teachers = await TeacherProfile.aggregate([
    //       {
    //         $lookup: {
    //           from: "staffsalarys", // collection name for salary
    //           localField: "staff_salary_ids",
    //           foreignField: "_id",
    //           as: "staff_Salary_ids",
    //         },
    //       },
    //   {
    //     $unwind: {
    //       path: "$staff_Salary_id", // convert array to object (if you expect only 1 salary per teacher)
    //       preserveNullAndEmptyArrays: true, // in case no salary exists
    //     },
    //   },
    //       {
    //         $project: {

    //              // Keep all teacher fields as-is

    //       profile_image: 1,
    //       full_name: 1,
    //       subject: 1,
    //       teacher_phone_no: 1,
    //     //   school_class_ids: 1,
    //     //   class_subjects_ids: 1,
    //     //   basic_info_id: 1,
    //     //   teacher_auth_id: 1,
    //       staff_Salary_id: 1,           // Already populated

    //       },
    //       }    ]);

    const {
      month,
      year,
      status,
      teacher_name,
      page = 1,
      limit = 20,
    } = req.query;

    let query = {};

    if (month) query.month = month;
    if (year) query.year = year;
    if (status) query.status = status;

    if (teacher_name) {
      query.full_name = { $regex: teacher_name, $options: "i" };
    }

    const a = await StaffSalary.find(query)
      .populate("teacher_id", "full_name subject teacher_code")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    // const a = await TeacherProfile.find().populate([
    //   { path: "staff_Salary_id", select:"net_salary" },
    // ]);



const finalDatas = a.map(({ teacher_id, ...rest }) => ({
  ...rest._doc,
  teacher_name: teacher_id.full_name,
  subject: teacher_id.subject,
  teacher_code: teacher_id.teacher_code
}));

const finalData = a.map(item => ({

  _id: item._id,

  // teacher flatten
  teacher_id: item.teacher_id._id,
  teacher_name: item.teacher_id.full_name,
  subject: item.teacher_id.subject,
  teacher_code: item.teacher_id.teacher_code,

  // Fees data
  base_salary: item.base_salary,
  bonuses: item.bonuses,
  deductions: item.deductions,
  net_salary: item.net_salary,
  month: item.month,
  year: item.year,
  pending_amount: item.pending_amount,
  payments:item.payments,
  status: item.status,
  createdAt: item.createdAt,
}));





    devLog(`Staff Salary getTeachersSalaryProfilesList `, {
      level: "s",
    });
    return res.status(200).json({
      success: true,
      data: finalData,
      dataa: a,
      //   datas: teachers,
      message: "All Teachers found",
    });
  } catch (error) {
    devLog(`Staff Salary getTeachersSalaryProfilesList `, {
      level: "e",
      data: error,
    });
    return res.status(500).json({
      success: false,
      message: "All Teachers Not found",
      error: error.message,
    });
  }
};

// Add payment
export const paySalaryStaff = async (req, res) => {
  devLog(`paySalaryStaff`, { level: "r" });
  try {
    const { salary_id } = req.params;

    // const salary_id = id;

    const { payment_amount, payment_mode, transaction_id, payment_date } =
      req.body;
    const paymentData = req.body;

    // 1. Create payment
    const payment = await salaryPaymentsModel.create({
      salary_id,
      ...paymentData,
    });

    // 2. Attach payment to salary
    const salary = await StaffSalary.findByIdAndUpdate(
      salary_id,
      { $push: { payments: payment._id } },
      { new: true }
    );

    // 3. Populate payments
    const payments = await salaryPaymentsModel.find({ salary_id });
    salary.populatedPayments = payments;

    // 4. Update status
    const totalPaid = payments.reduce((sum, p) => sum + p.payment_amount, 0);
    salary.status = totalPaid >= salary.net_salary ? "paid" : "pending";
    await salary.save();

    // const salary = await StaffSalary.findOne({ teacher_id: id });
    // if (!salary) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "Salary record not found" });
    // }

    // salary.payments.push({
    //   payment_amount,
    //   payment_mode,
    //   transaction_id,
    //   payment_date,
    // });

    // await salary.save();

    devLog(`paySalaryStaff`, { level: "s" });
    return res.status(200).json({
      success: true,
      message: "Payment added successfully",
      // data: salary,
      data: payment,
      salary,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==

/* -----------------------------
   Get single salary by ID
----------------------------- */
export const getSalaryById = async (req, res) => {
  let teacher_id = req.params.teacher_id;

  devLog(`getSalaryById `, { level: "r" });
  try {
    const salary = await StaffSalary.findOne({ teacher_id }).populate(
      "teacher_id",
      "full_name , teacher_code, profile_image"
    ); // phone , code name change
    if (!salary)
      return res
        .status(404)
        .json({ success: false, error: "Salary not found" });

    devLog(`getSalaryById `, { level: "s" });
    return res.json({ success: true, data: salary });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* -----------------------------
   Update salary
----------------------------- */
export const updateSalaryStaff = async (req, res) => {
  try {
    
    let teacher_id = req.params.teacher_id;
    devLog(`updateSalaryStaff `, { level: "r" ,id:teacher_id});

    const salary = await StaffSalary.findOneAndUpdate(
      { teacher_id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!salary)
      return res
        .status(404)
        .json({ success: false, error: "Salary not found" });

    devLog(`updateSalaryStaff `, { level: "s" });

    res.json({ success: true, data: salary });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

/* -----------------------------
   Delete salary
----------------------------- */
export const deleteSalaryStaff = async (req, res) => {
  try {
    devLog(`deleteSalaryStaff `, { level: "r" });

    let teacher_id = req.params.teacher_id;
    const salary = await StaffSalary.findByIdAndDelete(teacher_id);

    if (!salary)
      return res
        .status(404)
        .json({ success: false, error: "Salary not found" });

    devLog(`deleteSalaryStaff`, { level: "s" });

    return res.json({ success: true, message: "Salary deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
/* -----------------------------
   Delete salary slip 
----------------------------- */
export const deleteSalaryStaffPayment = async (req, res) => {
  try {
    
    let id = req.params.id
    devLog(`deleteSalaryStaffPayment `, { level: "r",id:id });

// let staff_id = await StaffSalary.findOne(teacher_id);

// let slipid = staff_id.payments

// if (slipid.length == 0) {
//    return res
//         .status(404)
//         .json({ success: false, error: "Salary Slips not found" });
// }

    // let teacher_id = req.params.teacher_id;
    const salary = await salaryPaymentsModel.findByIdAndDelete(id);

    if (!salary)
      return res
        .status(404)
        .json({ success: false, error: "deleteSalaryStaffPayment not found" });

    devLog(`deleteSalaryStaffPayment`, { level: "s" });

    return res.json({ success: true, message: "Salary deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* -----------------------------
   Add payment
----------------------------- */
export const addPayment = async (req, res) => {
  try {
    const salary = await StaffSalary.findById(req.params.id);
    if (!salary)
      return res
        .status(404)
        .json({ success: false, error: "Salary not found" });

        
    salary.payments.push(req.body); // body should contain payment_amount, payment_mode, etc.
    await salary.save(); // pre-save hook will update status & net_salary
    res.json({ success: true, data: salary });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

/* -----------------------------
   Generate monthly report
----------------------------- */
export const generateMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    const salaries = await StaffSalary.find({ month, year });

    const totalSalary = salaries.reduce((sum, s) => sum + s.net_salary, 0);
    const totalPaid = salaries.reduce(
      (sum, s) =>
        sum + s.payments.reduce((p, pay) => p + pay.payment_amount, 0),
      0
    );
    const totalPending = totalSalary - totalPaid;

    res.json({ success: true, data: { totalSalary, totalPaid, totalPending } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* -----------------------------
   Generate teacher-wise report
----------------------------- */
export const generateTeacherReport = async (req, res) => {
  try {
    const salaries = await StaffSalary.find({
      teacher_id: req.params.teacherId,
    }).sort({ year: 1, month: 1 });

    res.json({ success: true, data: salaries });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* -----------------------------
   Search salary
----------------------------- */
export const searchSalary = async (req, res) => {
  try {
    const { name } = req.query;
    const salaries = await StaffSalary.find({
      full_name: { $regex: name, $options: "i" },
    });
    res.json({ success: true, data: salaries });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
