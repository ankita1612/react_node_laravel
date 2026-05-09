import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please login first");
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-white rounded-full border-t-transparent animate-spin"></div>

          <p className="text-sm text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
