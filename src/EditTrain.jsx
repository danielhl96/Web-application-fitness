import './index.css';
import Header from './Header';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import exercise from './exercises.jsx';
import api from './api';
import TemplatePage from './templatepage.jsx';
import WorkoutCard from './workoutcard.jsx';
import ExerciseCard from './exercisecard.jsx';

const EditTrain = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [requestId, setRequestId] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(
    () => {
      api.get('/get_workout_plans').then((response) => {
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
    console.log(selectedExercise);
    if (data && data.length > 0) {
      setSelectedExercise(mapPlans(data));
    } else {
      setSelectedExercise({});
    }
  }, [data]);

  function handleEditWorkout(index) {
    const payload = {
      plan_id: selectedExercise[index][0]?.plan_id || null,
      exercises: selectedExercise[index]?.map(({ exercise, reps, sets, weights, plan_id }) => ({
        name: exercise,
        reps: Array.isArray(reps) ? reps : Array(sets).fill(reps),
        sets,
        weights: weights || Array(sets).fill(0),
        plan_id: plan_id || null,
      })),
    };
    console.log(payload);
    api
      .put('/edit_workout_plan', payload)
      .then((response) => {
        console.log('Workout plans updated successfully:', response.data);
        setMessage('Workout plan updated successfully!');
        setRequestId((requestId) => requestId + 1); // Trigger data refresh
      })
      .catch((error) => {
        console.error('Error updating workout plans:', error);
        setMessage('Error updating workout plan.');
      });
  }

  function changePosition(element, direction) {
    console.log(element, direction);
    const index = selectedExercise[savekey].findIndex((ex) => ex === element);
    if (direction === 'up' && index > 0) {
      const newExercises = [...selectedExercise[savekey]];
      [newExercises[index - 1], newExercises[index]] = [
        newExercises[index],
        newExercises[index - 1],
      ];
      setSelectedExercise({
        ...selectedExercise,
        [savekey]: newExercises,
      });
    } else if (direction === 'down' && index < selectedExercise[savekey].length - 1) {
      const newExercises = [...selectedExercise[savekey]];
      [newExercises[index + 1], newExercises[index]] = [
        newExercises[index],
        newExercises[index + 1],
      ];
      setSelectedExercise({
        ...selectedExercise,
        [savekey]: newExercises,
      });
    }
  }

  const handleRemoveExerciseinWorkout = (indexToRemove) => {
    setSelectedExercise((prev) => {
      const updated = { ...prev };
      updated[savekey] = updated[savekey].filter((_, i) => i !== indexToRemove);
      return updated;
    });
  };

  const [showModal, setShowModal] = useState(false);
  const [savekey, setKey] = useState('');
  const [addExercise, setaddExercise] = useState('');
  const [exerciseExists, setExerciseExists] = useState(exercise);

  function Workouts({ exercise }) {
    return (
      <div>
        <WorkoutCard>
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
        </WorkoutCard>
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
        data: { plan_id: selectedExercise[workoutname][0]?.plan_id },
      })
      .then(() => {
        console.log('Workout plan deleted');
        handeRemoveWorkout(workoutname);
      })
      .catch((error) => {
        console.error('Error deleting workout plan:', error);
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
      document.getElementById('input-e').value = '';
      setaddExercise('');
    }
  };

  function EditWorkoutPage() {
    return (
      <div>
        <div className="flex flex-col items-center space-y-1 h-130 ">
          <div className="flex flex-col w-65 md:w-80 items-center space-y-4 ">
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
                  ? 'block'
                  : 'hidden'
              }`}
            >
              {exerciseExists
                .filter(
                  (prev) =>
                    prev.name.toLowerCase().includes(addExercise.toLowerCase()) &&
                    !selectedExercise[savekey].some((ex) => ex.exercise === prev.name)
                )
                .map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center cursor-pointer max-h-auto overflow-y-auto"
                  >
                    <div
                      onClick={() => handleAddExercise(item.name)}
                      className="card w-65 sm:w-40 md:w-60 border border-blue-500 shadow-xl rounded-xl backdrop-blur-lg flex flex-col items-center mb-2"
                      style={{
                        background: 'rgba(0,0,0,0.20)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                        border: '1px solid rgba(0, 0, 0, 0.18)',
                        padding: '0.5rem',
                      }}
                    >
                      <h2 className="text-amber-50 font-bold mb-2">{item.name}</h2>
                      <figure className="w-6 h-6 mb-2">
                        <img
                          src={item.img}
                          style={{ filter: 'invert(1)' }}
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
          <div className="flex flex-col gap-4 overflow-y-auto max-h-96 py-2 w-full">
            {selectedExercise[savekey].map((ex, index) => (
              <ExerciseCard
                ExerciseName={ex.exercise}
                Description={exercise.find((item) => item.name === ex.exercise)?.description}
                ExerciseImage={exercise.find((item) => item.name === ex.exercise)?.img}
                onRepsChange={(reps) => {
                  setSelectedExercise((prev) => {
                    const updated = { ...prev };
                    updated[savekey] = updated[savekey].map((exercise, i) =>
                      i === index ? { ...exercise, reps } : exercise
                    );
                    return updated;
                  });
                }}
                onSetsChange={(sets) => {
                  setSelectedExercise((prev) => {
                    const updated = { ...prev };
                    updated[savekey] = updated[savekey].map((exercise, i) =>
                      i === index ? { ...exercise, sets } : exercise
                    );
                    return updated;
                  });
                }}
                handleRemoveExercise={() => handleRemoveExerciseinWorkout(index)}
                changePosition={(direction) => changePosition(ex, direction)}
                reps={ex.reps}
                sets={ex.sets}
              />
            ))}
          </div>
          <div className="divider divider-primary"></div>
          <div className="flex flex-row gap-2">
            <button
              onClick={() => {
                handleEditWorkout(savekey);
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
            <button onClick={handleShowModal} className="btn btn-outline btn-error">
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
          {message && <div className="text-green-500 mt-2">{message}</div>}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <TemplatePage>
        <div className="flex flex-col items-center">
          <div className="divider divider-primary text-amber-50 font-bold mb-2">
            Edit your workout plans
          </div>
          <div
            className={`w-65 md:w-95 lg:h-130 md:h-130 flex flex-col gap-4 items-center pt-2 max-md:h-130${
              !showModal ? ' overflow-y-auto' : ''
            }`}
          >
            {showModal ? (
              <div>{EditWorkoutPage()}</div>
            ) : selectedExercise && Object.keys(selectedExercise).length > 0 ? (
              Object.keys(selectedExercise).map((exercise, index) => (
                <Workouts exercise={exercise} key={index} />
              ))
            ) : (
              <>
                <p className="text-white">No workout plans available. Please create one first.</p>
                <button
                  onClick={() => navigate('/createtrain')}
                  className="btn btn-outline btn-primary mt-4"
                >
                  Create Workout
                </button>
              </>
            )}
          </div>
        </div>
      </TemplatePage>
    </div>
  );
};

export default EditTrain;
