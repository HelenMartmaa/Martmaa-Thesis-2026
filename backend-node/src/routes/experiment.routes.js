import express from "express";
import {
  createExperimentController,
  getUserExperimentsController,
  getExperimentByIdController,
  updateExperimentController,
  deleteExperimentController,
} from "../controllers/experiment.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// All experiment routes require authentication
router.post("/", authenticateToken, createExperimentController);
router.get("/", authenticateToken, getUserExperimentsController);
router.get("/:id", authenticateToken, getExperimentByIdController);
router.put("/:id", authenticateToken, updateExperimentController);
router.delete("/:id", authenticateToken, deleteExperimentController);

export default router;