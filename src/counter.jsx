import React from 'react';
import { useState, useEffect, useRef } from 'react';
import TemplatePage from './templatepage';
function CounterForm() {
  const marks = Array.from({ length: 12 }, (_, i) => i); // 0–11
  const marks2 = Array.from({ length: 48 }, (_, i) => i); // 0–11
  const [sec, setSec] = useState(0);
  const [min, setMin] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [countRounds, setCountRounds] = useState(0);
  const [breaktime, setBreaktime] = useState(0);
  const [starttime, setStarttime] = useState(0);
  const [roundtime, setRoundTime] = useState(0);
  const [totaltime, setTotalTime] = useState(0);
  const intervalRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [isbreakmode, setIsBreakMode] = useState(false);
  const [isStartmode, setisStartMode] = useState(false);
  const [isStopmode, setisStopMode] = useState(false);

  useEffect(() => {
    const totalSeconds = min * 60 + Math.floor(sec / 6); //Whole time in seconds
    setTotalTime(totalSeconds);
    if (sec == 360) {
      setMin((prevMin) => prevMin + 1);
      setSec(0);
    }
    if (totalSeconds == roundtime && roundtime !== 0 && !isbreakmode) {
      setCountRounds((prevRounds) => prevRounds + 1);
      // Reset for next round
      setSec(0);
      setMin(0);
      setIsBreakMode(true);
    }
    if (rounds !== 0 && countRounds === rounds && !isbreakmode) {
      clearInterval(intervalRef.current);
      setisStopMode(false);
      setisStartMode(true);
    }

    if (totalSeconds == starttime && starttime !== 0 && isStartmode) {
      setSec(0);
      setMin(0);
      setCountRounds(0);
      setisStartMode(false);
    }
    if (totalSeconds == breaktime && breaktime !== 0 && isbreakmode) {
      setSec(0);
      setMin(0);
      setIsBreakMode(false);
    }
  }, [sec, roundtime, countRounds, rounds, min, breaktime, starttime, isbreakmode, isStartmode]);

  const handleStartMode = (e) => {
    if (e > 0) {
      setisStartMode(true);
    }
    if (e == 0) {
      setisStartMode(false);
    }
    console.log(breaktime);
    setStarttime(e);
  };

  const handleBreakMode = (e) => {
    if (e > 0) {
      setBreaktime(e);
    }
  };

  const startCounter = () => {
    intervalRef.current = setInterval(function () {
      setSec((prevSec) => prevSec + 6);
    }, 1000); // every 1000 ms = 1 second
    setisStopMode(true);
  };

  const stopCounter = () => {
    clearInterval(intervalRef.current);
    setisStopMode(false);
  };

  const resetCounter = () => {
    clearInterval(intervalRef.current);
    setSec(0);
    setMin(0);

    setCountRounds(0);
    setBreaktime(0);
    setIsBreakMode(false);
    setisStartMode(false);
    setisStopMode(false);
  };

  const settingsModal = () => {
    return (
      <div className="modal modal-open modal-bottom sm:modal-middle items-center justify-center">
        <div
          className="modal-box border border-blue-500 shadow-xl rounded-xl"
          style={{
            background: 'rgba(10, 20, 40, 0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid #3b82f6',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          }}
        >
          <div className="divider divider-primary text-amber-50 font-bold mb-6">Settings</div>
          <div className="flex flex-col justify-center items-center space-y-4 text-xs">
            <input
              type="range"
              defaultValue={rounds}
              min="0"
              max="100"
              className="range range-xs"
              step="1"
              onChange={() => setRounds(parseInt(event.target.value))}
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
              onChange={() => setRoundTime(parseInt(event.target.value))}
            />
            <h1>Roundtime: {roundtime} s</h1>
          </div>
          <div className="modal-action justify-center">
            <button className="btn btn-secondary rounded-full" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const totalRotation = -180 + sec;
  return (
    <div>
      <TemplatePage>
        {showModal && settingsModal()}
        <div className="flex flex-col items-center justify-center mt-4">
          <div className="divider divider-primary">Manage your workout rounds</div>
          <div className="relative w-60 h-60 border-5 rounded-full border-4 border-green-600 bg-black">
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
                      roundtime - totaltime <= 5 && 'text-red-500'
                    } ${isbreakmode && 'text-purple-500'} ${
                      isStartmode && 'text-yellow-500'
                    } text-xs text-center items-center font-light`}
                  >
                    {String(min).padStart(2, '0')} : {String(Math.floor(sec / 6)).padStart(2, '0')}
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
            <button
              className="btn btn-outline btn-warning rounded-full mt-2 btn-sm flex flex-col items-center"
              onClick={() => setShowModal(true)}
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
            </button>
          </div>
          <div className="divider divider-primary text font-lightfont-bold mb-2"></div>
          <div className="flex- flex row space-x-2 ">
            <button
              disabled={rounds === 0}
              className="btn btn-outline btn-primary rounded-full btn-sm flex flex-col items-center"
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
            </button>
            <button
              className="btn btn-outline btn-secondary rounded-full btn-sm flex flex-col items-center"
              onClick={() => resetCounter()}
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
      </TemplatePage>
    </div>
  );
}

export default CounterForm;
