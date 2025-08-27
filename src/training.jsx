import './index.css';
import Header from './Header';
import {useState } from 'react';

function StartTraining() {
  const training = { 0: [{exercise: "/benchpress.png", sets: 3,reps: 12, weight: 85, set:[12,11,10], setw: [75,74,80]}], 1:[{exercise: "/shoulderpress.png", sets: 3,reps: 12,weight:50,set:[12,11,10], setw: [75,74,80]} ]};
  const [selectedExercise,setExercise] = useState(training[0][0])
  const [idxExercise,setidx] = useState(0)
  const [inputValue, setInputValue] = useState([]);
  const [training1,setTraining] = useState(training)

  const handleExercise = () => {
    if(idxExercise <  Object.keys(training).length-1){
      const newIdx = idxExercise +1
      training1[idxExercise].set = [...inputValue]
      setTraining(training1)
      setidx(newIdx)
      setExercise(training1[newIdx][0])
      console.log(training1)
      setInputValue([])
      console.log(selectedExercise.set.length)
  }
    else{
      training1[idxExercise].set = [...inputValue]
      console.log(training1)
    }
    console.log(inputValue)
    for (let i = 0; i < selectedExercise.set.length; i++) {
      document.getElementById('input'+(i+1)).value = '';
      console.log("TEST")
    }
  }
   const handleExerciseBack = () => {
     if(idxExercise > 0){
    const newIdx = idxExercise -1
    setidx(newIdx)
    setExercise(training1[newIdx][0])
    console.log(idxExercise)
      setInputValue([])
     }
  }

   const addInput = (e,index) => {
    const newinputs = [...inputValue]
    newinputs[index] = e
     setInputValue(newinputs); 
  };

  const increaseWeight = (index) =>{
   const updatedSetw = [...selectedExercise.setw];
  updatedSetw[index] = updatedSetw[index] + 1; // Reduziere den Wert an der angegebenen Stelle
  console.log(index)
  // Erstelle eine Kopie von selectedExercise und ersetze das "setw"-Array
  const updatedExercise = {
    ...selectedExercise,
    setw: updatedSetw
  };

  // Setze den neuen State
  setExercise(updatedExercise);
  }


  const reduceWeight = (index) => {
  // Kopiere das "setw"-Array
  const updatedSetw = [...selectedExercise.setw];
  updatedSetw[index] = updatedSetw[index] - 1; // Reduziere den Wert an der angegebenen Stelle
  console.log(index)
  // Erstelle eine Kopie von selectedExercise und ersetze das "setw"-Array
  const updatedExercise = {
    ...selectedExercise,
    setw: updatedSetw
  };

  // Setze den neuen State
  setExercise(updatedExercise);
};

  return (
    <div>
      <Header />
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 card sm:w-64 md:w-96 bg-gray-700 shadow-sm p-6 rounded-md">
           <figure className="mb-4">
        <img src={selectedExercise.exercise} name={"Benchpress"} className="rounded-md" width="50" height="50" />
      </figure>
          <div className="divider divider-primary">Exercise</div>
          {Array.from({ length: selectedExercise.sets }).map((_, index) => (
            <div className="flex flex-row space-x-3 items-center" key={index}>
              <div className='flex w-18'>
              <input
                type="text"
                placeholder={"Set: " + (index+1)}
                className="input input-primary"
                id={"input" + (index + 1)}
                onBlur={(e) => addInput(parseInt(e.target.value),index)}
              />
              </div>
              
          <div className='flex space-x-2 items-center justify-center'>
          <button onClick={()=>reduceWeight(index)}  className='btn btn-outline btn-primary'>-</button>
          <div>{selectedExercise.setw[index]} kg</div>
          <button onClick={()=>increaseWeight(index)} className='btn btn-outline btn-primary'>+</button>
          </div>
            </div>
          ))}
          <div className="flex space-x-2 items-center justify-center">
            <button disabled = {idxExercise == 0} onClick={() => handleExerciseBack()} className="btn btn-outline btn-primary">Back</button>
            <button  onClick={() =>handleExercise()} className="btn btn-outline btn-success"> {idxExercise == Object.keys(training).length-1 ? "Save" : "Next"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default StartTraining;