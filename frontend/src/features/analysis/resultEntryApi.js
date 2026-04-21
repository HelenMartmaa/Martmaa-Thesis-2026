import apiClient from "../../services/apiClient";

// Loads all entries for one result set
const getResultEntriesRequest = async (resultSetId, token) => {
  const response = await apiClient.get(`/result-sets/${resultSetId}/entries`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Creates a new entry for one result set
const createResultEntryRequest = async (resultSetId, data, token) => {
  const response = await apiClient.post(
    `/result-sets/${resultSetId}/entries`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Updates one entry
const updateResultEntryRequest = async (resultSetId, entryId, data, token) => {
  const response = await apiClient.put(
    `/result-sets/${resultSetId}/entries/${entryId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Deletes one entry
const deleteResultEntryRequest = async (resultSetId, entryId, token) => {
  const response = await apiClient.delete(
    `/result-sets/${resultSetId}/entries/${entryId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export {
  getResultEntriesRequest,
  createResultEntryRequest,
  updateResultEntryRequest,
  deleteResultEntryRequest
};