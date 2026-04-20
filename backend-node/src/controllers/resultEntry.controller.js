import {
  createResultEntryService,
  getResultEntriesService,
} from "../services/resultEntry.service.js";

// Handles request for creating a new result entry
const createResultEntryController = async (req, res) => {
  try {
    const entry = await createResultEntryService({
      resultSetId: req.params.resultSetId,
      userId: req.user.userId,
      ...req.body,
    });

    return res.status(201).json({
      message: "Result entry created successfully.",
      entry,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

// Handles request for loading all entries of one result set
const getResultEntriesController = async (req, res) => {
  try {
    const entries = await getResultEntriesService({
      resultSetId: req.params.resultSetId,
      userId: req.user.userId,
    });

    return res.status(200).json({
      entries,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

export { createResultEntryController, getResultEntriesController };