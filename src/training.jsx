import './index.css';
import Header from './Header';
import { useEffect, useState, useRef, use } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplatePage from './templatepage.jsx';
import WorkoutCard from './workoutcard.jsx';
import Input from './input.jsx';
import api from './api';

function StartTraining() {
  const navigate = useNavigate();
  useEffect(() => {
    api.get('/get_workout_plans').then((response) => {
      console.log('API response:', response.data);

      setData(response.data);
    });
  }, []);

  // map API response -> { PlanName: [ { exercise, reps, sets }, ... ], ... }
  const mapPlans = (plans) =>
    plans.reduce((acc, plan) => {
      acc[plan.name] = plan.templates.map((exercise) => {
        const matchingExercise = plan.exercises.find((e) => e.name === exercise.name);
        return {
          exercise: exercise.name,
          reps: exercise.reps,
          sets: exercise.sets,
          weights:
            matchingExercise && matchingExercise.weights !== undefined
              ? matchingExercise.weights
              : Array(exercise.sets).fill(0),
          previousReps:
            matchingExercise && matchingExercise.reps !== undefined
              ? matchingExercise.reps
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
  const [breakModal, setBreakModal] = useState(false);
  const [breakTime, setBreakTime] = useState(0);
  const [counterisRunning, setCounterisRunning] = useState(false);
  const intervalRef = useRef();
  const [lastTrainingModalValue, setLastTrainingModal] = useState(false);

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
      .post('/create_exercise', {
        workout_plan_id: updatedCurrent.plan_id,
        name: updatedCurrent.exercise,
        sets: updatedCurrent.sets,
        reps:
          updatedCurrent.reps &&
          updatedCurrent.reps.length == updatedCurrent.sets &&
          updatedCurrent.reps.every((rep) => rep != null)
            ? updatedCurrent.reps
            : Array(updatedCurrent.sets).fill(training1.reps[0]),
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
    if (Object.keys(currentExercises).every((ex) => currentExercises[ex].isFinished)) {
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
      // Ensure reps array is valid for next exercise
      const nextExercise = { ...updatedExercises[newIdx] };
      if (!nextExercise.reps || nextExercise.reps.length !== nextExercise.sets) {
        nextExercise.reps = Array(nextExercise.sets).fill(0);
      }
      setidx(newIdx);
      setTraining(nextExercise);
      setCurrentExercises((prev) => {
        const updated = [...prev];
        updated[newIdx] = nextExercise;
        return updated;
      });
      setInputValue([]);

      for (var i = 0; i < training1.sets; i++) {
        document.getElementById('input' + (i + 1)).value = '';
      }
    }
  };

  const handleExerciseBack = () => {
    if (idxExercise > 0) {
      const newIdx = idxExercise - 1;
      // Ensure reps array is valid
      const prevExercise = { ...currentExercises[newIdx] };
      if (!prevExercise.reps || prevExercise.reps.length !== prevExercise.sets) {
        prevExercise.reps = Array(prevExercise.sets).fill(0);
      }
      setidx(newIdx);
      setTraining(prevExercise);
      setCurrentExercises((prev) => {
        const updated = [...prev];
        updated[newIdx] = prevExercise;
        return updated;
      });
      setInputValue([]);
      console.log(idxExercise);
    }
  };

  const addInput = (e, index) => {
    const newinputs = [...inputValue];
    newinputs[index] = e;
    setInputValue(newinputs);
    console.log(training1);
  };

  const changeWeight = (index, flag) => {
    const totalWeight = (selectedWeight1[index] || 0) + (selectedWeight2[index] || 0);
    console.log('SELECTED:', currentExercises[idxExercise]);
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
      if (arr.length > selectedExercise.sets) arr.length = selectedExercise.sets;
      return arr;
    });
    setSelectedWeight2((prev) => {
      const arr = [...prev];
      while (arr.length < selectedExercise.sets) arr.push(null);
      if (arr.length > selectedExercise.sets) arr.length = selectedExercise.sets;
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
      const selectedRow = scrollRef.current.querySelector(`tr[data-weight="${wholePart}"]`);
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
      const selectedRow2 = scrollRef2.current.querySelector(`tr[data-weight2="${decimalPart}"]`);
      scrollRef2.current.scrollTop = selectedRow2.offsetTop;
    }
  }, [showModal, idx]);

  const lastTrainingModal = () => {
    return (
      <div className="modal modal-open modal-bottom sm:modal-middle items-center justify-center">
        <div
          className={`modal-box modal-xl border border-blue-500 shadow-xl rounded-xl p-6`}
          style={{
            background: 'rgba(10, 20, 40, 0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid #3b82f6',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          }}
        >
          <div className="flex flex-col justify-center items-center space-y-2 text-xs">
            <table className="min-w-2 border-collapse">
              <tbody>
                {training1.reps.map((rep, index) => (
                  <tr key={index} className={'bg-gray-700'}>
                    <td
                      className="border border-gray-800 w-48 h-12 text-center rounded-md backdrop-blur-lg "
                      style={{
                        background: 'rgba(10, 20, 40, 0.75)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1.5px solid transparent',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                      }}
                    >
                      Set {index + 1}: {training1.previousReps[index]} Reps,{' '}
                      {training1.weights[index]} kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
              style={{
                background: 'rgba(30, 41, 59, 0.25)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                border: '1.5px solid #f63b3bff',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(246, 59, 59, 0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
              onClick={() => setLastTrainingModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  //Modal for the weight selection
  const settingsModal = () => {
    return (
      <div className="modal modal-open modal-bottom sm:modal-middle items-center justify-center">
        <div
          className="modal-box border border-blue-500 shadow-xl rounded-xl"
          style={{
            background: 'rgba(10, 20, 40, 0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid #3b82f6',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          }}
        >
          <div className="flex flex-row justify-center items-center  text-xs">
            <div ref={scrollRef} className="h-24 overflow-y-scroll border border-gray-800">
              <div className="flex flex-row justify-center items-center">
                <table className="min-w-2 border-collapse">
                  <tbody>
                    {Array.from({ length: 1000 }, (_, i) => i).map((weight, index) => (
                      <tr
                        key={index}
                        data-weight={weight}
                        onClick={() => handleWeightSelect(weight)}
                        className={'bg-gray-700'}
                      >
                        <td
                          className="border border-gray-800 p-2 text-center rounded-md backdrop-blur-lg"
                          style={{
                            background:
                              selectedWeight1[idx] === weight
                                ? 'rgba(37,99,235,0.45)'
                                : 'rgba(0,0,0,0.15)',
                            boxShadow:
                              selectedWeight1[idx] === weight
                                ? '0 4px 24px 0 rgba(37,99,235,0.25)'
                                : '0 4px 16px 0 rgba(31, 38, 135, 0.17)',
                            border: '1px solid rgba(0, 0, 0, 0.12)',
                            color: selectedWeight1[idx] === weight ? '#e0eaff' : '',
                          }}
                        >
                          {weight + ' kg'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div ref={scrollRef2} className="h-24 overflow-y-scroll border border-gray-800">
              <div className="flex flex-row justify-center items-center">
                <table className="min-w-2 border-collapse">
                  <tbody>
                    {Array.from({ length: 8 }, (_, i) => i * 0.25).map((weight, index) => (
                      <tr
                        key={index}
                        data-weight2={weight}
                        onClick={() => handleWeightSelect2(weight)}
                        className={'bg-gray-700'}
                      >
                        <td
                          className={`border border-gray-800 p-2 text-center rounded-md backdrop-blur-lg ${
                            selectedWeight1[idx] === null
                              ? 'opacity-50 cursor-not-allowed'
                              : 'cursor-pointer'
                          }`}
                          style={{
                            background:
                              selectedWeight2[idx] === weight
                                ? 'rgba(37,99,235,0.45)'
                                : 'rgba(0,0,0,0.15)',
                            boxShadow:
                              selectedWeight2[idx] === weight
                                ? '0 4px 24px 0 rgba(37,99,235,0.25)'
                                : '0 4px 16px 0 rgba(31, 38, 135, 0.17)',
                            border: '1px solid rgba(0, 0, 0, 0.12)',
                            color: selectedWeight2[idx] === weight ? '#e0eaff' : '',
                          }}
                        >
                          {weight + ' kg'}
                        </td>
                      </tr>
                    ))}
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
              className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
              style={{
                background: 'rgba(30, 41, 59, 0.25)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                border: '1.5px solid #3b82f6',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
              onClick={() => changeWeight(idx, false)}
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
              className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
              style={{
                background: 'rgba(30, 41, 59, 0.25)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                border: '1.5px solid #f63b3bff',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(246, 59, 59, 0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
              onClick={() => setShowModal(false)}
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
    );
  };

  //Modal for the end of training
  function TrainingEndModal() {
    return (
      <div className="modal modal-open modal-bottom sm:modal-middle items-center justify-center">
        <div
          className={`modal-box modal-sm border border-blue-500 shadow-xl rounded-xl p-2`}
          style={{
            maxWidth: '90vw',
            background: 'rgba(0,0,0,0.20)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',

            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          <div className="flex flex-col justify-center items-center  text-xs">
            <h2 className="text-amber-50 font-bold mb-2">Workout Complete!</h2>
            <div className="flex flex-row justify-center items-center gap-4 mt-2">
              <button
                // Resets all training states and navigates to the home page
                onClick={(event) => {
                  // Prevents the default button behavior (such as form submission or page reload)
                  event.preventDefault();
                  setSelectedTrainingSite(true);
                  setShowTrainingEndModal(false);
                  setCurrentExercises([]);
                  setCurrentPlan(null);
                  setTraining(null);
                  setidx(0);
                  setExercise({});
                  setInputValue([]);
                  setSelectedWeight1([3]);
                  setSelectedWeight2([3]);
                  navigate('/');
                }}
                className="btn btn-outline btn-primary hover:bg-blue-600 text-white"
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '')}
              >
                ok
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const startCounter = () => {
    setCounterisRunning(true);
    intervalRef.current = setInterval(function () {
      setBreakTime((prevSec) => prevSec + 1);
    }, 1000); // every 1000 ms = 1 second
  };

  const stopCounter = () => {
    clearInterval(intervalRef.current);
    setCounterisRunning(false);
  };

  function BreakTimeModal() {
    return (
      <div className="modal modal-open modal-bottom sm:modal-middle items-center justify-center">
        <div
          className={`modal-box modal-sm border border-blue-500 shadow-xl rounded-xl p-2`}
          style={{
            width: '16rem', // ca. 256px, deutlich kleiner als Standard
            minWidth: '10rem',
            maxWidth: '90vw',
            background: 'rgba(0,0,0,0.20)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',

            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          <div className="flex flex-col justify-center items-center  text-xs">
            <h1 className="text-amber-50 text-xl font-bold mb-2">Take a Break!</h1>
            <div className="flex flex-row justify-center items-center  mt-2">
              <p1 className="text-slate-200 text-xl font-mono">
                {Math.floor(breakTime / 60)}:
                {breakTime % 60 < 10 ? `0${breakTime % 60}` : breakTime % 60}
              </p1>
            </div>

            <div className="flex flex-row justify-center items-center gap-1 mt-3">
              <button
                onClick={() => {
                  counterisRunning ? stopCounter() : startCounter();
                }}
                style={{
                  background: 'rgba(30, 41, 59, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                  border: '1.5px solid #3b82f6',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
              >
                {counterisRunning ? 'Break' : 'Go'}
              </button>
              <button
                onClick={() => {
                  setBreakModal(false);
                  stopCounter();
                  setBreakTime(0);
                }}
                style={{
                  background: 'rgba(30, 41, 59, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                  border: '1.5px solid #3b82f6',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(246, 59, 59, 0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  function Workouts({ planName }) {
    return (
      <div>
        <WorkoutCard
          onClick={() => {
            setCurrentExercises(selectedExercise[planName]);
            setCurrentPlan(planName);
            setTraining(selectedExercise[planName][0]);
            setSelectedTrainingSite(false);
          }}
        >
          <h2 className="text-amber-400 font-bold mb-2">{planName}</h2>
          <div className="flex flex-row justify-center items-center gap-4 mt-2"></div>
          <div className="flex flex-col">
            <p className="text-blue-300 font-light  text-sm ">
              Exercises: {selectedExercise[planName]?.length || 0}
            </p>
          </div>
        </WorkoutCard>
      </div>
    );
  }

  //Show the list of exercises in the current plan
  function ExerciseList() {
    console.log(currentExercises);
    return (
      <div className="modal modal-open modal-bottom sm:modal-middle items-center justify-center">
        <div
          className="modal-box border border-blue-500 shadow-xl rounded-xl h-auto max-h-130"
          style={{
            background: 'rgba(10, 20, 40, 0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid #3b82f6',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          }}
        >
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
                  className={`card w-40 h-20 shadow-xl rounded-xl backdrop-blur-lg flex flex-col items-center mb-2 ${
                    currentExercises[index].isFinished
                      ? 'border-2 border-green-500'
                      : 'border-2 border-blue-800'
                  }`}
                  style={{
                    background: currentExercises[index].isFinished
                      ? 'rgba(34,197,94,0.20)' // green glassy for finished
                      : 'rgba(0,0,0,0.20)', // black glassy for unfinished
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    border: '1px solid rgba(0, 0, 0, 0.18)',
                  }}
                >
                  <h2 className="text-amber-400 text-sm">{item.exercise}</h2>
                  <figure className="w-9 h-9 mb-2">
                    <img
                      src={
                        './' +
                        item.exercise.toLowerCase().replace('-', '').replace(' ', '') +
                        '.png'
                      }
                      className="w-full h-full object-cover rounded-md"
                      style={{ filter: 'invert(1)' }}
                      alt={item.exercise + ' icon'}
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
      {lastTrainingModalValue && lastTrainingModal()}
      <TemplatePage>
        {selectedTrainingSite ? (
          <div className="flex flex-col items-center ">
            <div className="divider divider-primary text-white font-bold mb-2 ">
              Select your workout
            </div>
            <div className="w-65 md:w-95 lg:h-130 md:h-130 flex flex-col gap-4 items-center pt-2 overflow-y-auto max-md:h-130">
              {selectedExercise && Object.keys(selectedExercise).length > 0 ? (
                Object.keys(selectedExercise).map((name, index) => (
                  <Workouts planName={name} key={index} />
                ))
              ) : (
                <div className="flex flex-col items-center">
                  <p className="text-white">No workout plans available. Please create one first.</p>
                  <button
                    onClick={() => navigate('/createtrain')}
                    className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:bg-blue-500/30 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-2 mt-4"
                    style={{
                      background: 'rgba(30, 41, 59, 0.25)',
                      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                      border: '1.5px solid #f63b3bff',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                  >
                    Create Workout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            className={`space-y-2  justify-center ${
              training1.isFinished ? 'border-green-500' : 'border-blue-500'
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
                style={{ filter: 'invert(1)' }}
                src={
                  './' + training1.exercise.toLowerCase().replace('-', '').replace(' ', '') + '.png'
                }
                name={'Benchpress'}
                className="rounded-md"
                width="50"
                height="50"
              />
            </figure>
            <div className="divider divider-primary text-amber-400">{training1.exercise}</div>
            <div className="overflow-y-auto max-h-40 space-y-2">
              {Array.from({ length: training1.sets }).map((_, index) => (
                <div className="flex flex-row space-x-3 items-center justify-center" key={index}>
                  <div className="flex w-20 space-x-2 items-center justify-center ">
                    <Input
                      onDisable={training1.isFinished}
                      type="text"
                      placeholder={'Reps: ' + training1.reps[index]}
                      id={'input' + (index + 1)}
                      w="w-25"
                      h="h-8"
                      onChange={(e) => addInput(parseInt(e.target.value), index)}
                    />
                  </div>
                  <div className="flex space-x-2 items-center justify-center ">
                    <button
                      disabled={training1.isFinished}
                      onClick={() => handleModal(index, true)}
                      className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:bg-blue-500/30 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
                      style={{
                        background: 'rgba(30, 41, 59, 0.25)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                        border: !training1.isFinished
                          ? '1.5px solid #ffea00ff'
                          : '1.5px solid  #3b82f6  ',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                      }}
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
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
                style={{
                  background: 'rgba(30, 41, 59, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                  border: '1.5px solid #f63b3bff',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
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
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
                style={{
                  background: 'rgba(30, 41, 59, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                  border: '1.5px solid #3b82f6',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
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
              <button
                onClick={() => setBreakModal(true)}
                style={{
                  background: 'rgba(30, 41, 59, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                  border: '1.5px solid #3b82f6',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setLastTrainingModal(true)}
                style={{
                  background: 'rgba(30, 41, 59, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                  border: '1.5px solid #3b82f6',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
              >
                Last
              </button>
              {breakModal && BreakTimeModal()}
            </div>
            <div className="divider divider-primary"></div>
            <div className="flex space-x-2 items-center justify-center">
              <button
                onClick={() => {
                  setSelectedTrainingSite(true);
                }}
                style={{
                  background: 'rgba(30, 41, 59, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                  border: '1.5px solid #3b82f6',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
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
                style={{
                  background: 'rgba(30, 41, 59, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                  border: '1.5px solid #3b82f6',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
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
                style={{
                  background: 'rgba(30, 41, 59, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                  border: '1.5px solid #3b82f6',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
              >
                {Object.keys(currentExercises).every((ex) => currentExercises[ex].isFinished) ? (
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
                style={{
                  background: 'rgba(30, 41, 59, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                  border: '1.5px solid #3b82f6',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
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
      </TemplatePage>
    </div>
  );
}
export default StartTraining;
