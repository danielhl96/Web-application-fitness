import TemplatePage from './templatepage';
import api from './api.js';

import { useState, useRef, useEffect, use } from 'react';

function Nutrition() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [showModal, setShowModal] = useState(false);
  const [showMeal, setShowMeal] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [meal, setMeal] = useState(null);
  const [dinnerMeals, setDinnerMeals] = useState([]);
  const [launchMeals, setLaunchMeals] = useState([]);
  const [breakfastMeals, setBreakfastMeals] = useState([]);
  const [snackMeals, setSnackMeals] = useState([]);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [mealtype, setMealtype] = useState('');
  const [calories, setCalories] = useState(0);

  useEffect(() => {
    get_profile();
    getdinnerMeals();
    getlaunchMeals();
    getbreakfastMeals();
    getsnackMeals();
  }, []);

  function get_profile() {
    api.get('/get_profile').then((response) => {
      setCalories(response.data.calories);
    });
  }

  function deleteMeal(mealId) {
    api
      .delete('/delete_meal', {
        data: {
          meal_id: mealId,
        },
      })
      .then(() => {
        getdinnerMeals();
        getlaunchMeals();
        getbreakfastMeals();
        getsnackMeals();
      })
      .catch((error) => {
        console.error('Error deleting meal:', error);
      });
  }

  function getdinnerMeals() {
    api
      .get('/get_meal_dinner', {
        params: {
          date: `${year}-${month.toString().padStart(2, '0')}-${selectedDay
            .toString()
            .padStart(2, '0')}`,
        },
      })
      .then((response) => {
        setDinnerMeals(response.data);
        console.log(response.data);
      });
  }
  function getlaunchMeals() {
    api
      .get('/get_meal_launch', {
        params: {
          date: `${year}-${month.toString().padStart(2, '0')}-${selectedDay
            .toString()
            .padStart(2, '0')}`,
        },
      })
      .then((response) => {
        setLaunchMeals(response.data);
        console.log(response.data);
      });
  }
  function getbreakfastMeals() {
    api
      .get('/get_meal_breakfast', {
        params: {
          date: `${year}-${month.toString().padStart(2, '0')}-${selectedDay
            .toString()
            .padStart(2, '0')}`,
        },
      })
      .then((response) => {
        setBreakfastMeals(response.data);
        console.log(response.data);
      });
  }
  function getsnackMeals() {
    api
      .get('/get_meal_snack', {
        params: {
          date: `${year}-${month.toString().padStart(2, '0')}-${selectedDay
            .toString()
            .padStart(2, '0')}`,
        },
      })
      .then((response) => {
        setSnackMeals(response.data);
        console.log(response.data);
      });
  }

  function calculateCalories() {
    let total = 0;
    dinnerMeals.forEach((meal) => {
      total += meal.calories;
    });
    launchMeals.forEach((meal) => {
      total += meal.calories;
    });
    breakfastMeals.forEach((meal) => {
      total += meal.calories;
    });
    snackMeals.forEach((meal) => {
      total += meal.calories;
    });
    return total;
  }

  function calculateProteins() {
    let total = 0;
    dinnerMeals.forEach((meal) => {
      total += meal.protein;
    });
    launchMeals.forEach((meal) => {
      total += meal.protein;
    });
    breakfastMeals.forEach((meal) => {
      total += meal.protein;
    });
    snackMeals.forEach((meal) => {
      total += meal.protein;
    });
    return total;
  }
  function calculateCarbs() {
    let total = 0;
    dinnerMeals.forEach((meal) => {
      total += meal.carbs;
    });
    launchMeals.forEach((meal) => {
      total += meal.carbs;
    });
    breakfastMeals.forEach((meal) => {
      total += meal.carbs;
    });
    snackMeals.forEach((meal) => {
      total += meal.carbs;
    });
    return total;
  }
  function calculateFats() {
    let total = 0;
    dinnerMeals.forEach((meal) => {
      total += meal.fats;
    });
    launchMeals.forEach((meal) => {
      total += meal.fats;
    });
    breakfastMeals.forEach((meal) => {
      total += meal.fats;
    });
    snackMeals.forEach((meal) => {
      total += meal.fats;
    });
    return total;
  }

  function handleMeal(mealtype, image, prompt) {
    console.log('Handling meal:', mealtype, image, prompt);
    setLoading(true);
    const formData = new FormData();
    formData.append('meal_type', mealtype);
    formData.append('image', image);
    if (prompt) formData.append('prompt', prompt);
    console.log(formData);
    api
      .post('/calculate_meal', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        console.log('Meal created:', response.data);
        setMeal(response.data);
        setShowFileUpload(false);
        setShowMeal(true);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error creating meal:', error);
        setShowFileUpload(false);
        setLoading(false);
      });
  }

  function handleMealSave() {
    console.log('Saving meal:', meal);
    api
      .post('/create_meal', {
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fats: meal.fats,
        mealtype: mealtype,
        date: `${year}-${month.toString().padStart(2, '0')}-${selectedDay
          .toString()
          .padStart(2, '0')}`,
      })
      .then(() => {
        setShowMeal(false);
        getdinnerMeals();
        getlaunchMeals();
        getbreakfastMeals();
        getsnackMeals();
      })
      .catch((error) => {
        console.error('Error saving meal:', error);
      });
  }

  function modalMeal() {
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
          <h3 className="font-bold text-lg text-white mb-4">Add {mealtype} Meal</h3>
          <div className="flex flex-col space-y-4">
            <p>{meal.name}</p>
            <p> Kcal:{meal.calories} </p>
            <p> Protein:{meal.protein}</p>
            <p> Carbs:{meal.carbs}</p>
            <p> Fats:{meal.fats}</p>
            <div className="flex flex-row space-x-2 justify-start">
              <button
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400"
                style={{
                  background: 'rgba(30, 41, 59, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                  border: '1.5px solid #3b82f6',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
                onClick={() => {
                  setShowMeal(false);
                  handleMealSave();
                }}
              >
                Save{' '}
              </button>
              <button
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400"
                style={{
                  background: 'rgba(30, 41, 59, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                  border: '1.5px solid #3b82f6',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
                onClick={() => setShowMeal(false)}
              >
                Close{' '}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function handleFileUpload() {
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
          <h3 className="font-bold text-lg text-white mb-4">Food image upload</h3>
          <input
            type="file"
            accept=".jpeg, .jpg, .png"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={(event) => {
              const file = event.target.files[0];
              console.log(file);
              handleMeal(mealtype, file, '');
            }}
          />

          <div className="flex flex-row justify-center space-x-2 mb-4">
            {loading ? (
              <span className="loading loading-bars loading-xl"></span>
            ) : (
              <button
                className="btn btn-outline w-16 h-16 btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400"
                style={{
                  background: 'rgba(30, 41, 59, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                  border: '1.5px solid #3b82f6',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <figure className="w-5 h-5 mb-2">
                  <img
                    src={'./image.png'}
                    className="w-full h-full object-cover rounded-md filter brightness-0 invert"
                  />
                </figure>
              </button>
            )}
          </div>
          <div className="modal-action">
            <button
              className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400"
              style={{
                background: 'rgba(30, 41, 59, 0.25)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                border: '1.5px solid #3b82f6',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
              onClick={() => setShowFileUpload(false)}
            >
              {' '}
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const daysInMonth = (month, year) => {
    if (month === 2) {
      // Leap year check
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
    }
    return [4, 6, 9, 11].includes(month) ? 30 : 31;
  };

  function modalDate() {
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

            <button
              className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400"
              style={{
                background: 'rgba(30, 41, 59, 0.25)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                border: '1.5px solid #3b82f6',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TemplatePage>
        {showModal && modalDate()}
        {showFileUpload && handleFileUpload()}
        {showMeal && modalMeal()}
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
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
              onClick={() => setShowModal(true)}
            >
              {`${selectedDay}.${month}.${year}`}
            </button>
          </div>

          <div className="flex flex-col space-y-2 overflow-y-auto max-h-85 mb-4">
            <div
              className="card w-full sm:w-80 lg:w-80 h-auto bg-black/20 border border-blue-500 shadow-xl rounded-xl backdrop-blur-lg cursor-pointer active:bg-blue-500 transition-colors duration-200"
              style={{
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <div className="card-body">
                <h2 className="card-title text-blue-400 text-xs">Breakfast</h2>
                <div className="flex flex-col items-center text-xs overflow-y-auto max-h-15">
                  <div className="flex flex-col items-center">
                    {breakfastMeals.map((meal, index) => (
                      <p key={index} className="flex flex-row space-x-1 items-center mr-2">
                        Meal {meal.name}
                        <p>KCAL {meal.calories}</p>
                        <p>P: {meal.protein}</p>
                        <p>C: {meal.carbs}</p>
                        <p>F: {meal.fats}</p>
                        <button
                          onClick={() => {
                            deleteMeal(meal.id);
                          }}
                          className="btn btn-outline btn-primary w-8 h-5 shadow-lg backdrop-blur-md border border-blue-400 text-white px-2 py-1  transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400"
                          style={{
                            background: 'rgba(30, 41, 59, 0.25)',
                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                            border: '1.5px solid transparent',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')
                          }
                          onMouseLeave={(e) =>
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
                      </p>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => {
                      setShowFileUpload(true);
                      setMealtype('breakfast');
                    }}
                    className="btn btn-outline btn-primary w-2 h-6 shadow-lg backdrop-blur-md border border-blue-400 text-white px-2 py-1 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400"
                    style={{
                      background: 'rgba(30, 41, 59, 0.25)',
                      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                      border: '1.5px solid #3b82f6',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div
              className="card w-full sm:w-80 lg:w-80 h-auto bg-black/20 border border-blue-500 shadow-xl rounded-xl backdrop-blur-lg cursor-pointer active:bg-blue-500 transition-colors duration-200"
              style={{
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <div className="card-body">
                <h2 className="card-title text-blue-400 text-xs">Launch</h2>

                <div className="flex flex-col items-center text-xs overflow-y-auto max-h-15">
                  {launchMeals.map((meal, index) => (
                    <p key={index} className="flex flex-row space-x-1 items-center mr-2">
                      Meal {meal.name}
                      <p>KCAL {meal.calories}</p>
                      <p>P: {meal.protein}</p>
                      <p>C: {meal.carbs}</p>
                      <p>F: {meal.fats}</p>
                      <button
                        onClick={() => {
                          deleteMeal(meal.id);
                        }}
                        className="btn btn-outline btn-primary w-8 h-5 shadow-lg backdrop-blur-md border border-blue-400 text-white px-2 py-1  transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400"
                        style={{
                          background: 'rgba(30, 41, 59, 0.25)',
                          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                          border: '1.5px solid transparent',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')
                        }
                        onMouseLeave={(e) =>
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
                    </p>
                  ))}
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => {
                      setShowFileUpload(true);
                      setMealtype('launch');
                    }}
                    className="btn btn-outline btn-primary w-2 h-6 shadow-lg backdrop-blur-md border border-blue-400 text-white px-2 py-1 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400"
                    style={{
                      background: 'rgba(30, 41, 59, 0.25)',
                      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                      border: '1.5px solid #3b82f6',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div
              className="card w-full sm:w-80 lg:w-80 h-auto bg-black/20 border border-blue-500 shadow-xl rounded-xl backdrop-blur-lg cursor-pointer active:bg-blue-500 transition-colors duration-200"
              style={{
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <div className="card-body">
                <h2 className="card-title text-blue-400 text-xs">Dinner</h2>
                <div className="flex flex-col items-center text-xs overflow-y-auto max-h-15">
                  {dinnerMeals.map((meal, index) => (
                    <p key={index} className="flex flex-row space-x-1 items-center text-xs mr-2">
                      Meal {meal.name}
                      <p>KCAL {meal.calories}</p>
                      <p>P: {meal.protein}</p>
                      <p>C: {meal.carbs}</p>
                      <p>F: {meal.fats}</p>
                      <button
                        onClick={() => {
                          deleteMeal(meal.id);
                        }}
                        className="btn btn-outline btn-primary w-8 h-5 shadow-lg backdrop-blur-md border border-blue-400 text-white px-2 py-1  transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400"
                        style={{
                          background: 'rgba(30, 41, 59, 0.25)',
                          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                          border: '1.5px solid transparent',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')
                        }
                        onMouseLeave={(e) =>
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
                    </p>
                  ))}
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => {
                      setShowFileUpload(true);
                      setMealtype('breakfast');
                    }}
                    className="btn btn-outline btn-primary w-2 h-6 shadow-lg backdrop-blur-md border border-blue-400 text-white px-2 py-1 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400"
                    style={{
                      background: 'rgba(30, 41, 59, 0.25)',
                      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                      border: '1.5px solid #3b82f6',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div
              className="card w-full sm:w-80 lg:w-80 h-auto bg-black/20 border border-blue-500 shadow-xl rounded-xl backdrop-blur-lg cursor-pointer active:bg-blue-500 transition-colors duration-200"
              style={{
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <div className="card-body">
                <h2 className="card-title text-blue-400 text-xs">Snacks</h2>

                {snackMeals.map((meal, index) => (
                  <div className="flex flex-col items-center text-xs overflow-y-auto max-h-15">
                    <p key={index} className="flex flex-row space-x-1 items-center text-xs mr-2">
                      Meal {meal.name}
                      <p>KCAL {meal.calories}</p>
                      <p>P: {meal.protein}</p>
                      <p>C: {meal.carbs}</p>
                      <p>F: {meal.fats}</p>
                      <button
                        onClick={() => {
                          deleteMeal(meal.id);
                        }}
                        className="btn btn-outline btn-primary w-8 h-5 shadow-lg backdrop-blur-md border border-blue-400 text-white px-2 py-1  transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400"
                        style={{
                          background: 'rgba(30, 41, 59, 0.25)',
                          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                          border: '1.5px solid transparent',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')
                        }
                        onMouseLeave={(e) =>
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
                    </p>
                  </div>
                ))}
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => {
                      setShowFileUpload(true);
                      setMealtype('snacks');
                    }}
                    className="btn btn-outline btn-primary w-2 h-6 shadow-lg backdrop-blur-md border border-blue-400 text-white px-2 py-1 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400"
                    style={{
                      background: 'rgba(30, 41, 59, 0.25)',
                      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                      border: '1.5px solid #3b82f6',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="divider divider-primary"></div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-16">
            <div
              className="card w-35 sm:w-30 lg:w-35 h-35 bg-black/20 border border-blue-500 shadow-xl rounded-xl backdrop-blur-lg cursor-pointer active:bg-blue-500 transition-colors duration-200"
              style={{
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <div className="card-body i">
                <h2 className="card-title text-blue-400 text-xs">Calories</h2>
                <div className="flex flex-col">
                  <div className="carousel rounded-box w-full">
                    <div className="carousel-item w-full items-center justify-center">
                      <div
                        className="radial-progress items-center justify-center"
                        style={
                          {
                            '--value': (calculateCalories() / calories) * 100,
                            '--thickness': '4px',
                          } /* as React.CSSProperties */
                        }
                        aria-valuenow={100}
                        role="progressbar"
                      >
                        {calculateCalories()} kcal
                      </div>
                    </div>

                    <div className="carousel-item w-full">
                      <div className="flex flex-col justify-center items-start text-xs">
                        <p className="text-white">In: {calculateCalories()}kcal</p>
                        <p className="text-white">Goal: {calories}kcal</p>
                        <p className="text-white">Open: {calories - calculateCalories()}kcal</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="card w-full sm:w-35 lg:w-35 h-35 bg-black/20 border border-blue-500 shadow-xl rounded-xl backdrop-blur-lg cursor-pointer active:bg-blue-500 transition-colors duration-200"
              style={{
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <div className="card-body">
                <h2 className="card-title text-blue-400 text-xs">Macronutrients</h2>
                <div className="flex flex-col justify-center items-start text-center text-xs">
                  <p className="text-white">P: {calculateProteins()}</p>
                  <p className="text-white">C: {calculateCarbs()}</p>
                  <p className="text-white">F: {calculateFats()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TemplatePage>
    </div>
  );
}

export default Nutrition;
