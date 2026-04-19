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

// Sends an experiment update to backend
const updateExperimentRequest = async (experimentId, data, token) => {
  const response = await apiClient.put(`/experiments/${experimentId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Deletes one experiment by id
const deleteExperimentRequest = async (experimentId, token) => {
  const response = await apiClient.delete(`/experiments/${experimentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export { createExperimentRequest, getSavedExperimentsRequest, getExperimentByIdRequest, updateExperimentRequest, deleteExperimentRequest };