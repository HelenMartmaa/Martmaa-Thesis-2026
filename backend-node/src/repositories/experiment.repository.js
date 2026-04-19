import prisma from "../config/prisma.js";

// Creates a new experiment that will be saved in database
const createExperiment = async ({
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
  return prisma.experiment.create({
    data: {
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
      userId,
      hypotheses: {
        create: hypotheses.map((hypothesisText) => ({
          hypothesisText,
        })),
      },
    },
    include: {
      hypotheses: true,
    },
  });
};

// Returns all experiments that belong to one user
const getExperimentsByUserId = async (userId) => {
  return prisma.experiment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

// Returns one experiment by its id and owner user id
const getExperimentByIdAndUserId = async (experimentId, userId) => {
  return prisma.experiment.findFirst({
    where: {
      id: experimentId,
      userId,
    },
    include: {
      hypotheses: true,
    },
  });
};

// Updates one specific experiment and replaces its hypotheses
const updateExperimentByIdAndUserId = async ({
  experimentId,
  userId,
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
}) => {
  const existingExperiment = await prisma.experiment.findFirst({
    where: {
      id: experimentId,
      userId,
    },
  });

  if (!existingExperiment) {
    throw new Error("Experiment not found.");
  }

  return prisma.experiment.update({
    where: {
      id: experimentId,
    },
    data: {
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
      // Replace hypotheses fully on update for simpler state management
      hypotheses: {
        deleteMany: {},
        create: hypotheses.map((hypothesisText) => ({
          hypothesisText,
        })),
      },
    },
    include: {
      hypotheses: true,
    },
  });
};

// Deletes specific one experiment owned by the authenticated user
const deleteExperimentByIdAndUserId = async (experimentId, userId) => {
  const existingExperiment = await prisma.experiment.findFirst({
    where: {
      id: experimentId,
      userId,
    },
  });

  if (!existingExperiment) {
    throw new Error("Experiment not found.");
  }

  return prisma.experiment.delete({
    where: {
      id: experimentId,
    },
  });
};

export { createExperiment, getExperimentsByUserId, getExperimentByIdAndUserId, updateExperimentByIdAndUserId, deleteExperimentByIdAndUserId };