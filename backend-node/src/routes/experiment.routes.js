import express from "express";
import {
  createExperimentController,
  getUserExperimentsController,
} from "../controllers/experiment.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// All experiment routes require authentication
router.post("/", authenticateToken, createExperimentController);
router.get("/", authenticateToken, getUserExperimentsController);

export default router;