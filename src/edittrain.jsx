import './index.css';
import Header from './Header';
import { useState } from 'react';

const EditTrain = () => {
  const exercises = {Push: ["Benchpress", "Sideraises","Dips"], Pull:["Pull-Up","High-Row"] 
};

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

  const[selectedExercise,setSelectedExercise] = useState(exercises)
  const[showModal,setShowModal] = useState(false)
  const[savekey,setKey] = useState("")

  function WorkoutCard({exercise}){
    return(
      <div className="card w-68 sm:w-64 md:w-96 bg-gray-600 card-xs shadow-sm">
  <div className="card- text-xl items-center text-center">
     <h2> Workout: {exercise}</h2>
    <div class="justify-center mt-1 card-actions p-6">
     <button  onClick={() => handleShowModal(exercise)} className="btn btn-outline btn-primary">Edit</button>
      <button  onClick={() => handeRemoveWorkout(exercise)} className="btn btn-outline btn-secondary">Remove</button>
    </div>
  </div>
</div>
    )
  }

  function handleShowModal(exercise) {
    setShowModal(prev => !prev )
    setKey(exercise)
  }

  const handeRemoveWorkout = (workoutname) => {
    console.log(workoutname)
     setSelectedExercise(prev => {
    const updated = { ...prev };
    delete updated[workoutname];
    return updated;
  });
  }

  const handleRemoveExercise = (exerciseToRemove) => {
  setSelectedExercise(prev => {
    const updatedCategory = prev[savekey].filter(ex => ex !== exerciseToRemove);
    return {
      ...prev,
      [savekey]: updatedCategory
    };
  });
};

const handleAddExercise = (e) => {
  const newExercise = e.target.value;
  setSelectedExercise(prev => {
    return {
      ...prev,
      [savekey]: [...prev[savekey], newExercise]
    };
  });
  console.log(selectedExercise)
}



  function EditWorkoutModal(){
    return (
    <div className="modal modal-open">
                        <div className="modal-box">
                          <p>Add a new exercise:</p>
                          <label className="input">
                            <div>
        <input 
          type="search"
          onSelect={handleAddExercise}
          list="exercise-options"
          className="w-full"
          id = "input_search"
          placeholder="Select an exercise"
        />
</div>


        <datalist id="exercise-options">
          {exercise.map((item, index) => (
            <option key={index} value={item.name} />
          ))}
        </datalist>
      </label>
      
                        {selectedExercise[savekey].map((exercise,index) => (
                          <div key={index} className="mb-6 border-b pb-4">
                            <h2>{exercise}</h2>
                         <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 p-4">
                          <button className = "btn btn-outline btn-primary w-30 " >Add sets</button>
                          <button className = "btn btn-outline btn-primary w-30">Reduce sets</button>
                          <button className = "btn btn-outline btn-primary w-30">Add reps</button>
                          <button className = "btn btn-outline btn-primary w-30">Reduce reps</button>
                         <button onClick={() => handleRemoveExercise(exercise)} className="btn btn-outline btn-secondary w-30">Remove</button>

                          </div>
                          <div className="grid grid-cols-2 gap-2 px-4">
                          <p>Sets:</p>
                          <p>Reps:</p>
                        </div>
                      </div>
                          ))}
                          <div className="modal-action">
                            <button
                            onClick={handleShowModal}
                              className="btn btn-soft btn-primary"
                            >
                              Save
                            </button>
                             <button
                            onClick={handleShowModal}
                              className="btn btn-soft btn-error"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
      );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <Header />
      <p className="text-4xl">Edit your training:</p>
      {Object.keys(selectedExercise).map((exercise, index) => (
          <WorkoutCard exercise = {exercise} key =  {index} />
      ))}
       {showModal && (
                  <div>{EditWorkoutModal()}</div>)}
    </div>
   
  );
};

export default EditTrain;