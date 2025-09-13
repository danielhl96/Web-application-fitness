import './index.css';
import Header from './Header';
import { useState } from 'react';


function ExerciseCard({ name, description, img, onRemove }) {
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);

  function addSet() {
    setSets(sets + 1);
  }
  function reduceSet() {
    if (sets > 0) setSets(sets - 1);
  }
  function addReps() {
    setReps(reps + 1);
  }
  function reduceReps() {
    if (reps > 0) setReps(reps - 1);
  }

  return (
    <div className="card w-full sm:w-80 md:w-[450px] bg-slate-800 shadow-lg border border-emerald-500">
      <div className="card-body">
        <h2 className="card-title text-emerald-400 text-xl font-semibold">{name}</h2>
        <figure className="mb-4 flex justify-center">
          <img src={img} alt={name} className="rounded-md" width="60" height="60" />
        </figure>
        <p className="text-sm text-slate-200 mb-2">{description}</p>
        <div className="card-actions flex flex-wrap gap-2 justify-start mt-2">
          <button className="btn bg-emerald-500 hover:bg-emerald-600 text-white" onClick={addSet}>Add set</button>
          <button className="btn bg-emerald-700 hover:bg-emerald-800 text-white" onClick={reduceSet}>Reduce set</button>
          <button className="btn bg-blue-500 hover:bg-blue-600 text-white" onClick={addReps}>Add reps</button>
          <button className="btn bg-blue-700 hover:bg-blue-800 text-white" onClick={reduceReps}>Reduce reps</button>
        </div>
        <div className="divider divider-primary my-2">Settings</div>
        <p className="mt-0 text-xs text-slate-300">Sets: {sets}</p>
        <p className="mt-0 text-xs text-slate-300">Repetitions: {reps}</p>
        <button className="btn bg-pink-500 hover:bg-pink-600 text-white mt-2" onClick={onRemove}>Remove</button>
      </div>
    </div>
  );
}

function CreateTrainGUI() {
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


  ];

  const [selectedExercise, setSelectedExercise] = useState([]);

  function handleExerciseChange(e) {
    const selectedName = e.target.value;
   

    const found = exercise.find((item) => item.name === selectedName);
    if (found) {
      // Add the found exercise to the selectedExercise state
      setSelectedExercise((prev) => {
        // Check if the exercise is already in the list before adding
        if (!prev.some(item => item.name === found.name)) {
          return [...prev, found];
        }
        return prev; // Don't add if already in the list
      });
    }
     document.getElementById('input_search').value = '';
  }

  const handleRemoveExercise = (name) => {
    setSelectedExercise((prev) => prev.filter((item) => item.name !== name));
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center pt-24 pb-8">
      <Header />
      <div className="space-y-4 card w-full max-w-2xl bg-slate-800 shadow-lg p-8 rounded-md flex flex-col items-center">
        <div className="divider divider-primary text-2xl text-emerald-400 font-bold mb-2">Create Your Training</div>
        <div className="w-full flex flex-col gap-4 items-center pt-2">
          <label className="input">
            <input
              type="input"
              onChange={handleExerciseChange}
              className="grow bg-slate-800 text-white border border-slate-700 rounded-md px-3 py-2"
              placeholder="Name your workout"
            />
          </label>
          <label className="input">
            <input
              type="search"
              onChange={handleExerciseChange}
              list="exercise-options"
              className="grow bg-slate-800 text-white border border-slate-700 rounded-md px-3 py-2"
              id="input_search"
              placeholder="Select your exercise"
            />
            <datalist id="exercise-options">
              {exercise.map((item, index) => (
                <option key={index} value={item.name} />
              ))}
            </datalist>
          </label>
        </div>
        {/* Render selected exercises */}
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-6 w-full items-center">
          {selectedExercise.length > 0 ? (
            selectedExercise.map((exercise, index) => (
              <ExerciseCard
                key={index}
                name={exercise.name}
                description={exercise.description}
                img={exercise.img}
                onRemove={() => handleRemoveExercise(exercise.name)}
              />
            ))
          ) : (
            <p className="text-slate-400 flex justify-center">No exercises selected yet.</p>
          )}
        </div>
        <div className="flex flex-row gap-4 mt-4">
          <button className="btn bg-emerald-500 hover:bg-emerald-600 text-white">Save</button>
          <button className="btn bg-pink-500 hover:bg-pink-600 text-white">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default CreateTrainGUI;