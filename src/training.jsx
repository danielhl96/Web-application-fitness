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
      acc[plan.name] = plan.templates.map((exercise) => ({
        exercise: exercise.name,
        reps: exercise.reps,
        sets: exercise.sets,
        weight: exercise.weights,
        plan_id: plan.id,
        isFinished: false,
      }));
      console.log(acc);
      return acc;
    }, {});

  // keep the selected state separate and initialize as empty object
  const [selectedExercise, setExercise] = useState({});
  const [data, setData] = useState([]);

  // whenever `data` (from backend) changes, compute the desired shape and set state
  useEffect(() => {
    if (data && data.length > 0) {
      setExercise(mapPlans(data));
    } else {
      setExercise({});
    }
  }, [data]);

  const [idxExercise, setidx] = useState(0);
  const [inputValue, setInputValue] = useState([]);
  const [training1, setTraining] = useState();
  const [selectedTrainingSite, setSelectedTrainingSite] = useState(true);
  const [showModal, setShowModal] = useState(false);
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
        weights: updatedCurrent.weight,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleExercise = () => {
    if (idxExercise < Object.keys(selectedExercise).length - 1) {
      // Erstelle Kopie des aktuellen Exercises und aktualisiere reps
      const updatedCurrent = {
        ...selectedExercise[idxExercise],
        reps: inputValue,
      };
      if (!updatedCurrent.isFinished) {
        postData(updatedCurrent);
      }
      // Markiere als fertig und aktualisiere State
      const finishedCurrent = { ...updatedCurrent, isFinished: true };
      const updatedExercises = { ...selectedExercise };
      updatedExercises[idxExercise] = finishedCurrent;
      setExercise(updatedExercises);

      const newIdx = idxExercise + 1;
      setidx(newIdx);
      setTraining(updatedExercises[newIdx]);
      console.log(finishedCurrent, updatedExercises[newIdx]);
    } else {
      console.log(selectedExercise);
    }

    // Leere Inputs (besser: State verwenden statt DOM)
    for (let i = 0; i < selectedExercise[idxExercise].sets; i++) {
      const input = document.getElementById("input" + (i + 1));
      if (input) input.value = "";
    }
  };
  const handleExerciseBack = () => {
    if (idxExercise > 0) {
      const newIdx = idxExercise - 1;
      setidx(newIdx);
      setTraining(selectedExercise[newIdx]);
      setExercise(selectedExercise);

      console.log(idxExercise);
      setInputValue([]);
    }
  };

  const addInput = (e, index) => {
    const newinputs = [...inputValue];
    newinputs[index] = e;
    setInputValue(newinputs);
  };

  const changeWeight = (index, flag) => {
    const totalWeight =
      (selectedWeight1[index] || 0) + (selectedWeight2[index] || 0);
    setSelectedWeight1((prev) => {
      const updated = [...prev];
      updated[index] = selectedWeight1[index];
      return updated;
    });

    setSelectedWeight2((prev) => {
      const updated = [...prev];
      updated[index] = selectedWeight2[index];
      return updated;
    });
    const updatedSetw = [...selectedExercise[idxExercise].weight];

    updatedSetw[index] = totalWeight;

    const updatedExercise = {
      ...selectedExercise[idxExercise],
      weight: updatedSetw,
    };

    setTraining(updatedExercise);
    setExercise((prev) => {
      const updatedExercises = [...prev];
      updatedExercises[idxExercise] = updatedExercise;
      return updatedExercises;
    });

    setShowModal(flag);
  };

  const handleAddSets = () => {
    const updatedSets = training1.sets + 1;
    const weightArray = [...training1.weight];
    weightArray.push(0);

    // Füge einen neuen Eintrag für das neue Set hinzu

    const updatedExercise = {
      ...training1,
      sets: updatedSets,
      weight: weightArray,
    };
    console.log(updatedExercise);
    setExercise((prev) => {
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
    setExercise((prev) => {
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

  function WorkoutCard({ planName }) {
    return (
      <div className="card w-full sm:w-80 md:w-[450px]  bg-slate-800 shadow-lg border border-blue-500 mb-4">
        <div className="card-body text-xl items-center  text-center">
          <h2 className="text-amber-50 font-bold mb-2">Workout: {planName}</h2>
          <div className="flex flex-row justify-center items-center gap-4 mt-2">
            <button
              onClick={() => {
                setTraining(selectedExercise[planName][0]);
                setExercise(selectedExercise[planName]);
                setSelectedTrainingSite(false);
              }}
              className="btn bg-blue-500 hover:bg-blue-600 text-white"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  function ExerciseList() {
    console.log(selectedExercise);
    return (
      <div className="modal modal-open modal-bottom sm:modal-middle items-center justify-center">
        <div className="modal-box border border-blue-500 bg-slate-800">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              onClick={() => setExerciseList(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <div className="flex flex-col justify-center items-center mt-4 text-xs">
            {Object.values(selectedExercise).map(
              (item, index) => (
                console.log(item),
                (
                  <div
                    key={index}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => {
                      setTraining(selectedExercise[index]);
                      setExerciseList(false);
                    }}
                  >
                    <div
                      className={`card w-40 h-20 ${
                        selectedExercise[index].isFinished
                          ? "bg-green-500"
                          : "bg-slate-800"
                      } ${
                        training1.exercise == selectedExercise[index].exercise
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

  return (
    <div>
      <Header />
      {showModal && settingsModal()}
      {exerciseList && ExerciseList()}
      <div className="min-h-screen flex items-center bg-slate-900  justify-center pb-8">
        {selectedTrainingSite ? (
          <div className="space-y-4 card w-full max-w-2xl bg-slate-800 border border-blue-500  shadow-sm p-8 rounded-md flex flex-col items-center">
            <div className="w-full flex flex-col gap-4 items-center">
              <div className="divider divider-primary text-amber-50 font-bold mb-2 ">
                Select your workout
              </div>
              {Object.keys(selectedExercise).map((name, index) => (
                <WorkoutCard planName={name} key={index} />
              ))}
            </div>
          </div>
        ) : (
          <div
            className={`space-y-4 card sm:w-64 md:w-96 bg-gray-800 shadow-sm p-6 rounded-md border ${
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
                    console.log(updatedTraining);
                  }}
                  className="btn btn-outline btn-secondary btn-sm mr-2"
                >
                  Edit
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
                <div className="flex space-x-2 items-center justify-center">
                  <button
                    disabled={training1.isFinished}
                    onClick={() => handleModal(index, true)}
                    className="btn btn-outline btn-warning"
                  >
                    Weight: {training1.weight[index]} kg
                  </button>
                </div>
              </div>
            ))}
            <div className="flex space-x-2 items-center justify-center">
              <button
                disabled={training1.isFinished}
                onClick={() => handleReduceSets()}
                className="btn btn-outline btn-secondary"
              >
                - Set
              </button>
              <button
                disabled={training1.isFinished}
                onClick={() => handleAddSets()}
                className="btn btn-outline btn-primary"
              >
                + Set
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
                Close
              </button>
              <button
                disabled={idxExercise == 0}
                onClick={() => handleExerciseBack()}
                className="btn btn-outline btn-primary"
              >
                Back
              </button>
              <button
                onClick={() => handleExercise()}
                className="btn btn-outline btn-success"
              >
                {" "}
                {idxExercise == Object.keys(selectedExercise).length - 1
                  ? "Save"
                  : "Next"}
              </button>
              <button
                onClick={() => {
                  setExerciseList(true);
                }}
                className="btn btn-outline btn-success"
              >
                List
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default StartTraining;
