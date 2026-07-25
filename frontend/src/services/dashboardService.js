import apiClient from "../api/apiClient";

const dashboardService = {
  getDashboardStatistics: async () => {
    const response = await apiClient.get("/dashboard");
    return response.data;
  },

  getInventoryValue: async () => {
    const response = await apiClient.get("/reports/inventory-value");
    return response.data;
  },

  getLowStockProducts: async (threshold = 10) => {
    const response = await apiClient.get("/reports/low-stock", {
      params: { threshold },
    });

    return response.data;
  },

  getTransactionSummary: async (days = 30) => {
    const response = await apiClient.get("/reports/transaction-summary", {
      params: { days },
    });

    return response.data;
  },

  getRecentTransactions: async (limit = 5) => {
    const response = await apiClient.get("/inventory-transactions", {
      params: {
        skip: 0,
        limit,
      },
    });

    return response.data;
  },
};

export default dashboardService;