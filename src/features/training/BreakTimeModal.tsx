import TemplateModal from '../../shared/Components/templatemodal.js';
import Button from '../../shared/Components/button.js';
interface BreakTimeModalProps {
  breakTime: number;
  counterisRunning: boolean;
  startCounter: () => void;
  stopCounter: () => void;
  onClose: () => void;
}

export default function BreakTimeModal({
  breakTime,
  counterisRunning,
  startCounter,
  stopCounter,
  onClose,
}: BreakTimeModalProps) {
  return (
    <TemplateModal>
      <div className="flex flex-col justify-center items-center text-xs">
        <h1 className="text-amber-50 text-xl font-bold mb-2">Take a Break!</h1>
        <p className="text-slate-200 text-xl font-mono mt-2">
          {Math.floor(breakTime / 60)}:{breakTime % 60 < 10 ? `0${breakTime % 60}` : breakTime % 60}
        </p>
        <div className="flex flex-row justify-center items-center gap-1 mt-3">
          <Button onClick={counterisRunning ? stopCounter : startCounter} border="#3b82f6">
            {counterisRunning ? 'Break' : 'Go'}
          </Button>
          <Button onClick={onClose} border="#ef4444ff">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
      </div>
    </TemplateModal>
  );
}
