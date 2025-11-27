import "./index.css";
import Header from "./Header";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import api from "./api";

function StartTraining() {
  const navigate = useNavigate();
  useEffect(() => {
    api.get("/get_workout_plans").then((response) => {
      console.log(response.data);
      setData(response.data);
    });
  }, []);

  // map API response -> { PlanName: [ { exercise, reps, sets }, ... ], ... }
  const mapPlans = (plans) =>
    plans.reduce((acc, plan) => {
      acc[plan.name] = plan.templates.map((exercise) => {
        const matchingExercise = plan.exercises.find(
          (e) => e.name === exercise.name
        );
        return {
          exercise: exercise.name,
          reps: exercise.reps,
          sets: exercise.sets,
          weights:
            matchingExercise && matchingExercise.weights !== undefined
              ? matchingExercise.weights
              : Array(exercise.sets).fill(0),
          plan_id: plan.id,
          isFinished: false,
        };
      });

      return acc;
    }, {});

  // keep the selected state separate and initialize as empty object
  const [selectedExercise, setExercise] = useState({});
  const [data, setData] = useState([]);

  // whenever `data` (from backend) changes, compute the desired shape and set state
  useEffect(() => {
    if (data && data.length > 0) {
      const mapped = mapPlans(data);
      setExercise(mapped);
      setTraining(mapped[0]);
    } else {
      setExercise({});
    }

    handleWeightSelect();
  }, [data]);

  const [idxExercise, setidx] = useState(0);
  const [inputValue, setInputValue] = useState([]);
  const [training1, setTraining] = useState();
  const [selectedTrainingSite, setSelectedTrainingSite] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTrainingEndModal, setShowTrainingEndModal] = useState(false);
  const [selectedWeight1, setSelectedWeight1] = useState([3]);
  const [exerciseList, setExerciseList] = useState(false);

  const [selectedWeight2, setSelectedWeight2] = useState([3]);
  const [idx, setWeightidx] = useState(0);

  const scrollRef = useRef(null);
  const scrollRef2 = useRef(null);

  const postData = (updatedCurrent) => {
    console.log(training1.reps);
    api
      .post("/create_exercise", {
        workout_plan_id: updatedCurrent.plan_id,
        name: updatedCurrent.exercise,
        sets: updatedCurrent.sets,
        reps:
          updatedCurrent.reps &&
          updatedCurrent.reps.length == updatedCurrent.sets &&
          updatedCurrent.reps.every((rep) => rep != null)
            ? updatedCurrent.reps
            : Array(updatedCurrent.sets).fill(0),
        weights: updatedCurrent.weights,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleExercise = () => {
    if (idxExercise == currentExercises.length - 1) {
      const updatedCurrent = {
        ...currentExercises[idxExercise],
        reps: inputValue,
      };
      if (!updatedCurrent.isFinished) {
        postData(updatedCurrent);
      }
      const finishedCurrent = { ...updatedCurrent, isFinished: true };
      const updatedExercises = [...currentExercises];
      updatedExercises[idxExercise] = finishedCurrent;
      setCurrentExercises(updatedExercises);
    }
    if (
      Object.keys(currentExercises).every(
        (ex) => currentExercises[ex].isFinished
      )
    ) {
      setShowTrainingEndModal(true);
    }

    if (idxExercise < currentExercises.length - 1) {
      const updatedCurrent = {
        ...currentExercises[idxExercise],
        reps: inputValue,
      };
      if (!updatedCurrent.isFinished) {
        postData(updatedCurrent);
      }
      const finishedCurrent = { ...updatedCurrent, isFinished: true };
      const updatedExercises = [...currentExercises];
      updatedExercises[idxExercise] = finishedCurrent;
      setCurrentExercises(updatedExercises);

      // Aktualisiere Objekt
      setExercise((prev) => {
        const updated = { ...prev };
        updated[currentPlan] = updatedExercises;
        return updated;
      });

      const newIdx = idxExercise + 1;
      setidx(newIdx);
      setTraining(updatedExercises[newIdx]);
      setInputValue([]);

      for (var i = 0; i < training1.sets; i++) {
        document.getElementById("input" + (i + 1)).value = "";
      }
    }
  };

  const handleExerciseBack = () => {
    if (idxExercise > 0) {
      const newIdx = idxExercise - 1;
      setidx(newIdx);
      setTraining(currentExercises[newIdx]);
      setCurrentExercises(currentExercises);

      console.log(idxExercise);
      setInputValue([]);
    }
  };

  const addInput = (e, index) => {
    const newinputs = [...inputValue];
    newinputs[index] = e;
    setInputValue(newinputs);
    console.log(training1);
  };

  const changeWeight = (index, flag) => {
    const totalWeight =
      (selectedWeight1[index] || 0) + (selectedWeight2[index] || 0);
    console.log("SELECTED:", currentExercises[idxExercise]);
    const updatedSetw = [...currentExercises[idxExercise].weights];
    updatedSetw[index] = totalWeight;

    const updatedExercise = {
      ...currentExercises[idxExercise],
      weights: updatedSetw,
    };

    setTraining(updatedExercise);
    setCurrentExercises((prev) => {
      const updated = [...prev];
      updated[idxExercise] = updatedExercise;
      return updated;
    });

    // update selectedExercise accordingly
    setExercise((prev) => {
      const updated = { ...prev };
      updated[currentPlan] = currentExercises.map((ex, i) =>
        i === idxExercise ? updatedExercise : ex
      );
      return updated;
    });

    setShowModal(flag);
  };

  // Add a new sets entry initialized to 0
  const handleAddSets = () => {
    const updatedSets = training1.sets + 1;
    const weightArray = [...training1.weights];
    weightArray.push(0);

    const updatedExercise = {
      ...training1,
      sets: updatedSets,
      weight: weightArray,
      reps: [...training1.reps, 0],
    };
    console.log(updatedExercise);
    setCurrentExercises((prev) => {
      const updatedExercises = [...prev];
      updatedExercises[idxExercise] = updatedExercise;
      return updatedExercises;
    });
    setTraining(updatedExercise);
  };

  const handleReduceSets = () => {
    const updatedSets = training1.sets - 1;

    const updatedExercise = {
      ...training1,
      sets: updatedSets,
    };
    console.log(updatedExercise);
    setCurrentExercises((prev) => {
      const updatedExercises = [...prev];
      updatedExercises[idxExercise] = updatedExercise;
      return updatedExercises;
    });
    setTraining(updatedExercise);
  };

  const handleModal = (index, flag) => {
    console.log(index);
    setShowModal(flag);
    setWeightidx(index);
    settingsModal();
  };

  // Weight selection handlers
  const handleWeightSelect = (weight) => {
    setSelectedWeight1((prev) => {
      const updated = [...prev];
      updated[idx] = weight;
      return updated;
    });
  };

  const handleWeightSelect2 = (weight) => {
    if (selectedWeight1[idx] !== null) {
      setSelectedWeight2((prev) => {
        const updated = [...prev];
        updated[idx] = weight;
        return updated;
      });
    }
  };

  useEffect(() => {
    setSelectedWeight1((prev) => {
      const arr = [...prev];
      // If sets have been added, fill with null
      while (arr.length < selectedExercise.sets) arr.push(null);
      // If sets have been removed, shorten the array
      if (arr.length > selectedExercise.sets)
        arr.length = selectedExercise.sets;
      return arr;
    });
    setSelectedWeight2((prev) => {
      const arr = [...prev];
      while (arr.length < selectedExercise.sets) arr.push(null);
      if (arr.length > selectedExercise.sets)
        arr.length = selectedExercise.sets;
      return arr;
    });
  }, [selectedExercise.sets]);

  useEffect(() => {
    if (showModal && scrollRef.current && training1 != null) {
      let wholePart = Math.floor(training1.weights[idx]);
      setSelectedWeight1((prev) => {
        const updated = [...prev];
        updated[idx] = wholePart;
        return updated;
      });
      if (isNaN(wholePart)) wholePart = 0;
      const selectedRow = scrollRef.current.querySelector(
        `tr[data-weight="${wholePart}"]`
      );
      scrollRef.current.scrollTop = selectedRow.offsetTop;
    }

    if (showModal && scrollRef2.current && training1 != null) {
      let decimalPart = training1.weights[idx] % 1;
      setSelectedWeight2((prev) => {
        const updated = [...prev];
        updated[idx] = decimalPart;
        return updated;
      });
      if (isNaN(decimalPart)) decimalPart = 0;
      const selectedRow2 = scrollRef2.current.querySelector(
        `tr[data-weight2="${decimalPart}"]`
      );
      scrollRef2.current.scrollTop = selectedRow2.offsetTop;
    }
  }, [showModal, idx]);

  //Modal for the weight selection
  const settingsModal = () => {
    return (
      <div className="modal modal-open modal-bottom sm:modal-middle items-center justify-center">
        <div className="modal-box border border-blue-500 bg-slate-800">
          <div className="flex flex-row justify-center items-center  text-xs">
            <div
              ref={scrollRef}
              className="h-24 overflow-y-scroll border border-gray-800"
            >
              <div className="flex flex-row justify-center items-center">
                <table className="min-w-2 border-collapse">
                  <tbody>
                    {Array.from({ length: 1000 }, (_, i) => i).map(
                      (weight, index) => (
                        <tr
                          key={index}
                          data-weight={weight}
                          onClick={() => handleWeightSelect(weight)}
                          className={"bg-gray-700"}
                        >
                          <td
                            className={`border border-gray-800 p-2 text-center ${
                              selectedWeight1[idx] === weight
                                ? "bg-blue-600"
                                : ""
                            }`}
                          >
                            {weight + " kg"}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div
              ref={scrollRef2}
              className="h-24 overflow-y-scroll border border-gray-800"
            >
              <div className="flex flex-row justify-center items-center">
                <table className="min-w-2 border-collapse">
                  <tbody>
                    {Array.from({ length: 4 }, (_, i) => i * 0.25).map(
                      (weight, index) => (
                        <tr
                          key={index}
                          data-weight2={weight}
                          onClick={() => handleWeightSelect2(weight)}
                          className={"bg-gray-700"}
                        >
                          <td
                            className={`border border-gray-800 p-2 text-center 
      ${selectedWeight2[idx] === weight ? "bg-blue-600" : ""} 
      ${
        selectedWeight1[idx] === null
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer"
      }`}
                          >
                            {weight + " kg"}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="divider divider-primary">
            {selectedWeight1[idx] + selectedWeight2[idx]} kg
          </div>
          <div className="modal-action justify-center">
            <button
              className="btn btn-primary rounded-full"
              onClick={() => changeWeight(idx, false)}
            >
              Save
            </button>
            <button
              className="btn btn-secondary rounded-full"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  //Modal for the end of training
  function TrainingEndModal() {
    return (
      <div className="modal modal-open modal-bottom sm:modal-middle items-center justify-center">
        <div className="modal-box border border-blue-500 bg-slate-800">
          <div className="flex flex-col justify-center items-center  text-xs">
            <h2 className="text-amber-50 font-bold mb-2">Workout Complete!</h2>
            <div className="flex flex-row justify-center items-center gap-4 mt-2">
              <button
                onClick={() => {
                  setSelectedTrainingSite(true);
                  setShowTrainingEndModal(false);
                  setCurrentExercises([]);
                  setCurrentPlan(null);
                  setTraining(null);
                  setidx(0);
                }}
                className="btn btn-outline btn-primary hover:bg-blue-600 text-white"
              >
                ok
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function WorkoutCard({ planName }) {
    return (
      <div className="card w-55  md:w-65 bg-slate-800 shadow-lg border border-blue-500 mb-4">
        <div className="card-body text-xl items-center  text-center">
          <h2 className="text-amber-50 font-bold mb-2">Workout: {planName}</h2>
          <div className="flex flex-row justify-center items-center gap-4 mt-2">
            <button
              onClick={() => {
                setCurrentExercises(selectedExercise[planName]);
                setCurrentPlan(planName);
                setTraining(selectedExercise[planName][0]);
                setSelectedTrainingSite(false);
              }}
              className="btn btn-outline btn-primary text-white flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  //Show the list of exercises in the current plan
  function ExerciseList() {
    console.log(currentExercises);
    return (
      <div className="modal modal-open modal-bottom sm:modal-middle items-center justify-center">
        <div className="modal-box border border-blue-500 bg-slate-800  overflow-y-auto max-h-120">
          <form method="dialog">
            <button
              onClick={() => setExerciseList(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <div className="grid grid-cols-1 mt-3">
            {Object.values(currentExercises).map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => {
                  setTraining(currentExercises[index]);
                  setExerciseList(false);
                  setidx(index);
                }}
              >
                <div
                  className={`card w-40 h-20 ${
                    currentExercises[index].isFinished
                      ? "bg-green-500"
                      : "bg-slate-800"
                  } ${
                    training1.exercise == currentExercises[index].exercise
                      ? "border-2 border-green-500"
                      : "border-2 border-blue-800"
                  }  shadow-sm p-2 rounded-md flex flex-col items-center mb-2`}
                >
                  <h2 className="text-amber-50 text-sm">{item.exercise}</h2>
                  <figure className="w-9 h-9 mb-2">
                    <img
                      src={
                        "./" +
                        item.exercise
                          .toLowerCase()
                          .replace("-", "")
                          .replace(" ", "") +
                        ".png"
                      }
                      className="w-full h-full object-cover rounded-md"
                    />
                  </figure>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const [currentExercises, setCurrentExercises] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);

  return (
    <div>
      <Header />
      {showModal && settingsModal()}
      {showTrainingEndModal && TrainingEndModal()}
      {exerciseList && ExerciseList()}
      <div className="min-h-screen bg-slate-900 flex flex-col items-center pt-24 pb-8">
        {selectedTrainingSite ? (
          <div className="space-y-4 card w-85  md:w-100 md:h-140  bg-slate-800 border border-blue-500  shadow-sm p-8 rounded-md flex flex-col items-center">
            <div className="w-65 md:w-95 flex flex-col gap-2 items-center">
              <div className="divider divider-primary text-amber-50 font-bold mb-2 ">
                Select your workout
              </div>
              <div className="overflow-y-auto max-md:h-100 max-h-120 gap-4">
                {selectedExercise &&
                Object.keys(selectedExercise).length > 0 ? (
                  Object.keys(selectedExercise).map((name, index) => (
                    <WorkoutCard planName={name} key={index} />
                  ))
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="text-white">
                      No workout plans available. Please create one first.
                    </p>
                    <button
                      onClick={() => navigate("/createtrain")}
                      className="btn btn-outline btn-primary mt-4"
                    >
                      Create Workout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`space-y-2 card sm:w-100 md:w-100 w-85 h-140 bg-gray-800 shadow-sm p-6 justify-center rounded-md border ${
              training1.isFinished ? "border-green-500" : "border-blue-500"
            }`}
          >
            <div className="flex flex-top justify-start"></div>

            {!training1.isFinished ? null : (
              <div className="flex flex-top justify-end">
                <button
                  onClick={() => {
                    const updatedTraining = { ...training1, isFinished: false };
                    setTraining(updatedTraining);
                    setExercise((prev) => {
                      const updatedExercises = { ...prev };
                      updatedExercises[idxExercise] = {
                        ...updatedExercises[idxExercise],
                        isFinished: false,
                      };
                      return updatedExercises;
                    });

                    console.log(updatedTraining);
                  }}
                  className="btn btn-outline btn-primary btn-sm mr-2"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              </div>
            )}
            <figure className="mb-4">
              <img
                src={
                  "./" +
                  training1.exercise
                    .toLowerCase()
                    .replace("-", "")
                    .replace(" ", "") +
                  ".png"
                }
                name={"Benchpress"}
                className="rounded-md"
                width="50"
                height="50"
              />
            </figure>
            <div className="divider divider-primary">{training1.exercise}</div>
            <div className="overflow-y-auto max-h-40 space-y-2">
              {Array.from({ length: training1.sets }).map((_, index) => (
                <div
                  className="flex flex-row space-x-3 items-center justify-center"
                  key={index}
                >
                  <div className="flex w-20">
                    <input
                      disabled={training1.isFinished}
                      type="text"
                      placeholder={"Reps: " + training1.reps[index]}
                      className="input input-primary"
                      id={"input" + (index + 1)}
                      onBlur={(e) => addInput(parseInt(e.target.value), index)}
                    />
                  </div>
                  <div className="flex space-x-2 items-center justify-center ">
                    <button
                      disabled={training1.isFinished}
                      onClick={() => handleModal(index, true)}
                      className="btn btn-outline btn-warning"
                    >
                      Weight: {training1.weights[index]} kg
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-2 items-center justify-center">
              <button
                disabled={training1.isFinished}
                onClick={() => handleReduceSets()}
                className="btn btn-outline btn-secondary"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
              <button
                disabled={training1.isFinished}
                onClick={() => handleAddSets()}
                className="btn btn-outline btn-success"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
            <div className="divider divider-primary"></div>
            <div className="flex space-x-2 items-center justify-center">
              <button
                onClick={() => {
                  setSelectedTrainingSite(true);
                }}
                className="btn btn-outline btn-primary btn-primary"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <button
                disabled={idxExercise == 0}
                onClick={() => handleExerciseBack()}
                className="btn btn-outline btn-primary"
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
              </button>
              <button
                onClick={() => handleExercise()}
                className="btn btn-outline btn-primary"
              >
                {Object.keys(currentExercises).every(
                  (ex) => currentExercises[ex].isFinished
                ) ? (
                  <svg // success icon
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
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
                )}
              </button>
              <button
                onClick={() => {
                  setExerciseList(true);
                }}
                className="btn btn-outline btn-primary btn-primary"
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
                    d="M3 12h18M3 6h18M3 18h18"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default StartTraining;
