import apiClient from "../../services/apiClient";

// Sends a new experiment to backend
const createExperimentRequest = async (data, token) => {
  const response = await apiClient.post("/experiments", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Loads saved experiments for the authenticated user
const getSavedExperimentsRequest = async (token) => {
  const response = await apiClient.get("/experiments", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Loads one saved experiment by id
const getExperimentByIdRequest = async (experimentId, token) => {
  const response = await apiClient.get(`/experiments/${experimentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export { createExperimentRequest, getSavedExperimentsRequest, getExperimentByIdRequest };