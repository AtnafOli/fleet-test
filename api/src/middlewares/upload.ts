import multer from "multer";
import path from "path";
import { NextFunction, Request, Response } from "express";

// Define custom error messages
export const UPLOAD_MESSAGES = {
  LIMIT_FILE_SIZE: "File size too large. Maximum size is 5MB",
  LIMIT_FILE_COUNT: "Too many files. Maximum is 5 files",
  INVALID_FILE_TYPE: "Invalid file type. Only images are allowed",
};

// Custom file filter type
type FileFilterCallback = (error: Error | null, acceptFile?: boolean) => void;

// Storage configuration
const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, "tmp/uploads/");
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter configuration
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error(UPLOAD_MESSAGES.INVALID_FILE_TYPE));
  }
};

// Create multer instance with configuration
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5,
  },
});

// Error handler middleware
export const handleUploadErrors = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: UPLOAD_MESSAGES.LIMIT_FILE_SIZE });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ error: UPLOAD_MESSAGES.LIMIT_FILE_COUNT });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};
