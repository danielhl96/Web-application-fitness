import { JSX } from 'react';
import { Link } from 'react-router-dom';
import { useHeader } from '../hooks/useHeader';

// OCP: add a new route here — no JSX changes needed
interface NavItem {
  to: string;
  label: string;
  icon: JSX.Element;
}

const navItems: NavItem[] = [
  {
    to: '/createtrain',
    label: 'Create Workout',
    icon: (
      <img
        src="/plan.png"
        className="h-5 w-5 object-cover rounded-md"
        alt="Create Training Icon"
        style={{ filter: 'brightness(0) invert(1)' }}
      />
    ),
  },
  {
    to: '/edittrain',
    label: 'Edit Workout',
    icon: (
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
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
  },
  {
    to: '/training',
    label: 'Start Workout',
    icon: (
      <img
        src="./pullup.png"
        className="w-6 h-6 mr-1 filter brightness-0 invert"
        alt="Start Workout"
      />
    ),
  },
  {
    to: '/nutrition',
    label: 'Nutrition',
    icon: (
      <img
        src="./nutrition-plan.png"
        className="w-5 h-5 object-cover rounded-md filter brightness-0 invert"
        alt="Nutrition"
      />
    ),
  },
  {
    to: '/aicoach',
    label: 'AI-Coach',
    icon: (
      <img
        src="./aicoach.png"
        className="w-5 h-5 object-cover rounded-md filter brightness-0 invert"
        alt="AI-Coach"
      />
    ),
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: (
      <img src="./scale.png" className="w-6 h-6 mr-1 filter brightness-0 invert" alt="Profile" />
    ),
  },
  {
    to: '/counter',
    label: 'Stopwatch',
    icon: (
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
    ),
  },
  {
    to: '/statistic',
    label: 'Statistic',
    icon: (
      <img
        src="./statistic.png"
        className="w-5 h-5 object-cover rounded-md filter brightness-0 invert"
        alt="Statistic"
      />
    ),
  },
  {
    to: '/credentials',
    label: 'Credentials',
    icon: (
      <img
        src="./credentials.png"
        className="w-5 h-5 object-cover rounded-md filter brightness-0 invert"
        alt="Credentials"
      />
    ),
  },
];

function Header(): JSX.Element {
  const { menuOpen, toggleMenu, closeMenu, handleLogout } = useHeader();

  return (
    <div>
      <div className="navbar fixed top-0 left-0 w-full bg-black text-white z-50">
        <div className="flex w-full justify-between items-center px-4">
          <Link to="/" className="btn btn-ghost text-white text-lg font-bold flex items-center">
            <figure className="w-9 h-9 mb-2">
              <img
                src="./squats.png"
                className="w-full h-full object-cover rounded-md filter brightness-0 invert"
                alt="Logo"
              />
            </figure>
          </Link>

          {/* Hamburger toggle (mobile) */}
          <div className="lg:hidden">
            <button
              className="btn btn-ghost text-white"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          {/* Nav links */}
          <div
            className={`flex-col lg:flex lg:flex-row lg:items-center lg:static absolute top-full left-0 w-full lg:w-auto bg-black lg:bg-transparent z-40 transition-all duration-200 ${menuOpen ? 'flex' : 'hidden'}`}
          >
            {navItems.map(({ to, label, icon }) => (
              <Link key={to} to={to} className="btn btn-ghost text-white" onClick={closeMenu}>
                {icon}
                {label}
              </Link>
            ))}

            <button className="btn btn-ghost text-white md:ml-4" onClick={handleLogout}>
              <svg className="h-6 w-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
