import React from "react";
import { useState, useEffect,useRef } from 'react';
function CounterForm() {
  const marks = Array.from({ length: 12 }, (_, i) => i); // 0–11
  const marks2 = Array.from({ length: 48 }, (_, i) => i); // 0–11
  const [sec, setSec] = useState(0);
  const [min, setMin] = useState(0);
  const [hsec, setHsec] = useState(0);  
  const [rounds,setRounds] = useState(0)
  const [countRounds,setCountRounds] = useState(0)  
  const  [breaktime,setBreaktime] = useState(0)
  const [starttime,setStarttime] = useState(0)  
  const [roundtime,setRoundTime] = useState(0)  
  const intervalRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
 
  useEffect(() => {
    if (sec === 360) {
     setMin(prevMin => prevMin +1);
      setCountRounds(prevRounds => prevRounds + 1);
      setSec(0)
    }
  }, [sec]);


 const startCounter = () => {
     intervalRef.current = setInterval(function() {
      setSec((prevSec) => (prevSec + 6)); // bei 360 wieder 0
      console.log(sec)
    }, 1000); // alle 1000 ms = 1 Sekunde

  }

  const stopCounter = () =>{
    clearInterval(intervalRef.current);
    setSec(0)
    setMin(0)
    setHsec(0)  
  }

  const settingsModal = () => {
    return (
      <div className="modal modal-open modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Settings</h3>
          <div className = "flex flex-col justify-center items-center space-y-4 text-xs">
           <input type="range" defaultValue={0} min="0" max="100" className="range range-xs" step="1" onChange={() => setRounds(parseInt(event.target.value))} />
           <h1>Rounds: {rounds}</h1>
         <input type="range" defaultValue={0} min="0" max="60" className="range range-xs" step="1" onChange={() => setStarttime(parseInt(event.target.value))} />
         <h1> Starttime: {starttime} s </h1>
         <input type="range" defaultValue={0} min="0" max="180" className="range range-xs" step="1" onChange={() => setBreaktime(parseInt(event.target.value))} />
       <h1>Breaktime: {breaktime} s </h1>
       <input type="range" defaultValue={0} min="0" max="180" className="range range-xs" step="1" onChange={() => setRoundTime(parseInt(event.target.value))} />
         <h1>Roundtime: {roundtime} s</h1>
         
         
         
       </div>
          <div className="modal-action">
            <button className="btn" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      </div>
    );
  }

   const totalRotation = -180 + sec; 

  
     

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
  {showModal && settingsModal()}
        <div className="space-y-4 items-center card sm:w-96 md:w-56 bg-gray-800 shadow-sm p-6 rounded-md">
      <div className="relative w-48 h-48 rounded-full border-4 border-green-400">
       {marks.map((_, index) => {
  const angle = index * 30;
  return (
    <React.Fragment key={index}>
      {/* Markierung */}
      <div
        className="absolute left-1/2 top-1/2 w-1 bg-yellow-400 flex items-center justify-center"
        style={{
          height: `15px`,
          transform: `rotate(${angle}deg) translateY(-92px)`,
          transformOrigin: "top",
        }}
        
      />
      
      {/* Zahl */}
      <div
        className="absolute left-1/2 top-1/2 w-1 text-blue-400 text-xs flex items-center justify-center"
        style={{
          transform: `rotate(${angle}deg) translateY(-58px)`,
          transformOrigin: "top",
        }}
      >
    <div
        style={{
          transform: `rotate(${-angle}deg)`,
        }}
      >
        {index === 0 ? 60 : index*5}
      </div>
      </div>
    </React.Fragment>
  );
})}

{marks2.map((_, index) => {
  const angle = index * 8 + 5;
  return (
    <React.Fragment key={index}>
         <div
        className="absolute left-1/2 top-1/2 w-0.5 bg-white flex items-center justify-center"
        style={{
          height: `10px`,
          transform: `rotate(${angle}deg) translateY(-76px)`,
          transformOrigin: "top",
        }}
      />
       
    </React.Fragment>
  );
})}
       {/* Sekundenzeiger */}
        <div className="absolute left-1/2 top-1/2 w-1 bg-red-500 flex items-center justify-center"
        style={{
          height:`50px`,
          transform: `translateX(50%) rotate(${totalRotation}deg)`,
          transformOrigin:"top"
        }}
        
        >
              <div className="absolute left-1/2 top-1/2 w-0 h-0 border-x-9 border-x-transparent border-b-9  border-yellow-500 flex items-center justify-center"
        style={{
           transform: `translateX(-50%) translateY(230%)  rotate(${180}deg)`,
          transformOrigin:"center"
        }}
        ></div>
             <div className="absolute left-1/2 top-1/2 w-1 h-1 rounded-full border-4 border-purple-500 flex items-center justify-center"
        style={{
          height:`6px`,
          width:`6px`,
           transform: `translateX(-50%) translateY(-350%)  rotate(${totalRotation}deg)`,
          transformOrigin:"center"
        }}
        >
        </div>
        </div>
      </div>
      <h1>{min} min : {sec/6} s : {hsec}</h1>
      {<h1>Rounds: {countRounds} / {rounds}</h1>}
      
        <div className="flex flex-col items-center space-y-2">
         <button className="btn btn-outline btn-secondary" onClick={() => setShowModal(true)}>Settings</button>
        </div>
<div className="divider divider-primary text-amber-50 font-bold mb-2"></div>
      <div className = "flex- flex row space-x-2 ">
      <button disabled={rounds === 0}  className = "btn btn-outline btn-primary" onClick={() => startCounter()}>Start</button>
      <button className = "btn btn-outline btn-secondary" onClick={() => stopCounter()}>Reset</button>
    </div>
    </div>
    </div>
  );
}

export default CounterForm;
