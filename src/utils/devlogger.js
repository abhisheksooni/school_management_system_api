// utils/devLogger.js
import chalk from "chalk";
import dayjs from "dayjs";

/**
 * Development-friendly console logger
 * @param {string} message - Main message
 * @param {object} options - Optional metadata
 * @param {string} options.level - "r - Running" | "p - process" | "i - info" | "s - success" | "w - warn" | "err - error"
 * @param {string} options.id - Optional ID of entity
 * @param {any} options.data - Optional data to log
 * @param {string} options.module - Optional module name
 */

// USE

// import { devLog } from "./utils/devLogger.js";

// devLog("Server started", { module: "Server" });
// devLog("Fee structure created", { level: "success", id: "fee_1234", module: "Fees", data: { total: 12000, discount: 10 } });
// devLog("Student not found", { level: "warn", id: "student_5678", module: "Student" });
// devLog("Database connection failed!", { level: "error", module: "DB" });

export const devLog = (message, options = {}) => {
  const { level = "info", id, data, module } = options;

  const time = dayjs().format("YYYY-MM-DD HH:mm:ss:SSS");
  let prefix = "";

  switch (level) {
    // case "success":
    case "s":
      prefix = chalk.green(`✅ [SUCCESS ${time}]`);
      break;
    // case "error":
    case "err":
      prefix = chalk.red(`❌ [ERROR   ${time}]`);
      break;
    // case "warn":
    case "w":
      prefix = chalk.yellow(`⚠️  [WARN    ${time}]`);
      break;
    case "p": // Process / in progress
      prefix = chalk.cyan(`⏳ [PROCESS ${time}]`);
      break;
    case "r": // Running / active
      prefix = chalk.magenta(`🏃 [RUNNING ${time}]`);
      break;
    // case "i": // Info
    //   prefix = chalk.blue(`ℹ️  [INFO    ${time}]`);
    //   break;

    default:
      prefix = chalk.blue(`[ ℹ️ INFO   ${time} ]`);
  }

  let meta = "";
  if (id) meta += ` | ID: ${chalk.bold.yellow(id)}`;
  if (module) meta += ` | Module: ${module}`;

  console.log(`${prefix} → ${message}${meta}`);

  if (data !== undefined) {
    console.log(chalk.gray("Data:"), data);
  }
};
