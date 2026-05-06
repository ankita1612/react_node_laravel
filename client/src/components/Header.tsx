function Header() {
  return (
    <header className="shadow-lg">
      <div className="px-2 py-6 mx-auto max-w-7xl sm:px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Demo</h1>
          </div>
          <nav className="hidden gap-6 md:flex">
            <a href="#" className="transition hover:text-gray-600">
              Home
            </a>
            <a href="#" className="transition hover:text-gray-600">
              About
            </a>
            <a href="#" className="transition hover:text-gray-600">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
