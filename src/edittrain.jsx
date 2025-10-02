import "./index.css";
import Header from "./Header";
import { useState } from "react";

const EditTrain = () => {
  const exercisesWithRepsAndSets = {
    Push: [
      { exercise: "Benchpress", reps: 12, sets: 4 },
      { exercise: "Sideraises", reps: 12, sets: 4 },
      { exercise: "Dips", reps: 12, sets: 4 },
    ],
    Pull: [
      { exercise: "Pull-Up", reps: 12, sets: 4 },
      { exercise: "High-Row", reps: 12, sets: 4 },
    ],
  };

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

  const [selectedExercise, setSelectedExercise] = useState(
    exercisesWithRepsAndSets
  );
  const [showModal, setShowModal] = useState(false);
  const [savekey, setKey] = useState("");
  const [addExercise, setaddExercise] = useState("");
  function WorkoutCard({ exercise }) {
    return (
      <div className="card w-full sm:w-80 md:w-[450px] bg-slate-800 shadow-lg border border-blue-500 mb-4">
        <div className="card-body text-xl items-center  text-center">
          <h2 className="text-amber-50 font-bold mb-2">Workout: {exercise}</h2>
          <div className="flex flex-row justify-center items-center gap-4 mt-2">
            <button
              onClick={() => handleShowModal(exercise)}
              className="btn btn-outline btn-primary"
            >
              Edit
            </button>
            <button
              onClick={() => handeRemoveWorkout(exercise)}
              className="btn btn-outline btn-error"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  }

  function handleShowModal(exercise) {
    setShowModal((prev) => !prev);
    setKey(exercise);
  }
  //Nur im Frontend
  const handeRemoveWorkout = (workoutname) => {
    console.log(workoutname);
    setSelectedExercise((prev) => {
      const updated = { ...prev };
      delete updated[workoutname];
      return updated;
    });
  };

  //Nur im Frontend
  const handleRemoveExercise = (exerciseToRemove) => {
    setSelectedExercise((prev) => {
      const updatedCategory = prev[savekey].filter(
        (ex) => ex !== exerciseToRemove
      );
      return {
        ...prev,
        [savekey]: updatedCategory,
      };
    });
  };

  const handleAddExercise2 = (e) => {
    setaddExercise(e.target.value);
  };

  //Nur im Frontend
  const handleAddExercise = () => {
    console.log(addExercise);

    if (exercise.some((ex) => ex.name == addExercise)) {
      let newExercise = { exercise: addExercise, reps: 12, sets: 4 };
      setSelectedExercise((prev) => {
        return {
          ...prev,
          [savekey]: [...prev[savekey], newExercise],
        };
      });
      console.log(selectedExercise);
      document.getElementById("input-e").value = "";
    }
  };

  //Nur im Frontend
  const handleAddSets = (e) => {
    // Überprüfen, ob die Übung bereits existiert
    const exerciseExists = selectedExercise[savekey].some(
      (ex) => ex.exercise === e.exercise
    );

    if (exerciseExists) {
      // Wenn die Übung existiert, eine neue Version des Objekts erstellen, um den Zustand zu ändern
      const updatedExercises = selectedExercise[savekey].map((ex) => {
        if (ex.exercise === e.exercise) {
          return { ...ex, sets: ex.sets + 1 }; // Inkrementiere die sets
        }
        return ex;
      });

      // Stelle sicher, dass der Zustand korrekt aktualisierst wird
      setSelectedExercise((prevState) => ({
        ...prevState,
        [savekey]: updatedExercises,
      }));
    }
  };

  //Nur im Frontend
  const handleAddReps = (e) => {
    // Überprüfen, ob die Übung bereits existiert
    const exerciseExists = selectedExercise[savekey].some(
      (ex) => ex.exercise === e.exercise
    );

    if (exerciseExists) {
      // Wenn die Übung existiert, eine neue Version des Objekts erstellen, um den Zustand zu ändern
      const updatedExercises = selectedExercise[savekey].map((ex) => {
        if (ex.exercise === e.exercise) {
          return { ...ex, reps: ex.reps + 1 }; // Inkrementiere die sets
        }
        return ex;
      });

      // Stelle sicher, dass der Zustand korrekt aktualisierst wird
      setSelectedExercise((prevState) => ({
        ...prevState,
        [savekey]: updatedExercises,
      }));
    }
  };

  //Nur im Frontend
  const handleReduceReps = (e) => {
    // Überprüfen, ob die Übung bereits existiert
    const exerciseExists = selectedExercise[savekey].some(
      (ex) => ex.exercise === e.exercise
    );

    if (exerciseExists) {
      // Wenn die Übung existiert, eine neue Version des Objekts erstellen, um den Zustand zu ändern
      const updatedExercises = selectedExercise[savekey].map((ex) => {
        if (ex.exercise === e.exercise && ex.reps > 1) {
          return { ...ex, reps: ex.reps - 1 }; // Inkrementiere die sets
        }
        return ex;
      });

      // Stelle sicher, dass der Zustand korrekt aktualisierst wird
      setSelectedExercise((prevState) => ({
        ...prevState,
        [savekey]: updatedExercises,
      }));
    }
  };

  //Nur im Frontend
  const handleReduceSets = (e) => {
    // Überprüfen, ob die Übung bereits existiert
    const exerciseExists = selectedExercise[savekey].some(
      (ex) => ex.exercise === e.exercise
    );

    if (exerciseExists) {
      // Wenn die Übung existiert, eine neue Version des Objekts erstellen, um den Zustand zu ändern
      const updatedExercises = selectedExercise[savekey].map((ex) => {
        if (ex.exercise === e.exercise && ex.sets > 1) {
          return { ...ex, sets: ex.sets - 1 }; // Inkrementiere die sets
        }
        return ex;
      });

      // Stelle sicher, dass der Zustand korrekt aktualisierst wird
      setSelectedExercise((prevState) => ({
        ...prevState,
        [savekey]: updatedExercises,
      }));
    }
  };

  function EditWorkoutModal() {
    return (
      <div className="modal modal-open">
        <div className="modal-box bg-slate-800 border flex flex-col items-center justify-center border-blue-500 space-y-3">
          <p className="text-amber-50 font-bold mb-2 ">Add a new exercise:</p>
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="search"
              placeholder="Enter exercise name"
              className="w-64 px-4 py-2 bg-slate-900 text-white border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              list="exercise-options"
              id="input-e"
              onChange={handleAddExercise2}
            />
            <button
              onClick={handleAddExercise}
              className="btn btn-outline btn-primary"
            >
              Add
            </button>
          </div>
          <datalist id="exercise-options">
            {exercise.map((item, index) => (
              <option key={index} value={item.name} />
            ))}
          </datalist>
          {selectedExercise[savekey].map((exercise, index) => (
            <div
              key={index}
              className="card w-64  bg-slate-800 border border-blue-500 shadow-sm p-2 rounded-md flex flex-col items-center"
            >
              <h2 className="text-amber-50 font-bold mb-2 ">
                {exercise.exercise}
              </h2>
              <div className="flex flex-row justify-start text-xs space-y-2">
                <div className="h-24 overflow-y-scroll border border-gray-800">
                  <table className=" min-w-2 border-collapse">
                    <tbody>
                      {Array.from({ length: 25 }, (_, i) => i + 1).map(
                        (setIndex) => (
                          <tr
                            key={setIndex}
                            className={"bg-gray-700"}
                            onClick={() => {
                              setSelectedExercise((prev) => {
                                const updated = { ...prev };
                                updated[savekey] = updated[savekey].map(
                                  (ex, i) =>
                                    i === index ? { ...ex, sets: setIndex } : ex
                                );
                                console.log(selectedExercise[savekey][index]);
                                return updated;
                              });
                            }}
                          >
                            <td
                              className={`border  border-gray-800 cursor-pointer p-2 text-center ${
                                setIndex ===
                                selectedExercise[savekey][index].sets
                                  ? "bg-blue-500"
                                  : ""
                              }`}
                            >
                              Sets: {setIndex}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="h-24 overflow-y-scroll border border-gray-800">
                  <table className=" min-w-2 border-collapse">
                    <tbody>
                      {Array.from({ length: 25 }, (_, i) => i + 1).map(
                        (repsIndex) => (
                          <tr
                            key={repsIndex}
                            className={"bg-gray-700"}
                            onClick={() => {
                              setSelectedExercise((prev) => {
                                const updated = { ...prev };
                                updated[savekey] = updated[savekey].map(
                                  (ex, i) =>
                                    i === index
                                      ? { ...ex, reps: repsIndex }
                                      : ex
                                );
                                console.log(selectedExercise[savekey][index]);
                                return updated;
                              });
                            }}
                          >
                            <td
                              className={`border  border-gray-800 cursor-pointer p-2 text-center ${
                                repsIndex ===
                                selectedExercise[savekey][index].reps
                                  ? "bg-blue-500"
                                  : ""
                              }`}
                            >
                              Reps: {repsIndex}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <button
                onClick={() => handleRemoveExercise(exercise)}
                className="btn btn-outline btn-error "
              >
                Remove
              </button>
            </div>
          ))}
          <div className="modal-action flex flex-row gap-2 justify-end">
            <button
              onClick={handleShowModal}
              className="btn btn-outline btn-primary"
            >
              Save
            </button>
            <button
              onClick={handleShowModal}
              className="btn btn-outline btn-error"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center pt-24 pb-8">
      <Header />
      <div className="space-y-4 card w-full max-w-2xl bg-slate-800 border border-blue-500 shadow-sm p-8 rounded-md flex flex-col items-center">
        <div className="divider divider-primary text-amber-50 font-bold mb-2">
          Edit Your Training
        </div>
        <div className="w-full flex flex-col  gap-4 items-center pt-2">
          {Object.keys(selectedExercise).map((exercise, index) => (
            <WorkoutCard exercise={exercise} key={index} />
          ))}
        </div>
        {showModal && <div>{EditWorkoutModal()}</div>}
      </div>
    </div>
  );
};

export default EditTrain;
