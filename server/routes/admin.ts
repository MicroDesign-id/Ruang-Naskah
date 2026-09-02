import { Router } from "express";
import {
  adminLogin,
  adminLogout,
  adminMe,
  getAdminDashboard,
  getAdminScripts,
  createAdminScript,
  getScriptById,
  getAdminScriptById,
  updateAdminScript,
  trashAdminScript,
  restoreAdminScript,
  permanentDeleteAdminScript,
  getAdminSubmissions,
  getAdminSubmissionById,
  approveAdminSubmission,
  rejectAdminSubmission,
  getAdminCategories,
  saveAdminCategory,
  deleteAdminCategory,
  getAdminTags,
  saveAdminTag,
  deleteAdminTag,
  getAdminReports,
  updateReportStatus,
  unpublishReportedScript,
  getAdminAuditLogs,
  handleAdminUpload
} from "../controllers/admin";
import { requireAdmin } from "../middleware/auth";
import { uploadScriptFile } from "../middleware/upload";

const router = Router();

// Auth Routes
router.post("/login", adminLogin);
router.post("/logout", adminLogout);
router.get("/me", requireAdmin, adminMe);

// Dashboard
router.get("/dashboard", requireAdmin, getAdminDashboard);

// Scripts Management
router.get("/scripts", requireAdmin, getAdminScripts);
router.post("/scripts", requireAdmin, createAdminScript);
router.get("/scripts/:id", requireAdmin, getAdminScriptById);
router.put("/scripts/:id", requireAdmin, updateAdminScript);
router.delete("/scripts/:id", requireAdmin, trashAdminScript);
router.post("/scripts/:id/restore", requireAdmin, restoreAdminScript);
router.delete("/scripts/:id/permanent", requireAdmin, permanentDeleteAdminScript);

// Submissions Review
router.get("/submissions", requireAdmin, getAdminSubmissions);
router.get("/submissions/:id", requireAdmin, getAdminSubmissionById);
router.post("/submissions/:id/approve", requireAdmin, approveAdminSubmission);
router.post("/submissions/:id/reject", requireAdmin, rejectAdminSubmission);

// Categories
router.get("/categories", requireAdmin, getAdminCategories);
router.post("/categories", requireAdmin, saveAdminCategory);
router.delete("/categories/:id", requireAdmin, deleteAdminCategory);

// Tags
router.get("/tags", requireAdmin, getAdminTags);
router.post("/tags", requireAdmin, saveAdminTag);
router.delete("/tags/:id", requireAdmin, deleteAdminTag);

// Reports
router.get("/reports", requireAdmin, getAdminReports);
router.put("/reports/:id/status", requireAdmin, updateReportStatus);
router.post("/reports/:id/unpublish-script", requireAdmin, unpublishReportedScript);

// Audit Logs
router.get("/audit-logs", requireAdmin, getAdminAuditLogs);

// Admin File Uploads
router.post("/upload/cover", requireAdmin, uploadScriptFile.single("cover"), handleAdminUpload);
router.post("/upload/document", requireAdmin, uploadScriptFile.single("file"), handleAdminUpload);

export default router;

