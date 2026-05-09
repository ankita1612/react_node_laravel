import { NavLink } from "react-router-dom";
function Header() {
  return (
    <header className="shadow-lg">
      <div className="px-2 py-6 mx-auto max-w-7xl sm:px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Demo</h1>
          </div>
          <nav>
            <NavLink
              to="/property/list"
              className={({ isActive }) =>
                `transition hover:text-gray-600 ${
                  isActive ? "text-blue-600 font-semibold" : ""
                }`
              }
            >
              Property
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
