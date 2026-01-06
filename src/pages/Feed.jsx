import { useEffect, useState } from "react";
import ActivityCard from "../components/ActivityCard";
import { useActivityApi } from "../api/ActivityApi";
import { useUser } from "@clerk/clerk-react";

export default function FeedPage() {
  const { getFeed, getFriendsFeed, getJoinedActivities, getUserActivities, joinActivity, deleteActivity } = useActivityApi();
  const { user } = useUser();
  const [activities, setActivities] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  const loadFeed = async () => {
    let data;
    switch (activeFilter) {
      case "friends":
        data = await getFriendsFeed();
        break;
      case "joined":
        data = await getJoinedActivities();
        break;
      case "owner":
        data = await getUserActivities();
        break;
      default:
        data = await getFeed();
    }
    setActivities(data);
  };

  useEffect(() => {
    loadFeed();
  }, [activeFilter]);

  const handleJoin = async (activityId) => {
    await joinActivity(activityId);
    loadFeed();
  };

  const handleDelete = async (activityId) => {
    await deleteActivity(activityId);
    loadFeed();
  };

  const filters = [
    { id: "all", label: "All Activities" },
    { id: "friends", label: "Friends" },
    { id: "joined", label: "Joined" },
    { id: "owner", label: "My Activities" },
  ];

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ 
        display: "flex", 
        gap: "0.5rem", 
        marginBottom: "1.5rem",
        borderBottom: "2px solid #e2e8f0",
        padding: "0.5rem 0"
      }}>
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            style={{
              padding: "0.65rem 1.5rem",
              background: activeFilter === filter.id ? "#2563eb" : "transparent",
              color: activeFilter === filter.id ? "white" : "#64748b",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: activeFilter === filter.id ? 700 : 500,
              fontSize: "0.95rem",
              transition: "all 0.2s ease",
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>
      
      {activities.length === 0 ? (
        <p style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>
          No activities found.
        </p>
      ) : (
        activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            currentUserId={user?.id}
            onJoin={handleJoin}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}
