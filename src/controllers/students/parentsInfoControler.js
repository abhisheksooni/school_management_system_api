
import { ParentsInfo, Student } from "../../models/student/student_model.js";

// // Get parents info by ID
// export const getParentsInfo = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const parentInfo = await ParentsInfo.findById(id);

//     if (!parentInfo) {
//       return res.status(404).json({ message: "Parent information not found for this student" });
//     }

//     res.status(200).json(parentInfo);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };




// POST Create parents info
export const createStudentParentsInfo = async (req, res) => {
  try {

    const { id } = req.params;
    // Check if student exists
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found in parents' });
    }


    const newParent = await ParentsInfo.create({
      student_id: id,
      ...req.body


    });



    //  Update student with parent's ObjectId
    student.parents_info = newParent._id ;
    await student.save();

 return res.status(200).json({
            success: true,
            message: "Student Parents Info scessfully",
            data: newParent
        })
   

  } catch (error) {
     console.error("Error student Parents Info : ", error);
    return    res.status(500).json({
            success: false,
            message: "student Parents Error in create POST"
        });
  
  }
};

// PUT Update existing parents info
export const updateStudentParentsInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedParentInfo = await ParentsInfo.findOneAndUpdate(
      { student_id: id },
      { $set: req.body },
      { new: true }
    );

    if (!updatedParentInfo) {
      return res.status(404).json({ message: "Parent information not found for this student" });
    }

    res.status(200).json(updatedParentInfo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

