import React, { JSX, useReducer, useEffect, useRef } from 'react';
import TemplatePage from '../Components/templatepage.js';
import Button from '../Components/button.js';
import Header from '../Components/Header.js';
import TemplateModal from '../Components/templatemodal.js';
import { List, useListRef, RowComponentProps } from 'react-window';
type Action =
  | {
      type:
        | 'SET_SEC'
        | 'SET_MIN'
        | 'SET_ROUNDS'
        | 'SET_COUNT_ROUNDS'
        | 'SET_BREAKTIME'
        | 'SET_STARTTIME'
        | 'SET_ROUNDTIME'
        | 'SET_TOTALTIME';
      payload: number;
    }
  | {
      type: 'SET_SHOW_MODAL' | 'SET_IS_BREAK_MODE' | 'SET_IS_START_MODE' | 'SET_IS_STOP_MODE';
      payload: boolean;
    }
  | { type: 'INCREMENT_SEC' };

type NumberActionType = Extract<Action, { payload: number }>['type'];

type TableProps = {
  selectedItem: number;
  type: NumberActionType;
  dispatch: React.Dispatch<Action>;
  string: string;
};
function Table({ selectedItem, type, dispatch, string }: TableProps): JSX.Element {
  const listRef = useListRef(null);

  useEffect(() => {
    if (selectedItem > 0) {
      listRef.current?.scrollToRow({
        index: selectedItem - 1,
        align: 'center',
        behavior: 'instant',
      });
    }
  }, []);

  const Row = ({ index, style }: RowComponentProps) => {
    const rep = index + 1;
    return (
      <div
        style={style}
        onClick={() => {
          dispatch({ type: type, payload: rep });
          if (type === 'SET_STARTTIME' && rep !== 0) {
            dispatch({ type: 'SET_IS_START_MODE', payload: true });
          }
        }}
        className={`border border-gray-800 text-xs text-center cursor-pointer flex items-center justify-center ${
          selectedItem === rep
            ? type === 'SET_ROUNDS'
              ? 'bg-blue-600/60 text-blue-100 shadow-lg border-blue-500'
              : type === 'SET_STARTTIME'
                ? 'bg-yellow-500/60 text-yellow-100 shadow-lg border-yellow-400'
                : type === 'SET_BREAKTIME'
                  ? 'bg-purple-600/60 text-purple-100 shadow-lg border-purple-500'
                  : type === 'SET_ROUNDTIME'
                    ? 'bg-green-600/60 text-green-100 shadow-lg border-green-500'
                    : 'bg-black/15'
            : 'bg-black/15 hover:bg-white/10'
        }`}
      >
        {string + rep + (string === 'Rounds: ' ? '' : 's')}
      </div>
    );
  };

  return (
    <List
      listRef={listRef}
      rowCount={600}
      rowHeight={32}
      rowComponent={Row}
      rowProps={{}}
      defaultHeight={80}
      className="h-20 lg:h-40 w-30 rounded-xl bg-gray-700/15 shadow-md"
      style={{ scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}
    />
  );
}

function CounterForm() {
  const marks = Array.from({ length: 12 }, (_, i) => i); // 0–11
  const marks2 = Array.from({ length: 48 }, (_, i) => i); // 0–11

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
        | 'SET_SHOW_MODAL'
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
      case 'SET_SHOW_MODAL':
        return { ...state, showModal: action.payload as boolean };
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

  const settingsModal = (): JSX.Element => {
    return (
      <div>
        <TemplateModal>
          <div className="divider divider-primary text-amber-50 font-bold mb-6">Settings</div>
          <div className="flex flex-col items-center space-y-2 ">
            <div className="grid grid-cols-1 lg:grid-cols-2  text-xs gap-4">
              <Table
                selectedItem={rounds}
                type="SET_ROUNDS"
                dispatch={dispatch}
                string="Rounds: "
              />

              <Table
                selectedItem={starttime}
                type="SET_STARTTIME"
                dispatch={dispatch}
                string="Starttime: "
              />

              <Table
                selectedItem={breaktime}
                type="SET_BREAKTIME"
                dispatch={dispatch}
                string="Breaktime: "
              />

              <Table
                selectedItem={roundtime}
                type="SET_ROUNDTIME"
                dispatch={dispatch}
                string="Roundtime: "
              />
            </div>
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
                      state.roundtime - state.totaltime <= 5 &&
                      !state.isStartmode &&
                      !state.isbreakmode &&
                      'text-red-500'
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
