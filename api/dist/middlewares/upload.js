"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUploadErrors = exports.upload = exports.UPLOAD_MESSAGES = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Define custom error messages
exports.UPLOAD_MESSAGES = {
    LIMIT_FILE_SIZE: "File size too large. Maximum size is 5MB",
    LIMIT_FILE_COUNT: "Too many files. Maximum is 5 files",
    INVALID_FILE_TYPE: "Invalid file type. Only images are allowed",
};
// Storage configuration
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "tmp/uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
    },
});
// File filter configuration
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new Error(exports.UPLOAD_MESSAGES.INVALID_FILE_TYPE));
    }
};
// Create multer instance with configuration
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 5,
    },
});
// Error handler middleware
const handleUploadErrors = (err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: exports.UPLOAD_MESSAGES.LIMIT_FILE_SIZE });
        }
        if (err.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({ error: exports.UPLOAD_MESSAGES.LIMIT_FILE_COUNT });
        }
        return res.status(400).json({ error: err.message });
    }
    if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
};
exports.handleUploadErrors = handleUploadErrors;
