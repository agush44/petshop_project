import fetchData, { API_URL } from "./api";

export const sendContactMessage = (data) =>
  fetchData(`${API_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
