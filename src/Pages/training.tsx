import '../index.css';
import type { RefObject } from 'react';
import Header from '../Components/Header.jsx';
import TemplatePage from '../Components/templatepage.jsx';
import WorkoutCard from '../Components/workoutcard.jsx';
import Button from '../Components/button.jsx';
import Notify from '../Components/notify.jsx';
import TemplateModal from '../Components/templatemodal.jsx';
import useTraining from '../hooks/useTraining';
import Table from '../Components/Table.tsx';

import type { TrainingExercise } from '../types';
import loadingComponente from '../Components/loading.js';

// ── Inline modal / sub-view components ───────────────────────────────────────
// These are tightly coupled to the training UI and intentionally kept here.

interface LastTrainingModalProps {
  training1: TrainingExercise;
  onClose: () => void;
}

function LastTrainingModal({ training1, onClose }: LastTrainingModalProps) {
  return (
    <TemplateModal>
      <div className="flex flex-col justify-center items-center space-y-2 text-xs">
        <div className="grid grid-cols-1 gap-2">
          {training1.reps.map((_, index) => (
            <div
              key={index}
              className="card w-48 h-12 shadow-xl rounded-xl backdrop-blur-lg flex items-center justify-center"
              style={{
                background: 'rgba(0,0,0,0.2)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
            >
              <p className="text-center text-xs">
                Set {index + 1}: {training1.previousReps[index]} Reps, {training1.weights[index]} kg
              </p>
            </div>
          ))}
        </div>
        <Button border="#ef4444ff" onClick={onClose}>
          X
        </Button>
      </div>
    </TemplateModal>
  );
}

interface WeightModalProps {
  scrollRef: RefObject<HTMLDivElement | null>;
  scrollRef2: RefObject<HTMLDivElement | null>;
  selectedWeight1: number[];

  idx: number;
  handleWeightSelect: (weight: number) => void;

  changeWeight: (index: number, flag: boolean) => void;
  onClose: () => void;
}

function WeightModal({
  scrollRef,
  selectedWeight1,
  idx,
  handleWeightSelect,
  changeWeight,
  onClose,
}: WeightModalProps) {
  return (
    <TemplateModal>
      <div>
        <div className="flex flex-row justify-center items-center text-xs">
          {/* Whole kg picker (virtualized) */}
          <div ref={scrollRef}>
            <Table
              selectedItem={selectedWeight1[idx] ?? 0}
              onSelect={handleWeightSelect}
              string="Weight: "
              color="bg-blue-500"
            />
          </div>
        </div>

        <div className="modal-action justify-center">
          <Button border="#08ad4dff" onClick={() => changeWeight(idx, false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </Button>
          <Button border="#ef4444ff" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
      </div>
    </TemplateModal>
  );
}

interface BreakTimeModalProps {
  breakTime: number;
  counterisRunning: boolean;
  startCounter: () => void;
  stopCounter: () => void;
  onClose: () => void;
}

function BreakTimeModal({
  breakTime,
  counterisRunning,
  startCounter,
  stopCounter,
  onClose,
}: BreakTimeModalProps) {
  return (
    <TemplateModal>
      <div className="flex flex-col justify-center items-center text-xs">
        <h1 className="text-amber-50 text-xl font-bold mb-2">Take a Break!</h1>
        <p className="text-slate-200 text-xl font-mono mt-2">
          {Math.floor(breakTime / 60)}:{breakTime % 60 < 10 ? `0${breakTime % 60}` : breakTime % 60}
        </p>
        <div className="flex flex-row justify-center items-center gap-1 mt-3">
          <Button onClick={counterisRunning ? stopCounter : startCounter} border="#3b82f6">
            {counterisRunning ? 'Break' : 'Go'}
          </Button>
          <Button onClick={onClose} border="#ef4444ff">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
      </div>
    </TemplateModal>
  );
}

interface ExerciseListModalProps {
  currentExercises: TrainingExercise[];
  training1: TrainingExercise;
  onSelect: (index: number) => void;
  onClose: () => void;
}

function ExerciseListModal({
  currentExercises,
  training1,
  onSelect,
  onClose,
}: ExerciseListModalProps) {
  return (
    <TemplateModal>
      <form method="dialog">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
      </form>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-3 w-full justify-center items-center">
        {currentExercises.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => onSelect(index)}
          >
            <div
              className={`card w-40 h-20 shadow-xl rounded-xl backdrop-blur-lg flex flex-col items-center mb-2 border-2 ${
                item.isFinished ? 'border-green-500' : 'border-blue-800'
              } ${item.exercise === training1.exercise ? 'border-yellow-500' : ''}`}
              style={{
                background: item.isFinished ? 'rgba(34,197,94,0.20)' : 'rgba(0,0,0,0.20)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              }}
            >
              <h2 className="text-amber-400 text-sm">{item.exercise}</h2>
              <figure className="w-9 h-9 mb-2">
                <img
                  src={
                    './' + item.exercise.toLowerCase().replace('-', '').replace(' ', '') + '.png'
                  }
                  className="w-full h-full object-cover rounded-md"
                  style={{ filter: 'invert(1)' }}
                  alt={item.exercise + ' icon'}
                />
              </figure>
            </div>
          </div>
        ))}
      </div>
    </TemplateModal>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

function StartTraining() {
  const {
    navigate,
    planState,
    selectedExercise,
    currentExercises,
    setCurrentExercises,
    training1,
    setTraining,
    idxExercise,
    setidx,
    inputValue,
    selectedTrainingSite,
    setSelectedTrainingSite,
    showModal,
    setShowModal,
    exerciseList,
    setExerciseList,
    showRepsInfo,
    setShowRepsInfo,
    lastTrainingModalValue,
    setLastTrainingModal,
    breakModal,
    setBreakModal,
    breakTime,
    setBreakTime,
    counterisRunning,
    notification,
    setNotification,
    selectedWeight1,

    idx,
    scrollRef,
    scrollRef2,
    selectPlan,
    handleExercise,
    handleExerciseBack,
    addInput,
    handleAddSets,
    handleReduceSets,
    handleModal,
    handleWeightSelect,

    changeWeight,
    startCounter,
    stopCounter,
  } = useTraining();

  return (
    <div>
      <Header />

      {notification && (
        <Notify
          title={notification.title}
          message={notification.message}
          duration={1000}
          key={notification.message + notification.title + Date.now()}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {showModal && (
        <WeightModal
          scrollRef={scrollRef}
          scrollRef2={scrollRef2}
          selectedWeight1={training1 ? training1.weights : [0]}
          idx={idx}
          handleWeightSelect={handleWeightSelect}
          changeWeight={changeWeight}
          onClose={() => setShowModal(false)}
        />
      )}

      {breakModal && (
        <BreakTimeModal
          breakTime={breakTime}
          counterisRunning={counterisRunning}
          startCounter={startCounter}
          stopCounter={stopCounter}
          onClose={() => {
            stopCounter();
            setBreakTime(0);
            setBreakModal(false);
          }}
        />
      )}

      {exerciseList && training1 && (
        <ExerciseListModal
          currentExercises={currentExercises}
          training1={training1}
          onSelect={(index) => {
            setTraining(currentExercises[index]);
            setidx(index);
            setExerciseList(false);
          }}
          onClose={() => setExerciseList(false)}
        />
      )}

      {lastTrainingModalValue && training1 && (
        <LastTrainingModal training1={training1} onClose={() => setLastTrainingModal(false)} />
      )}

      <TemplatePage>
        {/* ── Plan selection ─────────────────────────────────────────────── */}
        {selectedTrainingSite ? (
          <div className="flex flex-col items-center">
            <div className="divider divider-primary text-white font-bold mb-2">
              Select your workout
            </div>
            {planState.type === 'loading' ? (
              <div className="min-h-[50dvh] flex items-center justify-center flex-col">
                {loadingComponente('Loading your workout plans...')}
              </div>
            ) : (
              <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl justify-center flex grid lg:grid-cols-3 gap-4 items-center pt-2 overflow-y-auto max-h-[65vh]">
                {planState.type === 'error' ? (
                  <div className="col-span-3 flex flex-col items-center gap-3 mt-8">
                    <p className="text-red-400 text-sm">{planState.error}</p>
                    <Button onClick={() => navigate(0)} border="#3b82f6">
                      Retry
                    </Button>
                  </div>
                ) : Object.keys(selectedExercise).length > 0 ? (
                  Object.keys(selectedExercise).map((name, index) => (
                    <WorkoutCard key={index} onClick={() => selectPlan(name)}>
                      <h2 className="text-amber-400 font-bold mb-2">{name}</h2>
                      <p className="text-blue-300 font-light text-sm">
                        Exercises: {selectedExercise[name]?.length || 0}
                      </p>
                    </WorkoutCard>
                  ))
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="text-white">
                      No workout plans available. Please create one first.
                    </p>
                    <Button onClick={() => navigate('/createtrain')} border="#3b82f6">
                      Create Workout
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* ── Active exercise view ──────────────────────────────────────── */
          training1 && (
            <div
              className={`space-y-auto justify-center ${training1.isFinished ? 'border-green-500' : 'border-blue-500'}`}
            >
              {/* Edit button when exercise is already finished */}
              {training1.isFinished && (
                <div className="flex flex-top justify-end">
                  <Button
                    onClick={() => {
                      const updated: TrainingExercise = { ...training1, isFinished: false };
                      setTraining(updated);
                      setCurrentExercises((prev) => {
                        const upd = [...prev];
                        upd[idxExercise] = { ...upd[idxExercise], isFinished: false };
                        return upd;
                      });
                    }}
                    border="#3b82f6"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </Button>
                </div>
              )}

              {/* Exercise image */}
              <figure className="flex justify-center mb-4">
                <img
                  style={{ filter: 'invert(1)' }}
                  src={
                    './' +
                    training1.exercise.toLowerCase().replace('-', '').replace(' ', '') +
                    '.png'
                  }
                  className="rounded-md"
                  width="50"
                  height="50"
                  alt={training1.exercise}
                />
              </figure>

              <div className="divider divider-primary text-amber-400">{training1.exercise}</div>

              {/* Sets list */}
              <div className="overflow-y-auto max-h-40 space-y-4 mb-4">
                {Array.from({ length: training1.sets }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center justify-center">
                    <div className="flex flex-row space-x-2">
                      {/* Reps select */}
                      <span className="relative">
                        <select
                          disabled={training1.isFinished}
                          id={'input' + (index + 1)}
                          className="w-28 h-10 px-11 py-0 rounded-xl border border-blue-400 bg-white/10 text-white shadow-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                          style={{
                            background: 'rgba(30, 41, 59, 0.25)',
                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                            border: '1.5px solid rgba(59, 130, 246, 0.25)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            appearance: 'none',
                          }}
                          onChange={(e) => addInput(parseInt(e.target.value), index)}
                          value={
                            inputValue[index] !== undefined
                              ? inputValue[index]
                              : training1.reps[index] || 0
                          }
                        >
                          <option value="" disabled hidden />
                          {Array.from({ length: 25 }, (_, i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </select>
                        <div className="absolute left-1 top-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 text-white"
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
                        </div>
                      </span>

                      {/* Weight button */}
                      <Button
                        disabled={training1.isFinished}
                        onClick={() => handleModal(index, true)}
                        border={training1.isFinished ? '#3b82f6' : '#ffea00ff'}
                        w="w-34"
                      >
                        <img
                          style={{ filter: 'invert(1)' }}
                          src="./barbell.png"
                          className="rounded-md"
                          width="25"
                          height="25"
                          alt="barbell"
                        />
                        {training1.weights[index]} kg
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Set +/- and break controls */}
              <div className="flex space-x-2 items-center justify-center">
                <Button
                  disabled={training1.isFinished}
                  onClick={handleReduceSets}
                  border="#ef4444ff"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </Button>
                <Button disabled={training1.isFinished} onClick={handleAddSets} border="#3b82f6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </Button>
                <Button
                  disabled={training1.isFinished}
                  onClick={() => setBreakModal(true)}
                  border="#3b82f6"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </Button>
                <Button onClick={() => setLastTrainingModal(true)} border="#3b82f6">
                  Last
                </Button>
              </div>

              <div className="divider divider-primary" />

              {/* RM estimation panel */}
              {showRepsInfo && (
                <div
                  className="card w-full mt-2 mb-2 lg:w-full h-[20dvh] bg-gradient-to-b from-gray-900 to-black border shadow-xl rounded-xl backdrop-blur-lg"
                  style={{ border: '1px solid rgba(255,255,255,0.18)' }}
                >
                  <button
                    className="absolute top-2 right-2 text-xs text-blue-300 underline"
                    onClick={() => setShowRepsInfo(false)}
                  >
                    Hide Info
                  </button>
                  <h2 className="text-amber-400 text-center text-sm mb-2 font-bold">
                    Reps Estimation
                  </h2>
                  <div className="grid grid-cols-1 gap-1 text-xs px-1">
                    {(
                      [
                        ['RM: 1', 1],
                        ['RM: 3-4', 0.9],
                        ['RM: 5-6', 0.85],
                        ['RM: 8-10', 0.8],
                        ['RM: 12-15', 0.7],
                      ] as [string, number][]
                    ).map(([label, factor]) => (
                      <div key={label} className="flex justify-between">
                        <span>{label}</span>
                        <span className="font-mono text-blue-300">
                          {(
                            training1.weights[0] *
                            (1 + training1.previousReps[0] / 30) *
                            factor
                          ).toFixed(1)}{' '}
                          kg
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom navigation bar */}
              <div className="flex flex-row space-x-2 absolute bottom-2 left-1/2 -translate-x-1/2">
                <Button onClick={() => setSelectedTrainingSite(true)} border="#ef4444ff">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
                <Button disabled={idxExercise === 0} onClick={handleExerciseBack} border="#3b82f6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 transform scale-x-[-1]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12H9m6 0l-3-3m3 3l-3 3"
                    />
                  </svg>
                </Button>
                <Button onClick={handleExercise} border="#3b82f6">
                  {Object.keys(currentExercises).every(
                    (ex) => currentExercises[Number(ex)].isFinished
                  ) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12H9m6 0l-3-3m3 3l-3 3"
                      />
                    </svg>
                  )}
                </Button>
                <Button onClick={() => setExerciseList(true)} border="#3b82f6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12h18M3 6h18M3 18h18"
                    />
                  </svg>
                </Button>
                <Button border="#3b82f6" onClick={() => setShowRepsInfo(!showRepsInfo)}>
                  RM
                </Button>
              </div>
            </div>
          )
        )}
      </TemplatePage>
    </div>
  );
}

export default StartTraining;
