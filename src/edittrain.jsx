import './index.css';
import Header from './Header';
import { useState } from 'react';

const EditTrain = () => {
  const exercises = {Push: ["Benchpress", "Sideraises","Dips"], Pull:["Pull-Up","High-Row"] 
};

  const[selectedExercise,setSelectedExercise] = useState(exercises)
  const[showModal,setShowModal] = useState(false)
  const[savekey,setKey] = useState("")

  function WorkoutCard({exercise}){
    return(
      <div className="card w-full sm:w-64 md:w-96 bg-gray-600 card-xs shadow-sm">
  <div className="card- text-xl items-center text-center">
     <h2>{exercise}</h2>
    <div class="justify-center mt-4 card-actions">
     <button  onClick={() => handleShowModal(exercise)} className="btn btn-outline btn-primary">Edit</button>
    </div>
  </div>
</div>
    )
  }

  function handleShowModal(exercise) {
    setShowModal(prev => !prev )
    setKey(exercise)
  }

   const handleRemoveExercise = (name) => {
    console.log(name)
    setSelectedExercise((prev) => prev.filter((item) => item.name !== name));
  };

  function EditWorkoutModal(){
    return (
    <div className="modal modal-open">
                        <div className="modal-box">
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
      {Object.keys(exercises).map((exercise, index) => (
          <WorkoutCard exercise = {exercise} key =  {index} />
      ))}
       {showModal && (
                  <div>{EditWorkoutModal()}</div>)}
    </div>
   
  );
};

export default EditTrain;