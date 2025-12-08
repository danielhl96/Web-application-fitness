import api from './api';
import ApexCharts from 'apexcharts';
import { useState, useEffect } from 'react';
import TemplatePage from './templatepage';

function Statistic() {
  const [showOverview, setShowOverview] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(null);

  function ExerciseCards() {
    return showOverview ? (
      <div className="">
        <div className="divider divider-primary  text-amber-50 font-bold mb-2">Your statistics</div>

        <div className="grid sm:grid grid-cols-1 lg:grid-cols-3 space-x-2 justify-center items-center mt-4 text-xs overflow-y-auto max-h-130">
          {data.map((item, index) => (
            <div
              key={index}
              className="items-center cursor-pointer"
              onClick={() => {
                setSelectedExercise(item);
                setShowOverview(false);
              }}
            >
              <div
                className={`card w-auto h-auto border-2 border-blue-500 shadow-xl rounded-xl backdrop-blur-lg flex flex-col items-center mb-2`}
                style={{
                  background: 'rgba(0,0,0,0.20)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
              >
                <h2 className="text-amber-50 font-bold mb-2">{item.exercise_name}</h2>
                <figure className="w-9 h-9 mb-2">
                  <img
                    src={
                      './' +
                      item.exercise_name.toLowerCase().replace('-', '').replace(' ', '') +
                      '.png'
                    }
                    className="w-full h-full object-cover rounded-md"
                  />
                </figure>
                <div className="flex flex-row space-x-4">
                  {(() => {
                    let progress = 0;
                    if (item.entries && item.entries.length >= 2) {
                      const first = item.entries[0];
                      const last = item.entries[item.entries.length - 1];
                      const firstWeight =
                        first.weights && first.weights.length > 0 ? Math.max(...first.weights) : 0;
                      const lastWeight =
                        last.weights && last.weights.length > 0 ? Math.max(...last.weights) : 0;
                      const firstReps =
                        first.reps && first.reps.length > 0 ? Math.max(...first.reps) : 0;
                      const lastReps =
                        last.reps && last.reps.length > 0 ? Math.max(...last.reps) : 0;
                      if (firstWeight > 0 && firstReps > 0) {
                        progress =
                          ((lastWeight * lastReps - firstWeight * firstReps) /
                            (firstWeight * firstReps)) *
                          100;
                      }
                    }
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
      </div>
    ) : (
      <div className="flex flex-col w-full">
        <div id="chart" className="w-full"></div>
        <div className="divider my-4"></div>
        {selectedExercise && <ChartRenderer exercise={selectedExercise} />}
        <div className="flex flex-row justify-between w-full">
          <button
            onClick={() => setShowOverview(true)}
            className="btn btn-outline btn-secondary btn-sm"
          >
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
          </button>
          <div className="flex space-x-1">
            <button
              disabled={data.findIndex((e) => e === selectedExercise) === 0}
              onClick={() =>
                setSelectedExercise(
                  data.findIndex((e) => e === selectedExercise) - 1 >= 0
                    ? data[data.findIndex((e) => e === selectedExercise) - 1]
                    : selectedExercise
                )
              }
              className="btn btn-outline btn-success btn-sm flex justify-start"
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
                  d
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12H9m6 0l-3-3m3 3l-3 3"
                />
              </svg>
            </button>
            <button
              disabled={data.findIndex((e) => e === selectedExercise) === data.length - 1}
              onClick={() =>
                setSelectedExercise(
                  data.findIndex((e) => e === selectedExercise) + 1 < data.length
                    ? data[data.findIndex((e) => e === selectedExercise) + 1]
                    : selectedExercise
                )
              }
              className="btn btn-outline btn-primary btn-sm flex justify-start"
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
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Neu: Chart-Komponente mit useEffect
  function ChartRenderer({ exercise }) {
    useEffect(() => {
      if (!exercise) return;

      console.log('Rendering chart for exercise:', exercise);
      const dates = exercise.entries.map((e) => e.date);

      console.log(dates);

      const weights = exercise.entries.map((e) => Math.max(...e.weights));

      console.log('Weights:', weights);
      const options = {
        series: [
          {
            name: 'Weight (kg)',
            data: weights,
          },
        ],
        chart: {
          height: 300,
          type: 'line',
          zoom: { enabled: false },
          toolbar: { show: false },
          menubar: { show: false },
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'stepline' },
        title: {
          text: `Progress for ${exercise.exercise_name}`,
          align: 'left',
          style: { color: '#FFFFFF' },
        },
        grid: {
          row: { colors: ['#FFFFFF', 'transparent'], opacity: 0.5 },
        },
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
          custom: function ({ series, seriesIndex, dataPointIndex }) {
            const weight = series[seriesIndex][dataPointIndex];
            const repsArray = exercise.entries[dataPointIndex].reps;
            const date = exercise.entries[dataPointIndex].date;
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

  const [data, setData] = useState([]);

  useEffect(() => {
    api.get('/statistics').then((response) => {
      setData(response.data);
      console.log('Fetched statistics data:', response.data);
    });
  }, []);

  return (
    <div>
      <TemplatePage>
        <ExerciseCards />
      </TemplatePage>
    </div>
  );
}

export default Statistic;
