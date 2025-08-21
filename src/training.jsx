import './index.css';
import Header from './Header';
import { use, useState } from 'react';



function StartTraining() {
  const training = { 0: [{exercise: "/benchpress.png", sets: 3,reps: 12, weight: 85}], 1:[{exercise: "/shoulderpress.png", sets: 3,reps: 12,weight:50} ]};
  const [selectedExercise,setExercise] = useState(training[0][0])
  const [idxExercise,setidx] = useState(0)

  const handleExercise = () => {
    if(idxExercise <  Object.keys(training).length-1){
    const newIdx = idxExercise +1
    setidx(newIdx)
    setExercise(training[newIdx][0])
    console.log(idxExercise)
    }
  }
   const handleExerciseBack = () => {
     if(idxExercise > 0){
    const newIdx = idxExercise -1
    setidx(newIdx)
    setExercise(training[newIdx][0])
    console.log(idxExercise)
     }
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 card sm:w-64 md:w-96 bg-gray-700 shadow-sm p-6 rounded-md">
          <div>Your weight: {selectedExercise.weight} kg</div>
           <figure className="mb-4">
        <img src={selectedExercise.exercise} name={"Benchpress"} className="rounded-md" width="50" height="50" />
      </figure>
          <div class="divider divider-primary">Sets|Reps|OldReps</div>
          {Array.from({ length: selectedExercise.sets }).map((_, index) => (
            <div className="flex flex-row space-x-3 items-center" key={index}>
              <div>{index + 1}</div>
              <input
                type="text"
                placeholder="Repetitions"
                className="input input-primary"
                id={"input" + (index + 1)}
              />
              <div>{selectedExercise.reps}</div>
            </div>
          ))}

          <div className="flex space-x-2 items-center justify-center">
            <button onClick={() => handleExerciseBack()} className="btn btn-outline btn-primary">Back</button>
            <button onClick={() =>handleExercise()} className="btn btn-outline btn-success">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}



export default StartTraining;