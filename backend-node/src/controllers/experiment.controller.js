import {
  createExperimentService,
  getUserExperimentsService,
  getExperimentByIdService,
  updateExperimentService,
  updateExperimentNotesService,
  deleteExperimentService,
} from "../services/experiment.service.js";
import { hasLockedAnalysisForExperiment } from "../repositories/experiment.repository.js";

// Handles request for creating a new experiment
const createExperimentController = async (req, res) => {
  try {
    const experiment = await createExperimentService({
      ...req.body,
      userId: req.user.userId, // token payload contains userId, not id
    });

    return res.status(201).json({
      message: "Experiment created successfully.",
      experiment,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

// Handles request for loading saved experiments for the current specific user
const getUserExperimentsController = async (req, res) => {
  try {
    const experiments = await getUserExperimentsService(req.user.userId);

    return res.status(200).json({
      experiments,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to load experiments.",
    });
  }
};

// Handles request for loading one experiment by id
const getExperimentByIdController = async (req, res) => {
  try {
    const experiment = await getExperimentByIdService(
      req.params.id,
      req.user.userId
    );

    return res.status(200).json({
      experiment,
    });
  } catch (error) {
    return res.status(404).json({
      error: error.message,
    });
  }
};

// Handles request for updating one experiment by id
const updateExperimentController = async (req, res) => {
  try {
    const locked = await hasLockedAnalysisForExperiment(
      req.params.id,
      req.user.userId
    );

    if (locked) {
      const experiment = await updateExperimentNotesService({
        experimentId: req.params.id,
        userId: req.user.userId,
        notes: req.body.notes,
      });

      return res.status(200).json({
        message:
          "Only general notes were updated because this experiment is linked to an analyzed dataset.",
        experiment,
        limitedEdit: true,
      });
    }

    const experiment = await updateExperimentService({
      experimentId: req.params.id,
      userId: req.user.userId,
      ...req.body,
    });

    return res.status(200).json({
      message: "Experiment updated successfully.",
      experiment,
      limitedEdit: false,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

// Handles request for deleting one experiment by id
const deleteExperimentController = async (req, res) => {
  try {
    await deleteExperimentService(req.params.id, req.user.userId);

    return res.status(200).json({
      message: "Experiment deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

export { createExperimentController, getUserExperimentsController, getExperimentByIdController, updateExperimentController, deleteExperimentController };