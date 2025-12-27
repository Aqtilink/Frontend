import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const api = axios.create({
  // Allow overriding the backend URL at build time; fallback is local dev.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8081/api/v1",
});

export function useApi() {
  const { getToken } = useAuth();

  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
}

