import { AdvancedInfo, BasicInfo, ParentsInfo, Student } from "../../models/student/student_model.js";


//  =============  POST/ CREATE STUDENT  ==============


export const createStudent = async (req, res) => {
  try {



    const {
      student_name,
      roll_number,
      select_class,
      student_image,
      basic_info,
      advanced_info,
      parents_info,
    } = req.body;


    const rollNumberCheck = await Student.findOne({ roll_number });
    if (rollNumberCheck) {
      return res.status(400).json({
        success: false,
        message: "Roll Number already exists. Please use a different Roll Number."
      });
    }

    // 1. Create related nested documents first
    const basicInfoDoc = basic_info ? await BasicInfo.create(basic_info) : null;
    const advancedInfoDoc = advanced_info ? await AdvancedInfo.create(advanced_info) : null;
    const parentsInfoDoc = parents_info ? await ParentsInfo.create(parents_info) : null;


    // Create Student
    const newStudent = await Student.create({
      student_name,
      roll_number,
      select_class,
      student_image,
      basic_info: basicInfoDoc?._id || null,
      advanced_info: advancedInfoDoc?._id || null,
      parents_info: parentsInfoDoc?._id || null,

      // add more references here as needed
    });

    await newStudent.save();

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      student: newStudent
    });
  }
  catch (error) {
    console.error("Create Student Error:", error);
    return res.status(400).json({
      success: false,
      message: "Student creation failed",
      error: error.message
    })
  }

}




//  =============  GET ALL STUDENT  ==============

export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
    //   .populate("academicInfo feeInfo attendanceInfo examInfo");

    return res.status(200).json({
      success: true,
      message: "All Student found",
      data: students
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "All Student Not found",
      error: error.message
    });
  }
};


//  =============  GET BY ID STUDENT  ==============

export const getStudentById = async (req, res) => {
  try {

    const { id } = req.params;
    const student_id = id;

    const student = await Student.findById(student_id)
    // .populate("feesInfo");
    if (!student) return res.status(404).json({ message: "Student not found" });

    return res.status(200).json({
      success: true,
      message: "Student found",
      data: student
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Student Not found",
      error: error.message
    });
  }
};



//  =============  POST/UPDATE BY ID STUDENT  ==============

export const updateStudent = async (req, res) => {
  try {
    // const studentId = req.params.id;
    // const {
    //   student_name,
    //   roll_number,
    //   select_class,

    // } = req.body;

    // Step 1: Find the student
    const updateStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }  // Return updated document
    );

    if (!updateStudent) return res.status(404).json({ message: "Student not found" });




    // Step 4: Save updated student
    await updateStudent.save();

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updateStudent
    });




  } catch (error) {
    console.error("Update Student Error:", error);
    return res.status(400).json({
      success: false,
      message: "Student update failed",
      error: error.message
    });

  }
};

//  =============  GET BY ID STUDENT FULL DATA  ==============

export const getAllDataStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student_id = id;

    const student = await Student.findById(student_id).populate([{ path: "basic_info" },
    { path: "advanced_info" },
    { path: "parents_info" },
    { path: "fees_info" },
      // { path: "attendances" },  // ⛔️ This may need to change — see below
      // { path: "exam_info" },
      // { path: "homework_info" },
      // { path: "extraCurricularInfo" }
    ])

    // .populate("feesInfo");
    if (!student) return res.status(404).json({ message: "Student not found" });

    return res.status(200).json({
      success: true,
      message: "Student found",
      data: student
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Student Not found",
      error: error.message
    });
  }
}






//  =============  DELETE BY ID STUDENT  ==============

// export const deleteStudent = async (req, res) => {
//   try {
//     await Student.findByIdAndDelete(req.params.id);
//     res.json({ message: "Student deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

