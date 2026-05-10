import toast from "react-hot-toast";
import { useAuth } from "./../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error("Logout failed");
      navigate("/login", { replace: true });
    }
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
            {!user && (
              <>
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
              </>
            )}
            {user && (
              <>
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
                <NavLink
                  to="/employee/list"
                  className={({ isActive }) =>
                    `transition hover:text-gray-600 ${
                      isActive ? "text-blue-600 font-semibold" : ""
                    }`
                  }
                >
                  Employee
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="text-red-500 transition hover:text-gray-600"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
