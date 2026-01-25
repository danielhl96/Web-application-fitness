import React from 'react';
import './index.css';
import { useState, useRef, useEffect } from 'react';

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
}) {
  const [selectedSets, setSelectedSets] = useState(sets || null);
  const [maximized, setMaximized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedReps, setSelectedReps] = useState(
    reps ? (Array.isArray(reps) ? reps[0] : reps) : null
  );
  const selectedSetRef = useRef(null);
  const selectedRepRef = useRef(null);
  const handleSets = (sets, ref) => {
    setSelectedSets(sets);

    if (ref) {
      selectedSetRef.current = ref;
    }
    if (onSetsChange) {
      onSetsChange(sets);
    }
  };
  const handleReps = (reps, ref) => {
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
  }, [selectedSets]);
  useEffect(() => {
    if (selectedRepRef.current) {
      selectedRepRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedReps]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-60 max-w-xs sm:max-w-sm md:max-w-md flex flex-col items-center mb-4">
      <div
        className={`card w-full ${maximized ? 'h-[40dvh]' : 'h-[18dvh]'} ${maximized ? 'sm:h-[44dvh]' : 'sm:h-[20dvh]'} bg-black/20 border border-blue-500 shadow-xl rounded-xl flex flex-col items-center backdrop-blur-lg border-[1px] border-white/20`}
      >
        <div className="card-body items-center text-center">
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
          <h2 className="text-amber-400 font-bold mb-2">{ExerciseName}</h2>
          <figure className="flex justify-center items-center w-8 h-8">
            <img src={ExerciseImage} alt={ExerciseName} className="rounded-md invert" />
          </figure>
          <p className="text-xs text-slate-200 mb-2">{Description}</p>
        </div>
        {maximized && (
          <>
            <div className="flex flex-row space-x-4 p-2">
              <div className="h-20 overflow-y-scroll border border-gray-800 rounded-xl backdrop-blur-lg bg-black/15 shadow-md border-[1px] border-black/20">
                <table id="sets-table" className="min-w-2 border-collapse">
                  <tbody>
                    {Array.from({ length: 25 }, (_, i) => i + 1).map((set, index) => (
                      <tr key={index} data-set={set} className={'bg-gray-700'}>
                        <td
                          ref={selectedSets === set ? selectedSetRef : null}
                          onClick={(e) => handleSets(set, e.target)}
                          className={`border border-gray-800 p-2 text-center cursor-pointer rounded-md backdrop-blur-lg ${
                            selectedSets === set
                              ? 'bg-blue-600/45 text-blue-100 shadow-lg border-blue-600'
                              : 'bg-black/15'
                          } `}
                        >
                          {'Sets: ' + set}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="h-20 overflow-y-scroll border border-gray-800 rounded-xl backdrop-blur-lg bg-black/15 shadow-md border-[1px] border-black/20">
                <table id="reps-table" className="min-w-2 border-collapse">
                  <tbody>
                    {Array.from({ length: 25 }, (_, i) => i + 1).map((rep, index) => (
                      <tr key={index} data-rep={rep} className={'bg-gray-700'}>
                        <td
                          ref={selectedReps === rep ? selectedRepRef : null}
                          onClick={(e) => handleReps(rep, e.target)}
                          className={`border border-gray-800 p-2 text-center cursor-pointer rounded-md backdrop-blur-lg ${
                            selectedReps === rep
                              ? 'bg-blue-600/45 text-blue-100 shadow-lg border-blue-600'
                              : 'bg-black/15'
                          } `}
                        >
                          {'Reps: ' + rep}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex flex-row justify-center items-center space-x-2 mb-6 ">
              <button
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-red-500 text-white px-3 py-2 rounded-xl transition-all duration-200 hover:bg-red-500/30 hover:scale-105 focus:ring-2 focus:ring-red-400 flex items-center gap-1 text-base sm:text-lg md:text-xl min-w-[40px] min-h-[40px]"
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
              </button>

              <button
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-3 py-2 rounded-xl transition-all duration-200 hover:bg-blue-500/30 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-1 text-base sm:text-lg md:text-xl min-w-[40px] min-h-[40px]"
                onClick={() => changePosition('up')}
              >
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
              </button>
              <button
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-3 py-2 rounded-xl transition-all duration-200 hover:bg-blue-500/30 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-1 text-base sm:text-lg md:text-xl min-w-[40px] min-h-[40px]"
                onClick={() => changePosition('down')}
              >
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
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ExerciseCard;
