import './index.css';
import { Routes, Route } from 'react-router-dom';
import LoginForm from './features/auth/login.js';
import CreateTraining from './features/createworkout/createtrain.js';
import EditTrain from './features/editworkout/EditTrain.js';
import StartTraining from './features/training/training.tsx';
import Profile from './features/profile/profile.js';
import RegisterPage from './features/auth/register.js';
import PasswordForget from './features/auth/passwordforget.js';
import Counter from './features/timer/counter.tsx';
import ProtectedRoute from './features/auth/ProtectedRoute.js';
import PrivacyPolicy from './Pages/privacypolicy.jsx';
import Impressum from './Pages/imprint.jsx';
import AttributionPage from './Pages/attributionpage.jsx';
import { AuthProvider } from './features/auth/AuthProvider.js';
import Statistic from './features/statistics/statistic.js';
import CredentialsPage from './features/credentials/credentials.js';
import Nutrition from './features/meal/nutrition.js';
import Home from './Pages/home.jsx';
import AiCoach from './features/aicoach/aicoach.js';
import CardioPage from './features/cardio/cardio.js';

//Routes with ProtectedRoute to protect routes for the application
function App() {
  return (
    <div>
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
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/impressum" element={<Impressum />} />
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
                <CreateTraining />
              </ProtectedRoute>
            </AuthProvider>
          }
        />
        <Route
          path="/editTrain"
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
        <Route path="/attribution" element={<AttributionPage />} />
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
        <Route
          path="/credentials"
          element={
            <AuthProvider>
              <ProtectedRoute>
                <CredentialsPage />
              </ProtectedRoute>
            </AuthProvider>
          }
        />
        <Route
          path="/nutrition"
          element={
            <AuthProvider>
              <ProtectedRoute>
                <Nutrition />
              </ProtectedRoute>
            </AuthProvider>
          }
        />
        <Route
          path="/aicoach"
          element={
            <AuthProvider>
              <ProtectedRoute>
                <AiCoach />
              </ProtectedRoute>
            </AuthProvider>
          }
        />
        <Route
          path="/cardio"
          element={
            <AuthProvider>
              <ProtectedRoute>
                <CardioPage />
              </ProtectedRoute>
            </AuthProvider>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
