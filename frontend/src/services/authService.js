import apiClient from "../api/apiClient";

const login = async (credentials) => {
  const response = await apiClient.post("/auth/login", {
    email: credentials.email,
    password: credentials.password,
  });

  return response.data;
};

const getCurrentUser = async () => {
  const response = await apiClient.get("/auth/me");
  return response.data;
};

const register = async (userData) => {
  const response = await apiClient.post("/auth/register", userData);
  return response.data;
};

const authService = {
  login,
  register,
  getCurrentUser,
};

export default authService;