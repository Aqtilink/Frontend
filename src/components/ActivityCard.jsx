import { act } from "react";
import "./ActivityCard.css";
import { useState } from "react";

export default function ActivityCard({ activity, currentUserId, onJoin }) {
  const isOwner = activity.ownerId === currentUserId;
  const participants = Array.isArray(activity.participants) ? activity.participants : [];
  const alreadyJoined = participants.some(p => p.id === currentUserId) || isOwner;
  const isPast = new Date(activity.startTime) < new Date();

  const [showParticipants, setShowParticipants] = useState(false);

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
      <p>Owner: {activity.ownerName || "Unknown"}</p>
      <p>{activity.location}</p>
      <p>{new Date(activity.startTime).toLocaleString()}</p>

      <div style={{ display: "flex", alignItems: "center", marginTop: "8px", gap: "30px" }}>
        <div
          className="participants-widget"
          onMouseEnter={() => setShowParticipants(true)}
          onMouseLeave={() => setShowParticipants(false)}
        >
          Participants: {participants.length}
          {showParticipants && (
            <div className="participants-popup">
              {participants.map(p => `${p.firstName} ${p.lastName}`).join(", ")}
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
            color: "#2563eb",
            marginLeft: "30px"
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
    </div>
  );
}
