import {
  createStatisticalAnalysis,
  getStatisticalAnalysesByUserId,
  getStatisticalAnalysisByIdAndUserId,
  deleteStatisticalAnalysisById,
} from "../repositories/statisticalAnalysis.repository.js";
import { getResultSetByIdAndUserId } from "../repositories/resultSet.repository.js";
import { getResultEntriesByResultSetId } from "../repositories/resultEntry.repository.js";
import { calculateDescriptiveMetrics } from "./statisticsCalculator.service.js";

// Creates and saves a statistical analysis
const createStatisticalAnalysisService = async ({
  userId,
  resultSetId,
  analysisName,
  groupingMode,
  selectedMetrics,
  selectedTests,
  filters,
  chartConfig,
}) => {
  const parsedResultSetId = Number(resultSetId);

  if (!parsedResultSetId || Number.isNaN(parsedResultSetId)) {
    throw new Error("A valid result set is required.");
  }

  const resultSet = await getResultSetByIdAndUserId(parsedResultSetId, userId);

  if (!resultSet) {
    throw new Error("Result set not found.");
  }

  const entries = await getResultEntriesByResultSetId(parsedResultSetId);

  if (!entries.length) {
    throw new Error("This result set has no entries to analyze.");
  }

  const numericValues = entries
    .map((entry) => entry.numericValue)
    .filter((value) => Number.isFinite(value));

  if (!numericValues.length) {
    throw new Error("No valid numeric values found in this result set.");
  }

  const descriptiveResults = calculateDescriptiveMetrics(
    numericValues,
    selectedMetrics || []
  );

  const results = {
    entryCount: entries.length,
    numericValueCount: numericValues.length,
    descriptiveMetrics: descriptiveResults,
    tests: {},
  };

  return createStatisticalAnalysis({
    userId,
    resultSetId: parsedResultSetId,
    analysisName: analysisName?.trim() || "Untitled analysis",
    groupingMode: groupingMode || null,
    selectedMetricsJson: JSON.stringify(selectedMetrics || []),
    selectedTestsJson: JSON.stringify(selectedTests || []),
    filtersJson: JSON.stringify(filters || {}),
    resultsJson: JSON.stringify(results),
    chartConfigJson: JSON.stringify(chartConfig || {}),
  });
};

const getUserStatisticalAnalysesService = async (userId) => {
  return getStatisticalAnalysesByUserId(userId);
};

const getStatisticalAnalysisByIdService = async (analysisId, userId) => {
  const parsedId = Number(analysisId);

  if (!parsedId || Number.isNaN(parsedId)) {
    throw new Error("Invalid statistical analysis id.");
  }

  const analysis = await getStatisticalAnalysisByIdAndUserId(parsedId, userId);

  if (!analysis) {
    throw new Error("Statistical analysis not found.");
  }

  return analysis;
};

const deleteStatisticalAnalysisService = async (analysisId, userId) => {
  const parsedId = Number(analysisId);

  if (!parsedId || Number.isNaN(parsedId)) {
    throw new Error("Invalid statistical analysis id.");
  }

  const existing = await getStatisticalAnalysisByIdAndUserId(parsedId, userId);

  if (!existing) {
    throw new Error("Statistical analysis not found.");
  }

  return deleteStatisticalAnalysisById(parsedId);
};

export {
  createStatisticalAnalysisService,
  getUserStatisticalAnalysesService,
  getStatisticalAnalysisByIdService,
  deleteStatisticalAnalysisService
};