import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from './api';
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handlelogout = () => {
    api.post('/logout', {}, { withCredentials: true }).then(() => navigate('/login'));

    setMenuOpen(false);
  };

  return (
    <div>
      <div className="navbar fixed top-0 left-0 w-full bg-black text-white z-50">
        <div className="flex w-full justify-between items-center px-4">
          <Link to="/" className="btn btn-ghost text-white text-lg font-bold flex items-center">
            <figure className="w-9 h-9 mb-2">
              <img
                src={'./squats.png'}
                className="w-full h-full object-cover rounded-md filter brightness-0 invert"
              />
            </figure>
          </Link>
          <div className="lg:hidden">
            <button
              className="btn btn-ghost text-white"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                // X-Icon
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger-Icon
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
              )}
            </button>
          </div>
          <div
            className={`flex-col lg:flex lg:flex-row lg:items-center lg:static absolute top-full left-0 w-full lg:w-auto bg-black lg:bg-transparent z-40 transition-all duration-200 ${
              menuOpen ? 'flex' : 'hidden'
            }`}
          >
            <Link
              to="/createtrain"
              className="btn btn-ghost text-white"
              onClick={() => setMenuOpen(false)}
            >
              <div className="flex justify-center my-4">
                <img
                  src="/plan.png"
                  className="h-5 w-5 object-cover rounded-md"
                  alt="Create Training Icon"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>
              Create Workout
            </Link>
            <Link
              to="/edittrain"
              className="btn btn-ghost text-white"
              onClick={() => setMenuOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-amber-50" // <-- Klasse für Größe und Farbe hinzugefügt
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Workout
            </Link>
            <Link
              to="/training"
              className="btn btn-ghost text-white"
              onClick={() => setMenuOpen(false)}
            >
              <img src={'./pullup.png'} className="w-6 h-6 mr-1 filter brightness-0 invert" />
              Start Workout
            </Link>

            <Link
              to="/profile"
              className="btn btn-ghost text-white"
              onClick={() => setMenuOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-amber-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile
            </Link>

            <Link
              to="/counter"
              className="btn btn-ghost text-white md:ml-4"
              onClick={() => setMenuOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-amber-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Stopwatch
            </Link>
            <Link
              to="/statistic"
              className="btn btn-ghost text-white md:ml-4"
              onClick={() => setMenuOpen(false)}
            >
              <figure className="w-5 h-5 mb-2">
                <img
                  src={'./statistic.png'}
                  className="w-full h-full object-cover rounded-md filter brightness-0 invert"
                />
              </figure>
              Statistic
            </Link>
            <button className="btn btn-ghost text-white md:ml-4" onClick={() => handlelogout()}>
              <svg
                icon
                für
                logout
                className="h-6 w-6 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
