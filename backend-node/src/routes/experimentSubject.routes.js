import express from "express";

import {
  createExperimentSubjectController,
  getExperimentSubjectsController,
} from "../controllers/experimentSubject.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

// Subject routes for one experiment
router.post("/", authenticateToken, createExperimentSubjectController);
router.get("/", authenticateToken, getExperimentSubjectsController);

export default router;
