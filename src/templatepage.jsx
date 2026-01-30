import { useNavigate, useLocation } from 'react-router-dom';
import { useRef, useEffect } from 'react';

function TemplatePage({ children, dockDisabled }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dockRef = useRef(null);
  const refs = {
    '/': useRef(null),
    '/createtrain': useRef(null),
    '/editTrain': useRef(null),
    '/training': useRef(null),
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

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-gray-900 to-black flex flex-col items-center px-1 py-3">
      {/* vertikale Zentrierung */}
      <div className="flex flex-col items-center sm:items-center  w-full pt-16 pb-8">
        <div className="w-full lg:h-full h-[80dvh] max-h-[100dvh] lg:w-auto max-w-sm sm:max-w-md lg:max-w-4xl space-y-6 rounded-xl bg-black/20 border border-white/20 p-6 sm:p-8 shadow-xl backdrop-blur-lg">
          {children}
        </div>
        {!dockDisabled ? (
          <div
            className="dock bg-neutral h-16 w-full max-w-4xl overflow-y-hidden text-neutral-content overflow-x-auto mt-6 sm:hidden"
            style={{ maxWidth: 400, width: '100%' }}
            ref={dockRef}
          >
            <button
              ref={refs['/']}
              style={{ minWidth: 105, padding: '4px 0' }}
              className={location.pathname === '/' ? 'dock-active' : ''}
              onClick={() => navigate('/')}
            >
              <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g fill="currentColor" strokeLinejoin="miter" strokeLinecap="butt">
                  <polyline
                    points="1 11 12 2 23 11"
                    fill="none"
                    stroke="currentColor"
                    stroke-miterlimit="10"
                    strokeWidth="2"
                  ></polyline>
                  <path
                    d="m5,13v7c0,1.105.895,2,2,2h10c1.105,0,2-.895,2-2v-7"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="square"
                    stroke-miterlimit="10"
                    strokeWidth="2"
                  ></path>
                  <line
                    x1="12"
                    y1="22"
                    x2="12"
                    y2="18"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="square"
                    stroke-miterlimit="10"
                    strokeWidth="2"
                  ></line>
                </g>
              </svg>
              <span className="dock-label">Home</span>
            </button>
            <button
              ref={refs['/createtrain']}
              style={{ minWidth: 105 }}
              className={location.pathname === '/createtrain' ? 'dock-active' : ''}
              onClick={() => navigate('/createtrain')}
            >
              <img
                src={'/plan.png'}
                className="w-6 h-6 mx-auto filter brightness-0 invert"
                alt="Create"
              />
              <span className="dock-label">Create</span>
            </button>
            <button
              ref={refs['/editTrain']}
              style={{ minWidth: 105 }}
              className={location.pathname === '/editTrain' ? 'dock-active' : ''}
              onClick={() => navigate('/editTrain')}
            >
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
              <span className="dock-label">Edit</span>
            </button>
            <button
              ref={refs['/training']}
              style={{ minWidth: 105 }}
              className={location.pathname === '/training' ? 'dock-active' : ''}
              onClick={() => navigate('/training')}
            >
              <img
                src={'./pullup.png'}
                className="w-6 h-6 mx-auto filter brightness-0 invert"
                alt="Workout"
              />
              <span className="dock-label">Workout</span>
            </button>
            <button
              ref={refs['/nutrition']}
              style={{ minWidth: 105 }}
              className={location.pathname === '/nutrition' ? 'dock-active' : ''}
              onClick={() => navigate('/nutrition')}
            >
              <img
                src={'./nutrition-plan.png'}
                className="w-6 h-6 mx-auto filter brightness-0 invert"
                alt="Nutrition"
              />
              <span className="dock-label">Nutrition</span>
            </button>
            <button
              ref={refs['/aicoach']}
              style={{ minWidth: 105 }}
              className={location.pathname === '/aicoach' ? 'dock-active' : ''}
              onClick={() => navigate('/aicoach')}
            >
              <img src={'./aicoach.png'} className="w-6 h-6 mx-auto filter brightness-0 invert" />
              <span className="dock-label">AI Coach</span>
            </button>
            <button
              ref={refs['/profile']}
              style={{ minWidth: 105 }}
              className={location.pathname === '/profile' ? 'dock-active' : ''}
              onClick={() => navigate('/profile')}
            >
              <img
                src={'./scale.png'}
                className="w-6 h-6 mx-auto filter brightness-0 invert"
                alt="Profile"
              />
              <span className="dock-label">Profile</span>
            </button>
            <button
              ref={refs['/counter']}
              style={{ minWidth: 105 }}
              className={location.pathname === '/counter' ? 'dock-active' : ''}
              onClick={() => navigate('/counter')}
            >
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
              <span className="dock-label">Timer</span>
            </button>
            <button
              ref={refs['/statistic']}
              style={{ minWidth: 105 }}
              className={location.pathname === '/statistic' ? 'dock-active' : ''}
              onClick={() => navigate('/statistic')}
            >
              <img
                src={'./statistic.png'}
                className="w-6 h-6 mx-auto filter brightness-0 invert"
                alt="Stats"
              />
              <span className="dock-label">Stats</span>
            </button>
            <button
              ref={refs['/credentials']}
              style={{ minWidth: 105 }}
              className={location.pathname === '/credentials' ? 'dock-active' : ''}
              onClick={() => navigate('/credentials')}
            >
              <img
                src={'./credentials.png'}
                className="w-6 h-6 mx-auto filter brightness-0 invert"
                alt="Credentials"
              />
              <span className="dock-label">Credentials</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default TemplatePage;
