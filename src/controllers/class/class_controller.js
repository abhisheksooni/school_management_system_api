import { Class, Subject } from "../../models/student/student_model.js";

// Add Class
export const addClass = async (req, res) => {
    try {
        const { class_name, class_teacher, section } = req.body;

        const newClass = new Class({ class_name, class_teacher, section });
        await newClass.save();

        return res.status(200).json({ success: true, message: "Class added successfully", data: newClass });
    } catch (error) {

        console.error("Get add Classes", error)
        return res.status(500).json({ success: false, message: "Error Add/Create Class" })
    }
}

//  Get All Classes
export const getAllClasses = async (req, res) => {
    try {
        // Query params from frontend
        const { search, section, class_teacher } = req.query;

        // Build filter object dynamically
        let filter = {};

        if (search) {
            // Search by class_name (case insensitive, partial match)
            filter.class_name = { $regex: search, $options: "i" };
        }

        if (section) {
            filter.section = section;
        }

        if (class_teacher) {
            // Exact or partial match, use regex for partial
            filter.class_teacher = { $regex: class_teacher, $options: "i" };
        }

        const classes = await Class.find(filter);

        return res.status(200).json({ success: true, message: "Get All Class successfully", data: classes });
    } catch (error) {
        console.error("Get All Classes", error)
        return res.status(500).json({ success: false, message: "Error Get All Classes", error });
    }
};

// Update Class
export const updateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Class.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json({ success: true, message: "Class updated", data: updated });
    } catch (error) {
        console.error("Error updating class", error)
        return res.status(500).json({ success: false, message: "Error updating class", error });
    }
};


//  Delete Class
export const deleteClass = async (req, res) => {
    try {
        const { id } = req.params;
        await Class.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Class deleted successfully" });
    } catch (error) {
        console.error("Error deleting Classes", error)
        return res.status(500).json({ success: false, message: "Error deleting class", error });
    }
};



// ================  class with Subjects  =======================

//  Get All Class with Subjects
export const getAllClassesWithSubjects = async (req, res) => {
    try {
        const classes = await Class.find().populate("subjects");

        // Function to count total subjects
        function getTotalSubjects(data) {
            let totalSubjects = 0;

            data.forEach(classItem => {
                if (Array.isArray(classItem.subjects)) {
                    totalSubjects += classItem.subjects.length;
                }
            });

            return totalSubjects;
        }

           // Count total subjects
        const totalSubject = getTotalSubjects(classes);

        return res.status(200).json({
            success: true,
            message: "Fetched all classes with their subjects (aggregation).",
            totalClass: classes.length,
            totalSubject: totalSubject,

            data: classes
        });
    } catch (error) {
        console.error("Aggregation error:", error)
        return res.status(500).json({
            success: false,
            message: "Error using aggregation to get class with subjects", error: error.message
        });
    }
};
export const updateClassWithSubjects = async (req, res) => {

    const classId = req.params.id;
    const { class_name, section, class_teacher, subjects } = req.body;


    try {
        // 1. Update Class details
        const updatedClass = await Class.findByIdAndUpdate(
            classId,
            { class_name, section, class_teacher },
            { new: true } // return updated doc
        );


        if (!updatedClass) {
            return res.status(404).json({ success: false, message: "Class not found" });
        }

        // 2. Update / Add subjects
        if (Array.isArray(subjects)) {
            // Loop through subjects array
            for (const subject of subjects) {
                if (subject._id) {
                    // Existing subject — update it
                    await Subject.findByIdAndUpdate(subject._id, subject, { new: true });
                } else {
                    // New subject — create it linked with this class
                    const newSubject = new Subject({
                        ...subject,
                        class_id: classId
                    });
                    await newSubject.save();
                }
            }
        }
        // Get list of submitted subject ids
        const submittedSubjectIds = subjects.filter(s => s._id).map(s => s._id);

        // Delete subjects of this class which are not submitted (deleted by user)
        await Subject.deleteMany({
            class_id: classId,
            _id: { $nin: submittedSubjectIds }
        });





        const classWithSubjects = await Class.findById(classId).populate('subjects');


        //    classWithSubjects.map((item)=>(
        //     item.
        //    ))



        return res.status(200).json({
            success: true,
            message: "Class and subjects updated successfully",
            data: classWithSubjects
        });
    } catch (error) {
        console.error("Aggregation error:", error)
        return res.status(500).json({
            success: false,
            message: "Error using aggregation to get class with subjects", error: error.message
        });
    }
};



// // Get list of submitted subject ids
// const submittedSubjectIds = Subjects.filter(s => s._id).map(s => s._id);

// // Delete subjects of this class which are not submitted (deleted by user)
// await Subject.deleteMany({
//   class_id: classId,
//   _id: { $nin: submittedSubjectIds }
// });








// export const getAllClassesWithSubjects = async (req, res) => {
//     try {
//         const classes = await Class.find().populate("subjects");

//         return res.status(200).json({
//             success: true,
//             message: "Fetched all classes with subjects using virtual populate",
//             data: classes
//         });
//     } catch (error) {
//         console.error("Virtual populate error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Error fetching classes with virtual populate",
//             error: error.message
//         });
//     }
// };
