import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { analyzeCareerController, getCareerRolesController } from "../controllers/career.controller.js";
const router = Router();
router.get("/", getCareerRolesController);
router.get("/:roleId/analyze", authenticate, analyzeCareerController);
export default router;
