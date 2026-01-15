import './index.css';
import Header from './Header';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import exercise from './exercises.jsx';
import api from './api';
import TemplatePage from './templatepage.jsx';
import WorkoutCard from './workoutcard.jsx';
import ExerciseCard from './exercisecard.jsx';
import Notify from './notify.jsx';
import Input from './input.jsx';
import Button from './button.jsx';
const EditTrain = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [requestId, setRequestId] = useState(0);
  const [message, setMessage] = useState('');
  const [notification, setNotification] = useState(null);
  const [ConfirmationModalforWorkoutDeleteModal, setConfirmationModalforWorkoutDelete] =
    useState(false);

  useEffect(() => {
    api.get('/get_workout_plans').then((response) => {
      setData(response.data);
      console.log(response.data);
    });
  }, [requestId]);

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

  function handleEditWorkout() {
    const payload = {
      plan_id: selectedExercise[savekey][0]?.plan_id || null,
      exercises: selectedExercise[savekey]?.map(({ exercise, reps, sets, weights, plan_id }) => ({
        name: exercise,
        reps: Array.isArray(reps) ? reps : Array(sets).fill(reps),
        sets,
        weights: weights || Array(sets).fill(0),
        plan_id: plan_id || null,
      })),
    };

    console.log('Payload for editing workout plan:', payload);

    api
      .put('/edit_workout_plan', payload)
      .then((response) => {
        console.log('Workout plans updated successfully:', response.data);
        setNotification({
          title: 'Workout Updated',
          message: 'Your workout plan has been updated successfully.',
          type: 'success',
        });
        setRequestId((requestId) => requestId + 1); // Trigger data refresh
        setShowModal(false);
      })
      .catch((error) => {
        console.error('Error updating workout plans:', error);
        setNotification({
          title: 'Error',
          message: 'There was an error updating your workout plan.',
          type: 'error',
        });
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
      setNotification({
        title: 'Exercise Removed',
        message: `Exercise has been removed from your workout.`,
        type: 'success',
      });
      return updated;
    });
  };

  const [showModal, setShowModal] = useState(false);
  const [showEditWorkoutNameModal, setShowEditWorkoutNameModal] = useState(false);
  const [savekey, setKey] = useState('');
  const [addExercise, setaddExercise] = useState('');
  const [exerciseExists, setExerciseExists] = useState(exercise);
  const [WorkoutName, setWorkoutName] = useState('');

  async function changeWorkoutNameAPI() {
    try {
      const response = await api.put('/edit_workout_plan_name', {
        plan_id: selectedExercise[savekey][0]?.plan_id,
        new_name: WorkoutName,
      });
      console.log('Workout name changed successfully:', response.data);
      setNotification({
        title: 'Workout Name Changed',
        message: 'Your workout name has been changed successfully.',
        type: 'success',
      });

      //setRequestId((requestId) => requestId + 1); // Trigger data refresh
      setShowEditWorkoutNameModal(false);
    } catch (error) {
      setNotification({
        title: 'Error',
        message: 'There was an error changing the workout name.',
        type: 'error',
      });
      setShowEditWorkoutNameModal(false);
    }
  }

  function ConfirmationModalforWorkoutDelete() {
    return (
      <div className="modal modal-open modal-bottom sm:modal-middle items-center justify-center">
        <div
          className="modal-box border border-red-500 shadow-xl rounded-xl"
          style={{
            background: 'rgba(10, 20, 40, 0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid #ef4444',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          }}
        >
          <h3 className="font-bold text-lg text-amber-50 mb-4">Delete Workout Plan</h3>
          <p className="text-amber-50 mb-4">Are you sure you want to delete this workout plan?</p>
          <div className="modal-action">
            <Button onClick={() => handeRemoveWorkoutAPI(savekey)} border="#ef4444">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </Button>
            <Button onClick={() => setConfirmationModalforWorkoutDelete(false)} border="#3b82f6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  function changeWorkoutName() {
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
          <h3 className="font-bold text-lg text-amber-50 mb-4">Change Workout Name</h3>
          <Input
            placeholder="New Workout Name"
            w="w-full"
            h="h-10"
            id="workout-name-input"
            onChange={(e) => setWorkoutName(e.target.value)}
          />
          <div className="modal-action">
            <Button
              onClick={() => changeWorkoutNameAPI()}
              border="#3b82f6"
              disabled={WorkoutName.length === 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </Button>
            <Button onClick={() => setShowEditWorkoutNameModal(false)} border="#ef4444">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  function Workouts({ exercise }) {
    return (
      <div>
        <WorkoutCard>
          <h2 className="text-amber-400 font-bold mb-2">{exercise}</h2>
          <div className="flex flex-row justify-center items-center gap-4 mt-2">
            <Button onClick={() => handleShowModal(exercise)} border="#3b82f6">
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
            </Button>
            <Button
              onClick={() => (setConfirmationModalforWorkoutDelete(true), setKey(exercise))}
              border="#ef4444"
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
            </Button>
          </div>

          <div className="flex flex-col">
            <p className="text-blue-300 font-light  text-sm ">
              Exercises: {selectedExercise[exercise]?.length || 0}
            </p>
          </div>
        </WorkoutCard>
      </div>
    );
  }

  function handleShowModal(exercise) {
    setShowModal((prev) => !prev);
    setKey(exercise);
    setRequestId((requestId) => requestId + 1);
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
    console.log(workoutname);
    api
      .delete(`/delete_workout_plan`, {
        data: { plan_id: selectedExercise[workoutname][0]?.plan_id },
      })
      .then(() => {
        console.log('Workout plan deleted');
        handeRemoveWorkout(workoutname);
        setConfirmationModalforWorkoutDelete(false);
        setNotification({
          title: 'Workout Deleted',
          message: `Workout plan has been deleted.`,
          type: 'success',
        });
      })
      .catch((error) => {
        console.error('Error deleting workout plan:', error);
        setNotification({
          title: 'Error',
          message: 'There was an error deleting the workout plan.',
          type: 'error',
        });
      });
  };

  //Nur im Frontend
  const handleAddExercise = (elem) => {
    console.log(selectedExercise[savekey]);
    if (exercise.some((ex) => ex.name == elem)) {
      let newExercise = {
        exercise: elem,
        reps: 1,
        sets: 1,
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
      setNotification({
        title: 'Exercise Added',
        message: `${elem} has been added to your workout.`,
        type: 'success',
      });
    }
  };

  function EditWorkoutPage() {
    return (
      <div>
        <div className="flex flex-col items-center ">
          <div className="flex flex-col w-70 md:w-80 space-y-2 items-center ">
            <Input
              placeholder="Add an exercise..."
              value={addExercise}
              onChange={(e) => setaddExercise(e.target.value)}
              id="input-e"
              w="w-54"
              h="h-10"
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
                    !selectedExercise[savekey]?.some((ex) => ex.exercise === prev.name)
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
                      <h2 className="text-amber-400 font-bold mb-2">{item.name}</h2>
                      <figure className="w-6 h-6 mb-2">
                        <img
                          src={item.img}
                          style={{ filter: 'invert(1)' }}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </figure>
                      <h1 className="text-slate-200 font-light text-xs mb-2 text-center ">
                        {item.description}
                      </h1>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 overflow-y-auto py-2 w-full max-h-90 sm:max-h-80 md:max-h-96 lg:max-h-[40vh]">
            {Array.isArray(selectedExercise[savekey]) &&
              selectedExercise[savekey].map((ex, index) => (
                <ExerciseCard
                  key={ex.exercise + '-' + index}
                  ExerciseName={ex.exercise}
                  Description={exercise.find((item) => item.name === ex.exercise)?.description}
                  ExerciseImage={exercise.find((item) => item.name === ex.exercise)?.img}
                  onRepsChange={(reps) => {
                    setSelectedExercise((prev) => {
                      const updated = { ...prev };
                      updated[savekey] = updated[savekey].map((exercise, i) =>
                        i === index ? { ...exercise, reps } : exercise
                      );
                      console.log(updated);
                      return updated;
                    });
                  }}
                  onSetsChange={(sets) => {
                    setSelectedExercise((prev) => {
                      const updated = { ...prev };
                      updated[savekey] = updated[savekey].map((exercise, i) =>
                        i === index ? { ...exercise, sets } : exercise
                      );
                      console.log(updated);
                      return updated;
                    });
                  }}
                  handleRemoveExercise={() => handleRemoveExerciseinWorkout(index)}
                  changePosition={(direction) => changePosition(ex, direction)}
                  reps={Array.isArray(ex.reps) ? ex.reps[0] : ex.reps}
                  sets={ex.sets}
                />
              ))}
          </div>
          <div className="divider divider-primary"></div>
          <div className="flex flex-row gap-2">
            <Button
              onClick={handleEditWorkout}
              border="#08ad4dff"
              disabled={
                Array.isArray(selectedExercise[savekey]) && selectedExercise[savekey].length === 0
              }
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
            </Button>
            <Button onClick={handleShowModal} border="#ef4444">
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
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <TemplatePage>
        {notification && (
          <Notify
            title={notification.title}
            message={notification.message}
            duration={1500}
            key={notification.message + notification.title + Date.now()}
            type={notification.type}
            // Notify handles its own visibility, but we clear notification after duration to allow re-showing
            onClose={() => setNotification(null)}
          />
        )}
        {showEditWorkoutNameModal && changeWorkoutName()}
        {ConfirmationModalforWorkoutDeleteModal && ConfirmationModalforWorkoutDelete()}
        <div className="flex flex-col items-center  min-h-0">
          <div className="divider divider-primary text-white font-bold mb-2">
            <div className="flex flex-row items-center justify-center ">
              {showModal ? savekey : 'Edit your workout plans'}

              {showModal && (
                <Button onClick={() => setShowEditWorkoutNameModal(true)} border="transparent">
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
                </Button>
              )}
            </div>
          </div>
          <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl flex flex-col gap-4 items-center pt-2 overflow-y-auto max-h-[65vh]">
            {showModal ? (
              <div>{EditWorkoutPage()}</div>
            ) : selectedExercise && Object.keys(selectedExercise).length > 0 ? (
              Object.keys(selectedExercise).map((exercise, index) => (
                <Workouts exercise={exercise} key={index} />
              ))
            ) : (
              <>
                <p className="text-white">No workout plans available. Please create one first.</p>
                <Button border="#ef4444" onClick={() => navigate('/createtrain')}>
                  Create Workout
                </Button>
              </>
            )}
          </div>
        </div>
      </TemplatePage>
    </div>
  );
};

export default EditTrain;
