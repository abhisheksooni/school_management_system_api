import {
  StudentProfile,
  StudentParentsInfo,
} from "../../models/student/student_model.js";

// Get parents info by ID
// export const getParentsInfo = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const parentInfo = await StudentParentsInfo.findById(id);

//     if (!parentInfo) {
//       return res.status(404).json({ message: "Parent information not found for this student" });
//     }

//    return res.status(200).json(parentInfo);
//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// };

// POST Create parents info
export const createStudentParentsInfo = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if student exists
    const student = await StudentProfile.findById(id);

    const existingParentInfo = await StudentParentsInfo.findOne({
      student_id: id,
    });
    if (existingParentInfo) {
      return res
        .status(400)
        .json({
          message: "Parent information already exists for this student",
        });
    }

    if (!student) {
      return res.status(404).json({ message: "Student not found in parents" });
    }

    const newParent = await StudentParentsInfo.create({
      student_id: id,
      ...req.body,
    });

    //  Update student with parent's ObjectId
    student.parents_info_id = newParent._id;
    const saves = await student.save();
    // Update reference in StudentProfile
    // await StudentProfile.findByIdAndUpdate(
    //   req.body.student_id,
    //   { parents_info_id: saves._id }
    // );

    return res.status(200).json({
      success: true,
      message: "Student Parents Info scessfully",
      data: newParent,
      saves: saves,
    });
  } catch (error) {
    console.error("Error student Parents Info : ", error);
    return res.status(500).json({
      success: false,
      message: "student Parents Error in create POST",
    });
  }
};

// PUT Update existing parents info
export const updateStudentParentsInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedParentInfo = await StudentParentsInfo.findOneAndUpdate(
      { student_id: id },
      { $set: req.body },
      { new: true }
    );

    if (!updatedParentInfo) {
      return res
        .status(404)
        .json({ message: "Parent information not found for this student" });
    }

    res.status(200).json(updatedParentInfo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
