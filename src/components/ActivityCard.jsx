import "./ActivityCard.css";
import { useState } from "react";

export default function ActivityCard({ activity, currentUserId, onJoin }) {
  const alreadyJoined = activity.participants?.some(p => p.id === currentUserId);
  const isPast = new Date(activity.startTime) < new Date();

  const [showParticipants, setShowParticipants] = useState(false);

  const cardClass = `
    activity-card
    ${alreadyJoined ? "joined" : ""}
    ${isPast ? "past" : ""}
  `;

  return (
    <div className={cardClass}>
      <h3>{activity.title}</h3>
      <p>Owner: {activity.ownerName || "Unknown"}</p>
      <p>{activity.location}</p>
      <p>{new Date(activity.startTime).toLocaleString()}</p>

      <div
        className="participants-widget"
        onMouseEnter={() => setShowParticipants(true)}
        onMouseLeave={() => setShowParticipants(false)}
      >
        Participants: {activity.participants.length}
        {showParticipants && (
          <div className="participants-popup">
            {activity.participants.map(p => `${p.firstName} ${p.lastName}`).join(", ")}
          </div>
        )}
      </div>

      <button
        disabled={alreadyJoined || isPast}
        onClick={() => onJoin(activity.id)}
      >
        {alreadyJoined ? "Joined" : isPast ? "Finished" : "Join"}
      </button>
    </div>
  );
}
