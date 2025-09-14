import './index.css';
import Header from './Header';
import { act, useEffect, useState } from 'react';

function Profile()  {

  const [bmi, setBmi] = useState(0);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [hwr, setHwr] = useState(0);
  const [hip, setHip] = useState(0);
  const [waist, setWaist] = useState(0);
  const [goal, setGoal] = useState(0);
  const [bfp, setBFP] = useState(0);
  const[gender,setGender] = useState("")
  const [age,setAge] = useState(0);
  const [calories, setCalories] = useState(0);
  const [activity,setActivity] = useState(0.0)
  const[failureHeight,setFailureHeight] = useState(false)
  const[failureWeight,setFailureWeight] = useState(false)
  const[failureHip,setFailureHip] = useState(false)
  const[failureWaist,setFailureWaist] = useState(false)
   const[failureAge,setFailureAge] = useState(false)
     const[failureBFP,setFailureBFP] = useState(false)


   const handleBmi = () => {
      setBmi(weight/(height/100*height/100))
   }

   const handleAge =(e) => {
    const value = parseFloat(e.target.value);
    if(value <= 0 || isNaN(value)){
      setFailureAge(true)
    }
    else{
      setAge(value)
      setFailureAge(false)
    }
   }
   const handleActivity =(activity) => {
    setActivity(activity)
   } 

   const handleHeight =(e) =>{
    const value = parseFloat(e.target.value);
    if(value < 100 || isNaN(value)){
      setFailureHeight(true)
    }
    else{
      setHeight(e.target.value)
      setFailureHeight(false)
    }
   }

   const handleWeight =(e) =>{
    const value = parseFloat(e.target.value);
    if(value < 20 || isNaN(value)) {
      setFailureWeight(true)
    }
    else {
      setWeight(e.target.value)
      console.log(e.target.value)
      setFailureWeight(false)
    } 
  }

   const handleHwr = () => {
    setHwr(waist/hip)
   }

   const handleHip = (e) =>{
    const value = parseFloat(e.target.value);
    if(value < 50 || isNaN(value)) {
      setFailureHip(true)
    }
    else{
      setHip(e.target.value)
      handleHwr()
      setFailureHip(false)
    }
    
   }
   
   const handleWaist = (e) =>{
    const value = parseFloat(e.target.value);
    if(value < 20 || isNaN(value)) {
      setFailureWaist(true)
    }
    else { 
      setWaist(e.target.value)
      handleHwr()
      setFailureWaist(false)
    }
   }

   const handleGender = (gender) => {
    setGender(gender)
   }

   const handleGoal = (goal) =>{
    setGoal(goal)
   }

   const handleBFP =( e) => {
     const value = parseFloat(e.target.value);
      if(value <= 0 || isNaN(value)) {
      setFailureBFP(true)
    }
    else { 
      setBFP(e.target.value)
      setFailureBFP(false)
    }
   }

   const calcCalories =() => {
    let l = 0
    if(goal == 1){
      l -= weight*0.01*1000
    }
    if(goal == 3) {
      l += 200
    }
    if(gender == "male"){
    setCalories(((weight*10)+(6.25*height)-(5*age)+5)*activity+l)
    }
    else if(gender == "female"){
    setCalories(((weight*10)+(6.25*height)-(5*age)-161)*activity+l)
    }
   }

  useEffect(() => {
  calcCalories();
}, [gender, weight, height, age,activity,goal]);

  useEffect(() => {handleBmi();},[height,weight]);
   useEffect(() => {handleHwr();},[hip,waist]);

    return(<div>
       
  <div className='min-h-screen flex justify-center bg-slate-900  py-8 pt-24'>
            <div className="space-y-4 card sm:w-64 md:w-96  bg-slate-800 shadow-sm p-6 rounded-md">
                <div className="divider  text-amber-50 font-bold mb-2  divider-neutral">Profile</div>
                <div className='grid grid-cols-3 gap-2'>
               <div className='flex flex-col space-y-1  h-15'>
                <h1 style={{textDecoration:"underline"}}>Age</h1>
              <input
                type="text"
                placeholder={"Age: "}
                className="input input-primary"
                id={"age"}
               onChange={(e) =>handleAge(e)}
              />
              {failureAge && <h1 style={{color:"red",fontSize:8}}>Please enter a valid age</h1> }
          </div>
          <div className='flex flex-col space-y-1 h-15'>
                <h1  style={{textDecoration:"underline"}}>Weight</h1>
               <input
                  type="text"
                  placeholder={"Weight: (kg) "}
                  className="input input-primary"
                  id={"weight"}
                  onChange={(e)=> handleWeight(e)}
              />
             {failureWeight && <h1 style={{color:"red",fontSize:8}}>Please enter a valid weight</h1> }
              </div>
              <div className='flex flex-col space-y-1  h-15'>
                <h1  style={{textDecoration:"underline"}}>Height</h1>
               <input
                  type="text"
                  placeholder={"Height: (cm) "}
                  className="input input-primary"
                  id={"height"}
                  onChange={(e)=> handleHeight(e)}
              />
            {failureHeight && <h1 style={{color:"red",fontSize:8}}>Please enter a valid height</h1> }

                </div>
               <div className='flex flex-col space-y-1  h-15'>
                <h1  style={{textDecoration:"underline"}}>Waist</h1>
               <input
                  type="text"
                  placeholder={"Waist: (cm)"}
                  className="input input-primary"
                  id={"waist"}
                    onChange={(e)=> handleWaist(e)}
              />
              {failureWaist && <h1 style={{color:"red",fontSize:8}}>Please enter a valid waist</h1> }
              </div>
                <div className='flex flex-col space-y-1  h-15'>
                <h1  style={{textDecoration:"underline"}}>Hip</h1>
               <input
                type="text"
                placeholder={"Hip: (cm)"}
                className="input input-primary"
                id={"hip"}
                onChange={(e)=> handleHip(e)}
              />
              {failureHip && <h1 style={{color:"red",fontSize:8}}>Please enter a valid hip</h1> }
</div>
<div className='flex flex-col space-y-1  h-15'>
                <h1  style={{textDecoration:"underline"}}>BFP</h1>
              <input
                type="text"
                placeholder={"BFP: (%)"}
                className="input input-primary"
                id={"bfp"}
                onChange={(e)=> handleBFP(e)}
              />
              {failureBFP && <h1 style={{color:"red",fontSize:8}}>Please enter a valid bfp</h1> }
</div>
              </div>
              <h1>Your gender:</h1>
              <div className='flex flex-row space-x-2 items-center justify-center'>
             <button
        onClick={() => handleGender("male")} style={{color: gender === "male" ? "white" : "black", backgroundColor: gender === "male" ? "black" : "transparent",border: "1px solid black",}}
        className="btn btn-outline w-15 h-9"
      > <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M9 1a1 1 0 0 0 0 2h2.586L8.707 5.879a5 5 0 1 0 1.414 1.414L13 4.414V7a1 1 0 0 0 2 0V1H9zM6 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
  </svg>
        
      </button>
              <button onClick={() => handleGender("female")} style={{color: gender === "female" ? "white" : "black", backgroundColor: gender === "female" ? "black" : "transparent",border: "1px solid black",}} className='btn btn-outline btn-primary w-15 h-9'> <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M8 0a5 5 0 0 0 0 10v1H6a.5.5 0 0 0 0 1h2v2a.5.5 0 0 0 1 0v-2h2a.5.5 0 0 0 0-1H9v-1a5 5 0 0 0 0-10zm0 1a4 4 0 1 1 0 8A4 4 0 0 1 8 1z"/>
  </svg></button>
              </div>

     
              <select
                defaultValue=""
                onChange={(e) => handleActivity(parseFloat(e.target.value))}
                className="select select-primary"
              >
                <option value="" disabled>
                  Activity level
                </option>
                <option value="1.2">Not active</option>
                <option value="1.4">Light activity</option>
                <option value="1.7">Moderate activity</option>
                <option value="2.0">Very active</option>
              </select>

                
                 <div className="divider divider-neutral">Your goals:</div>
               <div className='flex flex-row space-x-2 items-center justify-center'>
              <button onClick={() => handleGoal(1)}  style={{color: goal === 1 ? "white" : "black", backgroundColor: goal === 1 ? "black" : "transparent",border: "1px solid black",}} className='btn btn-outline btn-primary w-15 h-9'>Cut</button>
              <button onClick={() => handleGoal(2)} style={{color: goal === 2 ? "white" : "black", backgroundColor: goal === 2 ? "black" : "transparent",border: "1px solid black",}}  className='btn btn-outline btn-primary w-15 h-9'>Hold</button>
              <button onClick={() => handleGoal(3)} style={{color: goal === 3 ? "white" : "black", backgroundColor: goal === 3 ? "black" : "transparent",border: "1px solid black",}} className='btn btn-outline btn-primary w-15 h-9'>Bulk</button>
              </div>
              <div className="divider divider-neutral">Important values</div>
              <div className='flex justify-center'>
                
                  <div className='flex flex-col space-y-2 items-center justify-center'>
                     
              <h1>Your calories: {calories} kcal</h1>     
              <h1 style={{color: bmi > 30 ? "red" : bmi > 25 ? "orange" : bmi < 20 ? "yellow" : "green"}}>
                Your BMI: { bmi > 30 ? "Adipoistas": bmi > 25 ? "Overweight" :  bmi < 20 ? "Underweight" :"Normal"} ({Math.round(bmi)}) </h1>
              <h1 style={{color : hwr >= 0.85 ? "red": "green" }}>Your HWR: { hwr >= 0.85 ? "Risk": "Good"}</h1></div>
               </div>
               <div className='flex flex-row space-x-2 items-center justify-center'>
              <button disabled = {failureHeight == true || failureHip == true || failureWeight== true || failureWaist == true || failureHip == true} className='btn btn-outline btn-success w-15'>Save</button>
              <button className='btn btn-outline btn-warning w-15'>Cancel</button>
              </div>
              </div>
              </div>
             
        </div>);
}

export default Profile;