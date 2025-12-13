import React from 'react';
import './index.css';
import { useState } from 'react';

function ExerciseCard({ ExerciseName, Description, ExerciseImage, onRepsChange, onSetsChange }) {
  const [selectedSets, setSelectedSets] = useState(null);
  const [selectedReps, setSelectedReps] = useState(null);
  const handleSets = (sets) => {
    setSelectedSets(sets);
    if (onSetsChange) {
      onSetsChange(sets);
    }
  };
  const handleReps = (reps) => {
    setSelectedReps(reps);
    if (onRepsChange) {
      onRepsChange(reps);
    }
  };

  return (
    <div>
      <div
        className="card lg:w-64 w-64 h-80 mb-4 md:w-64 md:h-auto bg-black/20 border border-blue-500 shadow-xl  rounded-xl flex flex-col  items-center backdrop-blur-lg"
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}
      >
        <div className="card-body items-center text-center">
          <h2 className="text-amber-50 font-bold mb-2">{ExerciseName}</h2>
          <figure className="flex justify-center items-center w-10 h-10">
            <img
              style={{ filter: 'invert(1)' }}
              src={ExerciseImage}
              alt={ExerciseName}
              className="rounded-md"
            />
          </figure>
          <p className="text-sm text-slate-200 mb-2">{Description}</p>
        </div>
        <div className="flex flex-row space-x-4 p-2">
          <div
            className="h-20 overflow-y-scroll border border-gray-800 rounded-xl backdrop-blur-lg"
            style={{
              background: 'rgba(0,0,0,0.15)',
              boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.17)',
              border: '1px solid rgba(0, 0, 0, 0.12)',
            }}
          >
            <table id="sets-table" className="min-w-2 border-collapse">
              <tbody>
                {Array.from({ length: 25 }, (_, i) => i + 1).map((set, index) => (
                  <tr key={index} data-set={set} className={'bg-gray-700'}>
                    <td
                      onClick={() => handleSets(set)}
                      className="border border-gray-800 p-2 text-center cursor-pointer rounded-md backdrop-blur-lg"
                      style={{
                        background:
                          selectedSets === set ? 'rgba(37,99,235,0.45)' : 'rgba(0,0,0,0.15)',
                        boxShadow:
                          selectedSets === set
                            ? '0 4px 24px 0 rgba(37,99,235,0.25)'
                            : '0 4px 16px 0 rgba(31, 38, 135, 0.17)',
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        color: selectedSets === set ? '#e0eaff' : '',
                      }}
                    >
                      {'Sets: ' + set}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className="h-20 overflow-y-scroll border border-gray-800 rounded-xl backdrop-blur-lg"
            style={{
              background: 'rgba(0,0,0,0.15)',
              boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.17)',
              border: '1px solid rgba(0, 0, 0, 0.12)',
            }}
          >
            <table id="reps-table" className="min-w-2 border-collapse">
              <tbody>
                {Array.from({ length: 25 }, (_, i) => i + 1).map((rep, index) => (
                  <tr key={index} data-rep={rep} className={'bg-gray-700'}>
                    <td
                      onClick={() => handleReps(rep)}
                      className="border border-gray-800 p-2 text-center cursor-pointer rounded-md backdrop-blur-lg"
                      style={{
                        background:
                          selectedReps === rep ? 'rgba(37,99,235,0.45)' : 'rgba(0,0,0,0.15)',
                        boxShadow:
                          selectedReps === rep
                            ? '0 4px 24px 0 rgba(37,99,235,0.25)'
                            : '0 4px 16px 0 rgba(31, 38, 135, 0.17)',
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        color: selectedReps === rep ? '#e0eaff' : '',
                      }}
                    >
                      {'Reps: ' + rep}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <button className="btn btn-outline btn-warning mb-2" onClick={null}>
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
      </div>
    </div>
  );
}

export default ExerciseCard;
