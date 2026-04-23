import express from "express";
import { createStatisticalAnalysisController, getUserStatisticalAnalysesController, getStatisticalAnalysisByIdController, deleteStatisticalAnalysisController } from "../controllers/statisticalAnalysis.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateToken, createStatisticalAnalysisController);
router.get("/", authenticateToken, getUserStatisticalAnalysesController);
router.get("/:id", authenticateToken, getStatisticalAnalysisByIdController);
router.delete("/:id", authenticateToken, deleteStatisticalAnalysisController);

export default router;