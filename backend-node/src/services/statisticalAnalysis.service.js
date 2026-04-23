import { createStatisticalAnalysis, getStatisticalAnalysesByUserId, getStatisticalAnalysisByIdAndUserId, deleteStatisticalAnalysisById } from "../repositories/statisticalAnalysis.repository.js";
import { getResultSetByIdAndUserId } from "../repositories/resultSet.repository.js";
import { getResultEntriesByResultSetId } from "../repositories/resultEntry.repository.js";
import { runPythonAnalysis } from "./pythonAnalysisClient.service.js";

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

	// Will be sent to Python statistics service
  const payload = {
    analysisName: analysisName?.trim() || "Untitled analysis",
    groupingMode: groupingMode || null,
    selectedMetrics: selectedMetrics || [],
    selectedTests: selectedTests || [],
    filters: filters || {},
    chartConfig: chartConfig || {},
    entries: entries.map((entry) => ({
      numericValue: entry.numericValue,
      timepointValue: entry.timepointValue,
      eventOccurred: entry.eventOccurred,
      sex: entry.sex,
      subjectId: entry.subjectId,
      groupId: entry.groupId,
      sampleCode: entry.sampleCode,
      groupLabel: entry.groupLabel,
    })),
  };

  const pythonResults = await runPythonAnalysis(payload);

  return createStatisticalAnalysis({
    userId,
    resultSetId: parsedResultSetId,
    analysisName: payload.analysisName,
    groupingMode: groupingMode || null,
    selectedMetricsJson: JSON.stringify(selectedMetrics || []),
    selectedTestsJson: JSON.stringify(selectedTests || []),
    filtersJson: JSON.stringify(filters || {}),
    resultsJson: JSON.stringify(pythonResults),
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
  deleteStatisticalAnalysisService,
};