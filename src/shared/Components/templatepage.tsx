import { useNavigate, useLocation } from 'react-router-dom';
import { useRef, useEffect, JSX } from 'react';
type TemplatePageProps = {
  children: React.ReactNode;
  dockDisabled?: boolean;
};

type DockItem = {
  to: string;
  label: string;
  icon: JSX.Element;
};

function TemplatePage({ children, dockDisabled }: TemplatePageProps): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const dockRef = useRef(null);
  const refs = {
    '/': useRef(null),
    '/createtrain': useRef(null),
    '/editTrain': useRef(null),
    '/training': useRef(null),
    '/cardio': useRef(null),
    '/nutrition': useRef(null),
    '/aicoach': useRef(null),
    '/profile': useRef(null),
    '/counter': useRef(null),
    '/statistic': useRef(null),
    '/credentials': useRef(null),
  };

  useEffect(() => {
    const ref = refs[location.pathname];
    if (ref && ref.current && dockRef.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [location.pathname]);

  const dockItems: DockItem[] = [
    {
      to: '/',
      label: 'Home',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 mx-auto text-amber-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      to: '/createtrain',
      label: 'Create',
      icon: (
        <img src="/plan.png" className="w-6 h-6 mx-auto filter brightness-0 invert" alt="Create" />
      ),
    },
    {
      to: '/editTrain',
      label: 'Edit',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 mx-auto text-amber-50"
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
      label: 'Workout',
      icon: (
        <img
          src="./pullup.png"
          className="w-6 h-6 mx-auto filter brightness-0 invert"
          alt="Workout"
        />
      ),
    },
    {
      to: '/cardio',
      label: 'Cardio',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318    6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
    {
      to: '/nutrition',
      label: 'Nutrition',
      icon: (
        <img
          src="./nutrition-plan.png"
          className="w-6 h-6 mx-auto filter brightness-0 invert"
          alt="Nutrition"
        />
      ),
    },
    {
      to: '/aicoach',
      label: 'AI Coach',
      icon: (
        <img
          src="./aicoach.png"
          className="w-6 h-6 mx-auto filter brightness-0 invert"
          alt="AI Coach"
        />
      ),
    },
    {
      to: '/profile',
      label: 'Profile',
      icon: (
        <img
          src="./scale.png"
          className="w-6 h-6 mx-auto filter brightness-0 invert"
          alt="Profile"
        />
      ),
    },
    {
      to: '/counter',
      label: 'Timer',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 mx-auto text-amber-50"
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
      label: 'Statistics',
      icon: (
        <img
          src="./statistic.png"
          className="w-6 h-6 mx-auto filter brightness-0 invert"
          alt="Statistics"
        />
      ),
    },
    {
      to: '/credentials',
      label: 'Credentials',
      icon: (
        <img
          src="./credentials.png"
          className="w-6 h-6 mx-auto filter brightness-0 invert"
          alt="Credentials"
        />
      ),
    },
  ];

  return (
    <>
      {/* iOS Landscape-Sperre: CSS-Overlay */}
      <div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-950 text-white"
        style={{ display: 'none' }}
        id="landscape-overlay"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-16 mb-4 text-blue-400 animate-spin-slow"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <p className="text-lg font-semibold">Please rotate your device</p>
        <p className="text-sm text-gray-400 mt-1">This app is optimized for portrait mode.</p>
      </div>
      <style>{`
        @media (orientation: landscape) and (max-width: 1024px) {
          #landscape-overlay { display: flex !important; }
        }
      `}</style>
      <div className="min-h-[100dvh] bg-gradient-to-b from-gray-900 min-w-[100dvw] to-black flex flex-col items-center px-1 py-3">
        {/* vertikale Zentrierung */}
        <div className="flex flex-col items-center sm:items-center  w-full pt-16 pb-8">
          <div className="w-full lg:h-full h-[80dvh] max-h-[100dvh] min-w-[320px] lg:w-auto max-w-sm sm:max-w-md lg:max-w-4xl space-y-6 rounded-xl bg-black/20 border border-white/20 p-6 sm:p-8 shadow-xl backdrop-blur-lg">
            {children}
          </div>
          {!dockDisabled ? (
            <div
              className="dock bg-neutral h-16 w-full max-w-4xl rounded-xl overflow-y-hidden text-neutral-content overflow-x-auto mt-6 sm:hidden"
              style={{ maxWidth: 400, width: '100%' }}
              ref={dockRef}
            >
              {dockItems.map((item) => (
                <button
                  key={item.to}
                  ref={refs[item.to]}
                  style={{ minWidth: 105, padding: '4px 0' }}
                  className={location.pathname === item.to ? 'dock-active' : ''}
                  onClick={() => navigate(item.to)}
                >
                  {item.icon}
                  <span className="dock-label">{item.label}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default TemplatePage;
