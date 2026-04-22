import Button from './button';
import ExerciseCard from './exercisecard';
import exercise from '../Components/exercises.ts';
import ExerciseSearchDropdown from './ExerciseSearchDropdown';
import { JSX } from 'react';
import { SelectedExercise, WorkoutPlanMap } from '../types';

interface EditWorkoutPageProps {
  addExercise: string;
  setAddExercise: (value: string) => void;
  selectedExercise: WorkoutPlanMap;
  savekey: string;
  handleAddExercise: (exerciseName: string) => void;
  handleEditWorkout: () => void;
  handleShowModal: (exercise: string) => void;
  changePosition: (element: SelectedExercise, direction: 'up' | 'down') => void;
  onRepsChange: (index: number, reps: number) => void;
  onSetsChange: (index: number, sets: number) => void;
  onRemoveExercise: (index: number) => void;
}

function EditWorkoutPage({
  addExercise,
  setAddExercise,
  selectedExercise,
  savekey,
  handleAddExercise,
  handleEditWorkout,
  handleShowModal,
  changePosition,
  onRepsChange,
  onSetsChange,
  onRemoveExercise,
}: EditWorkoutPageProps): JSX.Element {
  const currentExercises: SelectedExercise[] = selectedExercise[savekey] ?? [];
  const excludeNames = currentExercises.map((ex) => ex.exercise);

  return (
    <div>
      <div className="flex flex-col h-130 lg:h-130 lg:w-200 items-center justify-center pt-4 pb-8">
        <div className="flex flex-col w-70 h-auto md:w-80 space-y-2 items-center ">
          <ExerciseSearchDropdown
            value={addExercise}
            onChange={setAddExercise}
            excludeNames={excludeNames}
            onSelect={handleAddExercise}
          />
        </div>
        <div
          className={`${currentExercises.length > 1 ? 'flex grid lg:grid-cols-3 ' : 'flex grid grid-cols-1'} items-center gap-2 justify-center w-full overflow-y-auto py-2 lg:w-auto max-h-90 lg:max-h-[65vh]`}
        >
          {currentExercises.map((ex, index) => (
            <ExerciseCard
              key={ex.exercise + '-' + index}
              ismaximized={index === currentExercises.length - 1}
              ExerciseName={ex.exercise}
              Description={exercise.find((item) => item.name === ex.exercise)?.description}
              ExerciseImage={exercise.find((item) => item.name === ex.exercise)?.img}
              onRepsChange={(reps) => onRepsChange(index, reps)}
              onSetsChange={(sets) => onSetsChange(index, sets)}
              handleRemoveExercise={() => onRemoveExercise(index)}
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
            disabled={currentExercises.length === 0}
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
