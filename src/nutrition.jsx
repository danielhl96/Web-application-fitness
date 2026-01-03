import TemplatePage from './templatepage';

import { useState, useRef } from 'react';

function Nutrition() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [showModal, setShowModal] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  function handleFileUpload(event) {
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
              // Process the file here
              setShowFileUpload(false);
            }}
          />
          <input
            type="file"
            accept="image/*"
            capture
            ref={cameraInputRef}
            style={{ display: 'none' }}
            onChange={(event) => {
              const file = event.target.files[0];
              console.log(file);
              // Process the camera image here
              setShowFileUpload(false);
            }}
          />
          <div className="flex flex-row justify-center space-x-2 mb-4">
            <button
              className="btn btn-outline btn-primary mr-2"
              onClick={() => cameraInputRef.current && cameraInputRef.current.click()}
            >
              <figure className="w-5 h-5 mb-2">
                <img
                  src={'./cam.png'}
                  className="w-full h-full object-cover rounded-md filter brightness-0 invert"
                />
              </figure>
            </button>
            <button
              className="btn btn-outline btn-primary"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <figure className="w-5 h-5 mb-2">
                <img
                  src={'./image.png'}
                  className="w-full h-full object-cover rounded-md filter brightness-0 invert"
                />
              </figure>
            </button>
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
          <div className="flex space-x-2 mb-4">
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
          </div>
          <div className="overflow-x-auto flex max-w-70 mb-4 space-x-2">
            {(() => {
              const daysInMonth = (month, year) => {
                if (month === 2) {
                  // Leap year check
                  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
                }
                return [4, 6, 9, 11].includes(month) ? 30 : 31;
              };
              return Array.from({ length: daysInMonth(month, year) }).map((_, index) => (
                <button
                  onClick={() => {
                    setSelectedDay(index + 1);
                    setShowModal(false);
                  }}
                  key={index}
                  className={`btn btn-outline btn-primary mb-4${
                    selectedDay === index + 1 ? ' btn-active' : ''
                  }`}
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
                  {index + 1}
                </button>
              ));
            })()}
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
        <div className="overflow-auto max-h-[80vh]">
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

          <div className="flex flex-col space-y-2 overflow-y-auto max-h-90 mb-4">
            <div
              className="card w-full sm:w-80 lg:w-80 h-25 bg-black/20 border border-blue-500 shadow-xl rounded-xl backdrop-blur-lg cursor-pointer active:bg-blue-500 transition-colors duration-200"
              style={{
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <div className="card-body">
                <h2 className="card-title text-blue-400 text-xs">Breakfast</h2>
                <div className="flex flex-col justify-center text-xs"></div>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => setShowFileUpload(true)}
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
              className="card w-full sm:w-80 lg:w-80 h-25 bg-black/20 border border-blue-500 shadow-xl rounded-xl backdrop-blur-lg cursor-pointer active:bg-blue-500 transition-colors duration-200"
              style={{
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <div className="card-body">
                <h2 className="card-title text-blue-400 text-xs">Launch</h2>
                <div className="flex flex-col justify-center text-xs"></div>
                <div className="flex justify-end mt-2">
                  <button
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
              className="card w-full sm:w-80 lg:w-80 h-25 bg-black/20 border border-blue-500 shadow-xl rounded-xl backdrop-blur-lg cursor-pointer active:bg-blue-500 transition-colors duration-200"
              style={{
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <div className="card-body">
                <h2 className="card-title text-blue-400 text-xs">Dinner</h2>
                <div className="flex flex-col justify-center text-xs"></div>
                <div className="flex justify-end mt-2">
                  <button
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
              className="card w-full sm:w-80 lg:w-80 h-25 bg-black/20 border border-blue-500 shadow-xl rounded-xl backdrop-blur-lg cursor-pointer active:bg-blue-500 transition-colors duration-200"
              style={{
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <div className="card-body">
                <h2 className="card-title text-blue-400 text-xs">Snacks</h2>
                <div className="flex flex-col justify-center text-xs"></div>
                <div className="flex justify-end mt-2">
                  <button
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
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              className="card w-full sm:w-80 lg:w-80 h-30 bg-black/20 border border-blue-500 shadow-xl rounded-xl backdrop-blur-lg cursor-pointer active:bg-blue-500 transition-colors duration-200"
              style={{
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <div className="card-body">
                <h2 className="card-title text-blue-400 text-xs">Calories</h2>
                <div className="flex flex-col justify-center text-xs">
                  <p>Goal:2500 </p>
                  <p>Kcal: 2400 </p>
                </div>
              </div>
            </div>
            <div
              className="card w-fullsm:w-80 lg:w-80 h-30 bg-black/20 border border-blue-500 shadow-xl rounded-xl backdrop-blur-lg cursor-pointer active:bg-blue-500 transition-colors duration-200"
              style={{
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <div className="card-body">
                <h2 className="card-title text-blue-400 text-xs">Macronutrients</h2>
                <div className="flex flex-col justify-center text-xs">
                  <p>Proteins: 140g </p>
                  <p> Fats: 90g </p>
                  <p> Carbs: 240 </p>
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
