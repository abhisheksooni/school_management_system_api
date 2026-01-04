import * as ClassSerices from "../../services/class.service.js"
import { devLog } from "../../utils/devlogger.js";

export const  getClassController = async (req,res)=>{
try {
//       devLog(`Find -Service- getAttendanceByStudent  `, {
//     level: "r",
//   });

const result = await ClassSerices.getFilterClass()
  return res.status(200).json(result);
  
} catch (error) {
      devLog(`-Controller- getClassController  `, {
    level: "err",
    data:error
  });
}
}



export const  getClassWithAllStudentsControler = async (req,res)=>{
try {

const result = await ClassSerices.getClassWithAllStudents(req)
  return res.status(200).json(result);
  
} catch (error) {
      devLog(`-Controller- getClassWithAllStudentsControler  `, {
    level: "err",
    data:error
  });
}
}
export const  getOneClassControler = async (req,res)=>{
try {

const result = await ClassSerices.getOneClass(req)
  return res.status(200).json(result);
  
} catch (error) {
      devLog(`-Controller- getOneClassControler  `, {
    level: "err",
    data:error
  });
}
}