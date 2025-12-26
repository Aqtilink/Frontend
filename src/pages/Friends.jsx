import { useEffect, useState } from "react";
import { useUserApi } from "../api/UserApi";

export default function Friends() {
  const { getFriends, searchUsers, sendFriendRequest, getPendingRequests, acceptFriendRequest, rejectFriendRequest } = useUserApi();
  
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadData = async () => {
    try {
      const [friendsData, pendingData] = await Promise.all([
        getFriends(),
        getPendingRequests()
      ]);
      setFriends(friendsData);
      setPendingRequests(pendingData);
    } catch (err) {
      console.error("Error loading friends data:", err);
      console.error("Error response:", err.response?.data);
      setError(`Could not load data: ${err.response?.data?.message || err.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    setError("");
    try {
      const results = await searchUsers(searchQuery);
      // Filter out already friends and self
      const friendIds = friends.map(f => f.id);
      const filtered = results.filter(user => !friendIds.includes(user.id));
      setSearchResults(filtered);
    } catch (err) {
      setError("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleSendRequest = async (userId) => {
    setError("");
    setSuccessMessage("");
    try {
      await sendFriendRequest(userId);
      setSuccessMessage("Friend request sent!");
      // Remove from search results
      setSearchResults(results => results.filter(u => u.id !== userId));
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to send friend request.");
    }
  };

  const handleAcceptRequest = async (requestId) => {
    setError("");
    setSuccessMessage("");
    try {
      await acceptFriendRequest(requestId);
      setSuccessMessage("Friend request accepted!");
      await loadData();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to accept friend request.");
    }
  };

  const handleRejectRequest = async (requestId) => {
    setError("");
    setSuccessMessage("");
    try {
      await rejectFriendRequest(requestId);
      setSuccessMessage("Friend request rejected.");
      setPendingRequests(reqs => reqs.filter(r => r.id !== requestId));
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to reject friend request.");
    }
  };

  if (loading) return <p style={{ padding: "1rem" }}>Loading...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>Friends</h2>

      {error && <p style={{ color: "#b91c1c", marginBottom: "1rem" }}>{error}</p>}
      {successMessage && <p style={{ color: "#16a34a", marginBottom: "1rem" }}>{successMessage}</p>}

      {/* Search Section */}
      <div style={{ marginBottom: "2rem", padding: "1.5rem", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Search Users</h3>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: "0.65rem 0.8rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "0.95rem"
            }}
          />
          <button
            type="submit"
            disabled={searching}
            style={{
              padding: "0.65rem 1.5rem",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: searching ? "not-allowed" : "pointer",
              opacity: searching ? 0.6 : 1
            }}
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </form>

        {searchResults.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {searchResults.map((user) => (
              <li
                key={user.id}
                style={{
                  padding: "0.75rem 1rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  background: "white",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <strong>{user.firstName} {user.lastName}</strong>
                  <div style={{ color: "#64748b", fontSize: "0.9rem" }}>{user.email}</div>
                </div>
                <button
                  onClick={() => handleSendRequest(user.id)}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.9rem"
                  }}
                >
                  Add Friend
                </button>
              </li>
            ))}
          </ul>
        )}
        {searchQuery && searchResults.length === 0 && !searching && (
          <p style={{ marginTop: "1rem", color: "#64748b" }}>No users found.</p>
        )}
      </div>

      {/* Pending Requests Section */}
      {pendingRequests.length > 0 && (
        <div style={{ marginBottom: "2rem", padding: "1.5rem", background: "#fef3c7", borderRadius: "12px", border: "1px solid #fbbf24" }}>
          <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Pending Friend Requests ({pendingRequests.length})</h3>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {pendingRequests.map((request) => (
              <li
                key={request.id}
                style={{
                  padding: "0.75rem 1rem",
                  border: "1px solid #fbbf24",
                  borderRadius: "8px",
                  background: "white",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <strong>{request.senderFirstName} {request.senderLastName}</strong>
                  <div style={{ color: "#64748b", fontSize: "0.9rem" }}>{request.senderEmail}</div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.9rem"
                    }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.id)}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.9rem"
                    }}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Friends List Section */}
      <div style={{ padding: "1.5rem", background: "#f0fdf4", borderRadius: "12px", border: "1px solid #86efac" }}>
        <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Your Friends ({friends.length})</h3>
        {friends.length === 0 ? (
          <p style={{ color: "#64748b" }}>No friends yet. Search and add some friends!</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {friends.map((friend) => (
              <li
                key={friend.id}
                style={{
                  padding: "0.75rem 1rem",
                  border: "1px solid #86efac",
                  borderRadius: "8px",
                  background: "white"
                }}
              >
                <strong>{friend.firstName} {friend.lastName}</strong>
                <div style={{ color: "#64748b", fontSize: "0.9rem" }}>{friend.email}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

