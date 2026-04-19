import prisma from "../config/prisma.js";

// Creates a new experiment that will be saved in database
const createExperiment = async ({
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
  return prisma.experiment.create({
    data: {
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
  });
};

export { createExperiment, getExperimentsByUserId, getExperimentByIdAndUserId };