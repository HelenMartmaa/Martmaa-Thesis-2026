import {
  createExperiment,
  getExperimentsByUserId,
  getExperimentByIdAndUserId,
} from "../repositories/experiment.repository.js";

// Validates and creates a new experiment
const createExperimentService = async ({
  title,
  description,
  aim,
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
  hypotheses,
  userId,
}) => {
  const trimmedTitle = title?.trim();
  const trimmedDescription = description?.trim();
  const trimmedAim = aim?.trim();
  const normalizedType = experimentType?.trim();
  const trimmedOrganismName = organismName?.trim();
  const trimmedMethodsText = methodsText?.trim();
  const normalizedStatus = status?.trim();

  if (
    !trimmedTitle ||
    !trimmedDescription ||
    !trimmedAim ||
    !normalizedType ||
    !trimmedOrganismName ||
    !trimmedMethodsText ||
    !normalizedStatus
  ) {
    throw new Error(
      "Title, description, aim, experiment type, organism name, methods, and status are required."
    );
  }

  if (!["in_vivo", "in_vitro"].includes(normalizedType)) {
    throw new Error("Experiment type must be either 'in_vivo' or 'in_vitro'.");
  }

  if (!["planned", "completed"].includes(normalizedStatus)) {
    throw new Error("Status must be either 'planned' or 'completed'.");
  }

  const cleanedHypotheses = (hypotheses || [])
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  if (cleanedHypotheses.length === 0) {
    throw new Error("At least one hypothesis is required.");
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
    description: trimmedDescription,
    aim: trimmedAim,
    experimentType: normalizedType,
    organismName: trimmedOrganismName,
    startDate: parsedStartDate,
    endDate: parsedEndDate,
    scheduleNotes: scheduleNotes?.trim() || null,
    methodsText: trimmedMethodsText,
    resourcesText: resourcesText?.trim() || null,
    treatmentPlanText: treatmentPlanText?.trim() || null,
    notes: notes?.trim() || null,
    status: normalizedStatus,
    hypotheses: cleanedHypotheses,
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