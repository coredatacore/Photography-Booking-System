import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const AdminRoute = () => {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-dark text-primary">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (userProfile?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};