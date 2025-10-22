// import Mark from "../models/Mark.js";

// // ✅ Add Marks
// export const addMark = async (req, res) => {
//   try {
//     const { student_id, subject_id, exam_name, obtained_marks } = req.body;

//     const newMark = new Mark({ student_id, subject_id, exam_name, obtained_marks });
//     await newMark.save();

//     return res.status(201).json({ message: "Marks added successfully", mark: newMark });
//   } catch (error) {
//     return res.status(500).json({ message: "Error adding marks", error });
//   }
// };

// // ✅ Get Marks (filter by student or subject or class)
// export const getMarks = async (req, res) => {
//   try {
//     const { student_id, subject_id } = req.query;
//     const filter = {};

//     if (student_id) filter.student_id = student_id;
//     if (subject_id) filter.subject_id = subject_id;

//     const marks = await Mark.find(filter)
//       .populate("student_id", "student_name roll_number")
//       .populate("subject_id", "subject_name");
//     return res.status(200).json(marks);
//   } catch (error) {
//     return res.status(500).json({ message: "Error fetching marks", error });
//   }
// };

// // ✅ Update Marks
// export const updateMark = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updated = await Mark.findByIdAndUpdate(id, req.body, { new: true });
//     return res.status(200).json({ message: "Marks updated", mark: updated });
//   } catch (error) {
//     return res.status(500).json({ message: "Error updating marks", error });
//   }
// };

// // ✅ Delete Marks
// export const deleteMark = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Mark.findByIdAndDelete(id);
//     return res.status(200).json({ message: "Marks deleted successfully" });
//   } catch (error) {
//     return res.status(500).json({ message: "Error deleting marks", error });
//   }
// };
