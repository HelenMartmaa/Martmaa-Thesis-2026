import prisma from "../config/prisma.js";

// Creates a new experiment subject
const createExperimentSubject = async ({
  experimentId,
  groupId,
  subjectCode,
  sex,
  genotype,
  subjectType,
  notes,
}) => {
  return prisma.experimentSubject.create({
    data: {
      experimentId,
      groupId,
      subjectCode,
      sex,
      genotype,
      subjectType,
      notes,
    },
  });
};

// Returns all subjects for one experiment
const getExperimentSubjectsByExperimentId = async (experimentId) => {
  return prisma.experimentSubject.findMany({
    where: { experimentId },
    orderBy: { createdAt: "asc" },
    include: {
      group: true,
    },
  });
};

export { createExperimentSubject, getExperimentSubjectsByExperimentId };