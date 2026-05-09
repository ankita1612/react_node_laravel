import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  children?: React.ReactNode;
};
const PublicRoute = ({ children }: Props) => {
  // const auth_data: string | null = localStorage.getItem("auth_data");
  // if (auth_data) {
  const { accessToken, loading } = useAuth();
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
  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PublicRoute;
