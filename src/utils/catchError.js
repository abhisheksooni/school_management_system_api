import { devLog } from "./devlogger.js";


// USE
// 

const errorResponse = (data) => {
const {res, error, statusCode = 500 ,message , logtext=""} = data

 devLog(`${logtext} ❌ ERROR`, { level: "err", data: error });

  return res.status(statusCode).json({
    success: false,
    message: message || error.message || "Catch Err Something went wrong ",
  });
};

module.exports = errorResponse;



