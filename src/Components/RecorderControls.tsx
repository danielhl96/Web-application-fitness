import Button from './button';

export type RecorderState = 'idle' | 'recording' | 'paused' | 'stopped';

interface RecorderControlsProps {
  recorderState: RecorderState;
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

interface ControlConfig {
  show: (state: RecorderState) => boolean;
  onClick: () => void;
  border: string;
  extraClass?: string;
  icon: React.ReactNode;
}
// OCP: To add a new control, add an entry here — no changes to the JSX needed.
function buildControls(
  start: () => void,
  stop: () => void,
  pause: () => void,
  resume: () => void,
  reset: () => void
): ControlConfig[] {
  return [
    {
      show: (s) => s === 'idle',
      onClick: start,
      border: '#3b82f6',
      extraClass: 'btn btn-outline px-4 py-2 rounded-xl text-xs',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 1a4 4 0 014 4v6a4 4 0 01-8 0V5a4 4 0 014-4zm0 15a8 8 0 008-8H4a8 8 0 008 8zm0 0v3m-3 0h6"
          />
        </svg>
      ),
    },
    {
      show: (s) => s === 'recording',
      onClick: pause,
      border: '#f59e0b',
      extraClass: 'btn btn-outline btn-warning px-4 py-2 rounded-xl text-xs',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
        </svg>
      ),
    },
    {
      show: (s) => s === 'paused',
      onClick: resume,
      border: '#22c55e',
      extraClass: 'btn btn-outline btn-success px-4 py-2 rounded-xl text-xs',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.752 11.168l-5.197-3.03A1 1 0 008 9v6a1 1 0 001.555.832l5.197-3.03a1 1 0 000-1.664z"
          />
        </svg>
      ),
    },
    {
      show: (s) => s === 'recording' || s === 'paused',
      onClick: stop,
      border: '#ef4444',
      extraClass: 'btn btn-outline btn-error px-4 py-2 rounded-xl text-xs',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6h12v12H6z" />
        </svg>
      ),
    },
    {
      show: (s) => s === 'stopped',
      onClick: reset,
      border: '#3b82f6',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0114.65-3.65M20 15A9 9 0 015.35 18.65"
          />
        </svg>
      ),
    },
  ];
}

export default function RecorderControls({
  recorderState,
  start,
  stop,
  pause,
  resume,
  reset,
}: RecorderControlsProps) {
  const controls = buildControls(start, stop, pause, resume, reset);

  return (
    <div className="flex flex-row gap-3">
      {controls
        .filter((c) => c.show(recorderState))
        .map((c, i) =>
          c.extraClass ? (
            <button
              key={i}
              onClick={c.onClick}
              className={c.extraClass}
              style={{ border: `1.5px solid ${c.border}`, background: 'rgba(30,41,59,0.25)' }}
            >
              {c.icon}
            </button>
          ) : (
            <Button key={i} onClick={c.onClick} border={c.border} w="w-0">
              {c.icon}
            </Button>
          )
        )}
    </div>
  );
}
