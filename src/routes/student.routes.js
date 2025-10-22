
import { Router } from 'express';
import { createStudent, getAllDataStudent, getAllStudents, getStudentById, updateStudent } from '../controllers/students/studentController.js';

import {  addPaymentToFeesInfo, createFeesInfo, deleteFeesInfo, getAllFeesInfoForStudent, } from '../controllers/students/feesController.js';

import { createStudentParentsInfo, updateStudentParentsInfo, } from '../controllers/students/parentsInfoControler.js';
import { createStudentBasicInfo, updateStudentBasicInfo } from '../controllers/students/bacis_infoController.js';
import { createStudentAdvancedInfo, updateStudentAdvancedInfo, } from '../controllers/students/advanced_infoControler.js';
import { getMonthlyAttendance, markBulkAttendance } from '../controllers/students/attendanceController.js';
import { Query } from 'mongoose';



const router = Router();

// student routes
router.post("/students", createStudent ) // Create Student
router.get("/students", getAllStudents ) // Get All Students
router.post("/students/:id",getStudentById  ) // POST Get Student by ID
router.put("/students/:id", updateStudent ) // PUT Update Student by ID
router.post("/students/alldata/:id",getAllDataStudent  ) // get Full data

// Studennts basic_info routes
router.post("/students/basic_info/:id", createStudentBasicInfo ) // createBasicInfo
router.put("/students/basic_info/:id", updateStudentBasicInfo) // updateBasicInfo



// student advanced_info routes
router.post("/students/advanced_info/:id",createStudentAdvancedInfo ) //createAdvancedInfo
router.put("/students/advanced_info/:id",updateStudentAdvancedInfo ) // updateAdvancedInfo

// Student parentsInfo routes
router.post("/students/parents_info/:id", createStudentParentsInfo ) // createParentsInfo
router.put("/students/parents_info/:id", updateStudentParentsInfo) // updateParentsInfo
// router.get("/students/parents_info/:id", ) // getParentsInfo

// Students Fee routes
router.post("/students/fees/:id", createFeesInfo ) // create FeesInfo for student
router.put("/students/fees/:id/payment", addPaymentToFeesInfo )
// router.get("/students/fees", getAllFeesInfoForStudent ) //get All Students fees
// router.get("/students/fees/:id/payment", getPayments ) //get All Students fees
// router.delete("/students/fees/:id/payment", deleteFeesInfo )


// Student Attendance
router.post("/students/attendances/bulk",markBulkAttendance)
router.get("/students/attendances",getMonthlyAttendance) // req Query

// Student 





export default router;