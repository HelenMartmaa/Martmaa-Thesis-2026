import {
  createExperiment,
  getExperimentsByUserId,
  getExperimentByIdAndUserId,
} from "../repositories/experiment.repository.js";

// Validates and creates a new experiment
const createExperimentService = async ({
  title,
  experimentType,
  organismName,
  startDate,
  endDate,
  scheduleNotes,
  methodsText,
  resourcesText,
  treatmentPlanText,
  notes,
  status,
  userId,
}) => {
  const trimmedTitle = title?.trim();
  const normalizedType = experimentType?.trim();
  const normalizedStatus = status?.trim();

  if (!trimmedTitle || !normalizedType || !normalizedStatus) {
    throw new Error("Title, experiment type, and status are required.");
  }

  if (!["in_vivo", "in_vitro"].includes(normalizedType)) {
    throw new Error("Experiment type must be either 'in_vivo' or 'in_vitro'.");
  }

  if (!["planned", "completed"].includes(normalizedStatus)) {
    throw new Error("Status must be either 'planned' or 'completed'.");
  }

  // Convert HTML date input strings into Date objects for Prisma
  const parsedStartDate = startDate ? new Date(startDate) : null;
  const parsedEndDate = endDate ? new Date(endDate) : null;

  // End date check, can't be before start date
  if (parsedStartDate && parsedEndDate && parsedEndDate < parsedStartDate) {
    throw new Error("End date cannot be eralier than start date.");
  }

  return createExperiment({
    title: trimmedTitle,
    experimentType: normalizedType,
    organismName: organismName?.trim() || null,
    startDate: parsedStartDate,
    endDate: parsedEndDate,
    scheduleNotes: scheduleNotes?.trim() || null,
    methodsText: methodsText?.trim() || null,
    resourcesText: resourcesText?.trim() || null,
    treatmentPlanText: treatmentPlanText?.trim() || null,
    notes: notes?.trim() || null,
    status: normalizedStatus,
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