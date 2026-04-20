import prisma from "../config/prisma.js";

// Creates a new experiment group
const createExperimentGroup = async ({
  experimentId,
  name,
  groupType,
  description,
}) => {
  return prisma.experimentGroup.create({
    data: {
      experimentId,
      name,
      groupType,
      description,
    },
  });
};

// Returns all groups for one experiment
const getExperimentGroupsByExperimentId = async (experimentId) => {
  return prisma.experimentGroup.findMany({
    where: { experimentId },
    orderBy: { createdAt: "asc" },
  });
};

export { createExperimentGroup, getExperimentGroupsByExperimentId };