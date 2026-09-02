import { Router } from "express";
import {
  getPublicScripts,
  getPublicScriptBySlug,
  downloadScriptFile,
  getPublicCategories,
  getPublicTags,
  getFeaturedScripts,
  submitPublicScript,
  submitReport
} from "../controllers/public";
import { uploadScriptFile } from "../middleware/upload";

const router = Router();

// Public Discovery & Reading APIs
router.get("/scripts", getPublicScripts);
router.get("/scripts/:slug", getPublicScriptBySlug);
router.get("/scripts/:id/download", downloadScriptFile);
router.get("/categories", getPublicCategories);
router.get("/tags", getPublicTags);
router.get("/featured", getFeaturedScripts);

// Public Interactions
router.post("/submissions", uploadScriptFile.single("file"), submitPublicScript);
router.post("/reports", submitReport);

export default router;

