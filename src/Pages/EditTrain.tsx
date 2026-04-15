import '../index.css';
import Header from '../Components/Header.tsx';
import { useState, useRef, useEffect, JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import exercise from '../Components/exercises.ts';
import api from '../Utils/api.js';
import TemplatePage from '../Components/templatepage.js';
import Notify from '../Components/notify.js';
import Input from '../Components/input.js';
import Button from '../Components/button.js';
import TemplateModal from '../Components/templatemodal.js';
import { UI_STATE, SelectedExercise, WorkoutPlanMap, WorkoutPlan } from './types.ts';
import Workouts from '../Components/workouts.js';
import EditWorkoutPage from '../Components/editworkout.tsx';

const EditTrain = (): JSX.Element => {
  const navigate = useNavigate();

  const [requestId, setRequestId] = useState<number>(0);
  const [showState, setState] = useState<UI_STATE<WorkoutPlan[]>>({ type: 'loading' });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditWorkoutNameModal, setShowEditWorkoutNameModal] = useState<boolean>(false);
  const [savekey, setKey] = useState<string>('');
  const [addExercise, setaddExercise] = useState<string>('');
  const [workoutName, setWorkoutName] = useState<string>('');
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [ConfirmationModalforWorkoutDeleteModal, setConfirmationModalforWorkoutDelete] =
    useState<boolean>(false);

  useEffect(() => {
    api
      .get('/workout_plans/get_workout_plans')
      .then((response: { data: WorkoutPlan[] }) => {
        setState({ type: 'success', data: response.data });
      })
      .catch((error) => {
        setState({ type: 'error', error: error.message });
      });
  }, [requestId]);

  // map API response -> { PlanName: [ { exercise, reps, sets }, ... ], ... }
  const mapPlans = (plans: WorkoutPlan[]): WorkoutPlanMap =>
    plans.reduce((acc, plan) => {
      acc[plan.name] = plan.plan_exercise_templates.map((exercise) => ({
        exercise: exercise.name,
        reps: exercise.reps_template,
        sets: exercise.sets,
        weights: exercise.weights_template,
        plan_id: plan.id,
      }));
      return acc;
    }, {});

  // keep the selected state separate and initialize as empty object
  const [selectedExercise, setSelectedExercise] = useState<WorkoutPlanMap>({});

  // whenever `data` (from backend) changes, compute the desired shape and set state
  useEffect(() => {
    console.log(selectedExercise);
    if (showState.type === 'success' && showState.data.length > 0) {
      setSelectedExercise(mapPlans(showState.data));
    } else {
      setSelectedExercise({});
    }
  }, [showState]);

  function handleEditWorkout(): void {
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
    api
      .put('/workout_plans/edit_workout_plan', payload)
      .then((response: { data: WorkoutPlan[] }) => {
        console.log('Workout plans updated successfully:', response.data);
        setNotification({
          title: 'Workout Updated',
          message: 'Your workout plan has been updated successfully.',
          type: 'success',
        });
        setRequestId((requestId) => requestId + 1); // Trigger data refresh
        setShowModal(false);
      })
      .catch(() => {
        console.error('Error updating workout plans');
        setNotification({
          title: 'Error',
          message: 'There was an error updating your workout plan.',
          type: 'error',
        });
      });
  }

  function changePosition(element: SelectedExercise, direction: 'up' | 'down'): void {
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

  async function changeWorkoutNameAPI(): Promise<void> {
    try {
      await api.put('/workout_plans/change_workout_plan_name', {
        planId: selectedExercise[savekey][0]?.plan_id,
        newName: workoutName,
      });

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
      <TemplateModal border="#ef4444 1.5px solid">
        <div>
          <h3 className="font-bold text-lg text-amber-50 mb-4">Delete Workout Plan</h3>
          <p className="text-amber-50 mb-4">Are you sure you want to delete this workout plan?</p>
          <div className="modal-action">
            <Button onClick={() => handleRemoveWorkoutAPI(savekey)} border="#ef4444">
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
      </TemplateModal>
    );
  }

  function changeWorkoutName() {
    return (
      <TemplateModal>
        <div>
          <h3 className="font-bold text-lg text-amber-50 mb-4">Change Workout Name</h3>
          <Input
            placeholder="New Workout Name"
            w="w-full"
            h="h-10"
            value={workoutName}
            onChange={setWorkoutName}
          />
          <div className="modal-action">
            <Button
              onClick={() => changeWorkoutNameAPI()}
              border="#3b82f6"
              disabled={workoutName.length === 0}
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
      </TemplateModal>
    );
  }

  function handleShowModal(exercise: string): void {
    console.log(exercise);
    setShowModal((prev) => !prev);
    setKey(exercise);
    setRequestId((requestId) => requestId + 1);
  }

  const handleRemoveWorkout = (workoutname: string): void => {
    setSelectedExercise((prev) => {
      const updated = { ...prev };
      delete updated[workoutname];
      return updated;
    });
  };

  const handleRemoveWorkoutAPI = (workoutname: string): void => {
    api
      .delete(`workout_plans/delete_workout_plan`, {
        data: { planId: selectedExercise[workoutname][0]?.plan_id },
      })
      .then(() => {
        handleRemoveWorkout(workoutname);
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

  const handleAddExercise = (elem: string): void => {
    console.log(selectedExercise[savekey]);
    if (exercise.some((ex) => ex.name == elem)) {
      const newExercise: SelectedExercise = {
        exercise: elem,
        reps: 1,
        sets: 1,
        weights: [],
        plan_id: selectedExercise[savekey][0]?.plan_id || null,
      };
      setSelectedExercise((prev) => {
        return {
          ...prev,
          [savekey]: [...prev[savekey], newExercise],
        };
      });
      console.log(selectedExercise);

      setaddExercise('');
      setNotification({
        title: 'Exercise Added',
        message: `${elem} has been added to your workout.`,
        type: 'success',
      });
    }
  };

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
        <div className="flex flex-col items-center justify-center min-h-0">
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
          <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl justify-center flex grid lg:grid-cols-3 gap-4 items-center pt-2 overflow-y-auto max-h-[70dvh]">
            {showModal ? (
              <div>
                <EditWorkoutPage
                  addExercise={addExercise}
                  setaddExercise={setaddExercise}
                  selectedExercise={selectedExercise}
                  savekey={savekey}
                  handleAddExercise={handleAddExercise}
                  setSelectedExercise={setSelectedExercise}
                  handleEditWorkout={handleEditWorkout}
                  handleShowModal={handleShowModal}
                  changePosition={changePosition}
                />
              </div>
            ) : showState.type == 'success' ? (
              Object.keys(selectedExercise).map((exercise, index) => (
                <Workouts
                  exercise={exercise}
                  key={index}
                  handleShowModal={handleShowModal}
                  setConfirmationModalforWorkoutDelete={setConfirmationModalforWorkoutDelete}
                  setKey={setKey}
                  selectedExercise={selectedExercise}
                />
              ))
            ) : showState.type == 'error' ? (
              <>
                <p className="text-white">No workout plans available. Please create one first.</p>
                <Button border="#ef4444" onClick={() => navigate('/createtrain')}>
                  Create Workout
                </Button>
              </>
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center min-h-[50dvh] w-full">
                <span className="loading loading-bars loading-xl"></span>
                <div className="text-white font-bold text-xs mt-2">Loading workout plans...</div>
              </div>
            )}
          </div>
        </div>
      </TemplatePage>
    </div>
  );
};

export default EditTrain;
