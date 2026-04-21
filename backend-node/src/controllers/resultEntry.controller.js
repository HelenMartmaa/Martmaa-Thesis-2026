import {
  createResultEntryService,
  getResultEntriesService,
  updateResultEntryService,
  deleteResultEntryService,
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

// Handles request for updating one result entry
const updateResultEntryController = async (req, res) => {
  try {
    const entry = await updateResultEntryService({
      resultSetId: req.params.resultSetId,
      entryId: req.params.entryId,
      userId: req.user.userId,
      ...req.body,
    });

    return res.status(200).json({
      message: "Result entry updated successfully.",
      entry,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

// Handles request for deleting one result entry
const deleteResultEntryController = async (req, res) => {
  try {
    await deleteResultEntryService({
      resultSetId: req.params.resultSetId,
      entryId: req.params.entryId,
      userId: req.user.userId,
    });

    return res.status(200).json({
      message: "Result entry deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

export {
  createResultEntryController,
  getResultEntriesController,
  updateResultEntryController,
  deleteResultEntryController
};