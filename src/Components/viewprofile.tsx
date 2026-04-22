import { useNavigate } from 'react-router-dom';
import { JSX } from 'react';
import Button from './button';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import ProfileCard from './ProfileCard';
import HumanSilhouette from './HumanSilhouette';
import {
  getBmiColor,
  getBmiLabel,
  getBriColor,
  getHwrColor,
  getHwrLabel,
  getBfpColor,
  getGoalLabel,
  getActivityColor,
} from './HealthMetrics';

const activityLevels: Record<string, string> = {
  '1.2': 'Not active',
  '1.4': 'Lightly active',
  '1.7': 'Moderately active',
  '2.0': 'Very active',
};

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
      <div className="divider text-amber-50 font-bold mb-2 divider-primary">Profile</div>

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
        <ProfileCard>
          <h1>Age: {age} years</h1>
        </ProfileCard>

        <ProfileCard>
          <div className="flex flex-row items-center gap-2">
            <img src="/body-weight.png" alt="weight" className="w-5 h-5 object-contain invert" />
            <h1>{weight} kg</h1>
          </div>
        </ProfileCard>

        <ProfileCard>
          <div
            className="flex flex-row text-xs items-center gap-2"
            style={{ color: getBmiColor(bmi) }}
          >
            <img src="/bmi.png" alt="bmi" className="w-5 h-5 object-contain invert" />
            {Math.round(bmi)} ({getBmiLabel(bmi)})
          </div>
        </ProfileCard>

        <ProfileCard>
          <h1 style={{ color: getBriColor(bri) }}>BRI: {bri.toFixed(2)}</h1>
        </ProfileCard>

        <ProfileCard>
          <h1 style={{ color: getHwrColor(hwr) }}>
            WHR: {(hwr || 0).toFixed(2)} ({getHwrLabel(hwr)})
          </h1>
        </ProfileCard>

        <ProfileCard>
          <h1 style={{ color: getBfpColor(bfp) }}>BFP: {Math.round(bfp)} %</h1>
        </ProfileCard>

        <ProfileCard>
          <div className="flex flex-row items-center gap-2">
            <img src="/meal.png" alt="calories" className="w-5 h-5 object-contain invert" />
            <h1>{Math.round(calories)} kcal</h1>
          </div>
        </ProfileCard>

        <ProfileCard>
          <div className="flex flex-row items-center gap-2">
            <img src="/goal.png" alt="goal" className="w-5 h-5 object-contain invert" />
            <h1>{getGoalLabel(goal)}</h1>
          </div>
        </ProfileCard>

        <ProfileCard>
          <h1 style={{ color: getActivityColor(activity) }}>
            {activityLevels[activity] ?? 'Unknown'}
          </h1>
        </ProfileCard>
      </div>

      <div className="divider text-amber-50 font-light mb-2 divider-primary">
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
