import fetchData, { API_URL, authHeaders } from "./api";

export const fetchServices = () => fetchData(`${API_URL}/api/services`);

export const fetchServicesAdmin = () =>
  fetchData(`${API_URL}/api/services/admin`, { headers: authHeaders() });

export const createService = (data) =>
  fetchData(`${API_URL}/api/services`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });

export const updateService = (id, data) =>
  fetchData(`${API_URL}/api/services/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });

export const deleteService = (id) =>
  fetchData(`${API_URL}/api/services/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
