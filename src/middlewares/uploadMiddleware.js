import dayjs from "dayjs";
import fs from "fs-extra";
import multer from "multer";
import path from "path";
import sharp from "sharp";


import { customAlphabet } from "nanoid";


const nanoIDs = customAlphabet("1234567890ABCDEFGHIJKLMONPQRST", 8);


// ✅ Generate upload folder per student (once per request)
export const getUploadPath = function (req, type = "students") {
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

  // ✅ Ensure folder exists
  fs.ensureDirSync(baseFolder);

  // Save folder info to req so all files use the same folder
  req.uploadFolderPath = baseFolder;
  req.relativeBase = `/uploads/${type}`; 
//   req.relativeBase = `/uploads/${type}/${year}/${folderName}`;

  return {
    // fullPath: processFiles,
    fullPath: baseFolder,
    relativeBase: req.relativeBase,
  };
  // return {
  //   fullPath: processFiles,
  //   // fullPath: baseFolder,
  //   relativeBase: req.relativeBase,
  // };
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.body.role === "students" ? "students" : "staff";

    const { fullPath, relativeBase } = getUploadPath(req, type);

  req.uploadFolderPath = fullPath; // ✅ absolute path
  req.relativeBase = relativeBase;

    // req.uploadFolderPath = relativeBase;
    // req.relativeBase = relativeBase;

    cb(null, fullPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";

    const safeName = file.originalname
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_.-]/g, "");
    cb(null, `${Date.now()}-${safeName}.jpg`);
  },
});




const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // max 15MB
  fileFilter: (req, file, cb) => {
    cb(null, true); // allow all types (image/docs)
  },
});


// ✅ handles both images & documents
export const uploadFiles = upload.fields([
  { name: "profile_image", maxCount: 1 },
  { name: "father_image", maxCount: 1 },
  { name: "mother_image", maxCount: 1 },
  { name: "guardian_image", maxCount: 1 },
//   { name: "aadhar_card", maxCount: 1 },
//   { name: "mark_sheet_10th", maxCount: 1 },
//   { name: "mark_sheet_12th", maxCount: 1 },
//   { name: "transfer_certificate", maxCount: 1 },
]);



export const processFiles = async (req, res, next) => {
  try {
    if (!req.files) return next();


const results = {}; // Initialize results object

    for (const [field, files] of Object.entries(req.files)) {
      const file = files[0];
      const ext = path.extname(file.originalname).toLowerCase();

      if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        var optimizedName = `${path.parse(file.filename).name}-optimized.jpg`;
        const optimizedPath = path.join(req.uploadFolderPath, optimizedName);

        console.log("🔧 Resizing:", file.path, "→", optimizedPath);

 // Resize image using sharp
        await sharp(file.path)
          .resize(300, 300, { fit: "cover", position: "center" })
          .jpeg({ quality: 70 })
          .toFile(optimizedPath);

         
// Optionally, delete the original file after resizing
        // await fs.remove(file.path);

  const relativePath = `${req.relativeBase}/${optimizedName}`; 
  
  // Set the relative path for the resized image
        req.body[field] = relativePath;

        results[field] = relativePath;



        // req.body[field] = `${req.relativeBase}/${optimizedName}`;
      } else {

         const relativePath = `${req.relativeBase}/${file.filename}`;
        req.body[field] = relativePath;

        results[field] = relativePath;

        // req.body[field] = `${req.relativeBase}/${file.filename}`;
      }
    }
 console.log("📂 Uploaded & processed:", results);
 
    // relativeBase: req.relativeBase,

    console.log("📂 Uploaded & processed:", Object.keys(req.files || {}));
    next();
  } catch (err) {
    console.error("❌ Error in processFiles:", err);
    next(err);
  }
};
























