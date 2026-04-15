import Button from './button';
import Input from './input';
import ExerciseCard from './exercisecard';
import exercise from '../Components/exercises.ts';
import { JSX } from 'react';

function EditWorkoutPage({
  addExercise,
  setaddExercise,
  selectedExercise,
  savekey,
  handleAddExercise,
  setSelectedExercise,
  handleEditWorkout,
  handleShowModal,
  changePosition,
}: {
  addExercise: string;
  setaddExercise: (value: string) => void;
  selectedExercise: any;
  savekey: string;
  handleAddExercise: (exerciseName: string) => void;
  setSelectedExercise: (value: any) => void;
  handleEditWorkout: () => void;
  handleShowModal: (exercise: string) => void;
  changePosition: (element: any, direction: 'up' | 'down') => void;
}): JSX.Element {
  return (
    <div>
      <div className="flex flex-col h-130 lg:h-130 lg:w-200 items-center justify-center pt-4 pb-8">
        <div className="flex flex-col w-70 h-auto md:w-80 space-y-2 items-center ">
          <Input
            placeholder="Add an exercise..."
            value={addExercise}
            onChange={setaddExercise}
            id="input-e"
            w="w-54"
            h="h-10"
          />

          <div
            className={`h-32 overflow-y-scroll border border-gray-800 ${
              exercise.some((ex) => ex.name.toLowerCase().includes(addExercise.toLowerCase())) &&
              addExercise.length > 0
                ? 'block'
                : 'hidden'
            }`}
          >
            {exercise
              .filter(
                (prev) =>
                  prev.name.toLowerCase().includes(addExercise.toLowerCase()) &&
                  !selectedExercise[savekey]?.some((ex) => ex.exercise === prev.name)
              )
              .map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center cursor-pointer max-h-auto overflow-y-auto"
                >
                  <div
                    onClick={() => handleAddExercise(item.name)}
                    className="card w-65 sm:w-40 md:w-60 border border-blue-500 shadow-xl rounded-xl backdrop-blur-lg flex flex-col items-center mb-2"
                    style={{
                      background: 'rgba(0,0,0,0.20)',
                      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                      border: '1px solid rgba(0, 0, 0, 0.18)',
                      padding: '0.5rem',
                    }}
                  >
                    <h2 className="text-amber-400 font-bold mb-2">{item.name}</h2>
                    <figure className="w-6 h-6 mb-2">
                      <img
                        src={item.img}
                        style={{ filter: 'invert(1)' }}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </figure>
                    <h1 className="text-slate-200 font-light text-xs mb-2 text-center ">
                      {item.description}
                    </h1>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div
          className={` ${selectedExercise[savekey].length > 1 ? 'flex grid lg:grid-cols-3 ' : 'flex grid grid-cols-1'} items-center gap-2 justify-center w-full overflow-y-auto py-2 lg:w-auto max-h-90  lg:max-h-[65vh]`}
        >
          {Array.isArray(selectedExercise[savekey]) &&
            selectedExercise[savekey].map((ex, index) => (
              <ExerciseCard
                key={ex.exercise + '-' + index}
                ismaximized={index === selectedExercise[savekey].length - 1 ? true : false}
                ExerciseName={ex.exercise}
                Description={exercise.find((item) => item.name === ex.exercise)?.description}
                ExerciseImage={exercise.find((item) => item.name === ex.exercise)?.img}
                onRepsChange={(reps) => {
                  setSelectedExercise((prev) => {
                    const updated = { ...prev };
                    updated[savekey] = updated[savekey].map((exercise, i) =>
                      i === index ? { ...exercise, reps } : exercise
                    );
                    console.log(updated);
                    return updated;
                  });
                }}
                onSetsChange={(sets) => {
                  setSelectedExercise((prev) => {
                    const updated = { ...prev };
                    updated[savekey] = updated[savekey].map((exercise, i) =>
                      i === index ? { ...exercise, sets } : exercise
                    );
                    console.log(updated);
                    return updated;
                  });
                }}
                handleRemoveExercise={() => {
                  setSelectedExercise((prev: any) => {
                    const updated = { ...prev };
                    updated[savekey] = updated[savekey].filter((_: any, i: number) => i !== index);
                    return updated;
                  });
                }}
                changePosition={(direction) => changePosition(ex, direction)}
                reps={Array.isArray(ex.reps) ? ex.reps[0] : ex.reps}
                sets={ex.sets}
              />
            ))}
        </div>
        <div className="divider divider-primary"></div>
        <div className="flex flex-row gap-2">
          <Button
            onClick={handleEditWorkout}
            border="#08ad4dff"
            disabled={
              Array.isArray(selectedExercise[savekey]) && selectedExercise[savekey].length === 0
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </Button>
          <Button onClick={() => handleShowModal('')} border="#ef4444">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditWorkoutPage;
