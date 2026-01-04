import multer from "multer";
import path from "path";
import fs from "fs";
import { customAlphabet } from "nanoid";
import sharp from "sharp";


const nanoIDs = customAlphabet("1234567890ABCDEFGHIJKLMONPQRST", 8);

/**
 * @param {string} folderName - Upload directory (inside /uploads)
 * @param {string[]} fields - Array of field names (e.g. ['profile_image','father_image'])
 */

export const createUploadMiddleware =  (folderName,fields = []) => {
 
  
  // 1️⃣ Create folder dynamically
  const uploadDir = path.join(process.cwd(), "uploads", folderName);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // 2️⃣ Multer storage config
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      // call nanoIDs() — it’s a function, not a string!
      const now = new Date();
      // Format: YYYYMMDD
      const dateStr = `${now.getFullYear()}${String(
        now.getMonth() + 1
      ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;

      const uniqueName = `img-${nanoIDs()}-${dateStr}${ext}`;
      cb(null, uniqueName);
    },
  });

  // 3️⃣ File type filter
  const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only .jpg, .png, or .webp images are allowed!"));
  };

  // 4️⃣ Multer instance
  const upload = multer({
    storage,
    // limits: { fileSize: 200 * 1024 }, // 200 KB limit
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter,
  }).fields(fields.map((name) => ({ name, maxCount: 1 }))); // Change field name if needed
  // }).single("profile_image"); // Change field name if needed

  // 5️⃣ Middleware to compress image after upload
  return async (req, res, next) => {
    upload(req, res, async function (err) {
      if (err) return next(err);

      try {
           // req.files = { profile_image: [File], father_image: [File], ... }
        if (req.files) {
          for (const fieldName of Object.keys(req.files)) {
            const fileArray = req.files[fieldName];
            for (const file of fileArray) {
              const inputPath = file.path;
              const tempPath = path.join(path.dirname(inputPath), `temp-${file.filename}`);

              // 🧠 Compress and resize
              await sharp(inputPath)
                .resize({ width: 350, height: 350, position: "center" })
                .jpeg({ quality: 60 })
                .toFile(tempPath);

                 console.log("Uploaded files:", req.files); // <--- Add this
            //  fs.unlinkSync(inputPath);
// fs.renameSync(tempPath, inputPath);
            }
          }
        }
        next();
      } catch (error) {
        console.error("❌ Image processing error:", error);
        next(error);
      }

      // if (req.file) {
      //   const inputPath = req.file.path;
      //   const tempPath = path.join(
      //     path.dirname(inputPath),
      //     `temp-` + req.file.filename
      //   ); // overwrite same file

      //   try {
      //     await sharp(inputPath)
      //       .resize({ width: 350, height: 350, position: "center" }) // optional, max width
      //       .jpeg({ quality: 60 }) // compress jpeg
      //       .toFile(tempPath);

      //     // Replace original file safely
      //     fs.unlinkSync(inputPath);
      //     fs.renameSync(tempPath, inputPath);

      //     // If PNG/WebP, you can do similar:
      //     // sharp(inputPath).webp({ quality: 70 }).toFile(outputPath);
      //   } catch (error) {
      //     return next(error);
      //   }
      // }
    });
  };
};
// onl v1
//   return async (req, res, next) => {
//     upload(req, res, async function (err) {
//       if (err) return next(err);

//       if (req.file) {
//         const inputPath = req.file.path;
//         const tempPath = path.join(
//           path.dirname(inputPath),
//           `temp-` + req.file.filename
//         ); // overwrite same file

//         try {
//           await sharp(inputPath)
//             .resize({ width: 350, height: 350, position: "center" }) // optional, max width
//             .jpeg({ quality: 60 }) // compress jpeg
//             .toFile(tempPath);

//           // Replace original file safely
//           fs.unlinkSync(inputPath);
//           fs.renameSync(tempPath, inputPath);

//           // If PNG/WebP, you can do similar:
//           // sharp(inputPath).webp({ quality: 70 }).toFile(outputPath);
//         } catch (error) {
//           return next(error);
//         }
//       }
//       next();
//     });
//   };
// };

//  return (req, res, next) => {
//     upload(req, res, function (err) {
//       if (err) return next(err);
//       next();
//     });
//   };

//  return async (req, res, next) => {
//     upload(req, res, async function (err) {
//       if (err) return next(err);

//       if (req.file) {
//         const inputPath = req.file.path;
//         const tempPath = path.join(path.dirname(inputPath), `temp-` + req.file.filename); // overwrite same file

//      try {
//           await sharp(inputPath)
//             .resize({ width: 350 ,height:350 ,position: "center" ,}) // optional, max width
//             .jpeg({ quality: 60 }) // compress jpeg
//             .toFile(tempPath);

//              // Replace original file safely
//           fs.unlinkSync(inputPath);
//           fs.renameSync(tempPath, inputPath);

//           // If PNG/WebP, you can do similar:
//           // sharp(inputPath).webp({ quality: 70 }).toFile(outputPath);
//         } catch (error) {
//           return next(error);
//         }
//       }
//       next();
//     });
//   };
