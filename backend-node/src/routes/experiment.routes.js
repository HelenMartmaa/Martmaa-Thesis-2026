import express from "express";
import {
  createExperimentController,
  getUserExperimentsController,
  getExperimentByIdController,
  updateExperimentController,
  deleteExperimentController,
} from "../controllers/experiment.controller.js";
import experimentGroupRoutes from "./experimentGroup.routes.js";
import experimentSubjectRoutes from "./experimentSubject.routes.js";
import experimentTeamMemberRoutes from "./experimentTeamMember.routes.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// All experiment routes require authentication
router.post("/", authenticateToken, createExperimentController);
router.get("/", authenticateToken, getUserExperimentsController);
router.get("/:id", authenticateToken, getExperimentByIdController);
router.put("/:id", authenticateToken, updateExperimentController);
router.delete("/:id", authenticateToken, deleteExperimentController);

router.use("/:experimentId/groups", experimentGroupRoutes);
router.use("/:experimentId/subjects", experimentSubjectRoutes);
router.use("/:experimentId/team-members", experimentTeamMemberRoutes);

export default router;