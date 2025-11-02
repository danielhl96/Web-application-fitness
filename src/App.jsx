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
    <div className="flex items-center justify-center min-h-screen bg-slate-900 py-16 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 ">
        {/* Card 1 */}
        <div className="card w-full sm:w-96 lg:w-96 bg-slate-800 shadow-lg border border-slate-700">
          <div className="card-body">
            <h2 className="card-title text-blue-400">Create Training</h2>
            <p className="text-slate-200">
              Create your own training with exercises of your choice!
            </p>
            <div className="justify-end card-actions">
              <button
                onClick={() => navigate("/createtrain")}
                className="btn btn-outline btn-primary"
              >
                Create
              </button>
            </div>
          </div>
        </div>
        {/* Card 2 */}
        <div className="card w-full sm:w-96 lg:w-96 bg-slate-800 shadow-lg border border-slate-700">
          <div className="card-body">
            <h2 className="card-title text-blue-400">Start Training</h2>
            <p className="text-slate-200">Start your training now!</p>
            <div className="justify-end card-actions">
              <button
                onClick={() => navigate("/training")}
                className="btn btn-outline btn-primary"
              >
                Start
              </button>
            </div>
          </div>
        </div>
        {/* Card 3 */}
        <div className="card w-full sm:w-96 lg:w-96 bg-slate-800 shadow-lg border border-slate-700">
          <div className="card-body">
            <h2 className="card-title text-blue-400">Set Goal</h2>
            <p className="text-slate-200">
              Define your fitness goal and track your progress!
            </p>
            <div className="justify-end card-actions">
              <button
                onClick={() => navigate("/profile")}
                className="btn btn-outline btn-primary"
              >
                Profile
              </button>
            </div>
          </div>
        </div>
        {/* Card 4 */}
        <div className="card w-full sm:w-96 lg:w-96 bg-slate-800 shadow-lg border border-slate-700">
          <div className="card-body">
            <h2 className="card-title text-blue-400">Edit training</h2>
            <p className="text-slate-200">Edit your training!</p>
            <div className="justify-end card-actions">
              <button
                onClick={() => navigate("/edittrain")}
                className="btn btn-outline btn-primary"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
        <div className="card w-full sm:w-96 lg:w-96 bg-slate-800 shadow-lg border border-slate-700">
          <div className="card-body">
            <h2 className="card-title text-blue-400">Timer</h2>
            <p className="text-slate-200">Create a timer for your workouts!</p>
            <div className="justify-end card-actions">
              <button
                onClick={() => navigate("/timer")}
                className="btn btn-outline btn-primary"
              >
                Start
              </button>
            </div>
          </div>
        </div>
        <div className="card w-full sm:w-96 lg:w-96 bg-slate-800 shadow-lg border border-slate-700">
          <div className="card-body">
            <h2 className="card-title text-blue-400">Statistic</h2>
            <p className="text-slate-200">View your workout statistics!</p>
            <div className="justify-end card-actions">
              <button
                onClick={() => navigate("/statistic")}
                className="btn btn-outline btn-primary"
              >
                Start
              </button>
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
