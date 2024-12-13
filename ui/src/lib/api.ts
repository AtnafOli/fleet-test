import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8005/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export type ApiError = {
  message: string;
  errors?: Record<string, string[]>;
};
