import prisma from "../config/prisma.js";

// Creates a new experiment that will be saved in database
const createExperiment = async ({ title, experimentType, description, userId }) => {
  return prisma.experiment.create({
    data: {
      title,
      experimentType,
      description,
      userId,
    },
  });
};

// Returns all experiments (if any) that belong to one specific user, displayed starting from the newest
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