import prisma from "../config/prisma.js";

// Creates a new result set
const createResultSet = async ({
  userId,
  experimentId,
  title,
  experimentType,
  measurementName,
  measurementUnit,
  description,
}) => {
  return prisma.resultSet.create({
    data: {
      title,
      experimentType,
      measurementName,
      measurementUnit: measurementUnit || null,
      description: description || null,
      user: {
        connect: { id: userId },
      },
      ...(experimentId
        ? {
            experiment: {
              connect: { id: experimentId },
            },
          }
        : {}),
    },
    include: {
      experiment: true,
    },
  });
};

// Returns all result sets for one user
const getResultSetsByUserId = async (userId) => {
  return prisma.resultSet.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      experiment: true,
    },
  });
};

// Returns one result set by id and owner
const getResultSetByIdAndUserId = async (resultSetId, userId) => {
  return prisma.resultSet.findFirst({
    where: {
      id: resultSetId,
      userId,
    },
    include: {
      experiment: true,
    },
  });
};

// Updates one result set by id
const updateResultSetById = async ({
  resultSetId,
  experimentId,
  title,
  experimentType,
  measurementName,
  measurementUnit,
  description,
}) => {
  return prisma.resultSet.update({
    where: { id: resultSetId },
    data: {
      title,
      experimentType,
      measurementName,
      measurementUnit: measurementUnit || null,
      description: description || null,
      ...(experimentId
        ? {
            experiment: {
              connect: { id: experimentId },
            },
          }
        : {
            experiment: {
              disconnect: true,
            },
          }),
    },
    include: {
      experiment: true,
    },
  });
};

// Deletes one result set by id
const deleteResultSetById = async (resultSetId) => {
  return prisma.resultSet.delete({
    where: { id: resultSetId },
  });
};

export {
  createResultSet,
  getResultSetsByUserId,
  getResultSetByIdAndUserId,
  updateResultSetById,
  deleteResultSetById
};