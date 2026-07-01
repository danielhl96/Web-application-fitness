import Button from '../../shared/Components/button.tsx';
import ExerciseCard from '../../shared/Components/exercisecard.tsx';
import exercise from '../../shared/Components/exercises.ts';
import ExerciseSearchDropdown from '../../shared/Components/ExerciseSearchDropdown.tsx';
import { JSX, useRef, useEffect } from 'react';
import { SelectedExercise, WorkoutPlanMap } from '../../types.ts';
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

interface EditWorkoutPageProps {
  addExercise: string;
  setAddExercise: (value: string) => void;
  selectedExercise: WorkoutPlanMap;
  savekey: string;
  handleAddExercise: (exerciseName: string) => void;
  handleEditWorkout: () => void;
  handleShowModal: (exercise: string) => void;
  changePosition: (element: SelectedExercise, direction: 'up' | 'down') => void;
  reorderExercise: (fromIndex: number, toIndex: number) => void;
  onRepsChange: (index: number, reps: number) => void;
  onSetsChange: (index: number, sets: number) => void;
  onRemoveExercise: (index: number) => void;
  isLoading: boolean;
}

// ── Sortable wrapper for each ExerciseCard ─────────────────────────────────

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

function EditWorkoutPage({
  addExercise,
  setAddExercise,
  selectedExercise,
  savekey,
  handleAddExercise,
  handleEditWorkout,
  handleShowModal,
  changePosition,
  reorderExercise,
  onRepsChange,
  onSetsChange,
  onRemoveExercise,
  isLoading,
}: EditWorkoutPageProps): JSX.Element {
  const currentExercises: SelectedExercise[] = selectedExercise[savekey] ?? [];
  const excludeNames = currentExercises.map((ex) => ex.exercise);
  const lastExerciseRef = useRef<HTMLDivElement>(null);
  const previousLengthRef = useRef<number>(currentExercises.length);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  useEffect(() => {
    if (
      lastExerciseRef.current &&
      currentExercises.length > previousLengthRef.current &&
      currentExercises.length > 0
    ) {
      lastExerciseRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    previousLengthRef.current = currentExercises.length;
  }, [currentExercises.length]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = currentExercises.findIndex((ex, i) => `${ex.exercise}-${i}` === active.id);
    const toIndex = currentExercises.findIndex((ex, i) => `${ex.exercise}-${i}` === over.id);
    if (fromIndex !== -1 && toIndex !== -1) reorderExercise(fromIndex, toIndex);
  }

  return (
    <div>
      <div className="flex flex-col h-130 lg:h-130 lg:w-200 items-center justify-center pt-4 pb-8">
        <div className="flex flex-col w-70 h-auto md:w-80 space-y-2 items-center">
          <ExerciseSearchDropdown
            data-cy="exercise-search-dropdown"
            value={addExercise}
            onChange={setAddExercise}
            excludeNames={excludeNames}
            onSelect={handleAddExercise}
          />
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={currentExercises.map((ex, i) => `${ex.exercise}-${i}`)}
            strategy={rectSortingStrategy}
          >
            <div
              className={`${currentExercises.length > 1 ? 'flex grid lg:grid-cols-3' : 'flex grid grid-cols-1'} items-center gap-2 justify-center overflow-y-auto py-2 lg:w-auto lg:max-h-[65vh]`}
            >
              {currentExercises.map((ex, index) => {
                const id = `${ex.exercise}-${index}`;
                return (
                  <SortableExerciseCard key={id} id={id}>
                    <div ref={index === currentExercises.length - 1 ? lastExerciseRef : null}>
                      <ExerciseCard
                        data-cy-reps={`reps-${ex.exercise}`}
                        data-cy-sets={`sets-${ex.exercise}`}
                        data-cy-exercise-delete-button={`delete-${ex.exercise}`}
                        ismaximized={index === currentExercises.length - 1}
                        ExerciseName={ex.exercise}
                        Description={
                          exercise.find((item) => item.name === ex.exercise)?.description
                        }
                        ExerciseImage={exercise.find((item) => item.name === ex.exercise)?.img}
                        onRepsChange={(reps) => onRepsChange(index, reps)}
                        onSetsChange={(sets) => onSetsChange(index, sets)}
                        handleRemoveExercise={() => onRemoveExercise(index)}
                        changePosition={(direction) => changePosition(ex, direction)}
                        reps={Array.isArray(ex.reps) ? ex.reps[0] : ex.reps}
                        sets={ex.sets}
                      />
                    </div>
                  </SortableExerciseCard>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
        <div className="divider divider-primary"></div>
        <div className="flex flex-row gap-2">
          <Button
            isLoading={isLoading}
            onClick={handleEditWorkout}
            border="#08ad4dff"
            disabled={currentExercises.length === 0}
            data-cy="save-training-button"
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
          <Button
            data-cy="cancel-training-button"
            onClick={() => handleShowModal('')}
            border="#ef4444"
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
