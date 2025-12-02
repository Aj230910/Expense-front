import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedRoute({ unlocked }) {
  // if unlocked -> allow child routes via <Outlet />
  // otherwise redirect to unlock page
  return unlocked ? <Outlet /> : <Navigate to="/unlock" replace />;
}
