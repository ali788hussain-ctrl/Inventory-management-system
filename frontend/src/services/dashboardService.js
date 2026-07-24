import apiClient from "../api/apiClient";

const getDashboardStatistics = async () => {
  const response = await apiClient.get("/dashboard");
  return response.data;
};

const dashboardService = {
  getDashboardStatistics,
};

export default dashboardService;