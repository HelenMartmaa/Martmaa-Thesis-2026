import prisma from "../config/prisma.js";

// Creates a new statistical analysis
const createStatisticalAnalysis = async ({
  userId,
  resultSetId,
  analysisName,
  groupingMode,
  selectedMetricsJson,
  selectedTestsJson,
  filtersJson,
  resultsJson,
  chartConfigJson,
}) => {
  return prisma.statisticalAnalysis.create({
    data: {
      user: {
        connect: { id: userId },
      },
      resultSet: {
        connect: { id: resultSetId },
      },
      analysisName,
      groupingMode,
      selectedMetricsJson,
      selectedTestsJson,
      filtersJson,
      resultsJson,
      chartConfigJson,
    },
  });
};

// Returns all saved analyses for one user
const getStatisticalAnalysesByUserId = async (userId) => {
  return prisma.statisticalAnalysis.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      resultSet: true,
    },
  });
};

// Returns one saved statistical analysis bt id and owner user
const getStatisticalAnalysisByIdAndUserId = async (analysisId, userId) => {
  return prisma.statisticalAnalysis.findFirst({
    where: {
      id: analysisId,
      userId,
    },
		include: {
			resultSet: {
				include: {
					entries: {
						include: {
							subject: true,
							group: true,
						},
						orderBy: {
							id: "asc",
						},
					},
				},
			},
		},
  });
};

// Deletes one analysis
const deleteStatisticalAnalysisById = async (analysisId) => {
  return prisma.statisticalAnalysis.delete({
    where: { id: analysisId },
  });
};

export {
  createStatisticalAnalysis,
  getStatisticalAnalysesByUserId,
  getStatisticalAnalysisByIdAndUserId,
  deleteStatisticalAnalysisById,
};