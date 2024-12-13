import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:8005/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },

  // Enable cross-domain requests
  withCredentials: true,
});

export type ApiError = {
  message: string;
  errors?: Record<string, string[]>;
};
