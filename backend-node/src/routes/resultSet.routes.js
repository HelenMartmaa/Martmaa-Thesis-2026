import express from "express";
import {
  createResultSetController,
  getUserResultSetsController,
  getResultSetByIdController,
  updateResultSetController,
  deleteResultSetController
} from "../controllers/resultSet.controller.js";
import resultEntryRoutes from "./resultEntry.routes.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// All result set routes require authentication
router.post("/", authenticateToken, createResultSetController);
router.get("/", authenticateToken, getUserResultSetsController);
router.get("/:id", authenticateToken, getResultSetByIdController);
router.put("/:id", authenticateToken, updateResultSetController);
router.delete("/:id", authenticateToken, deleteResultSetController);

router.use("/:resultSetId/entries", resultEntryRoutes);

export default router;