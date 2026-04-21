import { useEffect, useState } from 'react';
import useAudioRecorder from '../hooks/useAudioRecorder';
import Button from './button';

export default function AudioRecorder({ onTranscript }: { onTranscript?: (text: string) => void }) {
  const {
    recorderState,

    start,
    stop,
    pause,
    resume,
    reset,
    isSupported,
    error,
    transcript,
    partialTranscriptLoading,
  } = useAudioRecorder({ onTranscript });

  const [showFinished, setShowFinished] = useState(false);

  useEffect(() => {
    if (recorderState === 'stopped') {
      setShowFinished(true);
      const t = setTimeout(() => setShowFinished(false), 2000);
      return () => clearTimeout(t);
    }
  }, [recorderState]);

  if (!isSupported) {
    return (
      <p className="text-red-400 text-xs">Audio recording is not supported in this browser.</p>
    );
  }

  return (
    <div
      className="flex flex-col items-center gap-4 w-full"
      style={{
        transition: 'opacity 0.4s ease',
        opacity: recorderState === 'stopped' ? 0 : 1,
      }}
    >
      {/* Live transcript box – only visible while recording */}
      {(recorderState === 'recording' || recorderState === 'paused') && (
        <div
          className="w-full rounded-xl overflow-y-auto border border-blue-500/60 p-4 text-sm text-white"
          style={{
            minHeight: '140px',
            maxHeight: '220px',
            background: 'rgba(10, 18, 38, 0.85)',
            boxShadow: '0 8px 32px 0 rgba(59, 130, 246, 0.25)',
            backdropFilter: 'blur(12px)',
            zIndex: 50,
            position: 'relative',
          }}
        >
          {transcript ? (
            <>
              <p className="text-blue-400 mb-1 font-semibold flex items-center gap-2">
                Live ✦
                {partialTranscriptLoading && <span className="loading loading-dots loading-xs" />}
              </p>
              <p
                key={transcript}
                className="leading-relaxed"
                style={{
                  animation: 'fadeSlideIn 0.4s ease both',
                }}
              >
                {transcript}
              </p>
              <style>{`
                @keyframes fadeSlideIn {
                  from { opacity: 0; transform: translateY(4px); }
                  to   { opacity: 1; transform: translateY(0); }
                }
              `}</style>
            </>
          ) : (
            <div className="flex items-center gap-2 text-blue-400/50 italic">
              {partialTranscriptLoading && <span className="loading loading-dots loading-xs" />}
              <p>Listening...</p>
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-row gap-3">
        {/* Start */}
        {recorderState === 'idle' && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              <Button onClick={start} border="#3b82f6">
                {/* Mic icon */}
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
              </Button>
            </div>
          </div>
        )}

        {/* Pause / Resume */}
        {recorderState === 'recording' && (
          <button
            onClick={pause}
            className="btn btn-outline btn-warning px-4 py-2 rounded-xl text-xs"
            style={{ border: '1.5px solid #f59e0b', background: 'rgba(30,41,59,0.25)' }}
          >
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
                d="M10 9v6m4-6v6"
              />
            </svg>
          </button>
        )}
        {recorderState === 'paused' && (
          <button
            onClick={resume}
            className="btn btn-outline btn-success px-4 py-2 rounded-xl text-xs"
            style={{ border: '1.5px solid #22c55e', background: 'rgba(30,41,59,0.25)' }}
          >
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
          </button>
        )}

        {/* Stop */}
        {(recorderState === 'recording' || recorderState === 'paused') && (
          <button
            onClick={stop}
            className="btn btn-outline btn-error px-4 py-2 rounded-xl text-xs"
            style={{ border: '1.5px solid #ef4444', background: 'rgba(30,41,59,0.25)' }}
          >
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
                d="M6 6h12v12H6z"
              />
            </svg>
          </button>
        )}

        {/* Reset */}
        {recorderState === 'stopped' && (
          <>
            <Button onClick={reset} border="#3b82f6" w="w-0" isLoading={false}>
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
            </Button>
          </>
        )}
      </div>

      {/* Error */}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
