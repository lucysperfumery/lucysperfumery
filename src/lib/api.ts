import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds
});

// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     // You can add auth tokens here in the future
//     // const token = localStorage.getItem('token');
//     // if (token) {
//     //   config.headers.Authorization = `Bearer ${token}`;
//     // }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.error("Bad Request:", data);
          break;
        case 401:
          console.error("Unauthorized:", data);
          // Handle auth errors (e.g., redirect to login)
          break;
        case 404:
          console.error("Not Found:", data);
          break;
        case 500:
          console.error("Server Error:", data);
          break;
        default:
          console.error("API Error:", data);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network Error: No response from server");
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      message?: string;
      error?: string;
    }>;

    if (axiosError.response?.data) {
      return (
        axiosError.response.data.message ||
        axiosError.response.data.error ||
        "An error occurred"
      );
    }

    if (axiosError.message) {
      return axiosError.message;
    }
  }

  return "An unexpected error occurred";
};

export default api;
