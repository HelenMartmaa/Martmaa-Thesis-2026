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

// Loads all groups for one experiment
const getExperimentGroupsRequest = async (experimentId, token) => {
  const response = await apiClient.get(`/experiments/${experimentId}/groups`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Creates a new group for one experiment
const createExperimentGroupRequest = async (experimentId, data, token) => {
  const response = await apiClient.post(`/experiments/${experimentId}/groups`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Loads all subjects for one experiment
const getExperimentSubjectsRequest = async (experimentId, token) => {
  const response = await apiClient.get(`/experiments/${experimentId}/subjects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Creates a new subject for one experiment
const createExperimentSubjectRequest = async (experimentId, data, token) => {
  const response = await apiClient.post(`/experiments/${experimentId}/subjects`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Loads all team members for one experiment
const getExperimentTeamMembersRequest = async (experimentId, token) => {
  const response = await apiClient.get(
    `/experiments/${experimentId}/team-members`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Creates a new team member for one experiment
const createExperimentTeamMemberRequest = async (
  experimentId,
  data,
  token
) => {
  const response = await apiClient.post(
    `/experiments/${experimentId}/team-members`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Updates one group for one experiment
const updateExperimentGroupRequest = async (experimentId, groupId, data, token) => {
  const response = await apiClient.put(
    `/experiments/${experimentId}/groups/${groupId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Deletes one group for one experiment
const deleteExperimentGroupRequest = async (experimentId, groupId, token) => {
  const response = await apiClient.delete(
    `/experiments/${experimentId}/groups/${groupId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Updates one subject for one experiment
const updateExperimentSubjectRequest = async (
  experimentId,
  subjectId,
  data,
  token
) => {
  const response = await apiClient.put(
    `/experiments/${experimentId}/subjects/${subjectId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Deletes one subject for one experiment
const deleteExperimentSubjectRequest = async (
  experimentId,
  subjectId,
  token
) => {
  const response = await apiClient.delete(
    `/experiments/${experimentId}/subjects/${subjectId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Updates one team member for one experiment
const updateExperimentTeamMemberRequest = async (
  experimentId,
  memberId,
  data,
  token
) => {
  const response = await apiClient.put(
    `/experiments/${experimentId}/team-members/${memberId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Deletes one team member for one experiment
const deleteExperimentTeamMemberRequest = async (
  experimentId,
  memberId,
  token
) => {
  const response = await apiClient.delete(
    `/experiments/${experimentId}/team-members/${memberId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export {
  createExperimentRequest,
  getSavedExperimentsRequest,
  getExperimentByIdRequest,
  updateExperimentRequest,
  deleteExperimentRequest,
  getExperimentGroupsRequest,
  createExperimentGroupRequest,
  updateExperimentGroupRequest,
  deleteExperimentGroupRequest,
  getExperimentSubjectsRequest,
  createExperimentSubjectRequest,
  getExperimentTeamMembersRequest,
  createExperimentTeamMemberRequest,
  updateExperimentSubjectRequest,
  deleteExperimentSubjectRequest,
  updateExperimentTeamMemberRequest,
  deleteExperimentTeamMemberRequest
};