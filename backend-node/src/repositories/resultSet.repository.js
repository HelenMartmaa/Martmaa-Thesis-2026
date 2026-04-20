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
      userId,
      experimentId,
      title,
      experimentType,
      measurementName,
      measurementUnit,
      description,
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
      experimentId,
      title,
      experimentType,
      measurementName,
      measurementUnit,
      description,
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