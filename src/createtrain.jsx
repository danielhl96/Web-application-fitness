import './index.css';
import Header from './Header';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import exercise from './exercises.jsx';
import TemplatePage from './templatepage.jsx';
import ExerciseCard from './exercisecard.jsx';
import Notify from './notify.jsx';
import Input from './input.jsx';

function CreateTraining() {
  const navigate = useNavigate();
  const [WorkoutName, setWorkoutName] = useState('');
  const [WorkoutNameSet, setWorkoutNameSet] = useState(false);
  const [notification, setNotification] = useState(null);
  const handleSaveTraining = async () => {
    const trainingName = WorkoutName || document.getElementById('training-input').value;
    const selectedExercises = selectedExercise.map((exercise) => ({
      name: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      weights: Array.isArray(exercise.weights)
        ? exercise.weights
        : Array(exercise.sets || 3).fill(0),
    }));

    await api
      .post('/create_workout_plan', {
        name: trainingName,
        exercises: selectedExercises,
      })
      .then((response) => {
        setMessage('Training saved successfully!');
        setNotification({
          title: 'Training Saved',
          message: 'Your training has been saved successfully!',
          type: 'success',
        });
        console.log('Training saved:', response.data);
        setWorkoutName('');
        setWorkoutNameSet(false);
        setSelectedExercise([]);
      })
      .catch((error) => {
        console.error('Error saving training:', error);
        setMessage('Error saving training.');
        setNotification({
          title: 'Error',
          message: 'There was an error saving your training.',
          type: 'error',
        });
      });
  };

  useEffect(() => {
    setExerciseExists(exercise);
  }, []);

  const [selectedExercise, setSelectedExercise] = useState([]);
  const [addExercise, setaddExercise] = useState('');
  const [exerciseExists, setExerciseExists] = useState([]);
  const [Message, setMessage] = useState('');

  function changePosition(element, direction) {
    console.log(element, direction);
    const index = selectedExercise.findIndex((ex) => ex === element);
    if (direction === 'up' && index > 0) {
      const newExercises = [...selectedExercise];
      [newExercises[index - 1], newExercises[index]] = [
        newExercises[index],
        newExercises[index - 1],
      ];
      setSelectedExercise(newExercises);
    } else if (direction === 'down' && index < selectedExercise.length - 1) {
      const newExercises = [...selectedExercise];
      [newExercises[index + 1], newExercises[index]] = [
        newExercises[index],
        newExercises[index + 1],
      ];
      setSelectedExercise(newExercises);
    }
  }

  function handleExerciseChange(e) {
    const selectedName = e;
    console.log(selectedName);
    const found = exercise.find((item) => item.name === selectedName);
    if (found) {
      // Add the found exercise to the selectedExercise state
      setSelectedExercise((prev) => {
        // Check if the exercise is already in the list before adding
        if (!prev.some((item) => item.name === found.name)) {
          setNotification({
            title: 'Exercise Added',
            message: `${found.name} has been added to your workout.`,
            type: 'success',
          });
          return [...prev, found];
        }
        setNotification({
          title: 'Exercise Exists',
          message: `${found.name} is already in your workout.`,
          type: 'info',
        });
        return prev; // Don't add if already in the list
      });
    }
    if (found) {
      // Update the sets and reps for the found exercise
      const updatedExercise = {
        ...found,
        sets: document.getElementById('sets-table').getElementsByTagName('tr').length,
        reps: [8, 8, 8],
        weights: [0, 0, 0],
        date: new Date().toISOString().split('T')[0],
      };
      setSelectedExercise((prev) => prev.map((item) => (item.name === e ? updatedExercise : item)));
    }
    console.log(selectedExercise);
    document.getElementById('input-e').value = '';
    setaddExercise('');
  }

  const handleAddExercise2 = (e) => {
    console.log(e.target.value);
    setaddExercise(e.target.value);
  };

  const handleRemoveExercise = (name) => {
    setSelectedExercise((prev) => prev.filter((item) => item.name !== name));
    setNotification({
      title: 'Exercise Removed',
      message: `${name} has been removed from your workout.`,
      type: 'success',
    });
  };

  // 1. Funktion in CreateTrainGUI definieren
  const handleRepsChange = (exerciseName, reps) => {
    setSelectedExercise((prev) =>
      prev.map((item) =>
        item.name === exerciseName
          ? { ...item, reps: Array.from({ length: item.sets }, () => reps) }
          : item
      )
    );
    console.log(selectedExercise);
  };
  const handleSetsChange = (exerciseName, sets) => {
    setSelectedExercise((prev) =>
      prev.map((item) =>
        item.name === exerciseName
          ? {
              ...item,
              sets,
              reps: Array.isArray(item.reps)
                ? Array.from({ length: sets }, (_, i) => item.reps[i] || 8)
                : Array(sets).fill(8),
              weights: Array.isArray(item.weights)
                ? Array.from({ length: sets }, (_, i) => item.weights[i] || 0)
                : Array(sets).fill(0),
            }
          : item
      )
    );
  };

  return (
    <div>
      <Header />
      <TemplatePage>
        {notification && (
          <Notify
            title={notification.title}
            message={notification.message}
            type={notification.type}
            duration={1500}
            onClose={() => setNotification(null)}
          />
        )}
        <div className="divider divider-primary text-white font-bold mb-2 ">
          Create your workout
        </div>
        <div className="flex flex-col items-center space-y-2 h-auto">
          <h1 className="text-slate-400">Your workout need an name:</h1>
          <div className="flex flex-row">
            <Input
              value={WorkoutName}
              onDisable={WorkoutNameSet}
              type="input"
              placeholder="Workout name"
              id="training-input"
              onChange={(e) => setWorkoutName(e.target.value)}
            />
            <button
              disabled={WorkoutName === ''}
              onClick={() => setWorkoutNameSet((prev) => !prev)}
              className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400"
              style={{
                background: 'rgba(30, 41, 59, 0.25)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                border: '1.5px solid #3b82f6',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
            >
              {WorkoutNameSet ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              ) : (
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          </div>
          {WorkoutNameSet === true && (
            <div className="flex flex-col items-center space-y-2">
              <h1 className="text-slate-400">Search your exercise:</h1>
              <div className="form-control">
                <Input
                  value={addExercise}
                  onChange={(e) => setaddExercise(e.target.value)}
                  w="w-54"
                  h="h-10"
                  placeholder="Enter an exercise name"
                  className="input input-bordered w-54 h-10 bg-slate-900 text-white border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="input-e"
                />
              </div>
              <div className="divider divider-primary text-amber-50 font-bold mb-2">
                {WorkoutName}
              </div>
            </div>
          )}
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
                  !selectedExercise.some((ex) => ex.exercise === prev.name)
              )
              .map((item, index) => (
                <div key={index} className="flex flex-col items-center cursor-pointer">
                  <div
                    onClick={() => handleExerciseChange(item.name)}
                    className="card w-50 h-30 border border-blue-500 shadow-xl rounded-xl backdrop-blur-lg flex flex-col items-center mb-2"
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
          {/* Render selected exercises */}
          {WorkoutNameSet ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="w-100 max-h-90 flex flex-col gap-4 items-center pt-2 overflow-y-auto max-md:h-auto">
                {selectedExercise.length > 0 ? (
                  selectedExercise.map((exercise, index) => (
                    <ExerciseCard
                      ExerciseName={exercise.name}
                      Description={exercise.description}
                      ExerciseImage={exercise.img}
                      onRemove={() => handleRemoveExercise(exercise.name)}
                      // Callback for Prop passed
                      onRepsChange={(reps) => handleRepsChange(exercise.name, reps)}
                      onSetsChange={(sets) => handleSetsChange(exercise.name, sets)}
                      handleRemoveExercise={() => handleRemoveExercise(exercise.name)}
                      changePosition={(direction) => changePosition(exercise, direction)}
                    />
                  ))
                ) : (
                  <p className="text-slate-400 flex justify-center">No exercises selected yet.</p>
                )}
              </div>
            </div>
          ) : null}
          <div className="flex flex-row items-center gap-4 mt-4">
            <button
              disabled={WorkoutName === '' || selectedExercise.length === 0}
              onClick={() => handleSaveTraining()}
              className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400"
              style={{
                background: 'rgba(30, 41, 59, 0.25)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                border: '1.5px solid #3b82f6',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
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
              onClick={() => navigate('/')}
              className="btn btn-outline btn-error shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-red-400"
              style={{
                background: 'rgba(30, 41, 59, 0.25)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                border: '1.5px solid #f63b3bff', // red-500
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(246, 59, 59, 0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
            >
              {Message === 'Training saved successfully!' ? (
                <>
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
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </>
              ) : (
                <>
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
                </>
              )}
            </button>
          </div>
        </div>
      </TemplatePage>
    </div>
  );
}

export default CreateTraining;
