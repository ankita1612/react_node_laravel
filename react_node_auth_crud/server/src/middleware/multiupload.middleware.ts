import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import ApiError from "../utils/api.error";

//const uploadPath = path.join(__dirname, "..", "..", "uploads");
const uploadPath ="uploads"

// Ensure folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadPath),

  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${crypto.randomUUID()}${ext}`;
    cb(null, uniqueName);
  },
});

// Secure file filter
const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  const ext = path.extname(file.originalname).toLowerCase();

  // Check MIME type
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new ApiError("Only JPG and PNG images allowed", 400) as any, false);
  }

  // Check extension
  if (![".jpg", ".jpeg", ".png"].includes(ext)) {
    return cb(new ApiError("Invalid file extension", 400) as any, false);
  }

  cb(null, true); // file accepted
};

export const multi_upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 5,                  // Max 5 files
  },
});