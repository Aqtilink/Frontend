import "./ActivityCard.css";
import { useState } from "react";

export default function ActivityCard({ activity, currentUserId, onJoin, onDelete }) {
  const isOwner = activity.ownerId === currentUserId;
  const participants = Array.isArray(activity.participants) ? activity.participants : [];
  const participantIds = participants
    .map((p) => (typeof p === "string" ? p : p.id))
    .filter(Boolean);
  const alreadyJoined = participantIds.includes(currentUserId) || isOwner;
  const isPast = new Date(activity.startTime) < new Date();

  const [showParticipants, setShowParticipants] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const ownerLabel = (() => {
    if (activity.owner) {
      const name = `${activity.owner.firstName || ""} ${activity.owner.lastName || ""}`.trim();
      if (name.length > 0) return name;
    }
    if (activity.ownerName) return activity.ownerName; // backward compatibility
    return "Unknown";
  })();

  const cardClass = `
    activity-card
    ${alreadyJoined ? "joined" : ""}
    ${isPast ? "past" : ""}
  `;

  return (
    <div className={cardClass}>
      <div className="title-with-type">
        <h3>{activity.title}</h3>
        {activity.sportType && <span className="activity-type">{activity.sportType}</span>}
      </div>
      <p>Owner: {ownerLabel}</p>
      <p>{activity.location}</p>
      <p>{new Date(activity.startTime).toLocaleString()}</p>

      <div style={{ display: "flex", alignItems: "center", marginTop: "8px", gap: "30px", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          <div
            className="participants-widget"
            onMouseEnter={() => setShowParticipants(true)}
            onMouseLeave={() => setShowParticipants(false)}
          >
            Participants: {participants.length}
            {showParticipants && (
              <div className="participants-popup">
                {participants.length > 0 
                  ? participants.map(p => {
                      if (typeof p === "string") {
                        const parts = p.split("_");
                        return parts.length > 1 ? parts[1].substring(0, 8) : p.substring(0, 8);
                      }
                      const name = `${p.firstName || ""} ${p.lastName || ""}`.trim();
                      if (name.length > 0) return name;
                      if (p.id) {
                        const parts = p.id.split("_");
                        return parts.length > 1 ? parts[1].substring(0, 8) : p.id.substring(0, 8);
                      }
                      return "";
                    }).join(", ")
                  : "No participants"
                }
              </div>
            )}
          </div>

          {isOwner ? (
            <div style={{ 
              background: "transparent", 
              border: "2px solid #2563eb",
              borderRadius: "12px",
              padding: "0.6rem 1rem",
              fontWeight: 700,
              fontSize: "0.9rem",
              textAlign: "center",
              color: "#2563eb"
            }}>
              Owner
            </div>
          ) : (
            <button className="join"
              disabled={alreadyJoined || isPast}
              onClick={() => onJoin(activity.id)}
            >
              {alreadyJoined ? "✓ Joined" : isPast ? "Finished" : "Join"}
            </button>
          )}
        </div>

        {isOwner && (
          <button 
            className="delete-btn"
            onClick={async () => {
              setIsDeleting(true);
              try {
                await onDelete(activity.id);
              } catch (error) {
                console.error("Error deleting activity:", error);
                setIsDeleting(false);
              }
            }}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
    </div>
  );
}
