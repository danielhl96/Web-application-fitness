import './index.css';
import Header from './Header';
import {useState } from 'react';

function StartTraining() {
  const training = { 0: [{exercise: "/benchpress.png",name:"Benchpress", sets: 3,reps: 12, weight: 85, set:[12,11,10], setw: [75,74,80]}], 1:[{exercise: "/shoulderpress.png", name:"Shoulderpress", sets: 3,reps: 12,weight:50,set:[12,11,10], setw: [75,74,80]} ]};
  const [selectedExercise,setExercise] = useState(training[0][0])
  const [idxExercise,setidx] = useState(0)
  const [inputValue, setInputValue] = useState([]);
  const [training1,setTraining] = useState(training)
  const[selectedTrainingSite,setSelectedTrainingSite] = useState(true)
  const [showModal, setShowModal] = useState(false);
   const [selectedWeight1, setSelectedWeight1] = useState(null);
 const [selectedWeight2, setSelectedWeight2] = useState(null);
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

  const handleAddSets = () => {
    const updatedSets = selectedExercise.sets + 1;
    const updatedSetw = [...selectedExercise.setw, selectedExercise.setw[selectedExercise.setw.length - 1]]; // Füge einen neuen Eintrag für das neue Set hinzu
    const updatedSet = [...selectedExercise.set, 0]; // Füge einen neuen Eintrag für das neue Set hinzu
     
    const updatedExercise = {
      ...selectedExercise,
      sets: updatedSets,
      setw: updatedSetw,
      set: updatedSet
    };

    setExercise(updatedExercise);
  }

  const handleReduceSets = () => {
    const updatedSets = selectedExercise.sets - 1;
    const updatedSetw = [...selectedExercise.setw];
    updatedSetw.pop(); // Entferne den letzten Eintrag
    const updatedSet = [...selectedExercise.set];
    updatedSet.pop(); // Entferne den letzten Eintrag 
    const updatedExercise = {
      ...selectedExercise,
      sets: updatedSets,
      setw: updatedSetw,
      set: updatedSet
    };
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

  const settingsModal = () => {
    return (
      <div className="modal modal-open modal-bottom sm:modal-middle items-center justify-center">
        <div className="modal-box">
          <div className = "flex flex-col justify-center items-center space-y-4 text-xs">
            <div className ="h-32 overflow-y-scroll border border-gray-800">
              <div className='flex flex-row justify-center items-center'>
            <table className='min-w-2 border-collapse'>
              <thead className='sticky top-0 bg-gray-800 '>
                <tr>
                  <th className='p-2'>kg</th>
                </tr>
              </thead>
<tbody>
{Array.from({ length: 1000 }, (_, i) => i).map((weight, index) => (
  <tr key={index} 
  onClick={() => {setSelectedWeight1(weight)}}
  className={'bg-gray-700'}>
    <td className={`border border-blue-500 p-2 text-center ${selectedWeight1 === weight ? 'bg-blue-600' : ''}`}>{weight}</td>
  </tr>
))}
</tbody>
            </table>
            <div className='divider divider-horizontal'></div>
            <table className='min-w-2 border-collapse'>
              <thead className='sticky top-0 bg-gray-800 '>
                <tr>
                  <th className='p-2'>kg</th>
                </tr>
              </thead>
<tbody>
{Array.from({ length: 1000 }, (_, i) => i*0.25).map((weight, index) => (
  <tr key={index} 
  onClick={() => {setSelectedWeight2(weight)}}
  className={'bg-gray-700'}>
    <td className={`border border-blue-500 p-2 text-center ${selectedWeight2 === weight ? 'bg-blue-600' : ''}`}>{weight}</td>
  </tr>
))}
</tbody>
            </table>
</div>
          </div>
          </div>
          <div className="modal-action justify-center">
      <button className="btn btn-primary rounded-full" onClick={() => setShowModal(false)}>Save</button>
            <button className="btn btn-secondary rounded-full" onClick={() => setShowModal(false)}>Close</button>
          </div>
        <h1>Selected weight:{selectedWeight1+selectedWeight2} kg</h1>
      </div>
       
       </div>
    );
  }

function WorkoutCard({ exercise }) {
    return (
      <div className="card w-full sm:w-80 md:w-[450px]  bg-slate-800 shadow-lg border border-blue-500 mb-4">
        <div className="card-body text-xl items-center  text-center">
          <h2 className="text-amber-50 font-bold mb-2">Workout: {exercise}</h2>
          <div className="flex flex-row justify-center items-center gap-4 mt-2">
            <button onClick={() => setSelectedTrainingSite(false)} className="btn bg-blue-500 hover:bg-blue-600 text-white">Start</button>
           
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      {showModal && settingsModal()}
      <div className="min-h-screen flex items-center bg-slate-900  justify-center pb-8">
      {selectedTrainingSite ? <div className="space-y-4 card w-full max-w-2xl bg-slate-800 border border-blue-500  shadow-sm p-8 rounded-md flex flex-col items-center">
        <div className="w-full flex flex-col gap-4 items-center">
          <div className="divider divider-primary text-amber-50 font-bold mb-2 ">Select your workout</div>
          {Object.keys(training1).map((exercise, index) => (
            <WorkoutCard exercise={exercise} key={index} />
          ))}
        </div>
      </div> :
        <div className="space-y-4 card sm:w-64 md:w-96 bg-gray-800 shadow-sm p-6 rounded-md border border-blue-500">
           <figure className="mb-4">
        <img src={selectedExercise.exercise} name={"Benchpress"} className="rounded-md" width="50" height="50" />
      </figure>
          <div className="divider divider-primary">{selectedExercise.name}</div>
          {Array.from({ length: selectedExercise.sets }).map((_, index) => (
            <div className="flex flex-row space-x-3 items-center justify-center" key={index}>
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
          <button onClick={() => handleReduceSets()} className="btn btn-outline btn-secondary">- Set</button>
             <button onClick={() => handleAddSets()} className="btn btn-outline btn-primary">+ Set</button>
             </div>
          <div className="divider divider-primary"></div>
          <div className="flex space-x-2 items-center justify-center">
            <button disabled = {idxExercise == 0} onClick={() => handleExerciseBack()} className="btn btn-outline btn-primary">Back</button>
            <button  onClick={() =>handleExercise()} className="btn btn-outline btn-success"> {idxExercise == Object.keys(training).length-1 ? "Save" : "Next"}</button>
          <button onClick={() => setShowModal(true)} className="btn btn-outline btn-warning">History</button>
          </div>
        </div>
}
      </div>
    </div>
   
       
);
}
export default StartTraining;