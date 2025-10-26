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
  ];

  const [showModal, setShowModal] = useState(false);
  const [savekey, setKey] = useState("");
  const [addExercise, setaddExercise] = useState("");
  const [exerciseExists, setExerciseExists] = useState(exercise);

  const setRef = useRef([]);
  const repsRef = useRef([]);
  const [saveY, setSaveY] = useState([]);
  const [saveY2, setSaveY2] = useState([]);
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
    for (let i = 0; i < selectedExercise[savekey]?.length; i++) {
      console.log(i);
      if (setRef.current[i] != null) {
        setRef.current[i].scrollTop = selectedExercise[savekey][i].sets[i];
        console.log(selectedExercise[savekey][i].sets);
      }
      if (repsRef.current[i] != null) {
        repsRef.current[i].scrollTop = selectedExercise[savekey][i].reps[0];
        console.log(selectedExercise[savekey][i].reps[0]);
      }
    }
  }, [showModal]);

  function EditWorkoutModal() {
    return (
      <div className="modal modal-open">
        <div className="modal-box w-auto h-auto bg-slate-800 border flex flex-col items-center justify-center border-blue-500 space-y-4">
          <div className="overflow-y-scroll flex flex-col items-center space-y-1">
            <p className="text-amber-50 font-bold mb-2 ">Add a new exercise:</p>

            <div className="flex flex-col items-center space-y-4">
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
            </div>
            {selectedExercise[savekey].map((ex, index) => (
              <div
                key={index}
                className="card w-64  bg-slate-800 border border-blue-500 shadow-sm p-2 rounded-md flex flex-col items-center"
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
                                  if (setRef.current[index]) {
                                    const scrollid = setRef.current[
                                      index
                                    ].querySelector(
                                      `tr[data-set-index="${setIndex}"]`
                                    );
                                    console.log(scrollid.offsetTop);
                                    if (scrollid) {
                                      setSaveY((prev) => {
                                        const updated = [...prev];
                                        updated[index] = scrollid.offsetTop;
                                        return updated;
                                      });
                                    }
                                  }
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
                                  if (repsRef.current[index]) {
                                    const scrollid = repsRef.current[
                                      index
                                    ].querySelector(
                                      `tr[data-reps-index="${repsIndex}"]`
                                    );
                                    if (scrollid) {
                                      setSaveY2((prev) => {
                                        const updated = [...prev];
                                        updated[index] = scrollid.offsetTop;
                                        return updated;
                                      });
                                    }
                                  }

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
                                  selectedExercise[savekey][index].reps[0]
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
                  onClick={() => handleRemoveExercise(ex)}
                  className="btn btn-outline btn-error "
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="modal-action flex flex-row gap-2 justify-end">
              <button
                onClick={() => {
                  handleEditWorkout(savekey);
                  handleShowModal();
                }}
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
