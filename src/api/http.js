import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const api = axios.create({
  // Allow overriding the backend URL at build time; fallback is local dev.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8081/api/v1",
});

export function useApi() {
  const { getToken } = useAuth();

  api.interceptors.request.use(async (config) => {
    try {
      const token = await getToken({ template: "default" });
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Failed to get token:", error);
    }
    return config;
  });

  return api;
}

