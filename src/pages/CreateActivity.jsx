import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useActivityApi } from "../api/ActivityApi";

export default function CreateActivity() {
  const { createActivity } = useActivityApi();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    location: "",
    startTime: "",
    sportType: "RUNNING",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        title: form.title.trim(),
        location: form.location.trim(),
        sportType: form.sportType,
        // send the local datetime string; backend maps to LocalDateTime
        startTime: form.startTime,
      };

      await createActivity(payload);
      navigate("/");
    } catch (err) {
      setError("Failed to create activity. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "480px", margin: "2rem auto", padding: "1.5rem", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
      <h2 style={{ marginBottom: "1rem" }}>Create Activity</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <span>Title</span>
          <input
            required
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Morning run"
            style={{ padding: "0.65rem 0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <span>Location</span>
          <input
            required
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="City park"
            style={{ padding: "0.65rem 0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <span>Start time</span>
          <input
            required
            type="datetime-local"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            style={{ padding: "0.65rem 0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <span>Sport type</span>
          <select
            name="sportType"
            value={form.sportType}
            onChange={handleChange}
            style={{ padding: "0.65rem 0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
          >
            <option value="RUNNING">Running</option>
            <option value="CYCLING">Cycling</option>
            <option value="SWIMMING">Swimming</option>
            <option value="HIKING">Hiking</option>
            <option value="WALKING">Walking</option>
          </select>
        </label>

        {error && <p style={{ color: "#b91c1c", margin: 0 }}>{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "10px",
            border: "none",
            background: submitting ? "#93c5fd" : "#3b82f6",
            color: "white",
            fontWeight: 600,
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}
