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
  // app-level unlocked state (keeps UI reactive)
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
      {/* show navbar only after unlocked */}
      {unlocked && <Navbar onLock={onLock} />}

      <Routes>
        {/* PIN flow */}
        <Route
          path="/set-pin"
          element={
            hasPin ? <Navigate to="/unlock" replace /> : <SetPin onSet={() => setHasPin(true)} />
          }
        />
        <Route
          path="/unlock"
          element={hasPin ? <UnlockPin onUnlock={onUnlock} /> : <Navigate to="/set-pin" replace />}
        />
        <Route path="/change-pin" element={
          unlocked ? <ChangePin /> : <Navigate to="/unlock" replace />
        } />

        {/* Protected app routes */}
        <Route element={<ProtectedRoute unlocked={unlocked} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/history" element={<History />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={
          unlocked ? <Navigate to="/" replace /> : (hasPin ? <Navigate to="/unlock" replace /> : <Navigate to="/set-pin" replace />)
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
