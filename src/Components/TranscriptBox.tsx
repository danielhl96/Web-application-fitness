interface TranscriptBoxProps {
  transcript: string;
  partialTranscriptLoading: boolean;
}

export default function TranscriptBox({
  transcript,
  partialTranscriptLoading,
}: TranscriptBoxProps) {
  return (
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
            Live ✦{partialTranscriptLoading && <span className="loading loading-dots loading-xs" />}
          </p>
          <p
            key={transcript}
            className="leading-relaxed"
            style={{ animation: 'fadeSlideIn 0.4s ease both' }}
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
  );
}
