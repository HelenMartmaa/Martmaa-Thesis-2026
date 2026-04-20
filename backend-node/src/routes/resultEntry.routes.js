import express from "express";
import {
  createResultEntryController,
  getResultEntriesController
} from "../controllers/resultEntry.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

// Result entry routes for one result set
router.post("/", authenticateToken, createResultEntryController);
router.get("/", authenticateToken, getResultEntriesController);

export default router;