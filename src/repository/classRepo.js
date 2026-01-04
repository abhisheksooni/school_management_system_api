import mongoose from "mongoose";
import {
  SchoolClass,
  StudentProfile,
} from "../models/student/student_model.js";

let fillStudent = [
  {
    $project: {
      _id: 1,
      roll_number: 1,
      full_name: 1,
      student_code: 1,
      profile_image: 1,
    },
  },
];

export const getClass = async (data) => {
  return await SchoolClass.findOne(data);
};
export const getClassSort = async () => {
  return await SchoolClass.aggregate([
    {
      $project: {
        _id: 1,
        name: 1,
        section: 1,
      },
    },
  ]);
};

export const getClassWithAllStudents = async (data) => {
  // return await SchoolClass.find()
  return await StudentProfile.aggregate([
    { $match: {    class_id: new mongoose.Types.ObjectId(data), } },
    // { $match: { class_id: data } },

    {
      $project: {
        _id: 1,
        roll_number: 1,
        full_name: 1,
        student_code: 1,
        profile_image: 1,
        class_id: 1,
      },
    },
  ]);
  // return await StudentProfile.find({class_id:data}).p
};
