import { SignInButton } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to AqtiLink</h1>
      <SignInButton mode="modal">
        <button>Sign in</button>
      </SignInButton>
    </div>
  );
}
