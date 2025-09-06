import './index.css';
import Header from './Header';
import { useState } from 'react';

function Profile()  {

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
              />
               <input
                type="text"
                placeholder={"Height: "}
                className="input input-primary"
                id={"height"}
                title="Must be a valid height"
                  pattern="^(1[0-9]{2}|2[0-4][0-9]|250)$"
              />
              
               <input
                type="text"
                placeholder={"Avg steps: "}
                className="input input-primary"
                id={"height"}
                title="Must be a valid height"
                  pattern="^(1[0-9]{2}|2[0-4][0-9]|250)$"
              />
              </div>
              
              <div className='flex flex-row space-x-2 items-center justify-center'>
              <button className='btn btn-outline btn-primary w-15'>Male</button>
               <button className='btn btn-outline btn-primary w-15'>Female</button>
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
                     <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7+</option>
                </select>
               <div className='flex flex-row space-x-2 items-center justify-center'>
              <button className='btn btn-outline btn-success w-15'>Save</button>
              <button className='btn btn-outline btn-warning w-15'>Cancel</button>
              </div>
              </div>
              </div>
             
        </div>);
}

export default Profile;