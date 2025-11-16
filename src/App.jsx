import "./index.css";
import { Routes, Route, Link } from "react-router-dom";
import LoginForm from "./login";
import Header from "./Header";
import CreateTrainGUI from "./createtrain.jsx";
import EditTrain from "./edittrain.jsx";
import StartTraining from "./training.jsx";
import Profile from "./profile";
import RegisterPage from "./register.jsx";
import PasswordForget from "./passwordforget.jsx";
import Counter from "./counter.jsx";
import ProtectedRoute from "./ProtectedRoute";
import { useNavigate } from "react-router-dom";
import { AuthProvider } from "./AuthProvider.jsx";
import Statistic from "./statistic.jsx";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 py-16">
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 p-4">
        {/* Card 1: Create Training */}
        <div
          onClick={() => navigate("/createtrain")}
          className="card w-full sm:w-80 lg:w-80 h-40 bg-slate-800 shadow-lg border border-slate-700 cursor-pointer active:bg-blue-500 transition-colors duration-200"
        >
          <div className="card-body">
            <h2 className="card-title text-blue-400">Create Training</h2>
            <div className="flex justify-center my-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-amber-50"
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
            </div>
            <p className="text-slate-300 text-sm text-center hidden md:block">
              Create your own training program
            </p>
          </div>
        </div>

        {/* Card 2: Start Training */}
        <div
          onClick={() => navigate("/training")}
          className="card w-full sm:w-80 lg:w-80 h-40 bg-slate-800 shadow-lg border border-slate-700 cursor-pointer active:bg-blue-500 transition-colors duration-200"
        >
          <div className="card-body">
            <h2 className="card-title text-blue-400">Start Training</h2>
            <div className="flex justify-center my-4">
              <img
                src="/pullup.png"
                className="h-8 w-8 object-cover rounded-md"
                alt="Pull-up Icon"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>
            <p className="text-slate-300 text-sm text-center hidden md:block">
              Start your training with pull-ups
            </p>
          </div>
        </div>

        {/* Card 3: Profile */}
        <div
          onClick={() => navigate("/profile")}
          className="card w-full sm:w-80 lg:w-80 h-40 bg-slate-800 shadow-lg border border-slate-700 cursor-pointer active:bg-blue-500 transition-colors duration-200"
        >
          <div className="card-body">
            <h2 className="card-title text-blue-400">Profile</h2>
            <div className="flex justify-center my-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-amber-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <p className="text-slate-300 text-sm text-center hidden md:block">
              Manage your profile and goals
            </p>
          </div>
        </div>

        {/* Card 4: Edit training */}
        <div
          onClick={() => navigate("/edittrain")}
          className="card w-full sm:w-80 lg:w-80 h-40 bg-slate-800 shadow-lg border border-slate-700 cursor-pointer active:bg-blue-500 transition-colors duration-200"
        >
          <div className="card-body">
            <h2 className="card-title text-blue-400">Edit training</h2>
            <div className="flex justify-center my-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-amber-50"
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
            </div>
            <p className="text-slate-300 text-sm text-center hidden md:block">
              Edit existing trainings
            </p>
          </div>
        </div>

        {/* Card 5: Timer */}
        <div
          onClick={() => navigate("/counter")}
          className="card w-full sm:w-80 lg:w-80 h-40 bg-slate-800 shadow-lg border border-slate-700 cursor-pointer active:bg-blue-500 transition-colors duration-200"
        >
          <div className="card-body">
            <h2 className="card-title text-blue-400">Timer</h2>
            <div className="flex justify-center my-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-amber-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-slate-300 text-sm text-center hidden md:block">
              Use the timer for breaks
            </p>
          </div>
        </div>

        {/* Card 6: Statistic */}
        <div
          onClick={() => navigate("/statistic")}
          className="card w-full sm:w-80 lg:w-80 h-40 bg-slate-800 shadow-lg border border-slate-700 cursor-pointer active:bg-blue-500 transition-colors duration-200"
        >
          <div className="card-body">
            <h2 className="card-title text-blue-400">Statistic</h2>
            <div className="flex justify-center my-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-amber-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-slate-300 text-sm text-center hidden md:block">
              View your statistics
            </p>
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
        <Route
          path="/"
          element={
            <AuthProvider>
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            </AuthProvider>
          }
        />

        <Route path="/login" element={<LoginForm />} />

        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/profile"
          element={
            <AuthProvider>
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </AuthProvider>
          }
        />
        <Route
          path="/createtrain"
          element={
            <AuthProvider>
              <ProtectedRoute>
                <CreateTrainGUI />
              </ProtectedRoute>
            </AuthProvider>
          }
        />
        <Route
          path="/edittrain"
          element={
            <AuthProvider>
              <ProtectedRoute>
                <EditTrain />
              </ProtectedRoute>
            </AuthProvider>
          }
        />
        <Route
          path="/training"
          element={
            <AuthProvider>
              <ProtectedRoute>
                <StartTraining />
              </ProtectedRoute>
            </AuthProvider>
          }
        />
        <Route path="/passwordforget" element={<PasswordForget />} />
        <Route
          path="/counter"
          element={
            <AuthProvider>
              <ProtectedRoute>
                <Counter />
              </ProtectedRoute>
            </AuthProvider>
          }
        />
        <Route
          path="/statistic"
          element={
            <AuthProvider>
              <ProtectedRoute>
                <Statistic />
              </ProtectedRoute>
            </AuthProvider>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
