import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useClerk } from "@clerk/clerk-react";

export default function Navbar() {
  const { signOut } = useClerk();
  
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
            onClick={() => signOut()}
            style={{
              padding: "0.5rem 1.5rem",
              border: "2px solid #ef4444",
              borderRadius: "9999px",
              backgroundColor: "#fee2e2",
              color: "#991b1b",
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
