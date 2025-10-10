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
    <div className="card  sm:w-80 md:w-[450px] bg-slate-800 shadow-lg border border-blue-500 mb-4">
      <div className="card-body  items-center  text-center">
        <h2 className="text-amber-50 font-bold mb-2">{name}</h2>
        <figure className="flex justify-center items-center w-6 h-6 mb-2">
          <img src={img} alt={name} className="rounded-md" />
        </figure>
        <p className="text-sm text-slate-200 mb-2">{description}</p>

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
                        {"Sets: " + set}
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
  const [addExercise, setaddExercise] = useState("");
  const [exerciseExists, setExerciseExists] = useState(exercise);

  console.log(selectedExercise);

  function handleExerciseChange(e, sets, reps) {
    const selectedName = e;
    console.log(selectedName);
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
    if (found) {
      // Update the sets and reps for the found exercise
      const updatedExercise = { ...found, sets: sets, reps: reps };
      setSelectedExercise((prev) =>
        prev.map((item) => (item.name === e ? updatedExercise : item))
      );
    }
    document.getElementById("input-e").value = "";
    setaddExercise("");
  }

  const handleAddExercise2 = (e) => {
    console.log(e.target.value);
    setaddExercise(e.target.value);
  };

  const handleRemoveExercise = (name) => {
    setSelectedExercise((prev) => prev.filter((item) => item.name !== name));
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center pt-24 pb-8">
      <Header />
      <div className="card w-auto h-auto  bg-slate-800 border border-blue-500 shadow-lg p-8 rounded-md flex flex-col items-center ">
        <div className="divider divider-primary text-amber-50 font-bold mb-2 ">
          Create your training
        </div>
        <div className="flex flex-col items-center space-y-4">
          <input
            type="input"
            placeholder="Your trainings name:"
            className="w-54 h-10 bg-slate-900 text-white border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="training-input"
          />
          <input
            type="search"
            placeholder="Enter an exercise name"
            className="w-54 h-10 bg-slate-900 text-white border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="input-e"
            onChange={handleAddExercise2}
          />

          <div
            className={`h-32 overflow-y-scroll border border-gray-800 ${
              exerciseExists.some((ex) =>
                ex.name.toLowerCase().includes(addExercise.toLowerCase())
              ) && addExercise.length > 0
                ? "block"
                : "hidden"
            }`}
          >
            {exerciseExists
              .filter(
                (prev) =>
                  prev.name.toLowerCase().includes(addExercise.toLowerCase()) &&
                  !selectedExercise.some((ex) => ex.exercise === prev.name)
              )
              .map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <div
                    onClick={() => handleExerciseChange(item.name)}
                    className="card w-50 h-30  bg-slate-800 border border-blue-500 shadow-sm p-2 rounded-md flex flex-col items-center mb-2"
                  >
                    <h2 className="text-amber-50 font-bold mb-2">
                      {item.name}
                    </h2>
                    <figure className="w-6 h-6 mb-2">
                      <img
                        src={item.img}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </figure>
                    <h1 className="text-amber-50 font-light text-xs mb-2 text-center ">
                      {item.description}
                    </h1>
                  </div>
                </div>
              ))}
          </div>

          {/* Render selected exercises */}
          <div className="flex flex-col items-center space-y-3">
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
    </div>
  );
}

export default CreateTrainGUI;
