import "./index.css";
import { Routes, Route } from "react-router-dom";
import GUI from "./login";
import Header from "./Header";
import CreateTrainGUI from "./createtrain.jsx";
import EditTrain from "./edittrain.jsx";
import StartTraining from "./training.jsx";
import Profile from "./profile";
import RegisterPage from "./register.jsx";
import PasswordForget from "./passwordforget.jsx";
import Counter from "./counter.jsx";
import ProtectedRoute from "./ProtectedRoute";

function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4">
        {/* Card 1 */}
        <div className="card w-full sm:w-96 lg:w-96 bg-slate-800 shadow-lg border border-slate-700">
          <div className="card-body">
            <h2 className="card-title text-emerald-400">Create Training</h2>
            <p className="text-slate-200">
              Create your own training with exercises of your choice!
            </p>
            <div className="justify-end card-actions">
              <a
                href="/createtrain"
                className="btn bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                Create
              </a>
            </div>
          </div>
        </div>
        {/* Card 2 */}
        <div className="card w-full sm:w-96 lg:w-96 bg-slate-800 shadow-lg border border-slate-700">
          <div className="card-body">
            <h2 className="card-title text-blue-400">Start Training</h2>
            <p className="text-slate-200">Start your training now!</p>
            <div className="justify-end card-actions">
              <a
                href="/training"
                className="btn bg-blue-500 hover:bg-blue-600 text-white"
              >
                Start
              </a>
            </div>
          </div>
        </div>
        {/* Card 3 */}
        <div className="card w-full sm:w-96 lg:w-96 bg-slate-800 shadow-lg border border-slate-700">
          <div className="card-body">
            <h2 className="card-title text-pink-400">Set Goal</h2>
            <p className="text-slate-200">
              Define your fitness goal and track your progress!
            </p>
            <div className="justify-end card-actions">
              <a
                href="/profile"
                className="btn bg-pink-500 hover:bg-pink-600 text-white"
              >
                Set Goal
              </a>
            </div>
          </div>
        </div>
        {/* Card 4 */}
        <div className="card w-full sm:w-96 lg:w-96 bg-slate-800 shadow-lg border border-slate-700">
          <div className="card-body">
            <h2 className="card-title text-yellow-400">Edit training</h2>
            <p className="text-slate-200">Edit your training!</p>
            <div className="justify-end card-actions">
              <a
                href="/edittrain"
                className="btn bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Edit training
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<GUI />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createtrain"
          element={
            <ProtectedRoute>
              <CreateTrainGUI />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edittrain"
          element={
            <ProtectedRoute>
              <EditTrain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/training"
          element={
            <ProtectedRoute>
              <StartTraining />
            </ProtectedRoute>
          }
        />
        <Route path="/passwordforget" element={<PasswordForget />} />
        <Route
          path="/counter"
          element={
            <ProtectedRoute>
              <Counter />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
