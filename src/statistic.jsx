import api from "./api";
import ApexCharts from "apexcharts";
import { useState, useEffect } from "react";

function Statistic() {
  const [showOverview, setShowOverview] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(null); // <-- Neu: Für ausgewähltes Exercise

  function ExerciseCards() {
    return showOverview ? (
      <div className="lg:mt-0 sm:pt-2 sm:w-auto lg:max-w-2xl bg-slate-800 border border-blue-500 shadow-sm p-8 rounded-md flex flex-col items-center">
        <h1 className="font-bold text-left">Your statistics:</h1>
        <div className="grid sm:grid grid-cols-1 lg:grid-cols-3 space-x-2 justify-center items-center mt-4 text-xs overflow-y-auto max-h-130">
          {data.map((item, index) => (
            <div
              key={index}
              className="items-center cursor-pointer"
              onClick={() => {
                setSelectedExercise(item); // <-- Neu: Setze ausgewähltes Exercise
                setShowOverview(false);
              }}
            >
              <div
                className={`card w-auto h-auto bg-slate-800 border-2 border-blue-500 shadow-sm p-2 rounded-md flex flex-col items-center mb-2`}
              >
                <h2 className="text-amber-50 font-bold mb-2">
                  {item.exercise_name}
                </h2>
                <figure className="w-9 h-9 mb-2">
                  <img
                    src={
                      "./" +
                      item.exercise_name
                        .toLowerCase()
                        .replace("-", "")
                        .replace(" ", "") +
                      ".png"
                    }
                    className="w-full h-full object-cover rounded-md"
                  />
                </figure>
                <div className="flex flex-row space-x-4">
                  <p className="text-slate-300 text-xs">
                    Progress:{" "}
                    {item.max_weight[0] && item.min_weight[0]
                      ? (
                          (item.max_weight[0] / item.min_weight[0]) *
                          100
                        ).toFixed(1)
                      : 0}{" "}
                    %
                  </p>
                  <p className="text-slate-300 text-xs">
                    Max: {item.max_weight[0] || 0} kg
                  </p>
                  <p className="text-slate-300 text-xs">
                    Min: {item.min_weight[0] || 0} kg
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="lg:mt-0 sm:pt-2 sm:w-auto lg:max-w-2xl bg-slate-800 border border-blue-500 shadow-sm p-8 rounded-md flex flex-col items-end">
        <div id="chart" className="w-full"></div>
        <div className="divider my-4"></div>
        {selectedExercise && <ChartRenderer exercise={selectedExercise} />}
        <div className="flex flex-row justify-between w-full">
          <button
            onClick={() => setShowOverview(true)}
            className="btn btn-outline btn-secondary btn-sm" // <-- Neu: btn-sm für kleinere Größe
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
                className="h-4 w-4 transform scale-x-[-1]" // <-- Hier hinzugefügt: scale-x-[-1] spiegelt horizontal
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
              onClick={() =>
                setSelectedExercise(
                  data.findIndex((e) => e === selectedExercise) + 1 <
                    data.length
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

      // Daten aus entries extrahieren (z.B. max weight pro Datum)
      console.log("Rendering chart for exercise:", exercise);
      //const dates = exercise.map((e) => e.date);

      //const weights = exercise.max_weight.map((e) => Math.max(...e.weights)); // Max weight pro Eintrag

      const weights = [20, 25, 30, 35, 40, 45, 50, 55, 60, 60, 70]; // Beispielwerte
      const dates = [
        "2024-01-01",
        "2024-01-05",
        "2024-01-10",
        "2024-01-15",
        "2024-01-20",
        "2024-01-25",
        "2024-01-30",
        "2024-02-04",
        "2024-02-10",
        "2024-02-15",
        "2024-02-20",
      ]; // Beispielwerte
      console.log("Weights:", weights);
      const options = {
        series: [
          {
            name: "Weight (kg)",
            data: weights,
          },
        ],
        chart: {
          height: 300,
          type: "line",
          zoom: { enabled: false },
          toolbar: { show: false },
          menubar: { show: false },
        },
        dataLabels: { enabled: false },
        stroke: { curve: "stepline" },
        title: {
          text: `Progress for ${exercise.exercise_name}`,
          align: "left",
          style: { color: "#FFFFFF" },
        },
        grid: {
          row: { colors: ["#FFFFFF", "transparent"], opacity: 0.5 },
        },
        xaxis: {
          categories: dates,
          labels: { style: { colors: "#FFFFFF", fontSize: "9px" } },
        },
        yaxis: {
          labels: {
            style: { colors: "#FFFFFF" },
            formatter: (value) => value + " kg", // <-- Neu: Einheiten "kg" anzeigen
          },
        },
        tooltip: {
          theme: "dark", // <-- Geändert: Dark-Theme für schwarzen Text auf hellem Hintergrund
          style: {
            fontSize: "12px",
            color: "#000000", // <-- Text explizit schwarz
          },
        },
      };

      const chart = new ApexCharts(document.querySelector("#chart"), options); // <-- Korrigiert: "#chart"
      chart.render();

      return () => chart.destroy();
    }, [exercise]);

    return null; // Kein JSX, nur Side-Effect
  }

  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/statistics").then((response) => {
      setData(response.data[0]); // <-- Korrigiert: Ohne [0]
      console.log("Fetched statistics data:", response.data);
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center bg-slate-900 justify-center pt-20 pb-5">
      <ExerciseCards />
    </div>
  );
}

export default Statistic;
