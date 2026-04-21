import prisma from "../config/prisma.js";

// Creates a new result entry
const createResultEntry = async ({
  resultSetId,
  subjectId,
  groupId,
  sampleCode,
  groupLabel,
  sex,
  timepointValue,
  timepointUnit,
  numericValue,
  eventOccurred,
  notes,
}) => {
  return prisma.resultEntry.create({
    data: {
      resultSetId,
      subjectId,
      groupId,
      sampleCode,
      groupLabel,
      sex,
      timepointValue,
      timepointUnit,
      numericValue,
      eventOccurred,
      notes,
    },
    include: {
      subject: true,
      group: true,
    },
  });
};

// Returns all entries for one result set
const getResultEntriesByResultSetId = async (resultSetId) => {
  return prisma.resultEntry.findMany({
    where: { resultSetId },
    orderBy: { id: "asc" },
    include: {
      subject: true,
      group: true,
    },
  });
};

// Returns one result entry by id
const getResultEntryById = async (entryId) => {
  return prisma.resultEntry.findUnique({
    where: { id: entryId },
    include: {
      subject: true,
      group: true,
    },
  });
};

// Updates one result entry
const updateResultEntryById = async ({
  entryId,
  subjectId,
  groupId,
  sampleCode,
  groupLabel,
  sex,
  timepointValue,
  timepointUnit,
  numericValue,
  eventOccurred,
  notes,
}) => {
  return prisma.resultEntry.update({
    where: { id: entryId },
    data: {
      subjectId,
      groupId,
      sampleCode,
      groupLabel,
      sex,
      timepointValue,
      timepointUnit,
      numericValue,
      eventOccurred,
      notes,
    },
    include: {
      subject: true,
      group: true,
    },
  });
};

// Deletes one result entry
const deleteResultEntryById = async (entryId) => {
  return prisma.resultEntry.delete({
    where: { id: entryId },
  });
};

export {
  createResultEntry,
  getResultEntriesByResultSetId,
  getResultEntryById,
  updateResultEntryById,
  deleteResultEntryById
};