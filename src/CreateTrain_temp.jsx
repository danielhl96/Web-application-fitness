import "./index.css";
import Header from "./Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import exercise from "./Exercises";

function ExerciseCard({
  name,
  description,
  img,
  onRemove,
  onRepsChange,
  onSetsChange,
}) {
  const [selectedSets, setSelectedSets] = useState([]);
  const [selectedReps, setSelectedReps] = useState([]);

  const handleSets = (e) => {
    console.log(e);
    setSelectedSets(e);
    ExerciseCard.sets = e;
    if (onSetsChange) onSetsChange(e);
  };
  const handleReps = (e) => {
    setSelectedReps(e);
    // 3. Callback aufrufen
    if (onRepsChange) onRepsChange(e);
  };

  return (
    <div className="card  w-65 sm:w-40 md:w-60 bg-slate-800 shadow-lg border border-blue-500 mb-4">
      <div className="card-body  items-center  text-center">
        <h2 className="text-amber-50 font-bold mb-2">{name}</h2>
        <figure className="flex justify-center items-center w-6 h-6 mb-2">
          <img src={img} alt={name} className="rounded-md" />
        </figure>
        <p className="text-sm text-slate-200 mb-2">{description}</p>

        <div className="flex flex-row justify-center items-center">
          <div className="h-20 overflow-y-scroll border border-gray-800">
            <table id="sets-table" className="min-w-2 border-collapse">
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
  const [WorkoutName, setWorkoutName] = useState("");
  const [WorkoutNameSet, setWorkoutNameSet] = useState(false);
  const handleSaveTraining = async () => {
    const trainingName =
      WorkoutName || document.getElementById("training-input").value;
    const selectedExercises = selectedExercise.map((exercise) => ({
      name: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      weights: Array.isArray(exercise.weights)
        ? exercise.weights
        : Array(exercise.sets || 3).fill(0),
    }));

    await api
      .post("/create_workout_plan", {
        name: trainingName,
        exercises: selectedExercises,
      })
      .then((response) => {
        setMessage("Training saved successfully!");
        console.log("Training saved:", response.data);
      })
      .catch((error) => {
        console.error("Error saving training:", error);
        setMessage("Error saving training.");
      });
  };


  useEffect(() => {
    setExerciseExists(exercise);
  }, []);

  const [selectedExercise, setSelectedExercise] = useState([]);
  const [addExercise, setaddExercise] = useState("");
  const [exerciseExists, setExerciseExists] = useState([]);
  const [Message, setMessage] = useState("");

  console.log(selectedExercise);

  function handleExerciseChange(e) {
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
      const updatedExercise = {
        ...found,
        sets: document.getElementById("sets-table").getElementsByTagName("tr")
          .length,
        reps: [8, 8, 8],
        weights: [0, 0, 0],
        date: new Date().toISOString().split("T")[0],
      };
      setSelectedExercise((prev) =>
        prev.map((item) => (item.name === e ? updatedExercise : item))
      );
    }
    console.log(selectedExercise);
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

  // 1. Funktion in CreateTrainGUI definieren
  const handleRepsChange = (exerciseName, reps) => {
    setSelectedExercise((prev) =>
      prev.map((item) =>
        item.name === exerciseName
          ? { ...item, reps: Array.from({ length: item.sets }, () => reps) }
          : item
      )
    );
    console.log(selectedExercise);
  };
  const handleSetsChange = (exerciseName, sets) => {
    setSelectedExercise((prev) =>
      prev.map((item) =>
        item.name === exerciseName
          ? {
              ...item,
              sets,
              reps: Array.isArray(item.reps)
                ? Array.from({ length: sets }, (_, i) => item.reps[i] || 8)
                : Array(sets).fill(8),
              weights: Array.isArray(item.weights)
                ? Array.from({ length: sets }, (_, i) => item.weights[i] || 0)
                : Array(sets).fill(0),
            }
          : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center pt-24 pb-8">
      <Header />
      <div className="card w-85 h-auto md:w-100 sm:w-85  bg-slate-800 border border-blue-500 shadow-lg p-8 rounded-md flex flex-col items-center  ">
        <div className="divider divider-primary text-amber-50 font-bold mb-2 ">
          Create your workout
        </div>
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-slate-400">Your workout need an name:</h1>
          <div className="flex flex-row">
            <input
              disabled={WorkoutNameSet}
              type="input"
              placeholder="Workout name"
              className={`w-54 h-10 ${
                WorkoutNameSet
                  ? "bg-gray-900 border border-green-500"
                  : "bg-gray-900"
              } text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              id="training-input"
              onChange={(e) => setWorkoutName(e.target.value)}
            />
            <button
              disabled={WorkoutName === ""}
              onClick={() => setWorkoutNameSet((prev) => !prev)}
              className="btn btn-outline btn-primary"
            >
              {WorkoutNameSet ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              ) : (
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          </div>
          {WorkoutNameSet === true && (
            <div className="flex flex-col items-center space-y-2">
              <h1 className="text-slate-400">Search your exercise:</h1>
              <div className="form-control">
                <input
                  type="search"
                  placeholder="Enter an exercise name"
                  className="input input-bordered w-54 h-10 bg-slate-900 text-white border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="input-e"
                  onChange={handleAddExercise2}
                />
              </div>
              <div className="divider divider-primary text-amber-50 font-bold mb-2">
                {WorkoutName}
              </div>
            </div>
          )}
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
          {WorkoutNameSet ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="w-100 flex flex-col  gap-4 items-center pt-2 overflow-y-auto max-h-80">
                {selectedExercise.length > 0 ? (
                  selectedExercise.map((exercise, index) => (
                    <ExerciseCard
                      key={index}
                      name={exercise.name}
                      description={exercise.description}
                      img={exercise.img}
                      onRemove={() => handleRemoveExercise(exercise.name)}
                      // Callback for Prop passed
                      onRepsChange={(reps) =>
                        handleRepsChange(exercise.name, reps)
                      }
                      onSetsChange={(sets) =>
                        handleSetsChange(exercise.name, sets)
                      }
                    />
                  ))
                ) : (
                  <p className="text-slate-400 flex justify-center">
                    No exercises selected yet.
                  </p>
                )}
              </div>
            </div>
          ) : null}
          <div className="flex flex-row items-center gap-4 mt-4">
            <button
              disabled={WorkoutName === "" || selectedExercise.length === 0}
              onClick={() => handleSaveTraining()}
              className="btn btn-outline btn-primary"
            >
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </button>
            <button
              onClick={() => navigate("/")}
              className="btn btn-outline btn-error"
            >
              {Message === "Training saved successfully!" ? (
                <>
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
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </>
              ) : (
                <>
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
          {Message === "Training saved successfully!" && (
            <div className="mt-4">
              <p className="text-green-500">{Message}</p>
            </div>
          )}{" "}
          {Message === "Error saving training." && (
            <div className="mt-4">
              <p className="text-red-500">{Message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateTrainGUI;
