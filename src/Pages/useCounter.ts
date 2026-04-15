import { useEffect, useReducer, useRef } from 'react';
import { Action } from './types';
type CounterReturn = {
  sec: number;
  min: number;
  rounds: number;
  countRounds: number;
  breaktime: number;
  starttime: number;
  roundtime: number;
  totaltime: number;
  showModal: boolean;
  isbreakmode: boolean;
  isStartmode: boolean;
  isStopmode: boolean;
  startCounter: () => void;
  stopCounter: () => void;
  resetCounter: () => void;
  dispatch: React.Dispatch<{
    type:
      | 'SET_SEC'
      | 'SET_MIN'
      | 'SET_ROUNDS'
      | 'SET_COUNT_ROUNDS'
      | 'SET_BREAKTIME'
      | 'SET_STARTTIME'
      | 'SET_ROUNDTIME'
      | 'SET_TOTALTIME'
      | 'SET_IS_BREAK_MODE'
      | 'SET_IS_START_MODE'
      | 'SET_IS_STOP_MODE'
      | 'INCREMENT_SEC';
    payload?: number | boolean;
  }>;
};

export default function useCounter(): CounterReturn {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  var totalSeconds: number = 0;
  const initalState = {
    sec: 0 as number,
    min: 0 as number,
    rounds: 0 as number,
    countRounds: 0 as number,
    breaktime: 0 as number,
    starttime: 0 as number,
    roundtime: 0 as number,
    totaltime: 0 as number,
    showModal: false as boolean,
    isbreakmode: false as boolean,
    isStartmode: false as boolean,
    isStopmode: false as boolean,
  };

  function reducer(
    state: typeof initalState,
    action: {
      type:
        | 'SET_SEC'
        | 'SET_MIN'
        | 'SET_ROUNDS'
        | 'SET_COUNT_ROUNDS'
        | 'SET_BREAKTIME'
        | 'SET_STARTTIME'
        | 'SET_ROUNDTIME'
        | 'SET_TOTALTIME'
        | 'SET_IS_BREAK_MODE'
        | 'SET_IS_START_MODE'
        | 'SET_IS_STOP_MODE'
        | 'INCREMENT_SEC';
      payload?: number | boolean;
    }
  ): typeof initalState {
    switch (action.type as Action['type']) {
      case 'SET_SEC':
        return { ...state, sec: action.payload as number };
      case 'SET_MIN':
        return { ...state, min: action.payload as number };
      case 'SET_ROUNDS':
        return { ...state, rounds: action.payload as number };
      case 'SET_COUNT_ROUNDS':
        return { ...state, countRounds: action.payload as number };
      case 'SET_BREAKTIME':
        return { ...state, breaktime: action.payload as number };
      case 'SET_STARTTIME':
        return { ...state, starttime: action.payload as number };
      case 'SET_ROUNDTIME':
        return { ...state, roundtime: action.payload as number };
      case 'SET_TOTALTIME':
        return { ...state, totaltime: action.payload as number };
      case 'SET_IS_BREAK_MODE':
        return { ...state, isbreakmode: action.payload as boolean };
      case 'SET_IS_START_MODE':
        return { ...state, isStartmode: action.payload as boolean };
      case 'SET_IS_STOP_MODE':
        return { ...state, isStopmode: action.payload as boolean };
      case 'INCREMENT_SEC': {
        const newSec = state.sec + 6 / 100;
        if (newSec >= 360) {
          return { ...state, sec: 0, min: state.min + 1 };
        }
        return { ...state, sec: newSec };
      }
      default:
        return state;
    }
  }
  const [state, dispatch] = useReducer(reducer, initalState as typeof initalState);

  var {
    roundtime,
    countRounds,
    rounds,
    breaktime,
    starttime,
    isbreakmode,
    isStartmode,
    isStopmode,
  } = state;

  useEffect(() => {
    totalSeconds = state.min * 60 + Math.floor(state.sec / 6); //Whole time in seconds

    dispatch({ type: 'SET_TOTALTIME', payload: totalSeconds });
    if (totalSeconds == roundtime && roundtime !== 0 && !isbreakmode && !isStartmode) {
      dispatch({ type: 'SET_COUNT_ROUNDS', payload: state.countRounds + 1 });
      // Reset for next round
      dispatch({ type: 'SET_SEC', payload: 0 });
      dispatch({ type: 'SET_MIN', payload: 0 });
      dispatch({ type: 'SET_TOTALTIME', payload: 0 });
      if (breaktime > 0) dispatch({ type: 'SET_IS_BREAK_MODE', payload: true });
    }
    if (rounds !== 0 && countRounds === rounds && !isbreakmode && !isStartmode) {
      clearInterval(intervalRef.current ?? undefined);
      dispatch({ type: 'SET_IS_STOP_MODE', payload: false });
      dispatch({ type: 'SET_IS_START_MODE', payload: true });
    }

    if (totalSeconds == starttime && starttime !== 0 && isStartmode) {
      dispatch({ type: 'SET_SEC', payload: 0 });
      dispatch({ type: 'SET_MIN', payload: 0 });
      dispatch({ type: 'SET_COUNT_ROUNDS', payload: 0 });
      dispatch({ type: 'SET_IS_START_MODE', payload: false });
    }
    if (totalSeconds == breaktime && breaktime !== 0 && isbreakmode && !isStartmode) {
      dispatch({ type: 'SET_SEC', payload: 0 });
      dispatch({ type: 'SET_MIN', payload: 0 });
      dispatch({ type: 'SET_IS_BREAK_MODE', payload: false });
    }
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

  const startCounter = () => {
    intervalRef.current = setInterval(function () {
      dispatch({ type: 'INCREMENT_SEC' });
    }, 10); // every 100 ms = 0.1 second
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

  return {
    sec: state.sec,
    min: state.min,
    rounds: state.rounds,
    countRounds: state.countRounds,
    breaktime: state.breaktime,
    starttime: state.starttime,
    roundtime: state.roundtime,
    totaltime: state.totaltime,
    showModal: state.showModal,
    isbreakmode: state.isbreakmode,
    isStartmode: state.isStartmode,
    isStopmode: state.isStopmode,
    startCounter,
    stopCounter,
    resetCounter,
    dispatch,
  };
}
