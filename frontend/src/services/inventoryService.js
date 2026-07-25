import apiClient from "../api/apiClient";

const inventoryService = {
  getTransactions: async ({
    skip = 0,
    limit = 20,
    productId = "",
    transactionType = "",
  } = {}) => {
    const response = await apiClient.get("/inventory-transactions", {
      params: {
        skip,
        limit,
        ...(productId ? { product_id: productId } : {}),
        ...(transactionType
          ? { transaction_type: transactionType }
          : {}),
      },
    });

    return Array.isArray(response.data) ? response.data : [];
  },

  getAllTransactions: async ({
    productId = "",
    transactionType = "",
  } = {}) => {
    const pageSize = 100;
    let skip = 0;
    let transactions = [];

    while (true) {
      const currentBatch = await inventoryService.getTransactions({
        skip,
        limit: pageSize,
        productId,
        transactionType,
      });

      transactions = [...transactions, ...currentBatch];

      if (currentBatch.length < pageSize) {
        break;
      }

      skip += pageSize;
    }

    return transactions;
  },

  getTransaction: async (transactionId) => {
    const response = await apiClient.get(
      `/inventory-transactions/${transactionId}`
    );

    return response.data;
  },

  createTransaction: async (transactionData) => {
    const response = await apiClient.post(
      "/inventory-transactions",
      transactionData
    );

    return response.data;
  },

  getProducts: async () => {
    const response = await apiClient.get("/products", {
      params: {
        page: 1,
        limit: 100,
      },
    });

    if (Array.isArray(response.data)) {
      return response.data;
    }

    return Array.isArray(response.data?.items)
      ? response.data.items
      : [];
  },

  getSuppliers: async () => {
    const response = await apiClient.get("/suppliers", {
      params: {
        skip: 0,
        limit: 100,
      },
    });

    if (Array.isArray(response.data)) {
      return response.data;
    }

    return Array.isArray(response.data?.items)
      ? response.data.items
      : [];
  },
};

export default inventoryService;