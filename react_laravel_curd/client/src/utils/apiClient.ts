import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    Accept: "application/json",
  },
});

// Fetch CSRF token before making any requests
export const initializeCsrfToken = async () => {
  await apiClient.get("/sanctum/csrf-cookie");
};

export default apiClient;
