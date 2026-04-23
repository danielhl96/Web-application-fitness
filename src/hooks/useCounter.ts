import { useEffect, useReducer, useRef } from 'react';
import { Action } from '../types';

// ── State ─────────────────────────────────────────────────────────────────────

type CounterState = {
  sec: number;
  min: number;
  rounds: number;
  countRounds: number;
  breaktime: number;
  starttime: number;
  roundtime: number;
  totaltime: number;
  isbreakmode: boolean;
  isStartmode: boolean;
  isStopmode: boolean;
};

const initialState: CounterState = {
  sec: 0,
  min: 0,
  rounds: 0,
  countRounds: 0,
  breaktime: 0,
  starttime: 0,
  roundtime: 0,
  totaltime: 0,
  isbreakmode: false,
  isStartmode: false,
  isStopmode: false,
};

// ── Reducer ───────────────────────────────────────────────────────────────────

function reducer(state: CounterState, action: Action): CounterState {
  switch (action.type) {
    case 'SET_SEC':
      return { ...state, sec: action.payload };
    case 'SET_MIN':
      return { ...state, min: action.payload };
    case 'SET_ROUNDS':
      return { ...state, rounds: action.payload };
    case 'SET_COUNT_ROUNDS':
      return { ...state, countRounds: action.payload };
    case 'SET_BREAKTIME':
      return { ...state, breaktime: action.payload };
    case 'SET_STARTTIME':
      return { ...state, starttime: action.payload };
    case 'SET_ROUNDTIME':
      return { ...state, roundtime: action.payload };
    case 'SET_TOTALTIME':
      return { ...state, totaltime: action.payload };
    case 'SET_IS_BREAK_MODE':
      return { ...state, isbreakmode: action.payload };
    case 'SET_IS_START_MODE':
      return { ...state, isStartmode: action.payload };
    case 'SET_IS_STOP_MODE':
      return { ...state, isStopmode: action.payload };
    case 'INCREMENT_SEC': {
      const newSec = state.sec + 6 / 100;
      return newSec >= 360 ? { ...state, sec: 0, min: state.min + 1 } : { ...state, sec: newSec };
    }
    default:
      return state;
  }
}

// ── Tick logic (S: pure function, no React, independently testable) ───────────

/**
 * Given the current state, returns the list of Actions that should be
 * dispatched for this tick. No side-effects, no React dependency.
 */
export function tickLogic(state: CounterState): Action[] {
  const totalSeconds = state.min * 60 + Math.floor(state.sec / 6);
  const actions: Action[] = [{ type: 'SET_TOTALTIME', payload: totalSeconds }];

  const { roundtime, countRounds, rounds, breaktime, starttime, isbreakmode, isStartmode } = state;

  // Round completed
  if (totalSeconds === roundtime && roundtime !== 0 && !isbreakmode && !isStartmode) {
    actions.push(
      { type: 'SET_COUNT_ROUNDS', payload: countRounds + 1 },
      { type: 'SET_SEC', payload: 0 },
      { type: 'SET_MIN', payload: 0 },
      { type: 'SET_TOTALTIME', payload: 0 }
    );
    if (breaktime > 0) actions.push({ type: 'SET_IS_BREAK_MODE', payload: true });
  }

  // All rounds completed
  if (rounds !== 0 && countRounds === rounds && !isbreakmode && !isStartmode) {
    actions.push(
      { type: 'SET_IS_STOP_MODE', payload: false },
      { type: 'SET_IS_START_MODE', payload: true }
    );
  }

  // Warmup/start time elapsed
  if (totalSeconds === starttime && starttime !== 0 && isStartmode) {
    actions.push(
      { type: 'SET_SEC', payload: 0 },
      { type: 'SET_MIN', payload: 0 },
      { type: 'SET_COUNT_ROUNDS', payload: 0 },
      { type: 'SET_IS_START_MODE', payload: false }
    );
  }

  // Break time elapsed
  if (totalSeconds === breaktime && breaktime !== 0 && isbreakmode && !isStartmode) {
    actions.push(
      { type: 'SET_SEC', payload: 0 },
      { type: 'SET_MIN', payload: 0 },
      { type: 'SET_IS_BREAK_MODE', payload: false }
    );
  }

  return actions;
}

// ── Return type (I: no dispatch — UI gets concrete setters) ───────────────────

type CounterReturn = {
  sec: number;
  min: number;
  rounds: number;
  countRounds: number;
  breaktime: number;
  starttime: number;
  roundtime: number;
  totaltime: number;
  isbreakmode: boolean;
  isStartmode: boolean;
  isStopmode: boolean;
  startCounter: () => void;
  stopCounter: () => void;
  resetCounter: () => void;
  /** Concrete setters — UI does not need to know Action type names */
  setRounds: (v: number) => void;
  setRoundtime: (v: number) => void;
  setBreaktime: (v: number) => void;
  setStarttime: (v: number) => void;
};

// ── Hook ──────────────────────────────────────────────────────────────────────

export default function useCounter(): CounterReturn {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  // ── Tick effect — delegates logic to pure tickLogic() ──────────────────
  useEffect(() => {
    const actions = tickLogic(state);

    // All-rounds-done: also stop the interval
    if (actions.some((a) => a.type === 'SET_IS_START_MODE')) {
      clearInterval(intervalRef.current ?? undefined);
    }

    actions.forEach((a) => dispatch(a));
  }, [
    state.sec,
    state.roundtime,
    state.countRounds,
    state.rounds,
    state.min,
    state.breaktime,
    state.starttime,
    state.isbreakmode,
    state.isStartmode,
  ]);

  // ── Timer controls ──────────────────────────────────────────────────────
  const startCounter = () => {
    intervalRef.current = setInterval(() => {
      dispatch({ type: 'INCREMENT_SEC' });
    }, 10);
    dispatch({ type: 'SET_IS_STOP_MODE', payload: true });
  };

  const stopCounter = () => {
    clearInterval(intervalRef.current ?? undefined);
    dispatch({ type: 'SET_IS_STOP_MODE', payload: false });
  };

  const resetCounter = () => {
    clearInterval(intervalRef.current ?? undefined);
    dispatch({ type: 'SET_SEC', payload: 0 });
    dispatch({ type: 'SET_MIN', payload: 0 });
    dispatch({ type: 'SET_COUNT_ROUNDS', payload: 0 });
    dispatch({ type: 'SET_TOTALTIME', payload: 0 });
    dispatch({ type: 'SET_IS_BREAK_MODE', payload: false });
    dispatch({ type: 'SET_IS_STOP_MODE', payload: false });
  };

  // ── Concrete setters (I: hides dispatch from UI) ────────────────────────
  const setRounds = (v: number) => dispatch({ type: 'SET_ROUNDS', payload: v });
  const setRoundtime = (v: number) => dispatch({ type: 'SET_ROUNDTIME', payload: v });
  const setBreaktime = (v: number) => dispatch({ type: 'SET_BREAKTIME', payload: v });
  const setStarttime = (v: number) => dispatch({ type: 'SET_STARTTIME', payload: v });

  return {
    sec: state.sec,
    min: state.min,
    rounds: state.rounds,
    countRounds: state.countRounds,
    breaktime: state.breaktime,
    starttime: state.starttime,
    roundtime: state.roundtime,
    totaltime: state.totaltime,
    isbreakmode: state.isbreakmode,
    isStartmode: state.isStartmode,
    isStopmode: state.isStopmode,
    startCounter,
    stopCounter,
    resetCounter,
    setRounds,
    setRoundtime,
    setBreaktime,
    setStarttime,
  };
}
