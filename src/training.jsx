import "./index.css";
import Header from "./Header";
import { useEffect, useState, useRef } from "react";

import api from "./api";

function StartTraining() {
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
        // Finde das passende Exercise per name (da exercises gefiltert ist)
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
      //hier zusätzlich daten aus exercises für weights ladnen

      console.log(acc);
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
  const [saveY, setSaveY] = useState([]);
  const [saveY2, setSaveY2] = useState([]);
  const scrollRef = useRef(null);
  const scrollRef2 = useRef(null);

  const postData = (updatedCurrent) => {
    api
      .post("/create_exercise", {
        workout_plan_id: updatedCurrent.plan_id,
        name: updatedCurrent.exercise,
        sets: updatedCurrent.sets,
        reps: updatedCurrent.reps,
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

    // Aktualisiere auch das Objekt
    setExercise((prev) => {
      const updated = { ...prev };
      updated[currentPlan] = currentExercises.map((ex, i) =>
        i === idxExercise ? updatedExercise : ex
      );
      return updated;
    });

    setShowModal(flag);
  };

  const handleAddSets = () => {
    const updatedSets = training1.sets + 1;
    const weightArray = [...training1.weights];
    weightArray.push(0);

    // Füge einen neuen Eintrag für das neue Set hinzu

    const updatedExercise = {
      ...training1,
      sets: updatedSets,
      weight: weightArray,
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

  // Gewicht für das aktuelle Set wählen
  const handleWeightSelect = (weight) => {
    setSelectedWeight1((prev) => {
      const updated = [...prev];
      updated[idx] = weight;
      return updated;
    });
    // Scroll-Position speichern wie gehabt
    if (scrollRef.current) {
      const selectedRow = scrollRef.current.querySelector(
        `tr[data-weight="${weight}"]`
      );
      if (selectedRow) {
        setSaveY((prev) => {
          const updated = [...prev];
          updated[idx] = selectedRow.offsetTop;
          return updated;
        });
      }
    }
  };

  const handleWeightSelect2 = (weight) => {
    if (selectedWeight1[idx] !== null) {
      setSelectedWeight2((prev) => {
        const updated = [...prev];
        updated[idx] = weight;
        return updated;
      });
    }
    if (scrollRef2.current) {
      const selectedRow = scrollRef2.current.querySelector(
        `tr[data-weight2="${weight}"]`
      );
      if (selectedRow) {
        setSaveY2((prev) => {
          const updated = [...prev];
          updated[idx] = selectedRow.offsetTop;
          return updated;
        });
      }
    }
  };

  useEffect(() => {
    setSelectedWeight1((prev) => {
      const arr = [...prev];
      // Falls Sätze hinzugefügt wurden, fülle mit null auf
      while (arr.length < selectedExercise.sets) arr.push(null);
      // Falls Sätze entfernt wurden, kürze das Array
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
    if (showModal && scrollRef.current) {
      if (saveY[idx] !== undefined) {
        scrollRef.current.scrollTop = saveY[idx];
      }
    }
    if (showModal && scrollRef2.current) {
      if (saveY2[idx] !== undefined) {
        scrollRef2.current.scrollTop = saveY2[idx];
      }
    }
  }, [showModal]);

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
      <div className="card sm:w-200 md:w-[450px]  bg-slate-800 shadow-lg border border-blue-500 mb-4">
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
              className="btn btn-outline btn-primary text-white"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  function ExerciseList() {
    console.log(currentExercises);
    return (
      <div className="modal modal-open modal-bottom sm:modal-middle items-center justify-center">
        <div className="modal-box border border-blue-500 bg-slate-800">
          <form method="dialog">
            <button
              onClick={() => setExerciseList(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <div className="flex flex-col justify-center items-center mt-4 text-xs">
            {Object.values(currentExercises).map(
              (item, index) => (
                console.log(item),
                (
                  <div
                    key={index}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => {
                      setTraining(currentExercises[index]);
                      setExerciseList(false);
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
                          : "border-2 border-blue-500"
                      }  shadow-sm p-2 rounded-md flex flex-col items-center mb-2`}
                    >
                      <h2 className="text-amber-50 font-bold mb-2">
                        {item.exercise}
                      </h2>
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
                )
              )
            )}
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
      <div className="min-h-screen flex items-center bg-slate-900  justify-center pb-8">
        {selectedTrainingSite ? (
          <div className="space-y-4 card w-full max-w-2xl bg-slate-800 border border-blue-500  shadow-sm p-8 rounded-md flex flex-col items-center">
            <div className="w-full flex flex-col gap-4 items-center">
              <div className="divider divider-primary text-amber-50 font-bold mb-2 ">
                Select your workout
              </div>
              <div className="overflow-y-auto max-h-80 ">
                {Object.keys(selectedExercise).map((name, index) => (
                  <WorkoutCard planName={name} key={index} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`space-y-2 card sm:w-100 md:w-100 bg-gray-800 shadow-sm p-6 justify-center rounded-md border ${
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

                    // Aktualisiere auch selectedExercise, damit isFinished konsistent ist
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
                  className="h-4 w-4 mr-1" // <-- Klasse für Größe und Abstand hinzugefügt
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
                onClick={() => handleExercise()}
                className="btn btn-outline btn-primary"
              >
                {idxExercise == Object.keys(currentExercises).length - 1 ? (
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
