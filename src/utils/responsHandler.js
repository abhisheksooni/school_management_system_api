// src/helper/responseHandler.js

// Use
//   sendSuccess(res, students, "All Students found", students.length);
//   sendError(res, error, error.statusCode || 500);

export const sendSuccess = (res, data, message = "Success", count = null) => {
  const response = { success: true, message, data };
  if (count !== null) response.count = count;
  return res.status(200).json(response);
};

export const sendError = (res, error, statusCode = 500, message = null) => {
  return res.status(statusCode).json({
    success: false,
    message: message || error.message || "Something went wrong",
    error: error.stack || undefined,
  });
};
