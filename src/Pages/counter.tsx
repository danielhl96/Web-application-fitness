import React, { JSX, useReducer, useEffect, useRef } from 'react';
import TemplatePage from '../Components/templatepage.js';
import Button from '../Components/button.js';
import Header from '../Components/Header.js';
import TemplateModal from '../Components/templatemodal.js';
import { List, useListRef, RowComponentProps } from 'react-window';
import useCounter from './useCounter.ts';
import { Action } from './types.ts';

type NumberActionType = Extract<Action, { payload: number }>['type'];

type TableProps = {
  selectedItem: number;
  type: NumberActionType;
  dispatch: React.Dispatch<Action>;
  string: string;
};
function Table({ selectedItem, type, dispatch, string }: TableProps): JSX.Element {
  const listRef = useListRef(null);
  // Scroll to the selected item when the component mounts
  // We use requestAnimationFrame to ensure the DOM is ready before scrolling
  // We also check if selectedItem is greater than 0 to avoid scrolling to index -1
  // This ensures that when the modal opens, the list will automatically scroll to the currently selected item, providing a better user experience.
  // We also return a cleanup function to cancel the animation frame if the component unmounts before the scroll happens, preventing potential memory leaks.
  useEffect(() => {
    if (selectedItem > 0) {
      const raf = requestAnimationFrame(() => {
        listRef.current?.scrollToRow({
          index: selectedItem - 1,
          align: 'center',
          behavior: 'instant',
        });
      });
      return () => cancelAnimationFrame(raf);
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
          listRef.current?.scrollToRow({ index, align: 'center', behavior: 'smooth' });
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
      rowHeight={50}
      rowComponent={Row}
      rowProps={{}}
      defaultHeight={80}
      className="h-20 lg:h-40 w-30 rounded-xl bg-gray-700/15 shadow-md"
      style={{ scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}
    />
  );
}

function CounterForm(): JSX.Element {
  const marks = Array.from({ length: 12 }, (_, i) => i); // 0–11
  const marks2 = Array.from({ length: 48 }, (_, i) => i); // 0–11
  const [showModal, setShowModal] = React.useState(false);
  const counter = useCounter();

  const settingsModal = (): JSX.Element => {
    return (
      <div>
        <TemplateModal>
          <div className="divider divider-primary text-amber-50 font-bold mb-6">Settings</div>
          <div className="flex flex-col items-center space-y-2 ">
            <div className="grid grid-cols-1 lg:grid-cols-2  text-xs gap-4">
              <Table
                selectedItem={counter.rounds}
                type="SET_ROUNDS"
                dispatch={counter.dispatch}
                string="Rounds: "
              />

              <Table
                selectedItem={counter.starttime}
                type="SET_STARTTIME"
                dispatch={counter.dispatch}
                string="Starttime: "
              />

              <Table
                selectedItem={counter.breaktime}
                type="SET_BREAKTIME"
                dispatch={counter.dispatch}
                string="Breaktime: "
              />

              <Table
                selectedItem={counter.roundtime}
                type="SET_ROUNDTIME"
                dispatch={counter.dispatch}
                string="Roundtime: "
              />
            </div>
          </div>
          <div className="modal-action justify-center">
            <Button border="#3b82f6" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </div>
        </TemplateModal>
      </div>
    );
  };

  const totalRotation = -180 + counter.sec;

  return (
    <div>
      <Header />
      <TemplatePage>
        {showModal && settingsModal()}
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
                      counter.roundtime - counter.totaltime <= 5 &&
                      !counter.isStartmode &&
                      !counter.isbreakmode &&
                      'text-red-500'
                    } ${counter.isbreakmode && 'text-purple-500'} ${
                      counter.isStartmode && 'text-yellow-500'
                    } text-xs text-center items-center font-light`}
                  >
                    {String(counter.min).padStart(2, '0')} :{' '}
                    {String(Math.floor(counter.sec / 6)).padStart(2, '0')}
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
                counter.isbreakmode ? 'bg-purple-500' : 'bg-red-500'
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
              Rounds: {counter.countRounds} / {counter.rounds}
            </h1>
          }

          <div className="flex flex-col items-center space-y-2">
            <Button
              border="#3b82f6"
              onClick={() => {
                setShowModal(true);
              }}
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
              disabled={counter.rounds === 0}
              border="#3b82f6"
              onClick={() => (counter.isStopmode ? counter.stopCounter() : counter.startCounter())}
            >
              {counter.isStopmode ? (
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
            <Button border="#f63b3b" onClick={() => counter.resetCounter()}>
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
