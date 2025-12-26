import { useEffect, useState } from "react";
import ActivityCard from "../components/ActivityCard";
import { useActivityApi } from "../api/ActivityApi";

export default function FeedPage() {
  const { getFeed, joinActivity } = useActivityApi();
  const [activities, setActivities] = useState([]);

  const loadFeed = async () => {
    const data = await getFeed();
    setActivities(data);
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const handleJoin = async (activityId) => {
    await joinActivity(activityId);
    loadFeed();
  };

  return (
    <>
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onJoin={handleJoin}
        />
      ))}
    </>
  );
}
