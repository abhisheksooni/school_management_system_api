// import { StudentProfile } from "../models/student/student_model.js";

/**
 * @typedef {Object} FindStudentsOptions
 * @property {string} populate - Fields to populate
 * @property {string} select - Fields to select
 * @property {string} module - Module name for logging
 * @property {Array} aggregate - Aggregation pipeline
 * @property {string} findById - ID to find one student
 * @property {Object} findOne - Filter for findOne
 */

/**
 * Flexible student finder
 * @param {Object} filter - Mongoose filter
 * @param {FindStudentsOptions} [options] - Additional query options
 * @returns {Promise<Object|Array>} - Single student or array
 */

import chalk from "chalk";
import { StudentProfile } from "../../models/student/student_model.js";
import { devLog } from "../../utils/devlogger.js";

// export const FetchByIdStudent =
export const FetchOneStudent = async (filter = {}, options = {}) => {
  const { populate = "", select = "", module = "Student" } = options;

  if (!filter || Object.keys(filter).length === 0) {
    throw new AppError("Filter is required to get student", 400);
  }

  let query = StudentProfile.findOne(filter);

  if (populate) query = query.populate(populate);
  if (select) query = query.select(select);

  const student = await query;

  if (!student) {
    devLog("Student not found", { level: "w", module, data: filter });
    throw new AppError("Student not found", 404);
  }

  devLog("Student fetched successfully", {
    level: "s",
    module,
    data: filter,
  });

  return student;
};

export const FindStudentsHandler = async (arg1 = {}, arg2 = {}) => {
  let filter = {};
  let options = {};

  // Decide if first arg is options or filter
  const isOptions =
    arg1.findById ||
    arg1.populate ||
    arg1.select ||
    arg1.aggregate ||
    arg1.module;
  if (isOptions) {
    options = arg1;
  } else {
    filter = arg1;
    options = arg2;
  }

  const {
    populate = "",
    select = "",
    module = "All Student",
    aggregate = null,
    findById = null,
    create = null,
  } = options;

  try {
    let students;

    if (aggregate) {
      // If using aggregation pipeline
      students = await StudentProfile.aggregate(aggregate);
      
    } else if (create) {
      
      students = await StudentProfile.create(create);

      devLog(`Student created successfully`, { level: "s", studentId: students._id });

    } else if (findById) {
      // Find by ID
      students = await StudentProfile.findById(findById)
        .populate(populate)
        .select(select);
    } else {
      // Normal find query
      let query = StudentProfile.find(filter);
      if (populate) query = query.populate(populate);
      if (select) query = query.select(select);

      students = await query;
    }

    //   const students = await query;

    if (!students || students.length === 0) {
      devLog("No students found for filter", {
        level: "w",
        module,
        data: filter,
      });
      throw new AppError("Student not found", 404);
    }

    devLog(
      `Normal find query fetched length-${chalk.bgYellow(students.length)} `,
      {
        level: "s",
        module,
        // data: ,
      }
    );

    return students;
  } catch (error) {
    devLog("Error fetching students FindStudentsHandler", {
      level: "err",
      module,
      data: error,
    });
    throw error;
  }
};

export const data = async () => {
  //  let query = await StudentProfile.find();
  let query = await StudentProfile.countDocuments();
  return query;
};
