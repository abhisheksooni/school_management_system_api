import { Router } from "express";
import * as employeesAttendance from "../controllers/employees-attendance.controller.js";
import { getOneEmployeeAccessController, updateEmployeeAccessController } from "../controllers/teacher/employeeAccess.js";
import {
  deleteSalaryStaff,
  deleteSalaryStaffPayment,
  getSalaryById,
  getTeachersSalaryProfilesList,
  paySalaryStaff,
  updateSalaryStaff,
} from "../controllers/teacher/staffSalary.js";
import {
  createTeacherAllDataController,
  deleteTeacherProfileWithAllData,
  getAllTeachersController,
  getTeacherByIdController,
  getTeachersByPreviewListController,
  updateTeacherAllDataController,
} from "../controllers/teacher/teacherController.js";
import { createUploadMiddleware } from "../middlewares/imageMulter.js";
import { processFiles, uploadFiles } from "../middlewares/uploadMiddleware.js";
import {
  TeacherProfile,
  TeachersBasicInfo,
} from "../models/teacher/teacher_model.js";

import * as EmployeesController from "../controllers/employees.controller.js"


const router = Router();
const uploadTeacher = await createUploadMiddleware("teachers");
// teacher  api/v1.0/teachers/

// Get All teachers
router.get("/teachers" , getAllTeachersController);

// GET  Get a specific teacher by ID
router.post("/teachers/profile/:id", getTeacherByIdController);

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

router.delete("/teachers/:id", deleteTeacherProfileWithAllData);
// GET  Get a specific teacher by ID
// summary
router.get("/teachers/summary", getTeachersByPreviewListController);




// A. CRUD (Basic Salary Records)

// Get all salaries 
router.get("/teachers/salary", getTeachersSalaryProfilesList);

// Payments  /:id/payment/:paymentId

// get one teacher with salary data Get one salary 
router.post("/teachers/salary/:teacher_id", getSalaryById);  // /:id/payment'
router.delete("/teachers/salary/:teacher_id", deleteSalaryStaff);




// add Payment
router.post("/teachers/salary/pay/:salary_id", paySalaryStaff);  // /:id/payment'
// Update payment
router.put("/teachers/salary/:teacher_id/update", updateSalaryStaff);
// // Delete payment
router.delete("/teachers/salary/payment/slip/:id", deleteSalaryStaffPayment);




// Delete salary
// Get one teacher salary
// Get one Update teacher salary
// Update salary

// search
// Search salary by teacher name GET  /salary/search?name=Abhi
// Filter by month/year  GET  /salary?month=11&year=2025
// Filter by payment status  GET  /salary?status=pending
// router.get('/search', salaryController.searchSalary);
// router.get('/report/monthly', salaryController.generateMonthlyReport);
// router.get('/report/yearly', salaryController.generateAnnualReport);
// router.get('/report/teacher/:teacherId', salaryController.generateTeacherReport);


// router.post("/teachers", createTeacherController);





/*  
===========================================================
+++++++++++++++ Employee Access Routes ++++++++++++++++
===========================================================
--------  NOTE  -------------
TEacher Auth modal me data hai 
*/


//GET
router.put("/teachers/access", getOneEmployeeAccessController);

//Update
router.put("/teachers/access/:id/update", updateEmployeeAccessController);

/*  
===========================================================
+++++++++++++++ Employee Access Routes ++++++++++++++++
===========================================================
*/



/*  
===========================================================
+++++++++++++++ Employees Attendance Routes ++++++++++++++++
===========================================================
*/

// Create
router.post("/teachers/attendance", employeesAttendance.employeesMarkBulkAttendanceController);

// Update
router.put("/teachers/attendance", employeesAttendance.updateEmployeesMarkBulkAttendanceController);

// get
router.get("/teachers/attendance", employeesAttendance.getEmployeesAttendanceController );
// get
router.get("/teachers/attendance-data", EmployeesController.getEmployeesAttendanceDataController );

 /*  
===========================================================
+++++++++++++++ End ++++++++++++++++
===========================================================
*/






















export default router;

// | Action               | HTTP      | Route         | Description                                        |
// | -------------------- | --------- | ------------- | -------------------------------------------------- |
// | Create salary record | POST      | `/salary`     | Create a monthly salary record for a teacher/staff |
// | Get all salaries     | GET       | `/salary`     | List all salary records                            |
// | Get one salary       | GET       | `/salary/:id` | Get salary record by id                            |
// | Update salary        | PUT/PATCH | `/salary/:id` | Update salary (base/bonus/deductions)              |
// | Delete salary        | DELETE    | `/salary/:id` | Delete salary record (if allowed)                  |

// | Action         | HTTP      | Route                            | Description                                   |
// | -------------- | --------- | -------------------------------- | --------------------------------------------- |
// | Add payment    | POST      | `/salary/:id/payment`            | Add a payment transaction for a salary record |
// | Update payment | PUT/PATCH | `/salary/:id/payment/:paymentId` | Update an existing payment                    |
// | Delete payment | DELETE    | `/salary/:id/payment/:paymentId` | Delete payment record                         |

// | Action                        | HTTP | Route                        | Description                 |
// | ----------------------------- | ---- | ---------------------------- | --------------------------- |
// | Search salary by teacher name | GET  | `/salary/search?name=Abhi`   | Case-insensitive search     |
// | Filter by month/year          | GET  | `/salary?month=11&year=2025` | Filter salaries for reports |
// | Filter by payment status      | GET  | `/salary?status=pending`     | List pending salaries       |

// | Action                | HTTP | Route                                       | Description                         |
// | --------------------- | ---- | ------------------------------------------- | ----------------------------------- |
// | Monthly salary report | GET  | `/salary/report/monthly?month=11&year=2025` | Total salary, paid, pending         |
// | Annual summary        | GET  | `/salary/report/yearly?year=2025`           | Total annual salary, total payments |
// | Teacher-wise report   | GET  | `/salary/report/teacher/:teacherId`         | Salary history of one teacher       |


// E. Optional Advanced Features

// Export salary data to Excel/CSV/PDF → /salary/export

// Bulk salary upload (CSV) → /salary/import

// Notifications when salary is paid → /salary/notify/:id