import './index.css';
import Header from './Header';
import { useState } from 'react';

function ExerciseCard({ name, description, img, onRemove }) {
  const [sets,setSets] = useState(0)
  const [reps,setReps] = useState(0)

  function addSet() {
    setSets(sets + 1);
  }
  
  function reduceSet(){
    if(sets > 0){
    setSets(sets-1)
    }
  }

   function addReps() {
    setReps(reps + 1);
  
  }
  
  function reduceReps(){
    if(reps > 0){
    setReps(reps-1)
    }
  }


  return (
  <div className="card w-full sm:w-64 md:w-96 bg-gray-600 card-xs shadow-sm">
    <div className="card-body">
      <h2 className="card-title text-xl font-semibold">{name}</h2>
      
      <figure className="mb-4">
        <img src={img} alt={name} className="rounded-md" width="50" height="50" />
      </figure>
      
      <p className="text-sm text-gray-300">{description}</p>
      
      <div className="card-actions justify-start mt-4">
        <button 
          className="btn btn-outline btn-primary" 
          onClick={addSet}>
          Add set
        </button>
        <button 
          className="btn btn-outline btn-primary" 
          onClick={reduceSet}>
          Reduce set
        </button>
         <button 
          className="btn btn-outline btn-primary" 
          onClick={addReps}>
          Add reps
        </button>
        <button 
          className="btn btn-outline btn-primary" 
          onClick={reduceReps}>
          Reduce reps
        </button>
      </div>
        <div class="divider divider-primary">Settings</div>
      <p className="mt-0 text-xs text-gray-400">Sets: {sets}</p>
      <p className="mt-0 text-xs text-gray-400">Repetitions : {reps}</p>
      <button 
          className="btn btn-outline btn-secondary " 
          onClick={onRemove}>
          Remove
        </button>
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
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <Header />
      <p className="text-4xl">Create your training:</p>
<label className="input">
       <input
          type="input"
          onChange={handleExerciseChange}
          className="grow"
          placeholder="Name your workout"
        />
</label>
      <label className="input">
        <input
          type="search"
          onChange={handleExerciseChange}
          list="exercise-options"
          className="grow"
          id = "input_search"
          placeholder="Select your exercise"
        />

        <datalist id="exercise-options">
          {exercise.map((item, index) => (
            <option key={index} value={item.name} />
          ))}
        </datalist>
      </label>

      {/* Render selected exercises */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
        {selectedExercise.length > 0 ? (
          selectedExercise.map((exercise, index) => (
            <ExerciseCard
              key={index}
              name={exercise.name}
              description={exercise.description}
              img={exercise.img}
              onRemove={() => handleRemoveExercise(exercise.name)} // Handle removing exercise
            />
          ))
        ) : (
          <p></p>
        )}
      </div>

      <div className="flex flex-row gap-2">
        <button className="btn btn-outline btn-primary">Save</button>
        <button className="btn btn-outline btn-secondary">Cancel</button>
      </div>
    </div>
  );
}

export default CreateTrainGUI;