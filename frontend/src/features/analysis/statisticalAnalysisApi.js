import apiClient from "../../services/apiClient";

// Creates and saves a new statistical analysis
const createStatisticalAnalysisRequest = async (data, token) => {
  const response = await apiClient.post("/statistical-analyses", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Loads all saved analyses for the current user
const getStatisticalAnalysesRequest = async (token) => {
  const response = await apiClient.get("/statistical-analyses", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Loads one saved analysis by id
const getStatisticalAnalysisByIdRequest = async (analysisId, token) => {
  const response = await apiClient.get(`/statistical-analyses/${analysisId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Deletes one saved analysis
const deleteStatisticalAnalysisRequest = async (analysisId, token) => {
  const response = await apiClient.delete(`/statistical-analyses/${analysisId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export { createStatisticalAnalysisRequest, getStatisticalAnalysesRequest, getStatisticalAnalysisByIdRequest, deleteStatisticalAnalysisRequest };