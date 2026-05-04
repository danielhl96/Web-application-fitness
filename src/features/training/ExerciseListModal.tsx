import TemplateModal from '../../shared/Components/templatemodal.js';
import { TrainingExercise } from '../../types';

interface ExerciseListModalProps {
  currentExercises: TrainingExercise[];
  training1: TrainingExercise;
  onSelect: (index: number) => void;
  onClose: () => void;
}

export default function ExerciseListModal({
  currentExercises,
  training1,
  onSelect,
  onClose,
}: ExerciseListModalProps) {
  return (
    <TemplateModal>
      <form method="dialog">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
      </form>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-3 w-full justify-center items-center">
        {currentExercises.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => onSelect(index)}
          >
            <div
              className={`card w-40 h-20 shadow-xl rounded-xl backdrop-blur-lg flex flex-col items-center mb-2 border-2 ${
                item.isFinished ? 'border-green-500' : 'border-blue-800'
              } ${item.exercise === training1.exercise ? 'border-yellow-500' : ''}`}
              style={{
                background: item.isFinished ? 'rgba(34,197,94,0.20)' : 'rgba(0,0,0,0.20)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              }}
            >
              <h2 className="text-amber-400 text-sm">{item.exercise}</h2>
              <figure className="w-9 h-9 mb-2">
                <img
                  src={
                    './' + item.exercise.toLowerCase().replace('-', '').replace(' ', '') + '.png'
                  }
                  className="w-full h-full object-cover rounded-md"
                  style={{ filter: 'invert(1)' }}
                  alt={item.exercise + ' icon'}
                />
              </figure>
            </div>
          </div>
        ))}
      </div>
    </TemplateModal>
  );
}
