import { JSX } from 'react';

interface RepsEstimationPanelProps {
  weight: number;
  previousReps: number;
  onClose: () => void;
}

function RepsEstimationPanel({
  weight,
  previousReps,
  onClose,
}: RepsEstimationPanelProps): JSX.Element {
  const rmData: [string, number][] = [
    ['RM: 1', 1],
    ['RM: 3-4', 0.9],
    ['RM: 5-6', 0.85],
    ['RM: 8-10', 0.8],
    ['RM: 12-15', 0.7],
  ];

  return (
    <div className="card w-full mt-2 lg:w-full h-[18dvh] bg-gradient-to-b from-gray-900 to-black border shadow-xl mb-5 rounded-xl backdrop-blur-lg border border-white/20">
      <button className="absolute top-2 right-2 text-xs text-blue-300 underline" onClick={onClose}>
        Hide Info
      </button>
      <h2 className="text-amber-400 text-center text-sm mb-2 font-bold">Reps Estimation</h2>
      <div className="grid grid-cols-1 gap-1 text-xs px-1">
        {rmData.map(([label, factor]) => (
          <div key={label} className="flex justify-between">
            <span>{label}</span>
            <span className="font-mono text-blue-300">
              {(weight * (1 + previousReps / 30) * factor).toFixed(1)} kg
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RepsEstimationPanel;
