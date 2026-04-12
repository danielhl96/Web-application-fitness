import { useNavigate } from 'react-router-dom';
import { JSX } from 'react';
import Button from './button';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const activityLevels = {
  1.2: 'Not active',
  1.4: 'Lightly active',
  1.7: 'Moderately active',
  '2.0': 'Very active',
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
      className="card w-full items-center justify-center  lg:w-40 h-[5dvh] bg-black/20 border border-blue-500 shadow-xl rounded-xl backdrop-blur-lg"
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
  const color = bmi > 30 ? '#ef4444' : bmi > 25 ? '#f97316' : bmi < 18.5 ? '#facc15' : '#4ade80';

  // Y-positions of measurement levels
  const waistY = male ? 78 : 74;
  const hipY = 104;

  return (
    <svg
      onClick={onClick}
      viewBox="0 0 160 200"
      className="w-66 h-50 drop-shadow-lg cursor-pointer"
    >
      {/* ── Body (shifted right to visually center it between left edge and labels) ── */}
      <g fill={color} transform="translate(30, 0)">
        <ellipse cx="50" cy="12" rx="11" ry="12" />
        <path d="M 44,24 L 56,24 L 57,34 L 43,34 Z" />
        <path d="M 26,36 C 19,50 17,68 19,90 L 27,90 C 25,68 26,52 30,38 Z" />
        <path d="M 74,36 C 81,50 83,68 81,90 L 73,90 C 75,68 74,52 70,38 Z" />
        <path d={torsoPath} />
        <path d="M 31,104 C 29,112 26,128 27,150 L 27,178 L 39,178 L 39,150 C 40,128 41,112 42,104 Z" />
        <path d="M 69,104 C 71,112 74,128 73,150 L 73,178 L 61,178 L 61,150 C 60,128 59,112 58,104 Z" />
      </g>

      {/* ── Measurement markers (rendered on top of body) ── */}
      <g stroke="rgba(255,255,255,0.85)" strokeWidth="0.7" fill="none">
        {/* Height: vertical double-arrow on the right */}
        {height > 0 && (
          <g>
            <line x1="121" y1="2" x2="121" y2="178" />
            <line x1="118" y1="2" x2="124" y2="2" />
            <path d="M 119,6 L 121,2 L 123,6" />
            <line x1="118" y1="178" x2="124" y2="178" />
            <path d="M 119,174 L 121,178 L 123,174" />
            <text
              x="121"
              y="192"
              fill="rgba(255,255,255,0.95)"
              stroke="none"
              fontSize="8"
              fontWeight="bold"
              textAnchor="middle"
            >
              Height: {height} cm
            </text>
          </g>
        )}

        {/* Waist: dashed horizontal level line */}
        {waist > 0 && (
          <g strokeDasharray="2.5,1.5">
            <line x1="47" y1={waistY} x2="119" y2={waistY} />
            <text
              x="123"
              y={waistY + 2.5}
              fill="rgba(255,255,255,0.95)"
              stroke="none"
              fontSize="8"
              fontWeight="bold"
              textAnchor="start"
              strokeDasharray="0"
            >
              Waist: {waist} cm
            </text>
          </g>
        )}

        {/* Hip: dashed horizontal level line */}
        {hip > 0 && (
          <g strokeDasharray="2.5,1.5">
            <line x1="47" y1={hipY} x2="119" y2={hipY} />
            <text
              x="123"
              y={hipY + 2.5}
              fill="rgba(255,255,255,0.95)"
              stroke="none"
              fontSize="8"
              fontWeight="bold"
              textAnchor="start"
              strokeDasharray="0"
            >
              Hip: {hip} cm
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
                  : { color: 'orange' }
            }
          >
            Activity: {activityLevels[activity] ?? 'UNS'}
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
