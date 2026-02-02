import * as studentService from "../services/student.service.js";
import { devLog } from "../utils/devlogger.js";

let logName = "Student Controler "

// getShortDataStudents

export const getStudents = async (req, res) => {
  try {

   const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

     const result = await studentService.getAllStudents({
      page,
      limit,
    });

    // const result = await studentService.getAllStudents();

    return res.status(200).json(result);

  } catch (error) {
      devLog(`Error ${logName} getStudents  `, {
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

export const getStudentById = async (req, res) => {
  try {

    const result = await studentService.getByIdStudents(req);

    return res.status(200).json(result);

  } catch (error) {
      devLog(`Error ${logName} getStudentById`, {
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


export const getAllDataStudent = async (req,res)=>{
  try {
    
    const result = await studentService.getByIdStudents(res)
 return res.status(200).json(result);

  } catch (error) {
      devLog(`Error ${logName} getAllDataStudent  `, {
          level: "err",
          data: error,
        });
     return res.status(500).json({
      success: false,
      message: "Student Not found",
      error: error.message,
    });
  }
}





export const createStudentContrller = async (req, res) => {
  try {
    const result = await studentService.createStudentWithAllData(req.body);

    return res.status(201).json(result);

    
  } catch (error) {
    devLog(`Error ${logName}createStudentContrller  `, {
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
    devLog(`Error ${logName} Update Student `, { level: "err", data: error.message });
    return res.status(500).json({
      success: false,
      message: "Student update Failed",
      error: error.message,
    });
  }
};

 export const deleteStudentWithAllData = async (req,res)=>{
  try {
    
 const result = await studentService.deleteStudentWithAllData(req)
 return res.status(200).json(result);


  } catch (error) {
     devLog(`Error ${logName} deleteStudentWithAllData  `, {
          level: "err",
          data: error,
        });
     return res.status(500).json({
      success: false,
      message: "Student Not found",
      error: error.message,
    });
  }
 }


