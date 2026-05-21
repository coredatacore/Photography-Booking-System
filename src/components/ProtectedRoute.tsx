import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-dark text-primary">Loading...</div>;
  }

  return currentUser ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};