import Button from './button';
import Input from './input';
import { JSX } from 'react';
import HealthMetrics from './HealthMetrics';

type EditProfileProps = {
  age: number;
  weight: number;
  height: number;
  waist: number;
  hip: number;
  bfp: number;
  activity: string;
  goal: string;
  calories: number;
  bmi: number;
  hwr: number;
  handleAge: (value: string) => void;
  handleWeight: (value: string) => void;
  handleHeight: (value: string) => void;
  handleWaist: (value: string) => void;
  handleHip: (value: string) => void;
  handleBFP: (value: string) => void;
  handleActivity: (value: string) => void;
  handleGoal: (value: string) => void;
  handleGender: (value: string) => void;
  handleEdit: () => void;
  setEdit: (value: boolean) => void;
  failureAge?: boolean;
  failureWeight?: boolean;
  failureHeight?: boolean;
  failureWaist?: boolean;
  failureHip?: boolean;
  failureBFP?: boolean;
  gender: string;
};
// OCP: To add a new profile field, add an entry here — no JSX changes needed.
interface FieldConfig {
  label: string;
  placeholder: string;
  id?: string;
  onChange: (value: string) => void;
  failure?: boolean;
  failureMsg: string;
}

function EditProfile({
  age,
  weight,
  height,
  waist,
  hip,
  bfp,
  activity,
  goal,
  calories,
  bmi,
  hwr,
  failureAge,
  failureWeight,
  failureHeight,
  failureWaist,
  failureHip,
  failureBFP,
  gender,
  handleAge,
  handleWeight,
  handleHeight,
  handleWaist,
  handleHip,
  handleBFP,
  handleActivity,
  handleGoal,
  handleGender,
  handleEdit,
  setEdit,
}: EditProfileProps): JSX.Element {
  const fieldConfigs: FieldConfig[] = [
    {
      label: 'Age',
      placeholder: `${age} years`,
      onChange: handleAge,
      failure: failureAge,
      failureMsg: 'Please enter a valid age',
    },
    {
      label: 'Weight',
      placeholder: `${weight} kg`,
      onChange: handleWeight,
      failure: failureWeight,
      failureMsg: 'Please enter a valid weight',
    },
    {
      label: 'Height',
      placeholder: `${height} cm`,
      onChange: handleHeight,
      failure: failureHeight,
      failureMsg: 'Please enter a valid height',
    },
    {
      label: 'Waist',
      placeholder: `${waist} cm`,
      onChange: handleWaist,
      failure: failureWaist,
      failureMsg: 'Please enter a valid waist',
      id: 'waist',
    },
    {
      label: 'Hip',
      placeholder: `${hip} cm`,
      onChange: handleHip,
      failure: failureHip,
      failureMsg: 'Please enter a valid hip',
      id: 'hip',
    },
    {
      label: 'BFP',
      placeholder: `${bfp} %`,
      onChange: handleBFP,
      failure: failureBFP,
      failureMsg: 'Please enter a valid bfp',
      id: 'bfp',
    },
  ];

  return (
    <div className="space-y-2 flex flex-col items-center ">
      <div className="divider  text-amber-50 font-bold mb-2  divider-primary">Profile</div>

      <div className="grid grid-cols-3 gap-4">
        {fieldConfigs.map(({ label, placeholder, id, onChange, failure, failureMsg }) => (
          <div key={label} className="flex flex-col space-y-1 h-15">
            <h1>{label}</h1>
            <Input
              placeholder={placeholder}
              id={id}
              value={null}
              onChange={onChange}
              w="w-24"
              h="h-8"
            />
            {failure && <h1 style={{ color: 'red', fontSize: 8 }}>{failureMsg}</h1>}
          </div>
        ))}
      </div>

      <div className="flex flex-row space-x-2  items-center justify-center">
        <Button
          border={gender === 'male' ? '#3b82f6' : '#64748b'}
          onClick={() => handleGender('male')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M9 1a1 1 0 0 0 0 2h2.586L8.707 5.879a5 5 0 1 0 1.414 1.414L13 4.414V7a1 1 0 0 0 2 0V1H9zM6 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
          </svg>
        </Button>
        <Button
          border={gender === 'female' ? '#3b82f6' : '#64748b'}
          onClick={() => handleGender('female')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 0a5 5 0 0 0 0 10v1H6a.5.5 0 0 0 0 1h2v2a.5.5 0 0 0 1 0v-2h2a.5.5 0 0 0 0-1H9v-1a5 5 0 0 0 0-10zm0 1a4 4 0 1 1 0 8A4 4 0 0 1 8 1z" />
          </svg>
        </Button>
      </div>

      <select
        value={activity}
        defaultValue=""
        onChange={(e) => handleActivity(e.target.value)}
        className="select select-primary w-full max-w-xs shadow-lg border border-blue-400 text-white rounded-xl focus:ring-2 focus:ring-blue-400"
        style={{
          background: 'rgba(30, 41, 59, 0.25)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
          border: '1.5px solid #3b82f6',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        <option value="" disabled>
          Activity level
        </option>
        <option value="1.2">Not active</option>
        <option value="1.4">Light activity</option>
        <option value="1.7">Moderate activity</option>
        <option value="2.0">Very active</option>
      </select>

      <div className="divider divider-primary">Your goals:</div>
      <div className="flex flex-row space-x-2 items-center justify-center">
        {/* OCP: new goal = new entry here, no JSX changes needed */}
        {(
          [
            { value: '1', label: 'Cut' },
            { value: '2', label: 'Hold' },
            { value: '3', label: 'Bulk' },
          ] as const
        ).map(({ value, label }) => (
          <Button
            key={value}
            border={goal === value ? '#3b82f6' : '#64748b'}
            onClick={() => handleGoal(value)}
          >
            {label}
          </Button>
        ))}
      </div>
      <div className="divider divider-primary">Important values</div>
      <div className="flex justify-center">
        <HealthMetrics calories={calories} bmi={bmi} hwr={hwr} />
      </div>
      <div className="flex flex-row space-x-2 items-center justify-center">
        <Button
          onClick={() => handleEdit()}
          border="#3b82f6"
          disabled={
            !!failureHeight ||
            !!failureHip ||
            !!failureWeight ||
            !!failureWaist ||
            !!failureBFP ||
            !!failureAge ||
            !gender
          }
        >
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
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </Button>
        <Button onClick={() => setEdit(false)} border="#ef4444">
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

export default EditProfile;
