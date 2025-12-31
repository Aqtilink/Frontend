import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";

export function useActivityApi() {
  const { getToken } = useAuth();
  const { user } = useUser();

  const api = axios.create({
    baseURL:
      import.meta.env.VITE_ACTIVITY_API_URL || "http://localhost:8081/api/v1/activities",
  });

  // Automatically attach JWT to all requests
  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
  const getFeed = async () => {
    const res = await api.get("/all");
    return res.data;
  }

  const getFriendsFeed = async () => {
    if (!user?.id) return [];
    const res = await api.get(`/friends-feed/${user.id}`);
    return res.data;
  };

  const joinActivity = async (activityId) => {
    if (!user?.id) throw new Error("User not authenticated");
    await api.post(`/${activityId}/join/${user.id}`);
  };

  const createActivity = async (payload) => {
    if (!user?.id) throw new Error("User not authenticated");
    const activityPayload = {
      ...payload,
      ownerId: user.id,
    };
    const res = await api.post("/json", activityPayload);
    return res.data;
  };

  return { 
    getFeed, 
    getFriendsFeed,
    getJoinedActivities: async () => {
      if (!user?.id) return [];
      const res = await api.get(`/joined/${user.id}`);
      return res.data;
    },
    getUserActivities: async () => {
      if (!user?.id) return [];
      const res = await api.get(`/user/${user.id}`);
      return res.data;
    },
    joinActivity, 
    createActivity
     
  };
}
