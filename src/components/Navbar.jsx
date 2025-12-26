import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

export default function Navbar() {
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
        <UserButton />
      </SignedIn>

      <SignedOut>
        <Link to="/login" style={linkStyle}>Login</Link>
      </SignedOut>
    </nav>
  );
}
