import { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <div className="navbar fixed top-0 left-0 w-full bg-black text-white z-50">
        <div className="flex w-full justify-between items-center px-4">
          <Link to="/" className="btn btn-ghost text-white text-lg font-bold">
            Fitness
          </Link>
          <div className="md:hidden">
            <button
              className="btn btn-ghost text-white"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          <div
            className={`flex-col md:flex md:flex-row md:items-center md:static absolute top-full left-0 w-full md:w-auto bg-black md:bg-transparent z-40 transition-all duration-200 ${
              menuOpen ? "flex" : "hidden"
            }`}
          >
            <Link
              to="/profile"
              className="btn btn-ghost text-white"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/createtrain"
              className="btn btn-ghost text-white"
              onClick={() => setMenuOpen(false)}
            >
              Create training
            </Link>
            <Link
              to="/edittrain"
              className="btn btn-ghost text-white"
              onClick={() => setMenuOpen(false)}
            >
              Edit training
            </Link>
            <Link
              to="/training"
              className="btn btn-ghost text-white"
              onClick={() => setMenuOpen(false)}
            >
              Start training
            </Link>
            <Link
              to="/login"
              className="btn btn-ghost text-white md:ml-4"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/counter"
              className="btn btn-ghost text-white md:ml-4"
              onClick={() => setMenuOpen(false)}
            >
              Timer
            </Link>
            <button
              className="btn btn-ghost text-white md:ml-4"
              onClick={() => setMenuOpen(false)}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
