import apiClient from "../api/apiClient";

const supplierService = {
  getSuppliers: async ({ skip = 0, limit = 100 } = {}) => {
    const response = await apiClient.get("/suppliers", {
      params: {
        skip,
        limit,
      },
    });

    return response.data;
  },

  getAllSuppliers: async () => {
    const pageSize = 100;
    let skip = 0;
    let suppliers = [];

    while (true) {
      const response = await apiClient.get("/suppliers", {
        params: {
          skip,
          limit: pageSize,
        },
      });

      const currentBatch = response.data ?? [];
      suppliers = [...suppliers, ...currentBatch];

      if (currentBatch.length < pageSize) {
        break;
      }

      skip += pageSize;
    }

    return suppliers;
  },

  getSupplier: async (supplierId) => {
    const response = await apiClient.get(`/suppliers/${supplierId}`);
    return response.data;
  },

  createSupplier: async (supplierData) => {
    const response = await apiClient.post("/suppliers", supplierData);
    return response.data;
  },

  updateSupplier: async (supplierId, supplierData) => {
    const response = await apiClient.patch(
      `/suppliers/${supplierId}`,
      supplierData
    );

    return response.data;
  },

  deleteSupplier: async (supplierId) => {
    await apiClient.delete(`/suppliers/${supplierId}`);
  },
};

export default supplierService;