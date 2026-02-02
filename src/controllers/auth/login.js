import jwt from "jsonwebtoken";
import {
  StudentAuthInfo,
  StudentProfile,
} from "../../models/student/student_model.js";
import {
  TeacherAuthModel,
  TeacherProfile,
  TeachersBasicInfo,
} from "../../models/teacher/teacher_model.js";
import { devLog } from "../../utils/devlogger.js";

export const login = async (req, res) => {
  let funName = "auth Login";

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Username & password required" });
    }

    devLog(`${funName}`, { level: "r", data: req.body });

    let userAuth = null;
    let userRole = "";
    let userId = "";
    let userFullname = "";
    let profile_image = "";

    // Check Teacher first
    userAuth = await TeacherAuthModel.findOne({ username });

    if (userAuth) {
      const profile = await TeacherProfile.findOne({
        teacher_auth_id: userAuth._id,
      });
      const basicInfo = await TeachersBasicInfo.findOne({
        teacher_id: profile._id,
      });
  
      userId = profile._id;
      userFullname = profile.full_name;
       profile_image = profile?.profile_image;
      userRole = basicInfo.role || "admin";
    }
    if (userAuth) {
      const profile = await TeacherProfile.findOne({
        teacher_auth_id: userAuth._id,
      });
      const basicInfo = await TeachersBasicInfo.findOne({
        teacher_id: profile._id,
      });
  
      userId = profile._id;
      userFullname = profile.full_name;
       profile_image = profile?.profile_image;
      userRole = basicInfo.role || "teacher";
    }

    // If not teacher → check student
    if (!userAuth) {
      userAuth = await StudentAuthInfo.findOne({ username });

      if (userAuth) {
        const profile = await StudentProfile.findOne({
          auth_info_id: userAuth._id,
        });

        userFullname = profile.full_name;
        profile_image = profile?.profile_image;
        userId = profile._id;
        userRole = userAuth.role || "student";
      }
    }

    // User not found
    if (!userAuth) {
      devLog(`${funName}`, { level: "w", module: "user not found" });
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    
    // Password check
    const isMatch = (await password) == userAuth?.password;
    // const isMatch = await bcrypt.compare(password, userAuth.password);
    // bugi hai >>
  
    if (!isMatch) {
      devLog(`${funName}`, { level: "w", module: "Password mismatch- Invalid credentials" });
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // JWT Token generation
    const token = jwt.sign(
      
    {  userAuthId:userAuth._id,
      role:userRole,
    },
    process.env.JWT_SECRET || "secret123"
      //   { expiresIn: "1d" }
    );

    devLog(`${funName}`, { level: "s", module: ` login success` });

    return res.status(200).json({
      success: true,
  
      user: {
        userId: userId,
        fullName: userFullname,
        profile_image: profile_image,
        role: userRole,
        userName: userAuth.username,
        userAuthId: userAuth._id,
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
