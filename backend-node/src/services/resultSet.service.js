import {
  createResultSet,
  getResultSetsByUserId,
  getResultSetByIdAndUserId,
  updateResultSetById,
  deleteResultSetById
} from "../repositories/resultSet.repository.js";
import { getExperimentByIdAndUserId } from "../repositories/experiment.repository.js";

// Validates and creates a new result set
const createResultSetService = async ({
  userId,
  experimentId,
  title,
  experimentType,
  measurementName,
  measurementUnit,
  description,
}) => {
  const trimmedTitle = title?.trim();
  const normalizedExperimentType = experimentType?.trim();
  const trimmedMeasurementName = measurementName?.trim();

  if (!trimmedTitle || !normalizedExperimentType || !trimmedMeasurementName) {
    throw new Error("Title, experiment type, and measurement name are required.");
  }

  if (!["in_vivo", "in_vitro"].includes(normalizedExperimentType)) {
    throw new Error("Experiment type must be either 'in_vivo' or 'in_vitro'.");
  }

  let parsedExperimentId = null;

  if (experimentId) {
    parsedExperimentId = Number(experimentId);

    if (!parsedExperimentId || Number.isNaN(parsedExperimentId)) {
      throw new Error("Invalid experiment id.");
    }

    const experiment = await getExperimentByIdAndUserId(parsedExperimentId, userId);

    if (!experiment) {
      throw new Error("Selected experiment was not found.");
    }
  }

  return createResultSet({
    userId,
    experimentId: parsedExperimentId,
    title: trimmedTitle,
    experimentType: normalizedExperimentType,
    measurementName: trimmedMeasurementName,
    measurementUnit: measurementUnit?.trim() || null,
    description: description?.trim() || null,
  });
};

// Returns all result sets for one user
const getUserResultSetsService = async (userId) => {
  return getResultSetsByUserId(userId);
};

// Returns one result set for the authenticated user
const getResultSetByIdService = async (resultSetId, userId) => {
  const parsedId = Number(resultSetId);

  if (!parsedId || Number.isNaN(parsedId)) {
    throw new Error("Invalid result set id.");
  }

  const resultSet = await getResultSetByIdAndUserId(parsedId, userId);

  if (!resultSet) {
    throw new Error("Result set not found.");
  }

  return resultSet;
};

// Validates and updates one result set
const updateResultSetService = async ({
  resultSetId,
  userId,
  experimentId,
  title,
  experimentType,
  measurementName,
  measurementUnit,
  description,
}) => {
  const parsedResultSetId = Number(resultSetId);

  if (!parsedResultSetId || Number.isNaN(parsedResultSetId)) {
    throw new Error("Invalid result set id.");
  }

  const existingResultSet = await getResultSetByIdAndUserId(parsedResultSetId, userId);

  if (!existingResultSet) {
    throw new Error("Result set not found.");
  }

  const trimmedTitle = title?.trim();
  const normalizedExperimentType = experimentType?.trim();
  const trimmedMeasurementName = measurementName?.trim();

  if (!trimmedTitle || !normalizedExperimentType || !trimmedMeasurementName) {
    throw new Error("Title, experiment type, and measurement name are required.");
  }

  if (!["in_vivo", "in_vitro"].includes(normalizedExperimentType)) {
    throw new Error("Experiment type must be either 'in_vivo' or 'in_vitro'.");
  }

  let parsedExperimentId = null;

  if (experimentId) {
    parsedExperimentId = Number(experimentId);

    if (!parsedExperimentId || Number.isNaN(parsedExperimentId)) {
      throw new Error("Invalid experiment id.");
    }

    const experiment = await getExperimentByIdAndUserId(parsedExperimentId, userId);

    if (!experiment) {
      throw new Error("Selected experiment was not found.");
    }
  }

  return updateResultSetById({
    resultSetId: parsedResultSetId,
    experimentId: parsedExperimentId,
    title: trimmedTitle,
    experimentType: normalizedExperimentType,
    measurementName: trimmedMeasurementName,
    measurementUnit: measurementUnit?.trim() || null,
    description: description?.trim() || null,
  });
};

// Deletes one result set
const deleteResultSetService = async (resultSetId, userId) => {
  const parsedId = Number(resultSetId);

  if (!parsedId || Number.isNaN(parsedId)) {
    throw new Error("Invalid result set id.");
  }

  const existingResultSet = await getResultSetByIdAndUserId(parsedId, userId);

  if (!existingResultSet) {
    throw new Error("Result set not found.");
  }

  return deleteResultSetById(parsedId);
};

export {
  createResultSetService,
  getUserResultSetsService,
  getResultSetByIdService,
  updateResultSetService,
  deleteResultSetService
};