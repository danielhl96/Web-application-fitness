import hark from 'hark';

// Tune these constants to balance responsiveness vs. cutting off mid-sentence.
// Threshold guide: background noise ≈ -60..-45 dB | speech ≈ -25..-10 dB
const DEFAULT_THRESHOLD_DB = -45; // dB — below this hark considers it silence
const DEFAULT_SILENCE_DEBOUNCE_MS = 2000; // ms of continuous silence before onSilence fires

export interface VADCallbacks {
  /** Called after continuous silence for silenceDebounceMs */
  onSilence: () => void;
}

export interface VADHandle {
  /**
   * Stops hark AND clears any pending silence debounce timer.
   * Call this wherever you previously called both harkRef.stop() and stopSilenceTimer().
   */
  stop: () => void;
}

export interface VADOptions {
  thresholdDb?: number;
  silenceDebounceMs?: number;
}

/**
 * Starts Voice Activity Detection on the given stream.
 * Returns a VADHandle whose stop() method cancels both hark and the silence debounce timer.
 */
export function startVAD(
  stream: MediaStream,
  callbacks: VADCallbacks,
  options?: VADOptions
): VADHandle {
  const thresholdDb = options?.thresholdDb ?? DEFAULT_THRESHOLD_DB;
  const silenceDebounceMs = options?.silenceDebounceMs ?? DEFAULT_SILENCE_DEBOUNCE_MS;

  let silenceTimer: ReturnType<typeof setTimeout> | null = null;

  const speechEvents = hark(stream, {
    interval: 100,
    threshold: thresholdDb,
    history: 25,
  });

  speechEvents.on('stopped_speaking', () => {
    if (silenceTimer !== null) return; // debounce: ignore if timer already running
    silenceTimer = setTimeout(() => {
      silenceTimer = null;
      callbacks.onSilence();
    }, silenceDebounceMs);
  });

  speechEvents.on('speaking', () => {
    // User started speaking again — cancel the pending silence timer
    if (silenceTimer !== null) {
      clearTimeout(silenceTimer);
      silenceTimer = null;
    }
  });

  return {
    stop: () => {
      if (silenceTimer !== null) {
        clearTimeout(silenceTimer);
        silenceTimer = null;
      }
      speechEvents.stop();
    },
  };
}
