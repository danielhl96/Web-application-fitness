import Button from '../../shared/Components/button';
import TemplateModal from '../../shared/Components/templatemodal';
import { TrainingExercise } from '../../types';

interface LastTrainingModalProps {
  training1: TrainingExercise;
  onClose: () => void;
}

export default function LastTrainingModal({ training1, onClose }: LastTrainingModalProps) {
  return (
    <TemplateModal>
      <div className="flex flex-col justify-center items-center space-y-2 text-xs">
        <div className="grid grid-cols-1 gap-2">
          {training1.reps.map((_, index) => (
            <div
              key={index}
              className="card w-48 h-12 shadow-xl rounded-xl backdrop-blur-lg flex items-center justify-center"
              style={{
                background: 'rgba(0,0,0,0.2)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
            >
              <p className="text-center text-xs">
                Set {index + 1}: {training1.previousReps[index]} Reps, {training1.weights[index]} kg
              </p>
            </div>
          ))}
        </div>
        <Button border="#ef4444ff" onClick={onClose}>
          X
        </Button>
      </div>
    </TemplateModal>
  );
}
