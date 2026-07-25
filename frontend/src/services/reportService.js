import apiClient from "../api/apiClient";

const reportService = {
  getLowStockReport: async (threshold = 10) => {
    const response = await apiClient.get("/reports/low-stock", {
      params: {
        threshold,
      },
    });

    return Array.isArray(response.data) ? response.data : [];
  },

  getOutOfStockReport: async () => {
    const response = await apiClient.get("/reports/out-of-stock");

    return Array.isArray(response.data) ? response.data : [];
  },

  getInventoryValueReport: async () => {
    const response = await apiClient.get("/reports/inventory-value");

    return response.data;
  },

  getTransactionSummary: async (days = 30) => {
    const response = await apiClient.get(
      "/reports/transaction-summary",
      {
        params: {
          days,
        },
      }
    );

    return response.data;
  },

  getAllReports: async ({ threshold = 10, days = 30 } = {}) => {
    const [
      lowStock,
      outOfStock,
      inventoryValue,
      transactionSummary,
    ] = await Promise.all([
      reportService.getLowStockReport(threshold),
      reportService.getOutOfStockReport(),
      reportService.getInventoryValueReport(),
      reportService.getTransactionSummary(days),
    ]);

    return {
      lowStock,
      outOfStock,
      inventoryValue,
      transactionSummary,
    };
  },
};

export default reportService;