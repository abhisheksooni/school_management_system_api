import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import chalk from "chalk";

import { devLog } from "./src/utils/devlogger.js";

import connectDB from "./src/config/db.js";


// Routes
import Student from "./src/routes/student.routes.js";
import Teacher from "./src/routes/teacher.routes.js";
import Class from "./src/routes/class.routes.js";
import StudentFee from "./src/routes/fee.Routes.js";
import auth from "./src/routes/auth.routes.js";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// ✅ Allow requests from your frontend (Vite dev server)
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true, // optional: only if you're using cookies/auth
// }));
app.use(cors());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.json()); // fine
app.use(express.urlencoded({ extended: true })); // fine

// --- ROUTES ---
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API V1
app.use("/api/v1.0/", Student);
app.use("/api/v1.0/", Teacher);
app.use("/api/v1.0/", Class);
app.use("/api/v1.0/", auth);

// API V1.1 NEW THINKINGS 
app.use("/api/v1.1/fees/", StudentFee);

// --- ROUTES END ---

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  devLog(`Server started on port ${chalk.bold.red(PORT)}`,{level:"r"})
});
