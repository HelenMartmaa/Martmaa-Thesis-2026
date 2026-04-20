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

export { createResultEntry, getResultEntriesByResultSetId };
