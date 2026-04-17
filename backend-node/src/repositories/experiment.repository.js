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

export { createExperiment, getExperimentsByUserId };