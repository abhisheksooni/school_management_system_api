import { devLog } from "../utils/devlogger.js";

export const responseHandler = ( data = {}) => {
  const {
    statusCode = 200,
    message = "Response sent successfully",
    successData = null,
    error = null,
  } = data;

  if (error) {
    devLog("❌ ERROR", { level: "err", data: error });

    return res.status(statusCode).json({
      success: false,
      message,
      error,
    });
  }

  return res.status(statusCode).json({
    success: true,
    message,
    data: successData,
  });
};
