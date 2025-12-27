import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useClerk, useUser } from "@clerk/clerk-react";
import { useUserApi } from "../api/UserApi";

export default function Navbar() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const api = useUserApi();
  
  const navStyle = {
    display: "flex",
    gap: "1rem",
    padding: "1rem 2rem",
    backgroundColor: "#f0f9ff",
    alignItems: "center",
  };

  const linkStyle = {
    padding: "0.5rem 1.5rem",
    border: "2px solid #7dd3fc",
    borderRadius: "9999px",
    backgroundColor: "#bfdbfe",
    color: "#1e3a8a",
    textDecoration: "none",
    fontWeight: "500",
    transition: "all 0.2s",
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={linkStyle}>Feed</Link>

      <SignedIn>
        <Link to="/create" style={linkStyle}>Create</Link>
        <Link to="/friends" style={linkStyle}>Friends</Link>
        <Link to="/settings" style={linkStyle}>Settings</Link>
        <div style={{ marginLeft: "auto", display: "flex", gap: "1rem", alignItems: "center" }}>
          <UserButton />
          <button
            onClick={async () => {
              if (!user?.id) return;
              const ok = window.confirm("Delete your account, friendships, and activities? This cannot be undone.");
              if (!ok) return;
              try {
                await api.deleteUser(user.id);
                await signOut();
                window.location.href = "/login";
              } catch (err) {
                alert("Failed to delete account: " + (err.response?.data?.message || err.message));
              }
            }}
            style={{
              padding: "0.5rem 1.5rem",
              border: "2px solid #ff0000ff",
              borderRadius: "9999px",
              backgroundColor: "#f46f6fff",
              color: "#92400e",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Delete
          </button>
          <button
            onClick={() => signOut()}
            style={{
              padding: "0.5rem 1.5rem",
              border: "2px solid #1800b7ff",
              borderRadius: "9999px",
              backgroundColor: "#9ad2fcff",
              color: "#007bffff",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Logout
          </button>
        </div>
      </SignedIn>

      <SignedOut>
        <Link to="/login" style={linkStyle}>Login</Link>
      </SignedOut>
    </nav>
  );
}
