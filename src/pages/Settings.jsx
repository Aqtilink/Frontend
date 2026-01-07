import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useUserApi } from "../api/UserApi";

export default function Settings() {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState({
    firstName: "",
    lastName: "",
    age: "",
    city: "",
    email: "",
  });

  const api = useUserApi();

  useEffect(() => {
    async function loadProfile() {
      const res = await api.getUser(user.id);
      setProfile(res);
      setDraft({
        firstName: res.firstName || "",
        lastName: res.lastName || "",
        age: res.age || "",
        city: res.city || "",
        email: res.email || "",
      });
    }
    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  const isIncomplete =
    !profile?.firstName || !profile?.lastName || !profile?.age || !profile?.city;

  const fields = [
    { key: "firstName", label: "First name", type: "text", placeholder: "First name" },
    { key: "lastName", label: "Last name", type: "text", placeholder: "Last name" },
    { key: "age", label: "Age", type: "number", placeholder: "Age" },
    { key: "city", label: "City", type: "text", placeholder: "City" },
    { key: "email", label: "Email", type: "email", placeholder: "Email" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      firstName: (draft.firstName?.trim() || profile?.firstName || ""),
      lastName: (draft.lastName?.trim() || profile?.lastName || ""),
      age: draft.age !== "" && draft.age !== null && draft.age !== undefined
        ? Number(draft.age)
        : (profile?.age ?? 0),
      city: (draft.city?.trim() || profile?.city || ""),
      email: (draft.email?.trim() || profile?.email || ""),
    };
    console.log("Updating user:", user.id, "with payload:", payload);
    try {
      const updated = await api.updateUser(user.id, payload);
      console.log("Update successful:", updated);
      setProfile(updated);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update profile: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-card">
        {isIncomplete && (
          <div className="settings-alert">
            Your profile is incomplete. Please fill in the required fields below.
          </div>
        )}

        <div className="settings-header">
          <div>
            <p className="eyebrow">Account</p>
            <h2>Profile</h2>
            <p className="muted">
              Keep your info up to date so friends can recognize you.
            </p>
          </div>
          <div className="avatar-fallback">{profile?.firstName?.[0] || "?"}</div>
        </div>

        <form className="settings-form" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div className="settings-row" key={field.key}>
              <div className="setting-box setting-current">
                <p className="setting-label">Current {field.label}</p>
                <p className="setting-value">{profile?.[field.key] || "Not set"}</p>
              </div>

              <div className="setting-box setting-input">
                <label>
                  <span className="setting-label">New {field.label.toLowerCase()}</span>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={draft[field.key] || ""}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                  />
                </label>
              </div>
            </div>
          ))}

          <div className="form-actions">
            <button type="submit">Save changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
