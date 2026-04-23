import '../index.css';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import { JSX } from 'react';

type HomeCardProps = {
  title: string;
  description: string;
  icon: JSX.Element;
  onClick: () => void;
};

function HomeCard({ title, description, icon, onClick }: HomeCardProps): JSX.Element {
  return (
    <div
      onClick={onClick}
      className="card w-full xs:w-full sm:w-70 lg:w-80 h-40 bg-black/20 border border-blue-500 shadow-xl rounded-xl backdrop-blur-lg cursor-pointer active:bg-blue-500 transition-colors duration-200"
      style={{
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
      }}
    >
      <div className="card-body">
        <h2 className="card-title text-blue-400 text-sm">{title}</h2>
        <div className="flex justify-center my-4">{icon}</div>
        <p className="text-slate-300 text-sm text-center hidden sm:block">{description}</p>
      </div>
    </div>
  );
}

function Home(): JSX.Element {
  const navigate = useNavigate();

  const HomeCardArray: HomeCardProps[] = [
    {
      title: 'Create Workout',
      description: 'Create your own training program',
      icon: (
        <img
          src="/plan.png"
          className="h-8 w-8 object-cover rounded-md"
          alt="Create Training Icon"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      ),
      onClick: () => navigate('/createtrain'),
    },
    {
      title: 'Edit Workout',
      description: 'Edit existing trainings',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-amber-50"
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
      onClick: () => navigate('/editTrain'),
    },
    {
      title: 'Start Workout',
      description: 'Start your workout',
      icon: (
        <img
          src="/pullup.png"
          className="h-8 w-8 object-cover rounded-md"
          alt="Pull-up Icon"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      ),
      onClick: () => navigate('/training'),
    },
    {
      title: 'Nutrition',
      description: 'View your nutrition',
      icon: (
        <img
          src="/nutrition-plan.png"
          className="h-8 w-8 object-cover rounded-md"
          alt="Nutrition Icon"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      ),
      onClick: () => navigate('/nutrition'),
    },
    {
      title: 'AI Coach',
      description: 'Get AI-powered coaching',
      icon: (
        <img
          alt="AI Coach Icon"
          src="/aicoach.png"
          className="h-8 w-8 object-cover rounded-md"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      ),
      onClick: () => navigate('/aicoach'),
    },
    {
      title: 'Profile',
      description: 'Manage your profile and goals',
      icon: (
        <img
          alt="Profile Icon"
          src="/scale.png"
          className="h-8 w-8 object-cover rounded-md"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      ),
      onClick: () => navigate('/profile'),
    },
    {
      title: 'Stopwatch',
      description: 'Use the timer for breaks',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-amber-50"
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
      onClick: () => navigate('/counter'),
    },
    {
      title: 'Statistic',
      description: 'View your statistics',
      icon: (
        <img
          src="/statistic.png"
          className="h-8 w-8 object-cover rounded-md"
          alt="Statistic Icon"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      ),
      onClick: () => navigate('/statistic'),
    },
    {
      title: 'Credentials',
      description: 'View your credentials',
      icon: (
        <img
          alt="Credentials Icon"
          src="/credentials.png"
          className="h-8 w-8 object-cover rounded-md"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      ),
      onClick: () => navigate('/credentials'),
    },
  ];

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center min-h-dvh bg-gradient-to-b from-gray-900 to-black py-14 px-2">
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 p-4 overflow-y-auto h-[80vh] w-full max-w-3xl">
          {HomeCardArray.map((card, index) => (
            <HomeCard
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
              onClick={card.onClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
