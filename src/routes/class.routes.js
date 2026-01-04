import { Router } from "express";
import {
  createClassz,
  deleteClass,
  getAllClasses,
  getAllClassesWithSubjects,
  updateClass,
  updateClassWithSubjects,
} from "../controllers/class/class_controller.js";
import {
  addSubject,
  getSubjects,
  updateSubject,
} from "../controllers/class/subject_controller.js";
import { getClassController, getClassWithAllStudentsControler, getOneClassControler } from "../controllers/class/class.controller.js";
import { getOneClass } from "../services/class.service.js";

const router = Router();

// class
router.post("/class", createClassz);
router.post("/class/info", getOneClassControler);
router.get("/class", getAllClasses);
router.put("/class/:id", updateClass);
router.delete("/class/:id", deleteClass);

// Subject
router.post("/subject", addSubject);
router.get("/subject", getSubjects);
router.put("/subject/:id", updateSubject);
// router.post("/subject", addSubject);

// class With Subjects
router.get("/class_with_subjects", getAllClassesWithSubjects);
router.put("/class_with_subjects/:id", updateClassWithSubjects);

/**
 * New sev , controller , With Repo
 */

router.get("/class/sort", getClassController);
router.post("/class/students", getClassWithAllStudentsControler);








// Marks

// // Subject routes
// router.post("/subject", addSubject);
// router.get("/subject", getSubjects);
// router.put("/subject/:id", updateSubject);
// router.delete("/subject/:id", deleteSubject);

// // Marks routes
// router.post("/marks", addMark);
// router.get("/marks", getMarks);
// router.put("/marks/:id", updateMark);
// router.delete("marks/:id", deleteMark);

export default router;
