import './index.css';
import Header from './Header';
import { use, useState } from 'react';

function Profile()  {

  const [bmi, setBmi] = useState(0);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [hwr, setHwr] = useState(0);
  const [hip, setHip] = useState(0);
  const [waist, setWaist] = useState(0);
  const [calories, setCalories] = useState(0);
  const[failureHeight,setFailureHeight] = useState(false)
  const[failureWeight,setFailureWeight] = useState(false)
  const[failureHip,setFailureHip] = useState(false)
  const[failureWaist,setFailureWaist] = useState(false)

   const handleBmi = () => {
      setBmi(weight/(height*height/100))
   }

   const handleHeight =(e) =>{
    if(e.target.value < 100){
      setFailureHeight(true)
    }
    else{
      setHeight(e.target.value)
      handleBmi()
      setFailureHeight(false)
    }
   }

   const handleWeight =(e) =>{
    if(e.target.value < 20) {
      setFailureWeight(true)
    }
    else {
      setWeight(e.target.value)
      console.log(e.target.value)
      handleBmi()
      setFailureWeight(false)
    } 
  }

   const handleHwr = () => {
    setHwr(hip/waist)
   }

   const handleHip = (e) =>{
    if(e.target.value < 50) {
      setFailureHip(true)
    }
    else{
      setHip(e.target.value)
      handleHwr()
      setFailureHip(false)
    }
    
   }
   
   const handleWaist = (e) =>{
    if(e.target.value < 20) {
      setFailureWaist(true)
    }
    else { 
      setWaist(e.target.value)
      handleHwr()
      setFailureWaist(false)
    }
   }

    return(<div>
        <Header/>
        <div className='min-h-screen flex items-center justify-center'>
            <div className="space-y-4 card sm:w-64 md:w-96 bg-gray-700 shadow-sm p-6 rounded-md">
                <h1 style={{fontWeight:"bold"}}>Profile</h1>
                <div className='grid grid-cols-3 gap-2'>
               <div className='flex flex-col space-y-1  h-15'>
                <h1 style={{textDecoration:"underline"}}>Age</h1>
              <input
                type="text"
                placeholder={"Age: "}
                className="input input-primary"
                id={"age"}
                title="Must be a valid age"
                min="14"
                 max="120"
              />
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
              />
</div>
              </div>
              <h1>Your gender:</h1>
              <div className='flex flex-row space-x-2 items-center justify-center'>
              <button className='btn btn-outline btn-primary w-15  h-9'>Male</button>
              <button className='btn btn-outline btn-primary w-15 h-9'>Female</button>
              </div>

              <div className='flex flex-col space-y-2 items-center justify-center'>
              <h1 style={{color: bmi > 30 ? "red" : bmi > 25 ? "orange" : bmi < 20 ? "yellow" : "green"}}>
                Your BMI: { bmi > 30 ? "Adipoistas": bmi > 25 ? "Overweight" :  bmi < 20 ? "Underweight" :"Normal"} ({Math.round(bmi)}) </h1>
              <h1 style={{color : hwr >= 0.85 ? "red": "green" }}>Your HWR: { hwr >= 0.85 ? "Risk": "Good"}</h1>
</div>
               

                 <select defaultValue="Activity level" className="select select-primary">
                    <option disabled={true}>Activity level</option>
                     <option>Not active</option>
                    <option>Litte bit active</option>
                    <option>Active</option>
                    <option>Very Active</option>
                </select>

               <h1>Your goals:</h1>
               <div className='flex flex-row space-x-2 items-center justify-center'>
              <button className='btn btn-outline btn-primary w-15 h-9'>Reduce</button>
              <button className='btn btn-outline btn-primary w-15 h-9'>Hold</button>
              <button className='btn btn-outline btn-primary w-15 h-9'>Increase</button>
              </div>
              <div className='flex justify-center'>
              <h1>Your calories: {calories} kcal</h1>
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