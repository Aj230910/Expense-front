// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransaction";
import History from "./pages/History";
import SetPin from "./pages/SetPin";
import UnlockPin from "./pages/UnlockPin";
import ChangePin from "./pages/ChangePin";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  // ⭐ Generate deviceId on first load (IMPORTANT)
  useEffect(() => {
    let id = localStorage.getItem("deviceId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("deviceId", id);
      console.log("Generated new deviceId:", id);
    }
  }, []);

  // ⭐ PIN system state
  const [unlocked, setUnlocked] = useState(
    localStorage.getItem("pinUnlocked") === "true"
  );
  const [hasPin, setHasPin] = useState(Boolean(localStorage.getItem("pin")));

  useEffect(() => {
    setHasPin(Boolean(localStorage.getItem("pin")));
  }, []);

  const onUnlock = () => {
    localStorage.setItem("pinUnlocked", "true");
    setUnlocked(true);
  };

  const onLock = () => {
    localStorage.setItem("pinUnlocked", "false");
    setUnlocked(false);
  };

  return (
    <BrowserRouter>
      
      {/* Show nav only when unlocked */}
      {unlocked && <Navbar onLock={onLock} />}

      <Routes>

        {/* PIN screens */}
        <Route
          path="/set-pin"
          element={
            hasPin
              ? <Navigate to="/unlock" replace />
              : <SetPin onSet={() => setHasPin(true)} />
          }
        />

        <Route
          path="/unlock"
          element={
            hasPin
              ? <UnlockPin onUnlock={onUnlock} />
              : <Navigate to="/set-pin" replace />
          }
        />

        <Route
          path="/change-pin"
          element={
            unlocked
              ? <ChangePin />
              : <Navigate to="/unlock" replace />
          }
        />

        {/* Protected Main App Routes */}
        <Route element={<ProtectedRoute unlocked={unlocked} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/history" element={<History />} />
        </Route>

        {/* Fallback routing */}
        <Route
          path="*"
          element={
            unlocked
              ? <Navigate to="/" replace />
              : (hasPin
                  ? <Navigate to="/unlock" replace />
                  : <Navigate to="/set-pin" replace />
                )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
