import { Router } from "express";
import { Teachers, TeachersAcademicInfo } from "../models/teacher/teacher_model.js";

const router = Router();

// teacher  api/v1.0/teachers/

// Get All teachers
router.get("/teachers", async (req, res) => {

    try {
        const allTeachers = await Teachers.find().populate('academicInfo');
        return res.status(200).json(
            {
                success: true,
                message: "Get All Teachers successfully",
                data: allTeachers
            }
        );
    } catch (error) {

    }
});

// GET  Get a specific teacher by ID
router.post("/teachers/:id", async (req, res) => {

    try {

        const { id } = req.params;
        const teacher_id = id;

        const getTeacher = await Teachers.findById(teacher_id).populate('academicInfo');

        if (!getTeacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        return res.status(200).json(
            {
                success: true,
                message: "Teacher get successfully",
                data: getTeacher
            }
        );


        // const allTeachers = await Teachers.find
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Teacher Error in GET" });
    }

});

//TeachersAcademicInfo
// Post  Update a specific teacher by ID
router.post("/teachers/academic/:id", async (req, res) => {

    try {
        const { id } = req.params;
        const teacher_id = id;

        const { qualifications, years_of_experience } = req.body;


        // console.log("Req Body:", req.body);
        // console.log("Req Body:", req.params);

        const searchTeacher = await Teachers.findById(teacher_id);

        if (!searchTeacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        const newAcademicInfo = await TeachersAcademicInfo.create({
            teacher_id,
            qualifications,
            years_of_experience
        });

        await newAcademicInfo.save();
        searchTeacher.academicInfo = newAcademicInfo._id;

        await searchTeacher.save();
        return res.status(201).json({
            success: true,
            message: "Teacher Academic Info created successfully",
            data: newAcademicInfo
        })


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Teacher Academic Info Error in create POST" });
    }
}
);

// POST Create a new teacher
router.post("/teachers", async (req, res) => {

    try {
        const { teacher_name, subject } = req.body;

        const newTeacher = await Teachers.create(
            {
                teacher_name,
                subject
            }
        )
        await newTeacher.save();

        return res.status(201).json({
            success: true,
            message: "Teacher created successfully",
            data: newTeacher
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Teacher Error in create POST" });
    }


});

export default router;
