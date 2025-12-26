import { useEffect, useState } from "react";
import { useUserApi } from "../api/UserApi";

export default function Friends() {
  const { getFriends } = useUserApi();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const data = await getFriends();
        setFriends(data);
      } catch (err) {
        setError("Could not load friends. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadFriends();
  }, []);

  if (loading) return <p style={{ padding: "1rem" }}>Loading friends...</p>;
  if (error) return <p style={{ padding: "1rem", color: "#b91c1c" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "640px", margin: "2rem auto", padding: "1rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Friends</h2>
      {friends.length === 0 ? (
        <p>No friends yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {friends.map((friend) => (
            <li key={friend.id} style={{ padding: "0.75rem 1rem", border: "1px solid #e2e8f0", borderRadius: "10px", background: "#f8fafc" }}>
              <strong>{friend.firstName} {friend.lastName}</strong>
              <div style={{ color: "#475569" }}>{friend.email}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
