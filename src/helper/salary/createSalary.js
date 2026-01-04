


export const createSalary = async (data)=>{

    try {
        const { teacher_id, base_salary, bonuses, deductions, month, year } = data.body;

        const salary = await TeacherSalary.create({
      teacher_id,
      base_salary,
      bonuses,
      deductions,
      month,
      year,
    });
    //     if (error.code === 11000) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Salary for this month already exists",
    //   });
    // }
 return res.status(201).json({
      success: true,
      message: "Salary created successfully",
      data: salary,
    });
        
    } catch (error) {

  return res.status(500).json({ success: false, message: error.message });

}
}


// 🚀  Get All Salary for One Teacher (GET /salary/teacher/:id)



// 🚀  Monthly Salary Report (GET /salary/report?month=1&year=2025)
export const getMonthlySalaryReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    const report = await TeacherSalary.find({ month, year })
      .populate("teacher_id", "full_name")
      .sort({ teacher_id: 1 });

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
