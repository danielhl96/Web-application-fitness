import "./index.css";
import Header from "./Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ExerciseCard({ name, description, img, onRemove }) {
  const [selectedSets, setSelectedSets] = useState(null);
  const [selectedReps, setSelectedReps] = useState(null);

  const handleSets = (e) => {
    console.log(e);
    setSelectedSets(e);
  };
  const handleReps = (e) => {
    console.log(e);
    setSelectedReps(e);
  };

  return (
    <div className="card w-full sm:w-80 md:w-[450px] bg-slate-800 justify-items-center shadow-lg border border-blue-500 mb-4">
      <div className="card-body">
        <h2 className="card-title  text-xl font-semibold">{name}</h2>
        <figure className="mb-4 flex justify-center">
          <img
            src={img}
            alt={name}
            className="rounded-md"
            width="60"
            height="60"
          />
        </figure>
        <p className="text-sm text-slate-200 mb-2">{description}</p>
        <div className="card-actions flex flex-wrap gap-2 justify-center mt-2">
          <div className="flex flex-row justify-center items-center">
            <div className="h-20 overflow-y-scroll border border-gray-800">
              <table className="min-w-2 border-collapse">
                <tbody>
                  {Array.from({ length: 25 }, (_, i) => i + 1).map(
                    (set, index) => (
                      <tr key={index} data-set={set} className={"bg-gray-700"}>
                        <td
                          onClick={() => handleSets(set)}
                          className={`border border-gray-800 p-2 text-center cursor-pointer ${
                            selectedSets === set ? "bg-blue-600" : ""
                          }`}
                        >
                          {"Set: " + set}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className="h-20 overflow-y-scroll border border-gray-800">
              <table className="min-w-2 border-collapse">
                <tbody>
                  {Array.from({ length: 25 }, (_, i) => i + 1).map(
                    (reps, index) => (
                      <tr key={index} data-set={reps} className={"bg-gray-700"}>
                        <td
                          onClick={() => handleReps(reps)}
                          className={`border border-gray-800 p-2 text-center cursor-pointer ${
                            selectedReps === reps ? "bg-blue-600" : ""
                          }`}
                        >
                          {"Reps: " + reps}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <button className="btn btn-outline btn-warning" onClick={onRemove}>
          Remove
        </button>
      </div>
    </div>
  );
}

function CreateTrainGUI() {
  const navigate = useNavigate();
  const exercise = [
    {
      name: "Benchpress",
      description: "An exercise to train the chest, shoulder, and triceps",
      img: "./benchpress.png",
    },
    {
      name: "Shoulderpress",
      description: "An exercise to train the shoulder and triceps",
      img: "./shoulderpress.png",
    },

    {
      name: "Side raise",
      description: "An exercise to train shoulder (deltas)",
      img: "./sideraises.png",
    },

    {
      name: "Butterfly-Maschine",
      description: "An exercise to train the chest and the shoulder",
      img: "./butterflymaschine.png",
    },

    {
      name: "Triceps-Maschine",
      description: "An exercise to train triceps",
      img: "./tricepsmaschine.png",
    },
    {
      name: "Dips",
      description: "An exercise to train triceps, chest and shoulder",
      img: "./dips.png",
    },
    {
      name: "French press",
      description: "An exercise to train the triceps",
      img: "./frenchpress.png",
    },
  ];

  const [selectedExercise, setSelectedExercise] = useState([]);

  function handleExerciseChange(e) {
    const selectedName = e.target.value;

    const found = exercise.find((item) => item.name === selectedName);
    if (found) {
      // Add the found exercise to the selectedExercise state
      setSelectedExercise((prev) => {
        // Check if the exercise is already in the list before adding
        if (!prev.some((item) => item.name === found.name)) {
          return [...prev, found];
        }
        return prev; // Don't add if already in the list
      });
    }
    document.getElementById("input_search").value = "";
  }

  const handleRemoveExercise = (name) => {
    setSelectedExercise((prev) => prev.filter((item) => item.name !== name));
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center pt-24 pb-8">
      <Header />
      <div className="space-y-4 card w-full max-w-2xl bg-slate-800 border border-blue-500 shadow-lg p-8 rounded-md flex flex-col items-center ">
        <div className="divider divider-primary text-amber-50 font-bold mb-2 ">
          Create your training
        </div>
        <div className="w-full flex flex-col gap-4 items-center justify-center pt-2">
          <label className="input">
            <input
              type="input"
              onChange={handleExerciseChange}
              className="input input-primary"
              placeholder="Name your workout"
            />
          </label>
          <label className="input">
            <input
              type="search"
              onChange={handleExerciseChange}
              list="exercise-options"
              className="input input-primary"
              id="input_search"
              placeholder="Select your exercise"
            />
            <datalist id="exercise-options">
              {exercise.map((item, index) => (
                <option key={index} value={item.name} />
              ))}
            </datalist>
          </label>
        </div>

        {/* Render selected exercises */}
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-6 w-full justify-center items-center">
          {selectedExercise.length > 0 ? (
            selectedExercise.map((exercise, index) => (
              <ExerciseCard
                key={index}
                name={exercise.name}
                description={exercise.description}
                img={exercise.img}
                onRemove={() => handleRemoveExercise(exercise.name)}
              />
            ))
          ) : (
            <p className="text-slate-400 flex justify-center">
              No exercises selected yet.
            </p>
          )}
        </div>
        <div className="flex flex-row items-center gap-4 mt-4">
          <button className="btn btn-outline btn-primary">Save</button>
          <button
            onClick={() => navigate("/")}
            className="btn btn-outline btn-error"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateTrainGUI;
