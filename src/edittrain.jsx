import "./index.css";
import Header from "./Header";
import { useState, useRef, useEffect } from "react";

import api from "./api";

const EditTrain = () => {
  const [data, setData] = useState([]);
  const [requestId, setRequestId] = useState(0);

  useEffect(
    () => {
      api.get("/get_workout_plans").then((response) => {
        setData(response.data);
        console.log(response.data);
      });
    },
    [],
    [requestId]
  );

  // map API response -> { PlanName: [ { exercise, reps, sets }, ... ], ... }
  const mapPlans = (plans) =>
    plans.reduce((acc, plan) => {
      acc[plan.name] = plan.templates.map((exercise) => ({
        exercise: exercise.name,
        reps: exercise.reps,
        sets: exercise.sets,
        weight: exercise.weight,
        plan_id: plan.id,
      }));
      return acc;
    }, {});

  // keep the selected state separate and initialize as empty object
  const [selectedExercise, setSelectedExercise] = useState({});

  // whenever `data` (from backend) changes, compute the desired shape and set state
  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedExercise(mapPlans(data));
    } else {
      setSelectedExercise({});
    }
  }, [data]);

  function handleEditWorkout(index) {
    const payload = {
      plan_id: selectedExercise[index][0]?.plan_id || null,
      exercises: selectedExercise[index]?.map(
        ({ exercise, reps, sets, weights, plan_id }) => ({
          name: exercise,
          reps: Array.isArray(reps) ? reps : Array(sets).fill(reps),
          sets,
          weights: weights || Array(sets).fill(0),
          plan_id: plan_id || null,
        })
      ),
    };
    console.log(payload);
    api
      .put("/edit_workout_plan", payload)
      .then((response) => {
        console.log("Workout plans updated successfully:", response.data);
        setRequestId((requestId) => requestId + 1); // Trigger data refresh
      })
      .catch((error) => {
        console.error("Error updating workout plans:", error);
      });
  }

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
      img: "./sideraise.png",
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
    {
      name: "Pull-Up",
      description: "An exercise to train the back and biceps",
      img: "./pullup.png",
    },
    {
      name: "High-Row",
      description: "An exercise to train the back and biceps",
      img: "./highrow.png",
    },
    {
      name: "Deadlift",
      description: "An exercise to train the back, glutes, and hamstrings",
      img: "./deadlift.png",
    },
    {
      name: "Biceps-Curl",
      description: "An exercise to train the biceps",
      img: "./bicepscurl.png",
    },
    {
      name: "Butterfly reverse",
      description: "An exercise to train the rear delts and upper back",
      img: "./butterflyreverse.png",
    },
    {
      name: "Seated-Row",
      description: "An exercise to train the back, lat and biceps",
      img: "./seatedrow.png",
    },
    {
      name: "Lat Pulldown",
      description: "An exercise to train the back, lat and biceps",
      img: "./latpulldown.png",
    },
    {
      name: "Squats",
      description: "An exercise to train the quads, glutes, and hamstrings",
      img: "./squats.png",
    },
    {
      name: "Lunges",
      description: "An exercise to train the quads, glutes, and hamstrings",
      img: "./lunges.png",
    },
    {
      name: "Leg Press",
      description: "An exercise to train the quads, glutes, and hamstrings",
      img: "./legpress.png",
    },
    {
      name: "Leg Curl",
      description: "An exercise to train the hamstrings",
      img: "./legcurl.png",
    },
    {
      name: "Calf Raises",
      description: "An exercise to train the calves",
      img: "./calfraises.png",
    },
    {
      name: "Leg Extension",
      description: "An exercise to train the quads",
      img: "./legextension.png",
    },
    {
      name: "Crunches",
      description: "An exercise to train the abdominal muscles",
      img: "./crunches.png",
    },
    {
      name: "Plank",
      description: "An exercise to train the core muscles",
      img: "./plank.png",
    },
    {
      name: "Russian Twists",
      description: "An exercise to train the obliques and core muscles",
      img: "./russiantwists.png",
    },
    {
      name: "Hanging Leg Raises",
      description: "An exercise to train the lower abdominal muscles",
      img: "./hanginglegraises.png",
    },
    {
      name: "Mountain Climbers",
      description:
        "An exercise to train the core muscles and improve cardiovascular fitness",
      img: "./mountainclimbers.png",
    },
    {
      name: "Burpees",
      description:
        "A full-body exercise that improves cardiovascular fitness and strength",
      img: "./burpees.png",
    },
    {
      name: "Leg Raises",
      description: "An exercise to train the lower abdominal muscles",
      img: "./legraises.png",
    },
    {
      name: "Sit-Ups",
      description: "An exercise to train the abdominal muscles",
      img: "./situps.png",
    },
    {
      name: "Muscle-Up",
      description:
        "An advanced exercise that combines a pull-up and a dip to train the upper body muscles",
      img: "./muscleup.png",
    },
    {
      name: "Incline Benchpress",
      description:
        "An exercise to train the upper chest, shoulder, and triceps",
      img: "./inclinebenchpress.png",
    },
    {
      name: "Push-Ups",
      description:
        "A bodyweight exercise to train the chest, shoulders, and triceps",
      img: "./pushups.png",
    },
  ];

  const [showModal, setShowModal] = useState(false);
  const [savekey, setKey] = useState("");
  const [addExercise, setaddExercise] = useState("");
  const [exerciseExists, setExerciseExists] = useState(exercise);

  const setRef = useRef([]);
  const repsRef = useRef([]);

  function WorkoutCard({ exercise }) {
    return (
      <div className="card w-55  md:w-65 bg-slate-800 shadow-lg border border-blue-500 mb-4">
        <div className="card-body text-xl items-center  text-center">
          <h2 className="text-amber-50 font-bold mb-2">Workout: {exercise}</h2>
          <div className="flex flex-row justify-center items-center gap-4 mt-2">
            <button
              onClick={() => handleShowModal(exercise)}
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => handeRemoveWorkoutAPI(exercise)}
              className="btn btn-outline btn-error"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
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
  const handeRemoveWorkoutAPI = (workoutname) => {
    api
      .delete(`/delete_workout_plan`, {
        data: { plan_id: selectedExercise[workoutname][0]?.plan_id }, // Korrigiert
      })
      .then(() => {
        console.log("Workout plan deleted");
        handeRemoveWorkout(workoutname);
      })
      .catch((error) => {
        console.error("Error deleting workout plan:", error);
      });
  };

  const handleAddExercise2 = (e) => {
    console.log(e.target.value);
    setaddExercise(e.target.value);
  };

  //Nur im Frontend
  const handleAddExercise = (elem) => {
    console.log(selectedExercise[savekey]);

    if (exercise.some((ex) => ex.name == elem)) {
      let newExercise = {
        exercise: elem,
        reps: 12,
        sets: 4,
        plan_id: selectedExercise[savekey][0]?.plan_id || null,
      };
      setSelectedExercise((prev) => {
        return {
          ...prev,
          [savekey]: [...prev[savekey], newExercise],
        };
      });
      console.log(selectedExercise);
      document.getElementById("input-e").value = "";
      setaddExercise("");
    }
  };
  useEffect(() => {
    console.log(selectedExercise);
    for (let i = 0; i < selectedExercise[savekey]?.length; i++) {
      if (setRef.current[i] != null) {
        const selectedSetRow = setRef.current[i].querySelector(
          `tr[data-set-index="${selectedExercise[savekey][i].sets}"]`
        );
        if (selectedSetRow) {
          setRef.current[i].scrollTop = selectedSetRow.offsetTop;
        }
        console.log(selectedExercise[savekey][i].sets);
      }
      if (repsRef.current[i] != null) {
        const selectedRepsRow = repsRef.current[i].querySelector(
          `tr[data-reps-index="${selectedExercise[savekey][i].reps[0]}"]`
        );
        if (selectedRepsRow) {
          repsRef.current[i].scrollTop = selectedRepsRow.offsetTop;
        }
        console.log(selectedExercise[savekey][i].reps);
      }
    }
  }, [showModal]);

  function EditWorkoutModal() {
    return (
      <div className="modal modal-open">
        <div className="modal-box md:w-100 md:h-140 bg-slate-800 border flex flex-col items-center justify-center border-blue-500 space-y-4">
          <div className="flex flex-col items-center space-y-1 overflow-auto max-h-120">
            <p className="text-amber-50 font-bold mb-2 ">Add a new exercise:</p>

            <div className="flex flex-col w-100 md:w-80  items-center space-y-4 ">
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
                      prev.name
                        .toLowerCase()
                        .includes(addExercise.toLowerCase()) &&
                      !selectedExercise[savekey].some(
                        (ex) => ex.exercise === prev.name
                      )
                  )
                  .map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <div
                        onClick={() => handleAddExercise(item.name)}
                        className="card w-65 sm:w-40 md:w-60  bg-slate-800 border border-blue-500 shadow-sm p-2 rounded-md flex flex-col items-center mb-2 "
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
            </div>
            {selectedExercise[savekey].map((ex, index) => (
              <div
                key={index}
                className="card w-64 md:w-50  bg-slate-800 border border-blue-500 shadow-sm p-2 rounded-md flex flex-col items-center"
              >
                <h2 className="text-amber-50 font-bold mb-2 ">{ex.exercise}</h2>
                <figure className="w-12 h-12 mb-2">
                  <img
                    src={
                      exercise.find((item) => item.name === ex.exercise)?.img
                    }
                    className="w-full h-full object-cover rounded-md"
                  />
                </figure>

                <h1 className="text-amber-50 font-light mb-2 text-center ">
                  {
                    exercise.find((item) => item.name === ex.exercise)
                      ?.description
                  }{" "}
                </h1>
                <div className="flex flex-row justify-start text-xs space-y-2">
                  <div
                    ref={(el) => (setRef.current[index] = el)}
                    className="h-24 overflow-y-scroll border border-gray-800"
                  >
                    <table className=" min-w-2 border-collapse">
                      <tbody>
                        {Array.from({ length: 25 }, (_, i) => i + 1).map(
                          (setIndex) => (
                            <tr
                              key={setIndex}
                              data-set-index={setIndex}
                              className={"bg-gray-700"}
                              onClick={() => {
                                setSelectedExercise((prev) => {
                                  const updated = { ...prev };
                                  updated[savekey] = updated[savekey].map(
                                    (ex, i) =>
                                      i === index
                                        ? { ...ex, sets: setIndex }
                                        : ex
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

                  <div
                    ref={(el) => (repsRef.current[index] = el)}
                    className="h-24 overflow-y-scroll border border-gray-800"
                  >
                    <table className=" min-w-2 border-collapse">
                      <tbody>
                        {Array.from({ length: 25 }, (_, i) => i + 1).map(
                          (repsIndex) => (
                            <tr
                              key={repsIndex}
                              data-reps-index={repsIndex}
                              className={"bg-gray-700"}
                              onClick={() => {
                                setSelectedExercise((prev) => {
                                  const updated = { ...prev };
                                  console.log(updated);
                                  updated[savekey] = updated[savekey].map(
                                    (ex, i) =>
                                      i === index
                                        ? {
                                            ...ex,
                                            reps: Array(ex.sets).fill(
                                              repsIndex
                                            ),
                                          }
                                        : ex
                                  );

                                  return updated;
                                });
                              }}
                            >
                              <td
                                className={`border  border-gray-800 cursor-pointer p-2 text-center ${
                                  repsIndex ===
                                  Number(
                                    selectedExercise[savekey][index].reps[0]
                                  )
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
                  onClick={() => handeRemoveWorkout(ex)}
                  className="btn btn-outline btn-error "
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
            <div className="divider divider-primary"></div>
            <div className="modal-action flex flex-row gap-2 justify-end">
              <button
                onClick={() => {
                  handleEditWorkout(savekey);
                  handleShowModal();
                }}
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
                onClick={handleShowModal}
                className="btn btn-outline btn-error"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center pt-24 pb-8">
      <Header />
      <div className="space-y-4 card w-85  md:w-100 md:h-140 bg-slate-800 border border-blue-500 shadow-sm p-8 rounded-md flex flex-col items-center">
        <div className="divider divider-primary text-amber-50 font-bold mb-2">
          Edit your workout
        </div>
        <div className="w-65 md:w-95 flex flex-col  gap-4 items-center pt-2 overflow-y-auto max-md:h-100 max-h-120">
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
