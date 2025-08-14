import './index.css';
import Header  from './Header'



function Exercise_cards(name,text){
    return (
        <div className="card w-96 bg-base-100 card-xs shadow-sm">
  <div className="card-body">
    <h2 className="card-title">{name}</h2>
    <figure>
    <img
      src="./public/fitnessstudio.png"
      width="75" height="75"/>
  </figure>
    <p>{text}</p>
    <div className="justify-end card-actions">
      <button className="btn btn-secondary">Remove</button>
    </div>
  </div>
</div>
    )
}

function CreateTrainGUI() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <Header/>
        <p className='text-4xl'> Create your training:</p>
        <label className="input">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                    strokeLinejoin="round"
                    strokeLinecap="round"  
                    strokeWidth="2.5" 
                    fill="none"
                    stroke="currentColor"
                >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                </g>
            </svg>
            <input type="search" className="grow" placeholder="Select your exercise" />
        </label>

        {Exercise_cards("Bench press","A exercise to train the chest, shoulder and triceps")}

        <div class="flex flex-row">
        <button className="btn btn-outline btn-primary">Save</button>
        <button className="btn btn-outline btn-secondary">Cancel</button>
        </div>
        </div>
       
    );
}

export default CreateTrainGUI;
