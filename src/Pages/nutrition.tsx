import { useRef, useEffect, useState } from 'react';
import type { FC, CSSProperties, MouseEvent } from 'react';
import ApexCharts from 'apexcharts';

import TemplatePage from '../Components/templatepage';
import Input from '../Components/input.jsx';
import Notify from '../Components/notify.jsx';
import Button from '../Components/button.jsx';
import TemplateModal from '../Components/templatemodal.jsx';
import Header from '../Components/Header.jsx';
import useNutrition from '../hooks/useNutrition.js';
import type { Meal } from '../types';
import AudioRecorder from '../Components/AudioRecorder.js';
import { use } from 'passport';
function Nutrition() {
  const {
    selectedDay,
    setSelectedDay,
    month,
    setMonth,
    year,
    setYear,
    loading,
    loadingMeals,
    dinnerMeals,
    launchMeals,
    breakfastMeals,
    snackMeals,
    meal,
    setMeal,
    mealtype,
    setMealtype,
    calorieFactor,
    setCalorieFactor,
    showModal,
    setShowModal,
    showMeal,
    setShowMeal,
    showFileUpload,
    setShowFileUpload,
    setShowAudioModal,
    showAudioModal,
    showInputSelect,
    setShowInputSelect,
    showEditMeal,
    setShowEditMeal,
    prompt,
    setPrompt,
    loadingProfile,
    notification,
    setNotification,
    deleteMeal,
    handleMeal,
    handleMealFromText,
    handleMealSave,
    handleEditMealSave,
    calculateCalories,
    calculateProteins,
    calculateCarbs,
    calculateFats,
    calculateProteinsGoal,
    calculateFatsGoal,
    calculateCarbsGoal,
  } = useNutrition();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mealToDelete, setMealToDelete] = useState<number | null>(null);

  // ── Sub-components ───────────────────────────────────────────────────────────
  function MacroPieChart({
    protein,
    carbs,
    fats,
  }: {
    protein: number;
    carbs: number;
    fats: number;
  }) {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const options = {
        chart: {
          type: 'pie',
          background: 'transparent',
          width: 110,
        },
        labels: ['P', 'C', 'F'],
        series: [protein, carbs, fats],
        colors: ['#3b82f6', '#f59e42', '#f87171'],

        dataLabels: { enabled: true, style: { colors: ['#fff'], fontSize: '7px' } },
        legend: { show: false, width: 0, position: 'bottom', labels: { colors: '#fff' } },
      };

      const chart = new ApexCharts(chartRef.current, options);
      chart.render();

      return () => {
        chart.destroy();
      };
    }, [protein, carbs, fats]);

    return <div ref={chartRef} />;
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const daysInMonth = (m: number, y: number): number => {
    if (m === 2) return y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0) ? 29 : 28;
    return [4, 6, 9, 11].includes(m) ? 30 : 31;
  };

  // ── Modals ───────────────────────────────────────────────────────────────────
  function modalMeal() {
    return (
      <div>
        <TemplateModal>
          <h3 className="font-bold text-lg text-white mb-4">
            Add {mealtype.charAt(0).toUpperCase() + mealtype.slice(1)}
          </h3>
          <div className="flex flex-col space-y-4">
            <p>{meal.name}</p>
            <input
              type="range"
              onChange={(e) => setCalorieFactor(Number(e.target.value))}
              min={-50}
              max={50}
              value={calorieFactor}
              className="range range-xs"
            />
            <div className="text-xs text-amber-400 text-center">
              Calorie Factor: {calorieFactor}
            </div>
            <p>Calories: {(meal.calories * (1 + calorieFactor / 100)).toFixed(2)} kcal</p>
            <p>Protein: {(meal.protein * (1 + calorieFactor / 100)).toFixed(2)} g</p>
            <p>Carbs: {(meal.carbs * (1 + calorieFactor / 100)).toFixed(2)} g</p>
            <p>Fats: {(meal.fats * (1 + calorieFactor / 100)).toFixed(2)} g</p>
            <div className="flex flex-row space-x-2 justify-center">
              <Button
                border="#3b82f6"
                onClick={() => {
                  setShowMeal(false);
                  handleMealSave();
                }}
              >
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
              <Button border="#3b82f6" onClick={() => setShowMeal(false)}>
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
      </div>
    );
  }

  function modalInputSelect() {
    return (
      <div>
        <TemplateModal>
          {/* Header with close button */}
          <div className="flex items-center justify-between mb-4">
            <div className="font-bold text-lg text-white">Input</div>
            <button
              onClick={() => setShowInputSelect(false)}
              className="text-white/50 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-row gap-3 justify-center">
            {/* Image analysis */}
            <button
              onClick={() => {
                setShowInputSelect(false);
                setShowFileUpload(true);
              }}
              className="flex flex-col w-full items-center gap-1.5 p-3 rounded-xl border border-blue-500 text-white text-xs transition-all duration-200 hover:scale-105 w-20"
              style={{ background: 'rgba(30,41,59,0.35)', backdropFilter: 'blur(8px)' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7h2l2-3h10l2 3h2a1 1 0 011 1v11a1 1 0 01-1 1H3a1 1 0 01-1-1V8a1 1 0 011-1zm9 3a4 4 0 100 8 4 4 0 000-8z"
                />
              </svg>
            </button>

            {/* Audio analysis */}
            <button
              onClick={() => {
                setShowInputSelect(false);
                setShowAudioModal(true);
              }}
              className="flex flex-col w-full items-center gap-1.5 p-3 rounded-xl border border-blue-500 text-white text-xs transition-all duration-200 hover:scale-105"
              style={{ background: 'rgba(30,41,59,0.35)', backdropFilter: 'blur(8px)' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 1a4 4 0 014 4v6a4 4 0 01-8 0V5a4 4 0 014-4zm0 15a8 8 0 008-8H4a8 8 0 008 8zm0 0v3m-3 0h6"
                />
              </svg>
            </button>
          </div>
        </TemplateModal>
      </div>
    );
  }

  function modalAudio() {
    return (
      <div>
        <TemplateModal>
          <div className="flex justify-end mb-4 w-20  ml-30">
            <button
              onClick={() => setShowAudioModal(false)}
              className="text-white/50 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {loading.type === 'loading' ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <span className="loading loading-bars loading-lg"></span>
              <p className="text-xs text-blue-400/70">Analyzing...</p>
            </div>
          ) : (
            <AudioRecorder onTranscript={handleMealFromText} />
          )}
        </TemplateModal>
      </div>
    );
  }

  function handleFileUpload() {
    return (
      <div>
        <TemplateModal>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-white">Nutrition Estimation</h3>
            <button
              className="text-white/50 hover:text-white transition-colors"
              onClick={() => setShowFileUpload(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <input
            type="file"
            accept=".jpeg, .jpg, .png"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleMeal(mealtype, e.target.files?.[0] ?? null)
            }
          />

          <div className="flex flex-row justify-center space-x-2 mb-4">
            {loading.type === 'loading' ? (
              <span className="loading loading-bars loading-xl text-white-400"></span>
            ) : (
              <div className="flex flex-row items-center space-x-2">
                <Input
                  placeholder="Enter an optional description"
                  onChange={setPrompt}
                  w={'w-62'}
                  value={prompt}
                ></Input>
                <Button
                  border="#3b82f6"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7h2l2-3h10l2 3h2a1 1 0 011 1v11a1 1 0 01-1 1H3a1 1 0 01-1-1V8a1 1 0 011-1zm9 3a4 4 0 100 8 4 4 0 000-8z"
                    />
                  </svg>
                </Button>
              </div>
            )}
          </div>
        </TemplateModal>
      </div>
    );
  }

  function modalDate() {
    return (
      <div>
        <TemplateModal>
          <div className="flex flex-col space-y-4">
            <select
              className="select select-primary w-auto max-w-xs shadow-lg border border-blue-400 text-white rounded-xl focus:ring-2 focus:ring-blue-400"
              style={{
                background: 'rgba(30, 41, 59, 0.25)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                border: '1.5px solid #3b82f6',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              value={selectedDay}
              onChange={(e) => setSelectedDay(parseInt(e.target.value))}
            >
              {Array.from({ length: daysInMonth(month, year) }).map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>

            <select
              className="select select-primary w-auto max-w-xs shadow-lg border border-blue-400 text-white rounded-xl focus:ring-2 focus:ring-blue-400"
              style={{
                background: 'rgba(30, 41, 59, 0.25)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                border: '1.5px solid #3b82f6',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
            >
              {Array.from({ length: 12 }).map((_, index) => (
                <option key={index} value={index + 1}>
                  {new Date(0, index).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <select
              className="select select-primary w-auto max-w-xs shadow-lg border border-blue-400 text-white rounded-xl focus:ring-2 focus:ring-blue-400"
              style={{
                background: 'rgba(30, 41, 59, 0.25)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                border: '1.5px solid #3b82f6',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
            >
              {Array.from({ length: 100 }).map((_, index) => (
                <option key={index} value={2026 - index}>
                  {2026 - index}
                </option>
              ))}
            </select>

            <Button border="#3b82f6" onClick={() => setShowModal(false)}>
              OK
            </Button>
          </div>
        </TemplateModal>
      </div>
    );
  }

  function editMeal() {
    return (
      <div>
        <TemplateModal>
          <h3 className="font-bold text-lg text-white mb-4">Edit Meal</h3>
          <div className="flex flex-col space-y-4">
            <p>{meal.name}</p>
            <input
              type="range"
              onChange={(e) => setCalorieFactor(Number(e.target.value))}
              min={-50}
              max={50}
              value={calorieFactor}
              className="range range-xs"
            />
            <div className="text-xs text-amber-400 text-center">
              Calorie Factor: {calorieFactor}
            </div>
            <p>Calories: {(meal.calories * (1 + calorieFactor / 100)).toFixed(2)} kcal</p>
            <p>Protein: {(meal.protein * (1 + calorieFactor / 100)).toFixed(2)} g</p>
            <p>Carbs: {(meal.carbs * (1 + calorieFactor / 100)).toFixed(2)} g</p>
            <p>Fats: {(meal.fats * (1 + calorieFactor / 100)).toFixed(2)} g</p>
            <div className="flex flex-row space-x-2 justify-center">
              <Button
                border="#3b82f6"
                onClick={() => {
                  handleEditMealSave();
                }}
              >
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
              <Button border="#ef4444" onClick={() => setShowEditMeal(false)}>
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
      </div>
    );
  }

  function modalDeleteConfirm() {
    return (
      <div>
        <TemplateModal border="red 1.5px solid">
          <div className="flex flex-col items-center gap-4">
            <p className="text-white text-sm text-center">
              <div className="divider font-bold divider-primary">Delete Meal</div>
              Are you sure you want to delete this meal?
            </p>
            <div className="flex flex-row gap-3">
              <Button
                border="#ef4444"
                onClick={() => {
                  if (mealToDelete !== null) deleteMeal(mealToDelete);
                  setMealToDelete(null);
                }}
              >
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </Button>
              <Button border="#3b82f6" onClick={() => setMealToDelete(null)}>
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
      </div>
    );
  }

  function mealSummary(mealname: string, meals: Meal[]) {
    return (
      <div className="mb-4">
        <div
          className="card w-full  sm:w-80 lg:w-80 h-[20dvh] bg-black/20 border border-blue-500 shadow-xl rounded-xl backdrop-blur-lg cursor-pointer active:bg-blue-500 transition-colors duration-200"
          style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
        >
          <div className="card-body">
            <h2 className="card-title text-blue-400 text-xs">{mealname}</h2>
            <div className="flex flex-col items-center text-xs overflow-y-auto max-h-18">
              <div className="flex flex-col items-center w-full">
                {loadingMeals.type === 'loading' ? (
                  <div className="flex justify-center items-center w-full h-10">
                    <span className="loading loading-bars loading-sm text-white-400" />
                  </div>
                ) : (
                  meals.map((meal, index) => (
                    <p key={index} className="flex flex-row space-x-0 items-center ">
                      <div
                        onClick={() => {
                          setShowEditMeal(true);
                          setMeal(meal);
                        }}
                        className="card w-full bg-black/20 border border-blue-500 shadow-xl rounded-xl mb-2 p-2 flex flex-row justify-between items-center"
                      >
                        <p className="mr-1">{meal.name}</p>
                        <p className="mr-1">Cal: {meal.calories.toFixed(0)}kcal </p>
                        <p className="mr-1">P: {meal.protein.toFixed(0)}g</p>
                        <p className="mr-1">C: {meal.carbs.toFixed(0)}g</p>
                        <p className="mr-1">F: {meal.fats.toFixed(0)}g</p>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMealToDelete(meal.id);
                          }}
                          className="btn btn-outline btn-primary w-8 h-5 shadow-lg backdrop-blur-md border border-blue-400 text-white px-2 py-1  transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400"
                          style={{
                            background: 'rgba(30, 41, 59, 0.25)',
                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                            border: '1.5px solid transparent',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                          }}
                          onMouseEnter={(e: MouseEvent<HTMLButtonElement>) =>
                            (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')
                          }
                          onMouseLeave={(e: MouseEvent<HTMLButtonElement>) =>
                            (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')
                          }
                        >
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </p>
                  ))
                )}
              </div>
            </div>
            <div className="flex justify-end ">
              <button
                onClick={() => {
                  setShowInputSelect(true);
                  setMealtype(mealname.toLowerCase());
                }}
                className="btn btn-outline btn-primary w-2 h-6 shadow-lg backdrop-blur-md border border-blue-400 text-white px-2 py-1 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400"
                style={{
                  background: 'rgba(30, 41, 59, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                  border: '1.5px solid #3b82f6',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                onMouseEnter={(e: MouseEvent<HTMLButtonElement>) =>
                  (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')
                }
                onMouseLeave={(e: MouseEvent<HTMLButtonElement>) =>
                  (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')
                }
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <TemplatePage>
        {showInputSelect && modalInputSelect()}
        {showAudioModal && modalAudio()}
        {showModal && modalDate()}
        {showFileUpload && handleFileUpload()}
        {showMeal && modalMeal()}
        {showEditMeal && editMeal()}
        {mealToDelete !== null && modalDeleteConfirm()}
        {notification && (
          <Notify
            title={notification.title}
            message={notification.message}
            duration={1500}
            key={notification.message + notification.title + Date.now()}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
        <div className="">
          <h1 className="text-2xl font-bold text-white mb-4">Nutrition</h1>
          <div className="divider divider-primary">
            <button
              className="btn btn-outline btn-primary mb-4 shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400"
              style={{
                background: 'rgba(30, 41, 59, 0.25)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                border: '1.5px solid transparent',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e: MouseEvent<HTMLButtonElement>) =>
                (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')
              }
              onMouseLeave={(e: MouseEvent<HTMLButtonElement>) =>
                (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')
              }
              onClick={() => setShowModal(true)}
            >
              {`${selectedDay.toString().padStart(2, '0')}.${month
                .toString()
                .padStart(2, '0')}.${year}`}
            </button>
          </div>
          <div className="overflow-y-auto grid lg:grid-cols-2 lg:gap-6 items-center lg:max-h-[65vh] max-h-[35vh]">
            {mealSummary('Breakfast', breakfastMeals)}
            {mealSummary('Lunch', launchMeals)}
            {mealSummary('Dinner', dinnerMeals)}
            {mealSummary('Snacks', snackMeals)}
          </div>
          <div className="divider divider-primary"></div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-16">
            <div
              className="card w-36 sm:w-36 lg:w-72  h-[18dvh] bg-black/20 border border-blue-500 shadow-xl rounded-xl backdrop-blur-lg cursor-pointer active:bg-blue-500 transition-colors duration-200"
              style={{
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <div className="card-body">
                <div className="flex flex-col">
                  {loadingProfile.type === 'loading' ? (
                    <div className="flex flex-1 justify-center items-center w-full h-full">
                      <span className="loading loading-bars loading-sm text-white-400" />
                    </div>
                  ) : (
                    <div className="carousel rounded-box w-full">
                      {calculateCalories() > 0 && (
                        <div className="carousel-item w-full flex flex-col items-center">
                          <h1 className="text-blue-400 text-xs text-left lg:text-lg mb-2">
                            Summary
                          </h1>

                          <div
                            className={`radial-progress text-xs items-center ${
                              loadingProfile.type === 'success' &&
                              loadingProfile.data.calories - calculateCalories() < 0
                                ? 'text-red-500'
                                : ''
                            } items-center justify-center`}
                            style={
                              {
                                '--value':
                                  loadingProfile.type === 'success'
                                    ? (calculateCalories() / loadingProfile.data.calories) * 100
                                    : 0,
                                '--thickness': '4px',
                              } as CSSProperties
                            }
                            aria-valuenow={100}
                            role="progressbar"
                          >
                            {calculateCalories()} kcal
                          </div>
                        </div>
                      )}
                      <div className="carousel-item w-full">
                        <div className="text-xs ">
                          <h1 className="text-blue-400 lg:text-md mb-2">Calories</h1>
                          <p className="text-white">In: {calculateCalories()}kcal</p>
                          <p className="text-white">
                            Goal:{' '}
                            {loadingProfile.type === 'success' ? loadingProfile.data.calories : 0}
                            kcal
                          </p>
                          <p
                            className={`${loadingProfile.type === 'success' && loadingProfile.data.calories - calculateCalories() < 0 ? 'text-red-500' : ''}`}
                          >
                            Open:{' '}
                            {loadingProfile.type === 'success'
                              ? loadingProfile.data.calories - calculateCalories()
                              : 0}
                            kcal
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Macros card */}
            <div
              className="card w-36 sm:w-36 lg:w-72 h-[18dvh] bg-black/20 border border-blue-500 shadow-xl rounded-xl backdrop-blur-lg cursor-pointer active:bg-blue-500 transition-colors duration-200"
              style={{
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <div className="card-body">
                {loadingProfile.type === 'loading' ? (
                  <div className="flex flex-1 justify-center items-center w-full h-full">
                    <span className="loading loading-bars loading-sm text-white-400" />
                  </div>
                ) : (
                  <div className="carousel rounded-box w-full">
                    <div className="carousel-item w-full ">
                      <div className="text-left text-xs">
                        <h2 className="text-blue-400 lg:text-md mb-2">Open Macros</h2>
                        <p
                          className={` ${
                            calculateProteinsGoal() - calculateProteins() < 0 ? 'text-red-500' : ''
                          } `}
                        >
                          P: {(calculateProteinsGoal() - calculateProteins()).toFixed(0)}g
                        </p>
                        <p
                          className={` ${
                            calculateCarbsGoal() - calculateCarbs() < 0 ? 'text-red-500' : ''
                          } `}
                        >
                          C: {(calculateCarbsGoal() - calculateCarbs()).toFixed(0)}g
                        </p>
                        <p
                          className={` ${
                            calculateFatsGoal() - calculateFats() < 0 ? 'text-red-500' : ''
                          } `}
                        >
                          F: {(calculateFatsGoal() - calculateFats()).toFixed(0)}g
                        </p>
                      </div>
                    </div>
                    <div className="carousel-item w-full ">
                      <div className="text-left text-xs lg:text-md">
                        <h2 className="text-blue-400 lg:text-md mb-2">Goals</h2>
                        <p className=" text-white">P: {calculateProteinsGoal().toFixed(0)} g</p>
                        <p className="text-white">C: {calculateCarbsGoal().toFixed(0)} g</p>
                        <p className="text-white">F: {calculateFatsGoal().toFixed(0)} g</p>
                      </div>
                    </div>
                    {calculateCalories() > 0 && (
                      <div className="carousel-item w-full">
                        <div className="text-left text-xs lg:text-md">
                          <h2 className="text-blue-400 lg:text-md mb-2">Macros (kcal)</h2>
                          <p className="text-white">
                            P: {(calculateProteins() * 4).toFixed(0)} kcal
                          </p>
                          <p className="text-white">C: {(calculateCarbs() * 4).toFixed(0)} kcal</p>
                          <p className="text-white">F: {(calculateFats() * 9).toFixed(0)} kcal</p>
                        </div>
                      </div>
                    )}

                    {calculateCalories() > 0 && (
                      <div className="carousel-item w-full  flex flex-col items-center">
                        <h2 className="text-blue-400 lg:text-md mb-2">Macronutrients</h2>
                        <MacroPieChart
                          protein={calculateProteins()}
                          carbs={calculateCarbs()}
                          fats={calculateFats()}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </TemplatePage>
    </div>
  );
}

export default Nutrition;
