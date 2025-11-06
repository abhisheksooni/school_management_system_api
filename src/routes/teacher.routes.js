import { Router } from "express";
import {
  createTeacherAllDataController,
  deleteTeacherProfileWithAllData,
  getAllTeachersController,
  getTeacherByIdController,
  getTeachersByPreviewListController,
  updateTeacherAllDataController
} from "../controllers/teacher/teacherController.js";
import { createUploadMiddleware } from "../middlewares/imageMulter.js";
import { processFiles, uploadFiles } from "../middlewares/uploadMiddleware.js";
import {
  TeacherProfile,
  TeachersBasicInfo,
} from "../models/teacher/teacher_model.js";

const router = Router();
const uploadTeacher = await createUploadMiddleware("teachers");
// teacher  api/v1.0/teachers/

// Get All teachers
router.get("/teachers", getAllTeachersController);

// GET  Get a specific teacher by ID
router.post("/teachers/:id", getTeacherByIdController);

//TeachersAcademicInfo
// Post  Update a specific teacher by ID
router.post("/teachers/academic/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const teacher_id = id;

    const { qualifications, years_of_experience } = req.body;

    // console.log("Req Body:", req.body);
    // console.log("Req Body:", req.params);

    const searchTeacher = await TeacherProfile.findById(teacher_id);

    if (!searchTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const newAcademicInfo = await TeachersBasicInfo.create({
      teacher_id,
      qualifications,
      years_of_experience,
    });

    await newAcademicInfo.save();
    searchTeacher.academicInfo = newAcademicInfo._id;

    await searchTeacher.save();
    return res.status(201).json({
      success: true,
      message: "Teacher Academic Info created successfully",
      data: newAcademicInfo,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Teacher Academic Info Error in create POST" });
  }
});

// POST Create a new teacher , staff ,
router.post(
  "/teachers",
  uploadFiles,
  processFiles,
  createTeacherAllDataController
);

router.put(
  "/teachers/:id",
  uploadFiles,
  processFiles,
  updateTeacherAllDataController
);

router.delete("/teachers/delete/:id", deleteTeacherProfileWithAllData)
// GET  Get a specific teacher by ID
// summary
router.get("/teachers/summary", getTeachersByPreviewListController);

// router.post("/teachers", createTeacherController);

export default router;
