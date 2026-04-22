import Button from './button';
import WorkoutCard from './workoutcard';
import { WorkoutPlanMap } from '../types';
import { JSX, ReactNode } from 'react';

// OCP: add a new workout action here — no changes to JSX needed
interface ActionButton {
  icon: ReactNode;
  border: string;
  onClick: () => void;
}

export default function Workouts({
  exercise,
  handleShowModal,
  onDelete,
  selectedExercise,
}: {
  exercise: string;
  handleShowModal: (exercise: string) => void;
  /** Atomare Delete-Aktion — koordiniert setConfirmationModal + setSaveKey im Elternteil */
  onDelete: (key: string) => void;
  selectedExercise: WorkoutPlanMap;
}): JSX.Element {
  const actionButtons: ActionButton[] = [
    {
      border: '#3b82f6',
      onClick: () => handleShowModal(exercise),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
    },
    {
      border: '#ef4444',
      onClick: () => onDelete(exercise),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <WorkoutCard>
        <h2 className="text-amber-400 font-bold mb-2">{exercise}</h2>
        <div className="flex flex-row justify-center items-center gap-4 mt-2">
          {actionButtons.map((btn, i) => (
            <Button key={i} onClick={btn.onClick} border={btn.border}>
              {btn.icon}
            </Button>
          ))}
        </div>
        <div className="flex flex-col">
          <p className="text-blue-300 font-light text-sm">
            Exercises: {selectedExercise[exercise]?.length || 0}
          </p>
        </div>
      </WorkoutCard>
    </div>
  );
}
