import { Subject } from "../../models/student/student_model.js";


// ✅ Add Subject
export const addSubject = async (req, res) => {
    try {
        const { subject_name, subject_code, class_id, max_marks } = req.body;

        const newSubject = new Subject({ subject_name, subject_code, class_id, max_marks });
        await newSubject.save();

        return res.status(201).json({ message: "Subject added successfully", subject: newSubject });
    } catch (error) {
        return res.status(500).json({ message: "Error adding subject", error });
    }
};

// ✅ Get All Subjects (optional filter by class)
export const getSubjects = async (req, res) => {
    try {
        const { class_id } = req.query;
        const filter = class_id ? { class_id } : {};

        const subjects = await Subject.find(filter).populate("class_id", "class_name section");
        return res.status(200).json(subjects);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching subjects", error });
    }
};


// ✅ Update Subject
export const updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Subject.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json({ message: "Subject updated", subject: updated });
    } catch (error) {
        return res.status(500).json({ message: "Error updating subject", error });
    }
};


// ✅ Delete Subject
export const deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;
        await Subject.findByIdAndDelete(id);
        return res.status(200).json({ message: "Subject deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting subject", error });
    }
};