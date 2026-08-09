const API_URL = import.meta.env.VITE_BACKEND_URL;

const fetchData = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.message || errorBody.error || `Error: ${response.status} ${response.statusText}`
    );
  }
  if (response.status === 204) return null;
  return response.json();
};

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default fetchData;
export { API_URL, authHeaders };
