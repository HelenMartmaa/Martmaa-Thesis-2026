import express from "express";

import {
  createExperimentTeamMemberController,
  getExperimentTeamMembersController,
} from "../controllers/experimentTeamMember.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

// Team member routes for one experiment
router.post("/", authenticateToken, createExperimentTeamMemberController);
router.get("/", authenticateToken, getExperimentTeamMembersController);

export default router;
