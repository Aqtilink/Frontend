import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

import Login from "./pages/Login";
import Feed from "./pages/Feed";
import CreateActivity from "./pages/CreateActivity";
import Friends from "./pages/Friends";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <SignedIn>
        <Navbar />
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/create" element={<CreateActivity />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </SignedIn>

      <SignedOut>
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </SignedOut>
    </BrowserRouter>
  );
}
