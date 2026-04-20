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

// Returns one group by name inside one experiment
const getExperimentGroupByName = async (experimentId, name) => {
  return prisma.experimentGroup.findFirst({
    where: {
      experimentId,
      name,
    },
  });
};

// Returns one group by its id
const getExperimentGroupById = async (groupId) => {
  return prisma.experimentGroup.findUnique({
    where: { id: groupId },
  });
};

// Updates one group by id
const updateExperimentGroupById = async ({
  groupId,
  name,
  groupType,
  description,
}) => {
  return prisma.experimentGroup.update({
    where: { id: groupId },
    data: {
      name,
      groupType,
      description,
    },
  });
};

// Deletes one group by id
const deleteExperimentGroupById = async (groupId) => {
  return prisma.experimentGroup.delete({
    where: { id: groupId },
  });
};

export { 
  createExperimentGroup, 
  getExperimentGroupsByExperimentId, 
  getExperimentGroupByName, 
  getExperimentGroupById, 
  updateExperimentGroupById, 
  deleteExperimentGroupById 
};