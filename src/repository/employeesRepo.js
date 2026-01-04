import { TeacherProfile } from "../models/teacher/teacher_model.js";



export const getEmployeesAttendanceFilterRepo = async ()=>{
 return await TeacherProfile.aggregate([
       {
         $project: {
           _id: 1,
           full_name: 1,
           profile_image: 1,
        //    teacher_phone_no: 1,
        //    subject: 1,
           teacher_code: 1,
         },
       },
     ]);
} 


export const employeesCount = async ()=>{
 return await TeacherProfile.countDocuments()
} 