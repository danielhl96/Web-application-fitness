import './index.css';
import { Routes, Route, Link } from 'react-router-dom';
import LoginForm from './Pages/login.jsx';
import CreateTraining from './Pages/createtrain.jsx';
import EditTrain from './Pages/EditTrain.jsx';
import StartTraining from './Pages/training.jsx';
import Profile from './Pages/profile.jsx';
import RegisterPage from './Pages/register.jsx';
import PasswordForget from './Pages/passwordforget.jsx';
import Counter from './Pages/counter.tsx';
import ProtectedRoute from './Auth/ProtectedRoute.jsx';
import PrivacyPolicy from './Pages/privacypolicy.jsx';
import Impressum from './Pages/imprint.jsx';
import AttributionPage from './Pages/attributionpage.jsx';
import { AuthProvider } from './Auth/AuthProvider.jsx';
import Statistic from './Pages/statistic.jsx';
import CredentialsPage from './Pages/credentials.jsx';
import Nutrition from './Pages/nutrition.jsx';
import Home from './Pages/home.jsx';
import AiCoach from './Pages/aicoach.jsx';

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
      </Routes>
    </div>
  );
}

export default App;
