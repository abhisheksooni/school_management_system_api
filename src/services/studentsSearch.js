
import { StudentProfile } from "../models/student/student_model.js";

// 🔍 Live search API
    
export const studentSearch =  async (req, res) => {
  try {
    const query = req.query.q?.trim() || "";

    // Agar query empty hai, result blank bhej do
    if (!query) return res.json([]);

    // Regex for partial & case-insensitive match
    const students = await StudentProfile.find({
      $or: [
        { full_name: { $regex: query, $options: "i" } },
        { roll_number: { $regex: query, $options: "i" } },
      ],
    })
      .populate("class_id", "name section _id")
      .limit(10); // limit 10 result

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


