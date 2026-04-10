import React, { useReducer } from 'react';
import { useState, useEffect, useRef } from 'react';
import TemplatePage from '../Components/templatepage';
import Button from '../Components/button.jsx';
import Header from '../Components/Header.jsx';
import TemplateModal from '../Components/templatemodal.jsx';
function CounterForm() {
  const marks = Array.from({ length: 12 }, (_, i) => i); // 0–11
  const marks2 = Array.from({ length: 48 }, (_, i) => i); // 0–11

  const intervalRef = useRef(null);
  var totalSeconds = 0;
  const initalState = {
    sec: 0,
    min: 0,
    rounds: 0,
    countRounds: 0,
    breaktime: 0,
    starttime: 0,
    roundtime: 0,
    totaltime: 0,
    showModal: false,
    isbreakmode: false,
    isStartmode: false,
    isStopmode: false,
  };

  function reducer(state, action) {
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
      case 'SET_SHOW_MODAL':
        return { ...state, showModal: action.payload };
      case 'SET_IS_BREAK_MODE':
        return { ...state, isbreakmode: action.payload };
      case 'SET_IS_START_MODE':
        return { ...state, isStartmode: action.payload };
      case 'SET_IS_STOP_MODE':
        return { ...state, isStopmode: action.payload };
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

  const [state, dispatch] = useReducer(reducer, initalState);

  useEffect(() => {
    totalSeconds = state.min * 60 + Math.floor(state.sec / 6); //Whole time in seconds

    dispatch({ type: 'SET_TOTALTIME', payload: totalSeconds });
    if (totalSeconds == roundtime && roundtime !== 0 && !isbreakmode) {
      dispatch({ type: 'SET_COUNT_ROUNDS', payload: state.countRounds + 1 });
      // Reset for next round
      dispatch({ type: 'SET_SEC', payload: 0 });
      dispatch({ type: 'SET_MIN', payload: 0 });
      dispatch({ type: 'SET_TOTALTIME', payload: 0 });
      if (breaktime > 0) dispatch({ type: 'SET_IS_BREAK_MODE', payload: true });
    }
    if (rounds !== 0 && countRounds === rounds && !isbreakmode) {
      clearInterval(intervalRef.current);
      dispatch({ type: 'SET_IS_STOP_MODE', payload: false });
      dispatch({ type: 'SET_IS_START_MODE', payload: true });
    }

    if (totalSeconds == starttime && starttime !== 0 && isStartmode) {
      dispatch({ type: 'SET_SEC', payload: 0 });
      dispatch({ type: 'SET_MIN', payload: 0 });
      dispatch({ type: 'SET_COUNT_ROUNDS', payload: 0 });
      dispatch({ type: 'SET_IS_START_MODE', payload: false });
    }
    if (totalSeconds == breaktime && breaktime !== 0 && isbreakmode) {
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

  const handleStartMode = (e) => {
    if (e > 0) {
      dispatch({ type: 'SET_IS_START_MODE', payload: true });
    }
    if (e == 0) {
      dispatch({ type: 'SET_IS_START_MODE', payload: false });
    }
    console.log(breaktime);
    dispatch({ type: 'SET_STARTTIME', payload: e });
  };

  const handleBreakMode = (e) => {
    if (e > 0) {
      dispatch({ type: 'SET_BREAKTIME', payload: e });
    }
  };

  const startCounter = () => {
    intervalRef.current = setInterval(function () {
      dispatch({ type: 'INCREMENT_SEC' });
    }, 10); // every 100 ms = 0.1 second
    dispatch({ type: 'SET_IS_STOP_MODE', payload: true });
  };

  const stopCounter = () => {
    clearInterval(intervalRef.current);
    dispatch({ type: 'SET_IS_STOP_MODE', payload: false });
  };

  const resetCounter = () => {
    clearInterval(intervalRef.current);
    dispatch({ type: 'SET_SEC', payload: 0 });
    dispatch({ type: 'SET_MIN', payload: 0 });
    dispatch({ type: 'SET_COUNT_ROUNDS', payload: 0 });
    dispatch({ type: 'SET_TOTALTIME', payload: 0 });

    dispatch({ type: 'SET_IS_BREAK_MODE', payload: false });
    dispatch({ type: 'SET_IS_START_MODE', payload: false });
    dispatch({ type: 'SET_IS_STOP_MODE', payload: false });
  };

  var {
    sec,
    min,
    roundtime,
    countRounds,
    rounds,
    breaktime,
    starttime,
    isbreakmode,
    isStartmode,
    isStopmode,
  } = state;

  const settingsModal = () => {
    return (
      <div>
        <TemplateModal>
          <div className="divider divider-primary text-amber-50 font-bold mb-6">Settings</div>
          <div className="flex flex-col justify-center items-center space-y-4 text-xs">
            <input
              type="range"
              defaultValue={rounds}
              min="0"
              max="100"
              className="range range-xs"
              step="1"
              onChange={() =>
                dispatch({ type: 'SET_ROUNDS', payload: parseInt(event.target.value) })
              }
            />
            <h1>Rounds: {rounds}</h1>
            <input
              type="range"
              defaultValue={starttime}
              min="0"
              max="60"
              className="range range-xs"
              step="1"
              onChange={() => handleStartMode(parseInt(event.target.value))}
            />
            <h1> Starttime: {starttime} s </h1>
            <input
              type="range"
              defaultValue={breaktime}
              min="0"
              max="180"
              className="range range-xs"
              step="1"
              onChange={() => handleBreakMode(parseInt(event.target.value))}
            />
            <h1>Breaktime: {breaktime} s </h1>
            <input
              type="range"
              defaultValue={roundtime}
              min="0"
              max="180"
              className="range range-xs"
              step="1"
              onChange={() =>
                dispatch({ type: 'SET_ROUNDTIME', payload: parseInt(event.target.value) })
              }
            />
            <h1>Roundtime: {roundtime} s</h1>
          </div>
          <div className="modal-action justify-center">
            <Button
              border="#3b82f6"
              onClick={() => dispatch({ type: 'SET_SHOW_MODAL', payload: false })}
            >
              Close
            </Button>
          </div>
        </TemplateModal>
      </div>
    );
  };

  const totalRotation = -180 + state.sec;

  return (
    <div>
      <Header />
      <TemplatePage>
        {state.showModal && settingsModal()}
        <div className="flex flex-col items-center justify-center mt-4">
          <div className="divider divider-primary text-white font-bold mb-2">Stopwatch</div>
          <div className="relative w-60 h-60 border-8 border-gray-400/10 rounded-full bg-gradient-to-b from-gray-900 to-black">
            {marks.map((_, index) => {
              const angle = index * 30;
              return (
                <React.Fragment key={index}>
                  {/* Marker */}
                  <div
                    className="absolute left-1/2 top-1/2 w-1 bg-yellow-400 flex items-center justify-center"
                    style={{
                      height: `15px`,
                      transform: `rotate(${angle}deg) translateY(-116px)`,
                      transformOrigin: 'top',
                    }}
                  />
                  <h1
                    className={`absolute left-1/2 top-2/3 transform -translate-x-1/2 -translate-y-1/1 ${
                      state.roundtime - state.totaltime <= 5 && 'text-red-500'
                    } ${state.isbreakmode && 'text-purple-500'} ${
                      state.isStartmode && 'text-yellow-500'
                    } text-xs text-center items-center font-light`}
                  >
                    {String(state.min).padStart(2, '0')} :{' '}
                    {String(Math.floor(state.sec / 6)).padStart(2, '0')}
                  </h1>
                  {/* Number */}
                  <div
                    className="absolute left-1/2 top-1/2 w-1 text-blue-400 text-xs flex items-center justify-center"
                    style={{
                      transform: `rotate(${angle}deg) translateY(-100px)`,
                      transformOrigin: 'top',
                    }}
                  >
                    <div
                      style={{
                        transform: `rotate(${-angle}deg)`, //The numbers should not be rotated
                      }}
                    >
                      {index === 0 ? 60 : index * 5}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}

            {marks2.map((_, index) => {
              const angle = index * 8 + 5;
              return (
                <React.Fragment key={index}>
                  <div
                    className="absolute left-1/2 top-1/2 w-0.5 bg-white flex items-center justify-center"
                    style={{
                      height: `10px`,
                      transform: `rotate(${angle}deg) translateY(-116px)`,
                      transformOrigin: 'top',
                    }}
                  />
                </React.Fragment>
              );
            })}
            {/* Secondspointer */}
            <div
              className={`absolute left-1/2 top-1/2 w-1 ${
                isbreakmode ? 'bg-purple-500' : 'bg-red-500'
              } flex items-center justify-center`}
              style={{
                height: `100px`,
                transform: `translateX(50%) rotate(${totalRotation}deg)`,
                transformOrigin: 'top',
              }}
            >
              {/* Pointer Circle */}
              <div
                className="absolute left-1/2 top-1/2 w-1 h-1 rounded-full border-4 border-yellow-500 flex items-center justify-center"
                style={{
                  height: `6px`,
                  width: `6px`,
                  transform: `translateX(-50%) translateY(-725%)  rotate(${totalRotation}deg)`,
                  transformOrigin: 'center',
                }}
              ></div>
            </div>
          </div>

          {
            <h1 className="text font-light mt-2">
              Rounds: {countRounds} / {rounds}
            </h1>
          }

          <div className="flex flex-col items-center space-y-2">
            <Button
              border="#3b82f6"
              onClick={() => dispatch({ type: 'SET_SHOW_MODAL', payload: true })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mb-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Button>
          </div>
          <div className="divider divider-primary text font-lightfont-bold mb-2"></div>
          <div className="flex- flex row space-x-2 ">
            <Button
              disabled={rounds === 0}
              border="#3b82f6"
              onClick={() => (isStopmode ? stopCounter() : startCounter())}
            >
              {isStopmode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mb-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 10h6v4H9z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mb-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </Button>
            <Button border="#f63b3b" onClick={() => resetCounter()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mb-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </Button>
          </div>
        </div>
      </TemplatePage>
    </div>
  );
}

export default CounterForm;
