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

// Returns one subject by subject code inside one experiment
const getExperimentSubjectByCode = async (experimentId, subjectCode) => {
  return prisma.experimentSubject.findFirst({
    where: {
      experimentId,
      subjectCode,
    },
  });
};

// Returns one subject by id
const getExperimentSubjectById = async (subjectId) => {
  return prisma.experimentSubject.findUnique({
    where: { id: subjectId },
    include: {
      group: true,
    },
  });
};

// Updates one subject by id
const updateExperimentSubjectById = async ({
  subjectId,
  groupId,
  subjectCode,
  sex,
  genotype,
  subjectType,
  notes,
}) => {
  return prisma.experimentSubject.update({
    where: { id: subjectId },
    data: {
      groupId,
      subjectCode,
      sex,
      genotype,
      subjectType,
      notes,
    },
    include: {
      group: true,
    },
  });
};

// Deletes one subject by id
const deleteExperimentSubjectById = async (subjectId) => {
  return prisma.experimentSubject.delete({
    where: { id: subjectId },
  });
};

export {
  createExperimentSubject,
  getExperimentSubjectsByExperimentId,
  getExperimentSubjectByCode,
  getExperimentSubjectById,
  updateExperimentSubjectById,
  deleteExperimentSubjectById,
};