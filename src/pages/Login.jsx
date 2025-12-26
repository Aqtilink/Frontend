import { SignInButton } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div style={{ 
      padding: "2rem", 
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      gap: "2rem"
    }}>
      <div>
        <h1 style={{ fontSize: "3rem", margin: "0 0 0.5rem 0", fontWeight: 800 }}>Welcome to AqtiLink</h1>
        <h2 style={{ fontSize: "1.5rem", margin: 0, fontWeight: 400, color: "#64748b" }}>
          An app for lazy people that want to be active.
        </h2>
      </div>
      <SignInButton mode="modal">
        <button style={{
          background: "linear-gradient(135deg, #60a5fa, #2563eb)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          padding: "0.9rem 2.5rem",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 10px 25px rgba(37, 99, 235, 0.25)",
          transition: "transform 0.12s ease, box-shadow 0.12s ease",
          fontSize: "1.1rem"
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 15px 35px rgba(37, 99, 235, 0.35)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 10px 25px rgba(37, 99, 235, 0.25)";
        }}>
          Sign in
        </button>
      </SignInButton>
    </div>
  );
}
