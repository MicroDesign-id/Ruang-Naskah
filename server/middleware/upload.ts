import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");
const DOCUMENTS_DIR = path.join(UPLOADS_DIR, "documents");
const COVERS_DIR = path.join(UPLOADS_DIR, "covers");

// Ensure directories exist
[UPLOADS_DIR, DOCUMENTS_DIR, COVERS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Allowed document MIME types and extensions
const ALLOWED_DOC_MIMES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword"
];

const ALLOWED_IMAGE_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp"
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "cover" || file.fieldname === "cover_image") {
      cb(null, COVERS_DIR);
    } else {
      cb(null, DOCUMENTS_DIR);
    }
  },
  filename: (req, file, cb) => {
    // Generate secure randomized unique filename to avoid path traversal and name collisions
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ext.replace(/[^a-z0-9.]/g, "");
    const uniqueId = crypto.randomUUID();
    cb(null, `${uniqueId}${safeExt}`);
  }
});

export const uploadScriptFile = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB limit as specified in PRD & SRS
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "cover" || file.fieldname === "cover_image") {
      if (ALLOWED_IMAGE_MIMES.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Format cover harus berupa gambar JPG, PNG, atau WEBP."));
      }
    } else if (file.fieldname === "file" || file.fieldname === "document" || file.fieldname === "script_file") {
      const ext = path.extname(file.originalname).toLowerCase();
      if ((ALLOWED_DOC_MIMES.includes(file.mimetype) || file.mimetype === "application/octet-stream") && 
          (ext === ".pdf" || ext === ".docx" || ext === ".doc")) {
        cb(null, true);
      } else {
        cb(new Error("Format naskah harus berupa dokumen PDF atau DOCX."));
      }
    } else {
      cb(null, true);
    }
  }
});

