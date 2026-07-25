import apiClient from "../api/apiClient";

const categoryService = {
  getAllCategories: async () => {
    const pageSize = 100;
    let skip = 0;
    let categories = [];

    while (true) {
      const response = await apiClient.get("/categories", {
        params: {
          skip,
          limit: pageSize,
        },
      });

      const currentBatch = Array.isArray(response.data)
        ? response.data
        : [];

      categories = [...categories, ...currentBatch];

      if (currentBatch.length < pageSize) {
        break;
      }

      skip += pageSize;
    }

    return categories;
  },

  getCategory: async (categoryId) => {
    const response = await apiClient.get(`/categories/${categoryId}`);
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await apiClient.post("/categories", categoryData);
    return response.data;
  },

  updateCategory: async (categoryId, categoryData) => {
    const response = await apiClient.patch(
      `/categories/${categoryId}`,
      categoryData
    );

    return response.data;
  },

  deactivateCategory: async (category) => {
    const response = await apiClient.patch(`/categories/${category.id}`, {
      name: category.name,
      description: category.description,
      is_active: false,
    });

    return response.data;
  },

  restoreCategory: async (category) => {
    const response = await apiClient.patch(`/categories/${category.id}`, {
      name: category.name,
      description: category.description,
      is_active: true,
    });

    return response.data;
  },

  deleteCategory: async (categoryId) => {
    await apiClient.delete(`/categories/${categoryId}`);
  },
};

export default categoryService;