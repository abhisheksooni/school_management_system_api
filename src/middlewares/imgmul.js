import dayjs from "dayjs";
import fs from "fs-extra";
import multer from "multer";
import path from "path";
import sharp from "sharp";
import { customAlphabet } from "nanoid";

const nanoIDs = customAlphabet("1234567890ABCDEFGHIJKLMONPQRST", 8);
const nanoIDsShort = customAlphabet("1234567890ABCD", 6);

// ✅ Unified middleware for upload + process + set paths
export const uploadAndProcessFiles = (type = "staff") => {
  // Multer storage config
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const now = dayjs();
      const year = now.format("YYYY");
      const firstName = req.body.first_name || "unknown";
      const lastName = req.body.last_name || "";
      const fullName = `${firstName}_${lastName}`.trim().replace(/\s+/g, "_");

      const sku = req.body.sku?.trim().replace(/\s+/g, "_");
      const folderName = sku && fullName
        ? `${sku}_${fullName}`
        : `user_${fullName}_${now.format("YYYYMMDD_")}${nanoIDs()}`;

      const baseFolder = path.join(process.cwd(), "uploads", type);
      fs.ensureDirSync(baseFolder);

      req.uploadFolderPath = baseFolder;
      req.relativeBase = `/uploads/${type}/${year}`;

      cb(null, baseFolder);
    },
    filename: (req, file, cb) => {
      const safeName = file.originalname
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_.-]/g, "");
      cb(null, `${Date.now()}-${safeName}`);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  });

  const fields = [
    { name: "profile_image", maxCount: 1 },
    { name: "father_image", maxCount: 1 },
    { name: "mother_image", maxCount: 1 },
    { name: "guardian_image", maxCount: 1 },
  ];

  // Return combined middleware
  return [
    upload.fields(fields),
    async (req, res, next) => {
      try {
        if (!req.files) return next();

        const results = {};

        for (const [field, files] of Object.entries(req.files)) {
          const file = files[0];
          const ext = path.extname(file.originalname).toLowerCase();

          if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
            const optimizedName = `${path.parse(file.filename).name}-optimized.jpg`;
            const optimizedPath = path.join(req.uploadFolderPath, optimizedName);

            await sharp(file.path)
              .resize(300, 300, { fit: "cover", position: "center" })
              .jpeg({ quality: 70 })
              .toFile(optimizedPath);

            await fs.remove(file.path); // remove original

            const relativePath = `${req.relativeBase}/${optimizedName}`;
            req.body[field] = relativePath;
            results[field] = relativePath;
          } else {
            const relativePath = `${req.relativeBase}/${file.filename}`;
            req.body[field] = relativePath;
            results[field] = relativePath;
          }
        }

        console.log("📂 Uploaded & processed:", results);
        next();
      } catch (err) {
        console.error("❌ Error processing files:", err);
        return res.status(500).json({ message: "Error processing files", error: err.message });
      }
    },
  ];
};

// ✅ Teacher controller
// export const createTeacherAllDataController = async (req, res) => {
//   try {
//     const {
//       first_name,
//       last_name,
//       subject,
//       phone_no,
//       school_class_id,
//       gender,
//       dob,
//       qualifications,
//       role,
//       address,
//       years_of_experience,
//       salary,
//       joined_date,
//       studentCreatePermissionStatus,
//       studentAttendanceStatus,
//     } = req.body;

//     const profile_image = req.body.profile_image || "";

//     const teacherProfile = await TeacherProfile.create({
//       full_name: `${first_name} ${last_name}`,
//       subject,
//       name: { first: first_name || null, last: last_name || null },
//       school_class_ids: school_class_id || null,
//       teacher_phone_no: phone_no || null,
//       profile_image,
//     });

//     const teachersBasicInfo = await TeachersBasicInfo.create({
//       teacher_id: teacherProfile._id,
//       qualifications,
//       years_of_experience,
//       gender,
//       date_of_birth: dob,
//       address,
//       joined_at: new Date(joined_date),
//       role,
//     });

//     teacherProfile.basic_info_id = teachersBasicInfo._id;

//     const teacherAuth = await TeacherAuthModel.create({
//       username: `${first_name}${teacherProfile.teacher_code}`,
//       password: `${first_name}${nanoIDsShort()}`,
//       addStudentPermissionStatus: studentCreatePermissionStatus,
//       studentAttendanceStatus: studentAttendanceStatus,
//     });

//     teacherProfile.teacher_auth_id = teacherAuth._id;

//     const staffSalary = await StaffSalary.create({
//       teacher_id: teacherProfile._id,
//       base_salary: salary,
//     });

//     teacherProfile.staff_Salary_id = staffSalary._id;
//     await teacherProfile.save();

//     return res.status(201).json({
//       success: true,
//       message: "Teacher Profile created successfully",
//       data: teacherProfile,
//       teachersBasicInfo,
//       teacherAuth,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Teacher creation error", error: error.message });
//   }
// };
