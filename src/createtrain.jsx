import './index.css';
import Header from './Header';
import { useState } from 'react';

function ExerciseCard({ name, description, img, onRemove }) {
  return (
    <div className="card w-full sm:w-64 md:w-96 bg-gray-600 card-xs shadow-sm">

      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <figure>
          <img src={img} alt={name} width="50" height="50" />
        </figure>
        <p>{description}</p>
        <div className="justify-end card-actions">
          <button className="btn btn-secondary" onClick={onRemove}>Remove</button>
        </div>
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
          type="search"
          onChange={handleExerciseChange}
          list="exercise-options"
          className="grow"
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