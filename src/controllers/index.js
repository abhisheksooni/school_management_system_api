import { createStudentBasicInfo, updateStudentBasicInfo, } from "./students/bacis_infoController.js";
import { getStudentById, createStudent, updateStudent } from "./students/studentController.js";


module.exports = {

    // student controllers
    getStudentById,
    createStudent,
    updateStudent,

    // Student basic_info controllers
    createStudentBasicInfo,
    updateStudentBasicInfo

};