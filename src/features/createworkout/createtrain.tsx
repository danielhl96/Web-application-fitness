import '../../index.css';
import Header from '../header/Header.js';
import { JSX, useRef, useEffect } from 'react';
import TemplatePage from '../../shared/Components/templatepage.js';
import ExerciseCard from '../../shared/Components/exercisecard.js';
import Notify from '../../shared/Components/notify.js';
import Input from '../../shared/Components/input.js';
import Button from '../../shared/Components/button.js';
import ExerciseSearchDropdown from '../../shared/Components/ExerciseSearchDropdown.tsx';
import useCreateTrain from './useCreateTrain.ts';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableExerciseCard({ id, children }: { id: string; children: JSX.Element }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}
function CreateTraining(): JSX.Element {
  const {
    workoutName,
    setWorkoutName,
    workoutNameSet,
    confirmWorkoutName,
    selectedExercise,
    addExercise,
    setAddExercise,
    exerciseExists,
    notification,
    setNotification,
    savedSuccessfully,
    handleSaveTraining,
    handleExerciseChange,
    handleRemoveExercise,
    handleRepsChange,
    handleSetsChange,
    changePosition,
    reorderExercise,
    goHome,
    isLoading,
  } = useCreateTrain();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = selectedExercise.findIndex((ex) => ex.name === active.id);
    const toIndex = selectedExercise.findIndex((ex) => ex.name === over.id);
    if (fromIndex !== -1 && toIndex !== -1) reorderExercise(fromIndex, toIndex);
  }

  const lastExerciseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastExerciseRef.current && selectedExercise.length > 0) {
      lastExerciseRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedExercise.length]);

  return (
    <div>
      <Header />
      <TemplatePage>
        {notification && (
          <Notify
            title={notification.title}
            message={notification.message}
            type={notification.type}
            duration={1500}
            onClose={() => setNotification(null)}
          />
        )}
        <div className="divider divider-primary text-white font-bold mb-2 ">
          Create your workout
        </div>
        <div className="flex flex-col items-center max-h-120 space-y-2">
          <h1 className="text-slate-400">Your workout need an name:</h1>
          <div className="flex flex-row">
            <Input
              value={workoutName}
              onDisable={workoutNameSet}
              placeholder="Workout name"
              id="training-input"
              onChange={(e) => setWorkoutName(e)}
            />
            <Button
              disabled={workoutName === ''}
              onClick={confirmWorkoutName}
              border={workoutNameSet ? '#10B981' : '#3b82f6'}
            >
              {workoutNameSet ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              ) : (
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </Button>
          </div>
          {workoutNameSet === true && (
            <div className="flex flex-col items-center space-y-2">
              <h1 className="text-slate-400">Search your exercise:</h1>
              <div className="form-control">
                <ExerciseSearchDropdown
                  value={addExercise}
                  onChange={(value) => setAddExercise(value)}
                  excludeNames={selectedExercise.map((ex) => ex.name)}
                  onSelect={(exerciseName) => handleExerciseChange(exerciseName)}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center max-h-85">
          <div className="divider divider-primary text-white font-bold mb-2">
            {selectedExercise.length > 0 && addExercise.length === 0
              ? 'Your selected exercises'
              : ''}
          </div>
          {/* Render selected exercises */}
          {workoutNameSet ? (
            <div className={'items-center justify-center'}>
              <div
                className={`${selectedExercise.length > 1 ? 'flex grid lg:grid-cols-3 ' : 'flex grid grid-cols-1'} w-full lg:w-200 max-h-65 gap-1 mb-2 items-center pt-1 overflow-y-auto max-md:h-auto`}
              >
                {selectedExercise.length > 0 && addExercise.length === 0 ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={selectedExercise.map((ex) => ex.name)}
                      strategy={rectSortingStrategy}
                    >
                      {selectedExercise.map((exercise, index) => (
                        <SortableExerciseCard key={exercise.name} id={exercise.name}>
                          <div ref={index === selectedExercise.length - 1 ? lastExerciseRef : null}>
                            <ExerciseCard
                              ismaximized={true}
                              ExerciseName={exercise.name}
                              Description={exercise.description}
                              ExerciseImage={exercise.img}
                              reps={exercise.reps}
                              sets={exercise.sets}
                              onRepsChange={(reps) => handleRepsChange(exercise.name, reps)}
                              onSetsChange={(sets) => handleSetsChange(exercise.name, sets)}
                              handleRemoveExercise={() => handleRemoveExercise(exercise.name)}
                              changePosition={(direction) => changePosition(exercise, direction)}
                            />
                          </div>
                        </SortableExerciseCard>
                      ))}
                    </SortableContext>
                  </DndContext>
                ) : selectedExercise.length === 0 && addExercise.length === 0 ? (
                  <p className="text-slate-400 flex justify-center">No exercises selected yet.</p>
                ) : null}
              </div>
            </div>
          ) : null}
          <div className="flex flex-row items-center gap-4 mt-2 mb-0">
            <Button
              isLoading={isLoading}
              disabled={
                workoutName === '' || selectedExercise.length === 0 || workoutNameSet === false
              }
              onClick={() => handleSaveTraining()}
              border={workoutNameSet ? '#10B981' : '#3b82f6'}
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
            <Button onClick={goHome} border="#ef4444">
              {savedSuccessfully ? (
                <>
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
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </>
              ) : (
                <>
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
                </>
              )}
            </Button>
          </div>
        </div>
      </TemplatePage>
    </div>
  );
}

export default CreateTraining;
