import fetchData, { API_URL, authHeaders } from "./api";

export const registerUser = (userData) =>
  fetchData(`${API_URL}/api/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

export const loginUser = async (userData) => {
  const data = await fetchData(`${API_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user?.role ?? "user");
  }

  return data;
};

export const getCurrentUser = () =>
  fetchData(`${API_URL}/api/users/me`, { headers: authHeaders() });

export const isAuthenticated = () => !!localStorage.getItem("token");

export const isAdmin = () => localStorage.getItem("role") === "admin";

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};
