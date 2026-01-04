import * as ClassRepo from "../repository/classRepo.js"
import { devLog } from "../utils/devlogger.js";


export const getFilterClass = async (data) => {
  devLog(`Find -Service- getFilterClass  `, {
    level: "r",
  });


    const result = await ClassRepo.getClassSort()

  devLog(`Find -Service- getFilterClass  `, {
    level: "s",
  });
  return {
    status: true,
    data: result,
  };
};
export const getOneClass = async (data) => {
  devLog(`Find -Service- getFilterClass  `, {
    level: "r",
  });
let {classId}= data.body

    const result = await ClassRepo.getClass({_id:classId})

  devLog(`Find -Service- getFilterClass  `, {
    level: "s",
  });
  return {
    status: true,
    data: result,
  };
};





export const getClassWithAllStudents = async (data) => {
  devLog(`-Service- getClassWithAllStudents  `, {
    level: "r",
    // id:
  });

  let {classId,} = data.body

// let query = 

    const result = await ClassRepo.getClassWithAllStudents(classId)

  devLog(`-Service- getClassWithAllStudents  `, {
    level: "s",
  });
  return {
    status: true,
    data: result,
  };
};
