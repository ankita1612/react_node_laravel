import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";
import { useAuth } from "./../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await apiClient.post("/api/auth/logout");

      toast.success("Logout successfully"); // ✅ toaster here
    } catch (err) {
      toast.error("Logout failed"); // optional error toast
    }

    logout();

    navigate("/login", {
      replace: true,
    });
  };
  return (
    <header className="shadow-lg">
      <div className="px-2 py-6 mx-auto max-w-7xl sm:px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Demo</h1>
          </div>
          <nav className="hidden gap-6 md:flex">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `transition hover:text-gray-600 ${
                  isActive ? "text-blue-600 font-semibold" : ""
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `transition hover:text-gray-600 ${
                  isActive ? "text-blue-600 font-semibold" : ""
                }`
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/registration"
              className={({ isActive }) =>
                `transition hover:text-gray-600 ${
                  isActive ? "text-blue-600 font-semibold" : ""
                }`
              }
            >
              Registration
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `transition hover:text-gray-600 ${
                  isActive ? "text-blue-600 font-semibold" : ""
                }`
              }
            >
              About
            </NavLink>

            <button
              onClick={handleLogout}
              className="text-red-500 transition hover:text-gray-600"
            >
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
