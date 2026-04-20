import express from "express";
import {
  createExperimentGroupController,
  getExperimentGroupsController,
  updateExperimentGroupController,
  deleteExperimentGroupController,
} from "../controllers/experimentGroup.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

// Group routes for one experiment
router.post("/", authenticateToken, createExperimentGroupController);
router.get("/", authenticateToken, getExperimentGroupsController);
router.put("/:groupId", authenticateToken, updateExperimentGroupController);
router.delete("/:groupId", authenticateToken, deleteExperimentGroupController);

export default router;