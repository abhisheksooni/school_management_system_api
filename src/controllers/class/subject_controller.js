import {
  ClassSubject,
  SchoolClass,
} from "../../models/student/student_model.js";

// ✅ Add Subject
export const addSubject = async (req, res) => {
  try {
    const { subject_name, subject_code, class_id, max_marks, teacher_id } =
      req.body;

    console.log("bk-data:  ", req.body);

    const newSubject = new ClassSubject({
      name: subject_name,
      subject_code,
      max_marks,
      // teacher_id: teacher_id ? teacher_id : null,
      class_id: class_id ? class_id : [],
    });

    // update class model with new subject id

    // if (class_id && class_id.length > 0) {
    //   await SchoolClass.updateMany(
    //     { _id: { $in: class_id } },
    //     { $push: { subject_ids: newSubject._id } }
    //   );
    // }

    const findClass = await SchoolClass.findById(class_id);
    if (!findClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    findClass.subjects_ids.push(newSubject._id);
    await findClass.save();
    await newSubject.save();

    return res
      .status(201)
      .json({ message: "Subject added successfully", subject: newSubject });
  } catch (error) {
    return res.status(500).json({ message: "Error adding subject", error });
  }
};

// ✅ Get All Subjects (optional filter by class)
export const getSubjects = async (req, res) => {
  try {
    const { class_id } = req.query;
    const filter = class_id ? { class_id } : {};

    const subjects = await ClassSubject.find(filter).populate(
      "class_id",
      "class_name section"
    );
    return res.status(200).json(subjects);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching subjects", error });
  }
};

// ✅ Update Subject
export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ClassSubject.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res
      .status(200)
      .json({ message: "Subject updated", subject: updated });
  } catch (error) {
    return res.status(500).json({ message: "Error updating subject", error });
  }
};

// ✅ Delete Subject
export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    await ClassSubject.findByIdAndDelete(id);
    return res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting subject", error });
  }
};
