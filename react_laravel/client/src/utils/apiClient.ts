import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // Enable cookies for session authentication
});

// Fetch CSRF token before making any requests
export const initializeCsrfToken = async () => {
  try {
    await apiClient.get("/sanctum/csrf-cookie");
    console.log("CSRF token initialized");
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
  }
};

// Helper function to get CSRF token from cookie
const getCsrfToken = (): string | null => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  if (cookieValue) {
    try {
      return decodeURIComponent(cookieValue);
    } catch (e) {
      return cookieValue;
    }
  }
  return null;
};

// Add interceptor to extract and include CSRF token in request headers
apiClient.interceptors.request.use((config) => {
  // Skip CSRF token for the csrf-cookie endpoint itself
  if (config.url?.includes("/sanctum/csrf-cookie")) {
    return config;
  }

  const token = getCsrfToken();
  if (token) {
    config.headers["X-CSRF-TOKEN"] = token;
    console.log("CSRF token added to request:", token.substring(0, 10) + "...");
  } else {
    console.warn("CSRF token not found in cookies");
  }

  return config;
});

export default apiClient;
