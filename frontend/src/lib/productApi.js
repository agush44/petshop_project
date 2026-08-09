import fetchData, { API_URL, authHeaders } from "./api";

export const fetchProducts = (filters = {}) => {
  const params = new URLSearchParams(
    Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
  );
  const query = params.toString() ? `?${params.toString()}` : "";
  return fetchData(`${API_URL}/api/products${query}`);
};

export const fetchPromotionProducts = () =>
  fetchData(`${API_URL}/api/products/promotions`);

export const fetchProductById = (id) =>
  fetchData(`${API_URL}/api/products/${id}`);

export const createProduct = (productData) =>
  fetchData(`${API_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(productData),
  });

export const updateProduct = (id, productData) =>
  fetchData(`${API_URL}/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(productData),
  });

export const deleteProduct = (id) =>
  fetchData(`${API_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
