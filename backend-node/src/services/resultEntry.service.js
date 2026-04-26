import {
  createResultEntry,
  getResultEntriesByResultSetId,
  getResultEntryById,
  updateResultEntryById,
  deleteResultEntryById,
} from "../repositories/resultEntry.repository.js";
import { getResultSetByIdAndUserId } from "../repositories/resultSet.repository.js";
import { countStatisticalAnalysesByResultSetId } from "../repositories/statisticalAnalysis.repository.js";

// Preventing update of datasets that are already linked to saved analyses
const preventEntryChangesIfAnalyzed = async (resultSetId, userId) => {
  const relatedAnalysisCount = await countStatisticalAnalysesByResultSetId(
    resultSetId,
    userId
  );

  if (relatedAnalysisCount > 0) {
    throw new Error(
      "This result dataset is already used in a saved statistical analysis and its entries can no longer be changed."
    );
  }
};

// Validates and creates a new result entry
const createResultEntryService = async ({
  resultSetId,
  userId,
  subjectId,
  groupId,
  sampleCode,
  groupLabel,
  sex,
  timepointValue,
  timepointUnit,
  numericValue,
  eventOccurred,
}) => {
  const parsedResultSetId = Number(resultSetId);
  if (!parsedResultSetId || Number.isNaN(parsedResultSetId)) {
    throw new Error("Invalid result set id.");
  }

  const resultSet = await getResultSetByIdAndUserId(parsedResultSetId, userId);
  if (!resultSet) {
    throw new Error("Result set not found.");
  }

	await preventEntryChangesIfAnalyzed(parsedResultSetId, userId);

  const parsedTimepointValue =
    timepointValue !== undefined &&
    timepointValue !== null &&
    timepointValue !== ""
      ? Number(timepointValue)
      : null;
  if (parsedTimepointValue !== null && !Number.isFinite(parsedTimepointValue)) {
    throw new Error("Timepoint value must be a valid number.");
  }
  const parsedEventOccurred =
    eventOccurred !== undefined &&
    eventOccurred !== null &&
    eventOccurred !== ""
      ? Number(eventOccurred)
      : null;
  if (parsedEventOccurred !== null && ![0, 1].includes(parsedEventOccurred)) {
    throw new Error("Event occurred must be either 0 or 1.");
  }
  const isSurvivalEntry =
    parsedTimepointValue !== null || parsedEventOccurred !== null;
  let parsedNumericValue = null;
  if (isSurvivalEntry) {
    if (parsedTimepointValue === null) {
      throw new Error("Survival entries must include a timepoint value.");
    }
    if (parsedEventOccurred === null) {
      throw new Error("Survival entries must include event occurrence data.");
    }
  } else {
    if (numericValue === undefined || numericValue === null || numericValue === "") {
      throw new Error("Numeric value is required.");
    }
    parsedNumericValue = Number(numericValue);
    if (!Number.isFinite(parsedNumericValue)) {
      throw new Error("Numeric value must be a valid number.");
    }
  }
  return createResultEntry({
    resultSetId: parsedResultSetId,
    subjectId: subjectId ? Number(subjectId) : null,
    groupId: groupId ? Number(groupId) : null,
    sampleCode: sampleCode?.trim() || null,
    groupLabel: groupLabel?.trim() || null,
    sex: sex?.trim() || null,
    timepointValue: parsedTimepointValue,
    timepointUnit: timepointUnit?.trim() || null,
    numericValue: parsedNumericValue,
    eventOccurred: parsedEventOccurred,
  });
};

// Returns all entries for one result set
const getResultEntriesService = async ({ resultSetId, userId }) => {
  const parsedResultSetId = Number(resultSetId);
  if (!parsedResultSetId || Number.isNaN(parsedResultSetId)) {
    throw new Error("Invalid result set id.");
  }
  const resultSet = await getResultSetByIdAndUserId(parsedResultSetId, userId);
  if (!resultSet) {
    throw new Error("Result set not found.");
  }
  return getResultEntriesByResultSetId(parsedResultSetId);
};
// Updates one result entry
const updateResultEntryService = async ({
  resultSetId,
  entryId,
  userId,
  subjectId,
  groupId,
  sampleCode,
  groupLabel,
  sex,
  timepointValue,
  timepointUnit,
  numericValue,
  eventOccurred,
}) => {
  const parsedResultSetId = Number(resultSetId);
  const parsedEntryId = Number(entryId);
  if (
    !parsedResultSetId ||
    Number.isNaN(parsedResultSetId) ||
    !parsedEntryId ||
    Number.isNaN(parsedEntryId)
  ) {
    throw new Error("Invalid id.");
  }
  const resultSet = await getResultSetByIdAndUserId(parsedResultSetId, userId);
  if (!resultSet) {
    throw new Error("Result set not found.");
  }
  const existingEntry = await getResultEntryById(parsedEntryId);
  if (!existingEntry || existingEntry.resultSetId !== parsedResultSetId) {
    throw new Error("Result entry not found.");
  }

	await preventEntryChangesIfAnalyzed(parsedResultSetId, userId);

  const parsedTimepointValue =
    timepointValue !== undefined &&
    timepointValue !== null &&
    timepointValue !== ""
      ? Number(timepointValue)
      : null;
  if (parsedTimepointValue !== null && !Number.isFinite(parsedTimepointValue)) {
    throw new Error("Timepoint value must be a valid number.");
  }
  const parsedEventOccurred =
    eventOccurred !== undefined &&
    eventOccurred !== null &&
    eventOccurred !== ""
      ? Number(eventOccurred)
      : null;
  if (parsedEventOccurred !== null && ![0, 1].includes(parsedEventOccurred)) {
    throw new Error("Event occurred must be either 0 or 1.");
  }
  const isSurvivalEntry =
    parsedTimepointValue !== null || parsedEventOccurred !== null;
  let parsedNumericValue = null;
  if (isSurvivalEntry) {
    if (parsedTimepointValue === null) {
      throw new Error("Survival entries must include a timepoint value.");
    }
    if (parsedEventOccurred === null) {
      throw new Error("Survival entries must include event occurrence data.");
    }
  } else {
    if (numericValue === undefined || numericValue === null || numericValue === "") {
      throw new Error("Numeric value is required.");
    }
    parsedNumericValue = Number(numericValue);
    if (!Number.isFinite(parsedNumericValue)) {
      throw new Error("Numeric value must be a valid number.");
    }
  }
  return updateResultEntryById({
    entryId: parsedEntryId,
    subjectId: subjectId ? Number(subjectId) : null,
    groupId: groupId ? Number(groupId) : null,
    sampleCode: sampleCode?.trim() || null,
    groupLabel: groupLabel?.trim() || null,
    sex: sex?.trim() || null,
    timepointValue: parsedTimepointValue,
    timepointUnit: timepointUnit?.trim() || null,
    numericValue: parsedNumericValue,
    eventOccurred: parsedEventOccurred,
  });
};
// Deletes one result entry
const deleteResultEntryService = async ({ resultSetId, entryId, userId }) => {
  const parsedResultSetId = Number(resultSetId);
  const parsedEntryId = Number(entryId);
  if (
    !parsedResultSetId ||
    Number.isNaN(parsedResultSetId) ||
    !parsedEntryId ||
    Number.isNaN(parsedEntryId)
  ) {
    throw new Error("Invalid id.");
  }
  const resultSet = await getResultSetByIdAndUserId(parsedResultSetId, userId);
  if (!resultSet) {
    throw new Error("Result set not found.");
  }
  const existingEntry = await getResultEntryById(parsedEntryId);
  if (!existingEntry || existingEntry.resultSetId !== parsedResultSetId) {
    throw new Error("Result entry not found.");
  }

	await preventEntryChangesIfAnalyzed(parsedResultSetId, userId);

  return deleteResultEntryById(parsedEntryId);
};
export {
  createResultEntryService,
  getResultEntriesService,
  updateResultEntryService,
  deleteResultEntryService
};