import './index.css';
import Header from './Header';
import { useState } from 'react';

function Profile()  {

  const [bmi, setBmi] = useState(0);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [hwr, setHwr] = useState(0);
  const [hip, setHip] = useState(0);
  const [waist, setWaist] = useState(0);

   const handleBmi = () => {
      setBmi(weight/(height*height/100))
   }

   const handleHeight =(e) =>{
    setHeight(e.target.value)
    handleBmi()
   }

   const handleWeight =(e) =>{
    setWeight(e.target.value)
    console.log(e.target.value)
    handleBmi()
   }

    return(<div>
        <Header/>
        <div className='min-h-screen flex items-center justify-center'>
            <div className="space-y-4 card sm:w-64 md:w-96 bg-gray-700 shadow-sm p-6 rounded-md">
                <h1>Profile</h1>
                <div className='grid grid-cols-3 gap-2'>
               
              <input
                type="text"
                placeholder={"Age: "}
                className="input input-primary"
                id={"age"}
                title="Must be a valid age"
                min="14"
                 max="120"
              />

               <input
                type="text"
                placeholder={"Weight: "}
                className="input input-primary"
                id={"weight"}
                onChange={(e)=> handleWeight(e)}
              />
               <input
                type="text"
                placeholder={"Height: "}
                className="input input-primary"
                id={"height"}
                title="Must be a valid height"
                  pattern="^(1[0-9]{2}|2[0-4][0-9]|250)$"
                onChange={(e)=> handleHeight(e)}
              />
              
               <input
                type="text"
                placeholder={"Waist:"}
                className="input input-primary"
                id={"waist"}
                title="Must be a valid height"
                  pattern="^(1[0-9]{2}|2[0-4][0-9]|250)$"
              />

               <input
                type="text"
                placeholder={"HIP:"}
                className="input input-primary"
                id={"hip"}
              />

              <input
                type="text"
                placeholder={"BFP:"}
                className="input input-primary"
                id={"bfp"}
              />

              </div>
              <h1>Your gender:</h1>
              <div className='flex flex-row space-x-2 items-center justify-center'>
              <button className='btn btn-outline btn-primary w-15'>Male</button>
              <button className='btn btn-outline btn-primary w-15'>Female</button>
              </div>

              <div className='flex flex-col space-y-2 items-center justify-center'>
              <h1 style={{color: bmi > 30 ? "red" : bmi > 25 ? "orange" : "green"}}>
                Your BMI: { bmi > 30 ? "Adipoistas": bmi > 25 ? "Overweight" : "Normal"} ({Math.round(bmi)}) </h1>
              <h1>Your HWR: { bmi > 30 ? "Adipoistas": bmi > 25 ? "Overweight" : "Normal"}</h1>
</div>
                <select defaultValue="Trainings frequency" className="select select-primary">
                    <option disabled={true}>Trainings frequency</option>
                     <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7+</option>
                </select>

                 <select defaultValue="Activity level" className="select select-primary">
                    <option disabled={true}>Activity level</option>
                     <option>Not active</option>
                    <option>Litte bit active</option>
                    <option>Active</option>
                    <option>Very Active</option>
                </select>

               <h1>Your goals:</h1>
               <div className='flex flex-row space-x-2 items-center justify-center'>
              <button className='btn btn-outline btn-primary w-15'>Reduce</button>
              <button className='btn btn-outline btn-primary w-15'>Hold</button>
              <button className='btn btn-outline btn-primary w-15'>Increase</button>
              </div>

               <div className='flex flex-row space-x-2 items-center justify-center'>
              <button className='btn btn-outline btn-success w-15'>Save</button>
              <button className='btn btn-outline btn-warning w-15'>Cancel</button>
              </div>
              </div>
              </div>
             
        </div>);
}

export default Profile;