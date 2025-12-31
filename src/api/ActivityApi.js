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
    // Ensure we always return an array
    return Array.isArray(res.data) ? res.data : [];
  }

  const getFriendsFeed = async () => {
    if (!user?.id) return [];
    try {
      const res = await api.get(`/friends-feed/${user.id}`);
      // For now, friends-feed returns all activities
      // TODO: implement proper friend filtering
      return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
      console.error("Error fetching friends feed:", error);
      // Fall back to all activities if there's an error
      try {
        const res = await api.get("/all");
        return Array.isArray(res.data) ? res.data : [];
      } catch {
        return [];
      }
    }
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
      participants: [], // Initialize as empty array
    };
    try {
      const res = await api.post("/json", activityPayload);
      return res.data;
    } catch (error) {
      console.error("Error creating activity:", error);
      // Even if response fails, the activity was likely created
      // since it appears in the feed
      throw error;
    }
  };

  return { 
    getFeed, 
    getFriendsFeed,
    getJoinedActivities: async () => {
      if (!user?.id) return [];
      try {
        const res = await api.get(`/joined/${user.id}`);
        return Array.isArray(res.data) ? res.data : [];
      } catch (error) {
        console.error("Error fetching joined activities:", error);
        return [];
      }
    },
    getUserActivities: async () => {
      if (!user?.id) return [];
      try {
        const res = await api.get(`/user/${user.id}`);
        return Array.isArray(res.data) ? res.data : [];
      } catch (error) {
        console.error("Error fetching user activities:", error);
        return [];
      }
    },
    joinActivity, 
    createActivity
     
  };
}
