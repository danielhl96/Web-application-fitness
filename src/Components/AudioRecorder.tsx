import useAudioRecorder from '../hooks/useAudioRecorder';
import TranscriptBox from './TranscriptBox';
import RecorderControls from './RecorderControls';

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

  if (!isSupported) {
    return (
      <p className="text-red-400 text-xs">Audio recording is not supported in this browser.</p>
    );
  }

  const isActive = recorderState !== 'stopped';

  return (
    <div
      className="flex flex-col items-center gap-4 w-full"
      style={{ transition: 'opacity 0.4s ease', opacity: isActive ? 1 : 0 }}
    >
      {/* Live transcript – only visible while recording or paused */}
      {(recorderState === 'recording' || recorderState === 'paused') && (
        <TranscriptBox
          transcript={transcript}
          partialTranscriptLoading={partialTranscriptLoading}
        />
      )}

      {/* Controls */}
      <RecorderControls
        recorderState={recorderState}
        start={start}
        stop={stop}
        pause={pause}
        resume={resume}
        reset={reset}
      />

      {/* Error */}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
