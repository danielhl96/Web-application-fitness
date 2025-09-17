import React from "react";
import { useState, useEffect,useRef } from 'react';
function CounterForm() {
  const marks = Array.from({ length: 12 }, (_, i) => i); // 0–11
  const [sec, setSec] = useState(0);
  const [min, setMin] = useState(0);
  const [hsec, setHsec] = useState(0);  
  const intervalRef = useRef(null);
 

 const startCounter = () => {
     intervalRef.current = setInterval(function() {
      setSec((prevSec) => (prevSec + 6) % 360); // bei 360 wieder 0
      if(sec/6 == 59) {
        setMin((prevMin) => (prevMin + 1));
      }
    }, 1000); // alle 1 ms = 0.001 Sekunde

  }

  const stopCounter = () =>{
    clearInterval(intervalRef.current);
    setSec(0)
    setMin(0)
    setHsec(0)  
  }

   const totalRotation = -180 + sec; 
   console.log(sec)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <div className="space-y-4 items-center card sm:w-96 md:w-56 bg-gray-800 shadow-sm p-6 rounded-md">
      <div className="relative w-40 h-40 rounded-full border-4 border-gray-400">
       {marks.map((_, index) => {
  const angle = index * 30;
  return (
    <React.Fragment key={index}>
      {/* Markierung */}
      <div
        className="absolute left-1/2 top-1/2 w-1 bg-gray-400"
        style={{
          height: `15px`,
          transform: `rotate(${angle}deg) translateY(-76px)`,
          transformOrigin: "top",
        }}
      />
      {/* Zahl */}
      <div
        className="absolute left-1/2 top-1/2 w-1.5 text-white text-xs"
        style={{
          transform: `rotate(${angle}deg) translateY(-55px)`,
          transformOrigin: "top",
        }}
      >
        {index === 0 ? 60 : index*5}
      </div>
    </React.Fragment>
  );
})}

       
        <div className="absolute left-1/2 top-1/2 w-1 bg-red-500"
        style={{
          height:`50px`,
          transform: `translateX(50%) rotate(${totalRotation}deg)`,
          transformOrigin:"top"
        }}
        ></div>
    
      </div>
      <h1>{min} : {sec/6} s : {hsec}</h1>
      <div className = "flex- flex row space-x-2 ">
      <button className = "btn btn-outline btn-primary mt-4" onClick={() => startCounter()}>Start</button>
      <button className = "btn btn-outline btn-primary mt-4" onClick={() => stopCounter()}>Reset</button>
    </div>
    </div>
    </div>
  );
}

export default CounterForm;
