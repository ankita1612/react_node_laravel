import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import ApiError from "../utils/api.error";

const uploadPath = "uploads";

// Ensure upload folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, uploadPath);
  },

  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${crypto.randomUUID()}${ext}`;

    cb(null, uniqueName);
  },
});

const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb
) => {
  // =========================
  // PHOTO VALIDATION
  // =========================
  if (file.fieldname === "photos") {
    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    const ext = path
      .extname(file.originalname)
      .toLowerCase();

    const allowedExt = [
      ".jpg",
      ".jpeg",
      ".png",
    ];

    if (
      !allowedImageTypes.includes(file.mimetype)
    ) {
      return cb(
        new ApiError(
          "Only JPG, JPEG and PNG images allowed",
          400
        ) as any,
        false
      );
    }

    if (!allowedExt.includes(ext)) {
      return cb(
        new ApiError(
          "Invalid image extension",
          400
        ) as any,
        false
      );
    }

    return cb(null, true);
  }

  // =========================
  // BROCHURE VALIDATION
  // =========================
  if (file.fieldname === "brochure") {
    const ext = path
      .extname(file.originalname)
      .toLowerCase();

    if (
      file.mimetype !== "application/pdf"
    ) {
      return cb(
        new ApiError(
          "Only PDF allowed for brochure",
          400
        ) as any,
        false
      );
    }

    if (ext !== ".pdf") {
      return cb(
        new ApiError(
          "Invalid brochure extension",
          400
        ) as any,
        false
      );
    }

    return cb(null, true);
  }

  // =========================
  // UNKNOWN FIELD
  // =========================
  return cb(
    new ApiError("Invalid upload field", 400) as any,
    false
  );
};

export const multi_upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10,
  },
});