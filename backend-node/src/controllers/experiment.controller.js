import {
  createExperimentService,
  getUserExperimentsService,
} from "../services/experiment.service.js";

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

export { createExperimentController, getUserExperimentsController };