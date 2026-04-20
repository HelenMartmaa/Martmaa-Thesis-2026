import express from "express";
import {
  createExperimentTeamMemberController,
  getExperimentTeamMembersController,
  updateExperimentTeamMemberController,
  deleteExperimentTeamMemberController,
} from "../controllers/experimentTeamMember.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

// Team member routes for one experiment
router.post("/", authenticateToken, createExperimentTeamMemberController);
router.get("/", authenticateToken, getExperimentTeamMembersController);
router.put("/:memberId", authenticateToken, updateExperimentTeamMemberController);
router.delete("/:memberId", authenticateToken, deleteExperimentTeamMemberController);

export default router;
