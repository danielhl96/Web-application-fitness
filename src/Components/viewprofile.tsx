import { useNavigate } from 'react-router-dom';
import { JSX } from 'react';
import Button from './button';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const activityLevels = {
  1.2: 'Not active',
  1.4: 'Lightly active',
  1.7: 'Moderately active',
  2.0: 'Very active',
};

type HumanSilhouetteProps = {
  gender: string;
  bmi: number;
  height: number;
  waist: number;
  hip: number;
  age: number;
  weight: number;
  onClick: () => void;
};

function cardForValues(children: React.ReactNode): JSX.Element {
  return (
    <div
      className="card w-full items-center justify-center text-xs lg:w-40 h-[5dvh] bg-black/20 border border-blue-500 shadow-xl rounded-xl backdrop-blur-lg"
      style={{
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
      }}
    >
      {children}
    </div>
  );
}

function HumanSilhouette({
  gender = 'female',
  bmi = 22,
  height = 0,
  waist = 0,
  hip = 0,
  onClick,
}: HumanSilhouetteProps) {
  const male = gender !== 'female';
  const torsoPath = male
    ? 'M 26,36 C 24,52 36,68 36,80 C 31,88 31,97 31,104 L 69,104 C 69,97 69,88 64,80 C 64,68 76,52 74,36 Z'
    : 'M 29,36 C 28,52 38,66 37,78 C 28,87 27,97 27,104 L 73,104 C 73,97 72,87 63,78 C 62,66 72,52 71,36 Z';

  const baseColor =
    bmi > 30 ? '#ef4444' : bmi > 25 ? '#f97316' : bmi < 18.5 ? '#facc15' : '#4ade80';
  const glowColor =
    bmi > 30
      ? 'rgba(239,68,68,0.35)'
      : bmi > 25
        ? 'rgba(249,115,22,0.35)'
        : bmi < 18.5
          ? 'rgba(250,204,21,0.35)'
          : 'rgba(74,222,128,0.35)';

  const waistY = male ? 78 : 74;
  const hipY = 104;

  return (
    <svg
      onClick={onClick}
      viewBox="0 0 200 220"
      className="w-66 h-50 drop-shadow-lg cursor-pointer"
    >
      <defs>
        {/* Body gradient */}
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={baseColor} stopOpacity="0.95" />
          <stop offset="100%" stopColor={baseColor} stopOpacity="0.55" />
        </linearGradient>
        {/* Glow filter */}
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Glass background clip */}
        <clipPath id="bodyClip">
          <rect x="20" y="0" width="120" height="190" rx="8" />
        </clipPath>
      </defs>

      {/* ── Glass background panel ── */}

      {/* Subtle inner highlight */}

      {/* ── Body glow halo ── */}
      <g transform="translate(30,0)" filter="url(#glow)" opacity="0.6">
        <ellipse cx="50" cy="12" rx="11" ry="12" fill={glowColor} />
        <path d={torsoPath} fill={glowColor} />
      </g>

      {/* ── Body ── */}
      <g fill="url(#bodyGrad)" transform="translate(30,0)">
        <ellipse cx="50" cy="12" rx="11" ry="12" />
        <path d="M 44,24 L 56,24 L 57,34 L 43,34 Z" />
        <path d="M 26,36 C 19,50 17,68 19,90 L 27,90 C 25,68 26,52 30,38 Z" />
        <path d="M 74,36 C 81,50 83,68 81,90 L 73,90 C 75,68 74,52 70,38 Z" />
        <path d={torsoPath} />
        <path d="M 31,104 C 29,112 26,128 27,150 L 27,178 L 39,178 L 39,150 C 40,128 41,112 42,104 Z" />
        <path d="M 69,104 C 71,112 74,128 73,150 L 73,178 L 61,178 L 61,150 C 60,128 59,112 58,104 Z" />
      </g>

      {/* ── Shine overlay on body ── */}
      <g transform="translate(30,0)" opacity="0.18">
        <ellipse cx="46" cy="10" rx="5" ry="4" fill="white" />
        <path d="M 32,40 C 31,52 33,64 34,72 C 36,68 36,52 34,40 Z" fill="white" />
      </g>

      {/* ── Measurement markers ── */}
      <g fill="none">
        {height > 0 && (
          <g>
            <line
              x1="153"
              y1="2"
              x2="153"
              y2="178"
              stroke="rgba(147,197,253,0.5)"
              strokeWidth="0.8"
            />
            <line
              x1="150"
              y1="2"
              x2="156"
              y2="2"
              stroke="rgba(147,197,253,0.7)"
              strokeWidth="0.8"
            />
            <line
              x1="150"
              y1="178"
              x2="156"
              y2="178"
              stroke="rgba(147,197,253,0.7)"
              strokeWidth="0.8"
            />
            <path d="M 151,6 L 153,2 L 155,6" stroke="rgba(147,197,253,0.9)" strokeWidth="0.8" />
            <path
              d="M 151,174 L 153,178 L 155,174"
              stroke="rgba(147,197,253,0.9)"
              strokeWidth="0.8"
            />
            {/* Glass pill label */}
            <rect
              x="130"
              y="185"
              width="46"
              height="13"
              rx="6"
              fill="rgba(15,23,42,0.7)"
              stroke="rgba(147,197,253,0.3)"
              strokeWidth="0.7"
            />
            <text
              x="153"
              y="194.5"
              fill="rgba(147,197,253,1)"
              stroke="none"
              fontSize="7"
              fontWeight="600"
              textAnchor="middle"
            >
              {height} cm
            </text>
          </g>
        )}

        {waist > 0 && (
          <g>
            <line
              x1="47"
              y1={waistY}
              x2="143"
              y2={waistY}
              stroke="rgba(147,197,253,0.45)"
              strokeWidth="0.8"
              strokeDasharray="3,2"
            />
            <rect
              x="120"
              y={waistY - 7}
              width="38"
              height="12"
              rx="5"
              fill="rgba(15,23,42,0.7)"
              stroke="rgba(147,197,253,0.3)"
              strokeWidth="0.7"
            />
            <text
              x="139"
              y={waistY + 1.5}
              fill="rgba(147,197,253,1)"
              stroke="none"
              fontSize="6.5"
              fontWeight="600"
              textAnchor="middle"
            >
              W: {waist} cm
            </text>
          </g>
        )}

        {hip > 0 && (
          <g>
            <line
              x1="47"
              y1={hipY}
              x2="143"
              y2={hipY}
              stroke="rgba(147,197,253,0.45)"
              strokeWidth="0.8"
              strokeDasharray="3,2"
            />
            <rect
              x="120"
              y={hipY - 7}
              width="38"
              height="12"
              rx="5"
              fill="rgba(15,23,42,0.7)"
              stroke="rgba(147,197,253,0.3)"
              strokeWidth="0.7"
            />
            <text
              x="139"
              y={hipY + 1.5}
              fill="rgba(147,197,253,1)"
              stroke="none"
              fontSize="6.5"
              fontWeight="600"
              textAnchor="middle"
            >
              H: {hip} cm
            </text>
          </g>
        )}
      </g>
    </svg>
  );
}

type ViewProfileProps = {
  gender: string;
  bmi: number;
  height: number;
  waist: number;
  age: number;
  weight: number;
  hip: number;
  bfp: number;
  calories: number;
  goal: number;
  activity: string;
  bri: number;
  hwr: number;
  setShowTrend: (value: boolean) => void;
  setEdit: (value: boolean) => void;
};

function ViewProfile(props: ViewProfileProps): JSX.Element {
  const {
    gender,
    bmi,
    height,
    waist,
    hip,
    bfp,
    calories,
    goal,
    activity,
    bri,
    hwr,
    age,
    weight,
    setShowTrend,
    setEdit,
  } = props;
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="divider  text-amber-50 font-bold mb-2  divider-primary">Profile</div>

      <HumanSilhouette
        gender={gender}
        bmi={bmi}
        height={height}
        waist={waist}
        hip={hip}
        age={age}
        weight={weight}
        onClick={() =>
          console.log('HumanSilhouette clicked', { gender, bmi, height, waist, hip, age, weight })
        }
      />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        {cardForValues(<h1>Age: {age} years</h1>)}

        {cardForValues(
          <div className="flex flex-row items-center gap-2">
            <img src="/body-weight.png" alt="weight" className="w-5 h-5 object-contain invert" />
            <h1>{weight} kg</h1>
          </div>
        )}

        {cardForValues(
          <h1
            style={{
              color: bmi > 30 ? 'red' : bmi > 25 ? 'orange' : bmi < 20 ? 'yellow' : 'green',
            }}
          >
            <div className="flex flex-row text-xs items-center gap-2">
              <img src="/bmi.png" alt="weight" className="w-5 h-5 object-contain invert" />
              {Math.round(bmi)}{' '}
              {bmi > 30
                ? '(Adipoistas)'
                : bmi > 25
                  ? '(Overweight)'
                  : bmi < 20
                    ? '(Underweight)'
                    : '(Normal)'}
            </div>
          </h1>
        )}
        {cardForValues(
          <h1
            style={{
              color: bri > 4.5 ? 'red' : bri > 3 ? 'orange' : 'green',
            }}
          >
            BRI: {bri.toFixed(2)}
          </h1>
        )}
        {cardForValues(
          <h1 style={{ color: hwr >= 0.85 ? 'red' : 'green' }}>
            WHR: {(hwr || 0).toFixed(2)} {hwr >= 0.85 ? '(Risk)' : '(Good)'}
          </h1>
        )}
        {cardForValues(
          <h1 style={{ color: bfp > 25 ? 'red' : 'green' }}>BFP: {Math.round(bfp)} %</h1>
        )}
        {cardForValues(
          <div className="flex flex-row  items-center gap-2">
            <img src="/meal.png" alt="weight" className="w-5 h-5 object-contain invert" />
            <h1>{Math.round(calories)} kcal</h1>
          </div>
        )}

        {cardForValues(
          <div className="flex flex-row  items-center gap-2">
            <img src="/goal.png" alt="weight" className="w-5 h-5 object-contain invert" />
            <h1> {goal == 1 ? 'Cut' : goal == 2 ? 'Hold' : 'Bulk'}</h1>
          </div>
        )}
        {cardForValues(
          <h1
            style={
              parseFloat(activity) <= 1.2
                ? { color: 'red' }
                : parseFloat(activity) >= 1.5
                  ? { color: 'green' }
                  : parseFloat(activity) > 1.2 && parseFloat(activity) < 1.5
                    ? { color: 'yellow' }
                    : { color: 'orange' }
            }
          >
            {activityLevels[activity] ?? 'UNS'}
          </h1>
        )}
      </div>
      <div className="divider  text-amber-50 font-light mb-2  divider-primary">
        Updates and Trends
      </div>

      <div className="flex flex-row space-x-2 items-center justify-center">
        <Button
          onClick={() => {
            setShowTrend(true);
            setEdit(false);
          }}
          border="#3b82f6"
        >
          <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
        </Button>

        <Button onClick={() => setEdit(true)} border="#3b82f6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
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
        </Button>

        <Button onClick={() => navigate('/')} border="#ef4444">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}
export default ViewProfile;
