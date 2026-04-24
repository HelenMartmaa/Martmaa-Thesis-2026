import apiClient from "../../services/apiClient";

// Creates a new result set
const createResultSetRequest = async (data, token) => {
  const response = await apiClient.post("/result-sets", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Loads all saved result sets
const getSavedResultSetsRequest = async (token) => {
  const response = await apiClient.get("/result-sets", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Loads one result set by id
const getResultSetByIdRequest = async (resultSetId, token) => {
  const response = await apiClient.get(`/result-sets/${resultSetId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Updates one result set
const updateResultSetRequest = async (resultSetId, data, token) => {
  const response = await apiClient.put(`/result-sets/${resultSetId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const getResultSetsRequest = async (token) => {
  const response = await apiClient.get("/result-sets", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Deletes one result set
const deleteResultSetRequest = async (resultSetId, token) => {
  const response = await apiClient.delete(`/result-sets/${resultSetId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export {
  createResultSetRequest,
  getSavedResultSetsRequest,
  getResultSetByIdRequest,
  updateResultSetRequest,
  deleteResultSetRequest,
	getResultSetsRequest,
};