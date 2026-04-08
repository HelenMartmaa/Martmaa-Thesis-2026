import apiClient from "../../services/apiClient";

// auth API requests for register, login and current user
const registerRequest = async (data) => {
  const response = await apiClient.post("/auth/register", data);
  return response.data;
};

const loginRequest = async (data) => {
  const response = await apiClient.post("/auth/login", data);
  return response.data;
};

const getCurrentUserRequest = async (token) => {
  const response = await apiClient.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export { registerRequest, loginRequest, getCurrentUserRequest };