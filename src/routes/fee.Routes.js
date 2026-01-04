import express, { Router } from "express";

import {
  addPayment,
  createFeeTemplatebreakdown,
  createStudentFeeStructure,
  deletePayment,
  getAllFees,
  getClassFees,
  getStudentFee,
  getAllFeeTemplatebreakdown,
  updateFeeTemplatebreakdown,
  getOneFeeTemplatebreakdown,
} from "../controllers/feeController.js";

const router = Router();

// 🔹 Create new fee structure /testfeev2
router.post("/create", createStudentFeeStructure);

// 🔹 Get all fee structures
router.get("/", getAllFees);

// 🔹 Get one student's fee record
router.get("/student/:id", getStudentFee);

// 🔹 Get all students fee by class
router.get("/class/:className", getClassFees);

// 🔹 Add new payment
router.post("/pay/:id", addPayment);

// 🔹 Delete or rollback a payment
router.delete("/payment/:id/:receiptNo", deletePayment);



router.get("/templatebreakdown", getAllFeeTemplatebreakdown);
router.post("/templatebreakdown", createFeeTemplatebreakdown );

router.put("/templatebreakdown/:id", updateFeeTemplatebreakdown );
// router.delete("/templatebreakdown/:id", updateFeeTemplatebreakdown );
router.post("/templatebreakdown/:id", getOneFeeTemplatebreakdown );


router.post("/create-student-fee-structure", createStudentFeeStructure );




export default router;
