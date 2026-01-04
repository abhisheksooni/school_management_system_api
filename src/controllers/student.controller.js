import * as studentService from "../services/student.service.js";
import { devLog } from "../utils/devlogger.js";

export const createssStudent = async (req, res) => {
  try {
    const result = await serviesFun_NAme(req);

    return res.status(200).json({
      success: true,
      length: lengthStudents,
      data: Students,
      message: "All Student found",
      // data1: students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "All Student Not found",
      error: error.message,
    });
  }
};

// getShortDataStudents

export const getStudents = async (req, res) => {
  try {
    const result = await studentService.getAllStudents();

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "All Student Not found",
      error: error.message,
    });
  }
};

export const getStudentById = async (req, res) => {
  try {
      const { id } = req.params;
    const student_id = id;

    const result = await studentService.getByIdStudents(student_id);

    return res.status(200).json(result);

  } catch (error) {
      devLog(`Error getStudentById controller `, {
          level: "err",
          data: error,
        });
    return res.status(500).json({
      success: false,
      message: "Student Not found",
      error: error.message,
    });
  }
};











export const funName = async (req, res) => {};


export const createStudent = async (req, res) => {
  try {
    const result = await studentService.createStudentWithAllData(req.body);

    return res.status(201).json(result);

    
  } catch (error) {
    devLog(`Error createStudent controller `, {
          level: "err",
          data: error,
        });
    return res.status(500).json({
      success: false,
      message: "All Student Not found",
      error: error.message,
    });
  }
};


export const updateStudent = async (req, res) => {
  try {
    const result = await studentService.updateStudentWithAllData(req);

    return res.status(201).json(result);


  } catch (error) {
    devLog("Update Student Error", { level: "err", data: error.message });
    return res.status(500).json({
      success: false,
      message: "Student update Failed",
      error: error.message,
    });
  }
};




