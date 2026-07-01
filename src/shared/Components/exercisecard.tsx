import React, { JSX } from 'react';
import '../../index.css';
import { useState, useRef, useEffect } from 'react';
import Table from './Table.tsx';
import Button from './button.tsx';
type ExerciseCardProps = {
  ExerciseName: string;
  Description: string;
  ExerciseImage: string;
  onRepsChange?: (reps: number) => void;
  onSetsChange?: (sets: number) => void;
  handleRemoveExercise: () => void;
  changePosition: (direction: 'up' | 'down') => void;
  reps?: number | number[];
  sets?: number;
  ismaximized?: boolean;
  'data-cy-reps'?: string;
  'data-cy-sets'?: string;
  'data-cy-exercise-delete-button'?: string;
};

function ExerciseCard({
  ExerciseName,
  Description,
  ExerciseImage,
  onRepsChange,
  onSetsChange,
  handleRemoveExercise,
  changePosition,
  reps,
  sets,
  ismaximized,
  'data-cy-reps': dataCyReps,
  'data-cy-sets': dataCySets,
  'data-cy-exercise-delete-button': dataCyExerciseDeleteButton,
}: ExerciseCardProps): JSX.Element {
  const [selectedSets, setSelectedSets] = useState(sets || null);
  const [maximized, setMaximized] = useState(ismaximized || false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedReps, setSelectedReps] = useState(
    reps ? (Array.isArray(reps) ? reps[0] : reps) : null
  );
  const selectedSetRef = useRef<HTMLTableCellElement | null>(null);
  const selectedRepRef = useRef<HTMLTableCellElement | null>(null);
  const handleSets = (sets: number, ref: HTMLTableCellElement | null) => {
    setSelectedSets(sets);

    if (ref) {
      selectedSetRef.current = ref;
    }
    if (onSetsChange) {
      onSetsChange(sets);
    }
  };
  const handleReps = (reps: number, ref: HTMLTableCellElement | null) => {
    setSelectedReps(reps);

    if (ref) {
      selectedRepRef.current = ref;
    }
    if (onRepsChange) {
      onRepsChange(reps);
    }
  };

  useEffect(() => {
    if (sets) {
      setSelectedSets(sets);
    }
  }, [sets]);

  useEffect(() => {
    if (reps) {
      setSelectedReps(Array.isArray(reps) ? reps[0] : reps);
    }
  }, [reps]);

  // Auto-scroll to selected set/rep row
  useEffect(() => {
    if (selectedSetRef.current) {
      selectedSetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedSets, maximized]);
  useEffect(() => {
    if (selectedRepRef.current) {
      selectedRepRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedReps, maximized]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setMaximized(window.innerWidth >= 768); // Auto-maximize on desktop, allow toggle on mobile
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      className="w-60 sm:max-w-sm md:max-w-md flex flex-col items-center"
      data-cy={`exercise-card-${ExerciseName}`}
    >
      <div
        className={`card w-full ${maximized ? 'min-h-[35dvh]' : 'h-[18dvh]'} ${maximized ? 'lg:min-h-[10dvh] sm:min-h-[25dvh]' : 'sm:h-[20dvh]'} bg-black/20 border border-blue-500 shadow-xl rounded-xl flex flex-col items-center backdrop-blur-lg border-[1px] border-white/20`}
      >
        <div className="card-body items-center text-center">
          {isMobile ? (
            <button
              onClick={() => setMaximized(!maximized)}
              className="btn btn-xs btn-circle absolute right-2 top-2 bg-black/30 border border-white/20 text-white hover:bg-black/50 focus:ring-2 focus:ring-white"
            >
              {maximized ? (
                // Minus Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              ) : (
                // Plus Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              )}
            </button>
          ) : null}
          <h2 className="text-amber-400 font-bold mb-2">{ExerciseName}</h2>
          <figure className="flex justify-center items-center w-8 h-8">
            <img src={ExerciseImage} alt={ExerciseName} className="rounded-md invert" />
          </figure>

          {maximized && <p className="text-xs text-slate-200">{Description}</p>}
        </div>
        {maximized && (
          <>
            <div className="flex flex-row space-x-2 p-3">
              <div className="h-15 overflow-y-scroll rounded-lg bg-black/5 flex items-center justify-center">
                <Table
                  data-cy={dataCySets}
                  selectedItem={selectedSets}
                  onSelect={(sets) => handleSets(sets, null)}
                  string="Sets: "
                  color="bg-blue-500"
                />
              </div>

              <div className="h-15 overflow-y-scroll rounded-lg bg-black/5 flex items-center justify-center">
                <Table
                  data-cy={dataCyReps}
                  selectedItem={selectedReps}
                  onSelect={(reps) => handleReps(reps, null)}
                  string="Reps: "
                  color="bg-blue-500"
                />
              </div>
            </div>
            <div className="flex flex-row justify-center items-center space-x-2 mb-2">
              <Button
                data-cy={dataCyExerciseDeleteButton}
                border="#ef4444"
                onClick={() => handleRemoveExercise()}
              >
                {/* Mülltonne Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </Button>

              <Button border="#3b82f6" onClick={() => changePosition('up')}>
                {/* Up Arrow Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </Button>
              <Button border="#3b82f6" onClick={() => changePosition('down')}>
                {/* Down Arrow Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ExerciseCard;
