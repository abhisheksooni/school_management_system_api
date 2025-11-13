import { Router } from "express";
import {
  createWithAllDataStudent,
  deleteStudentWithAllData,
  getAllDataStudent,
  getAllStudents,
  getStudentById,
  updateStudentWithAllData,
} from "../controllers/students/studentController.js";

import {
  addPaymentToFeesInfo,
  createFeesInfo,
  deleteFeesInfo,
  getStudentFeesFullInfo,
  getStudentsFeesFullInfo,
 
} from "../controllers/students/feesController.js";


import {
  getMonthlyAttendance,
  markBulkAttendance,
} from "../controllers/students/attendanceController.js";

import { createUploadMiddleware } from "../middlewares/imageMulter.js";
import multer from "multer";
import { processFiles, uploadFiles } from "../middlewares/uploadMiddleware.js";
import { studentSearch } from "../services/studentsSearch.js";
import { createFeeTemplatebreakdown } from "../controllers/feeController.js";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) =>
//     cb(null, Date.now() + "-" + file.originalname),
// });

// const upload = multer({ storage });

const router = Router();

router.get("/students", getAllStudents); // Get All Students
router.post("/students/:id", getStudentById); // POST Get Student by ID
router.post("/students", uploadFiles, processFiles, createWithAllDataStudent);

router.put(
  "/students/:student_id",
  uploadFiles,
  processFiles,
  updateStudentWithAllData
); // PUT Update Student by ID
router.post("/students/alldata/:id", getAllDataStudent); // get Full data

// delet Student With All data
router.delete("/students/delete/:id",deleteStudentWithAllData)


router.get("/students/search",studentSearch)



// const uploadImage = await createUploadMiddleware("student");

// createUploadMiddleware("student", [
//     "profile_image",
//     "father_image",
//     "mother_image",
//     "guardian_image",
//   ]),
// student routes
// router.post("/students",async (req,res)=>  {
// await console.log("profile_image--- ",req.profile_image);
// await console.log("father_image--- ",req.father_image);
// await console.log("mother_image--- ",req.mother_image);
// console.log("guardian_image--- ",req.guardian_image);
// console.log("file--- ",req.file);
//  console.log("file--- ",req.files);
//  console.log("body--- ",req.body);

//  return res.status(400).json({
//       // success: false,
//       message: "Student creation send",

//     });
//   }); // Create Student
// student routes
// router.post("/students",createUploadMiddleware("student", [
//     "profile_image",
//     "father_image",
//     "mother_image",
//     "guardian_image",
//   ]), createStudent, async (req,res)=>  {
// console.log("file--- ",req.files);

//   }); // Create Student


// =========================================
// Students Fee routes
// =========================================

router.post("/students/fees/:id", createFeesInfo); // create FeesInfo for student
router.put("/students/fees/:id/payment", addPaymentToFeesInfo);
router.post("/students/fees/full/:id",getStudentFeesFullInfo );
router.get("/students/fees",getStudentsFeesFullInfo);




// router.get("/students/fees", getAllStudentsFeesInfoOnly ) //get All Students fees data basic info
// router.get("/students/fees", getStudentFeesInfo ) //get All Students fees
// router.get("/students/fees/:id/payment", getPayments ) //get All Students fees
// router.delete("/students/fees/:id/payment", deleteFeesInfo );

// =========================================
//  Student Attendance //
// =========================================

router.post("/students/attendances/bulk", markBulkAttendance);
router.get("/students/attendances", getMonthlyAttendance); // req Query


export default router;
