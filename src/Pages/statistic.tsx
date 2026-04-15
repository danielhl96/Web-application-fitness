import api from '../Utils/api.js';
import ApexCharts from 'apexcharts';
import { useState, useEffect, JSX } from 'react';
import TemplatePage from '../Components/templatepage.js';
import Button from '../Components/button.js';
import Header from '../Components/Header.js';
import { UI_STATE } from '../types.js';

type ExerciseEntry = {
  date: string;
  weights: number[];
  reps: number[];
};

type ExerciseData = {
  exercise_name: string;
  entries: ExerciseEntry[];
  date: string[];
  max_weight: number;
  min_weight: number;
};

function calculateProgress(item: ExerciseData): number {
  let progress = 0;
  if (item.entries && item.entries.length >= 2) {
    const first = item.entries[0];
    const last = item.entries[item.entries.length - 1];
    const firstWeight =
      first.weights && first.weights.length > 0 ? first.weights.reduce((a, b) => a + b, 0) : 0;
    const lastWeight =
      last.weights && last.weights.length > 0 ? last.weights.reduce((a, b) => a + b, 0) : 0;
    const firstReps =
      first.reps && first.reps.length > 0 ? first.reps.reduce((a, b) => a + b, 0) : 0;
    const lastReps = last.reps && last.reps.length > 0 ? last.reps.reduce((a, b) => a + b, 0) : 0;
    if (firstWeight > 0 && firstReps > 0) {
      progress =
        ((lastWeight * lastReps - firstWeight * firstReps) / (firstWeight * firstReps)) * 100;
    }
  }
  return progress;
}

function Statistic(): JSX.Element {
  const [showOverview, setShowOverview] = useState<boolean>(true);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseData | null>(null);
  const [statistics, setStatistics] = useState<UI_STATE<Record<string, any>>>({ type: 'loading' });

  function ExerciseCards(): JSX.Element {
    return (
      <div className="flex flex-col items-center justify-center w-full">
        <div className="divider divider-primary  text-white font-bold mb-2">Your statistics</div>

        {showOverview && statistics.type === 'success' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:space-y-2 lg:space-x-2 w-full items-center mt-4 text-xs overflow-y-auto overflow-x-hidden max-h-130">
            {statistics.data.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center cursor-pointer"
                onClick={() => {
                  setSelectedExercise(item);
                  setShowOverview(false);
                }}
              >
                <div
                  className={`card w-65 lg:w-40 h-auto lg:h-30 border-2 border-blue-500 shadow-xl rounded-xl backdrop-blur-lg flex flex-col items-center mb-2`}
                  role="button"
                  aria-pressed="false"
                  style={{
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    border: '2px solid #3b82f6',
                  }}
                >
                  <h2 className="text-amber-400 font-bold mb-2">{item.exercise_name}</h2>
                  <figure className="w-9 h-9 mb-2">
                    <img
                      src={
                        './' +
                        item.exercise_name.toLowerCase().replace('-', '').replace(' ', '') +
                        '.png'
                      }
                      style={{ filter: 'invert(1)' }}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </figure>
                  <div className="flex flex-row space-x-4">
                    {(() => {
                      const progress = calculateProgress(item);
                      const progressText = `${progress.toFixed(1)} %`;
                      let progressClass = 'text-slate-300';
                      if (progress > 0) progressClass = 'text-green-500';
                      else if (progress < 0) progressClass = 'text-red-500';

                      return (
                        <p className={`text-xs ${progressClass}`}>
                          Progress:{' '}
                          {/* Progress is calculated as percentage increase from (first_weight * first_reps) to (last_weight * last_reps) */}{' '}
                          {progressText}
                        </p>
                      );
                    })()}
                    <p className="text-slate-300 text-xs">Max: {item.max_weight || 0} kg</p>
                    <p className="text-slate-300 text-xs">Min: {item.min_weight || 0} kg</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : statistics.type === 'success' ? (
          <div className="flex flex-col w-full">
            <div id="chart" className="w-full"></div>
            <div className="divider my-4"></div>
            {selectedExercise && <ChartRenderer exercise={selectedExercise} />}
            <div className="flex flex-row justify-between w-full">
              <Button onClick={() => setShowOverview(true)} border="#ef4444">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
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
              <div className="flex space-x-1">
                <Button
                  disabled={statistics.data.findIndex((e) => e === selectedExercise) === 0}
                  onClick={() =>
                    setSelectedExercise(
                      statistics.data.findIndex((e) => e === selectedExercise) - 1 >= 0
                        ? statistics.data[
                            statistics.data.findIndex((e) => e === selectedExercise) - 1
                          ]
                        : selectedExercise
                    )
                  }
                  border="#3b82f6"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 transform scale-x-[-1]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12H9m6 0l-3-3m3 3l-3 3"
                    />
                  </svg>
                </Button>
                <Button
                  disabled={
                    statistics.data.findIndex((e) => e === selectedExercise) ===
                    statistics.data.length - 1
                  }
                  onClick={() =>
                    setSelectedExercise(
                      statistics.data.findIndex((e) => e === selectedExercise) + 1 <
                        statistics.data.length
                        ? statistics.data[
                            statistics.data.findIndex((e) => e === selectedExercise) + 1
                          ]
                        : selectedExercise
                    )
                  }
                  border="#3b82f6"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12H9m6 0l-3-3m3 3l-3 3"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        ) : null}
        {statistics.type === 'loading' && (
          <div className="flex flex-col justify-center items-center">
            <span className="loading loading-bars loading-xl"></span>
            <div className="text-gray-500 mt-4">Loading statistics...</div>
          </div>
        )}
        {statistics.type === 'error' && (
          <div className="flex flex-col justify-center items-center mt-8 gap-3">
            <span className="text-red-400">Error loading statistics</span>
          </div>
        )}
      </div>
    );
  }

  function ChartRenderer({ exercise }: { exercise: ExerciseData }): JSX.Element {
    useEffect(() => {
      if (!exercise) return;

      const dates = exercise.date;
      const values = exercise.entries.map((e) => Math.max(...e.weights));
      const allWeightsonDate = exercise.entries.map((e) => e.weights);

      const options = {
        series: [
          {
            name: 'Weight (kg)',
            data: values,
          },
        ],
        chart: {
          height: 300,
          type: 'area',
          zoom: { enabled: false },
          toolbar: { show: false },
          menubar: { show: false },
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' },
        title: {
          text: `Progress for ${exercise.exercise_name}`,
          align: 'left',
          style: { color: '#FFFFFF' },
        },
        grid: { show: false },
        xaxis: {
          categories: dates,
          labels: { style: { colors: '#FFFFFF', fontSize: '9px' } },
        },
        yaxis: {
          labels: {
            style: { colors: '#FFFFFF' },
            formatter: (value) => value + ' kg',
          },
        },
        tooltip: {
          theme: 'dark',
          style: {
            fontSize: '12px',
            color: '#000000',
          },
          custom: function ({ dataPointIndex }) {
            const weight = allWeightsonDate[dataPointIndex].join(', ');

            const repsArray = exercise.entries[dataPointIndex].reps;
            const date = dates[dataPointIndex];
            const repsDisplay = repsArray.join(', ');
            return `<div class="apexcharts-tooltip-title" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">${date}</div><div class="apexcharts-tooltip-series-group apexcharts-active" style="order: 1; display: flex;"><div class="apexcharts-tooltip-text" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;"><div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label">Weight: </span><span class="apexcharts-tooltip-text-y-value">${weight} kg</span></div><div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label">Reps: </span><span class="apexcharts-tooltip-text-y-value">${repsDisplay}</span></div></div></div>`;
          },
        },
      };

      const chart = new ApexCharts(document.querySelector('#chart'), options);
      chart.render();

      return () => chart.destroy();
    }, [exercise]);

    return null;
  }

  useEffect(() => {
    api
      .get('/statistics/exercise_statistics')
      .then((response: { data: Record<string, ExerciseEntry[]> }) => {
        const transformed = Object.entries(response.data).map(([exercise_name, entries]) => ({
          exercise_name,
          entries,
          date: entries.map((e) => new Date(e.date).toLocaleDateString()),
          max_weight: Math.max(...entries.flatMap((e) => e.weights)),
          min_weight: Math.min(...entries.flatMap((e) => e.weights)),
        }));

        setStatistics({ type: 'success', data: transformed });
      });
  }, []);

  return (
    <div>
      <Header />
      <TemplatePage>
        <ExerciseCards />
      </TemplatePage>
    </div>
  );
}

export default Statistic;
