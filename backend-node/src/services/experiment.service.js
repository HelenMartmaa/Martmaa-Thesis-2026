import {
  createExperiment,
  getExperimentsByUserId,
  getExperimentByIdAndUserId,
} from "../repositories/experiment.repository.js";

// Validates and creates a new experiment
const createExperimentService = async ({ title, experimentType, description, userId }) => {
  const trimmedTitle = title?.trim();
  const trimmedType = experimentType?.trim();

  if (!trimmedTitle || !trimmedType) {
    throw new Error("Title and experiment type are required.");
  }

  if (!["in vivo", "in vitro"].includes(trimmedType)) {
    throw new Error("Experiment type must be either 'in vivo' or 'in vitro'.");
  }

  return createExperiment({
    title: trimmedTitle,
    experimentType: trimmedType,
    description: description?.trim() || null,
    userId,
  });
};

// Returns one experiment for the authenticated user
const getExperimentByIdService = async (experimentId, userId) => {
  const parsedId = Number(experimentId);

  if (!parsedId || Number.isNaN(parsedId)) {
    throw new Error("Invalid experiment id.");
  }

  const experiment = await getExperimentByIdAndUserId(parsedId, userId);

  if (!experiment) {
    throw new Error("Experiment not found.");
  }

  return experiment;
};

// Returns all experiments for one authenticated user
const getUserExperimentsService = async (userId) => {
  return getExperimentsByUserId(userId);
};

export { createExperimentService, getUserExperimentsService, getExperimentByIdService };