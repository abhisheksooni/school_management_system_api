import jwt from "jsonwebtoken";
import { StudentAuthInfo, StudentProfile } from "../../models/student/student_model.js";
import {
  TeacherAuthModel,
  TeacherProfile,
  TeachersBasicInfo,
} from "../../models/teacher/teacher_model.js";
import { devLog } from "../../utils/devlogger.js";

export const login = async (req, res) => {
  let funName = "auth Login fun..";

  try {
    const { username, password } = req.body;

    let userId = "";
    let userFullname = "";
    let userRole = "";

    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Username & password required" });
    }

    devLog(`${funName}`, { level: "r", data: req.body });

    // Check Teacher first
    const user = await TeacherAuthModel.findOne({ username });

    if (user) {
      const a = await TeacherProfile.findOne({ teacher_auth_id: user._id });
      const b = await TeachersBasicInfo.findOne({ teacher_id: a._id });

      userFullname = await a.full_name;
      userId = await a._id;
      userRole = b.role;
    }

    //    let role = "teacher";

    // Check Student if Teacher not found
    if (!user) {
      user = await StudentAuthInfo.findOne({ username });

       const a = await StudentProfile.findOne({ auth_info_id: user._id });
      const b = await StudentAuthInfo.findOne({ student_id: a._id });
      userFullname = await a.full_name;
      userId = await a._id;
      userRole = b.role;
    }

    // User not found
    if (!user) {
      devLog(`${funName}`, { level: "w", module: "user not found" });
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // devLog(`${funName}`, { level: "i", module: "prosess",data:user });
    // Password check
    const isMatch = (await password) === user?.password;

    // bugi hai >>
    // const isMatch = await bcrypt.compare(password, user?.password);

    if (!isMatch) {
      devLog(`${funName}`, { level: "w", module: "Password mismatch" });
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // JWT Token generation
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret123"
      //   { expiresIn: "1d" }
    );

    devLog(`${funName}`, { level: "s", module: ` login success` });

    return res.status(200).json({
      success: true,
    //   data: user,
        data: {
          userId: userId,
          fullName: userFullname,
          role:userRole,
          userName:user.username,
          userAuthId:user._id,
          // permissions: user.permissions || {}
        },
      token,
      message: "Login successfully",
    });
  } catch (error) {
    devLog(`${funName}`, { level: "err", data: error });
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

// }
