import apiClient from "../api/apiClient";

const productService = {
  getProducts: async ({
    page = 1,
    limit = 10,
    search = "",
    category = "",
    minPrice = "",
    maxPrice = "",
    isActive = "",
    sortBy = "created_at",
    order = "desc",
  } = {}) => {
    const params = {
      page,
      limit,
      sort_by: sortBy,
      order,
    };

    if (search.trim()) {
      params.search = search.trim();
    }

    if (category.trim()) {
      params.category = category.trim();
    }

    if (minPrice !== "") {
      params.min_price = Number(minPrice);
    }

    if (maxPrice !== "") {
      params.max_price = Number(maxPrice);
    }

    if (isActive !== "") {
      params.is_active = isActive;
    }

    const response = await apiClient.get("/products", { params });
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await apiClient.post("/products", productData);
    return response.data;
  },

  updateProduct: async (productId, productData) => {
    const response = await apiClient.patch(
      `/products/${productId}`,
      productData
    );

    return response.data;
  },

  deactivateProduct: async (productId) => {
    const response = await apiClient.delete(`/products/${productId}`);
    return response.data;
  },

  restoreProduct: async (productId) => {
    const response = await apiClient.patch(`/products/${productId}/restore`);
    return response.data;
  },
};

export default productService;