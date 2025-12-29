import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./Index.css";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkJsUrl = import.meta.env.VITE_CLERK_JS_URL || "https://cdn.clerk.com";

if (!clerkPubKey) {
  console.warn("Clerk publishable key missing. Set VITE_CLERK_PUBLISHABLE_KEY.");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey} clerkJSUrl={clerkJsUrl}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
