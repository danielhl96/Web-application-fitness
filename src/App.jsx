import './index.css';
import { Routes, Route, Link } from 'react-router-dom';
import LoginForm from './login.jsx';
import Header from './Header';
import CreateTraining from './createtrain.jsx';
import EditTrain from './EditTrain.jsx';
import StartTraining from './training.jsx';
import Profile from './profile.jsx';
import RegisterPage from './register.jsx';
import PasswordForget from './passwordforget.jsx';
import Counter from './counter.jsx';
import ProtectedRoute from './ProtectedRoute';
import PrivacyPolicy from './privacypolicy.jsx';
import Impressum from './imprint.jsx';
import AttributionPage from './attributionpage.jsx';
import { useNavigate } from 'react-router-dom';
import { AuthProvider } from './AuthProvider.jsx';
import Statistic from './statistic.jsx';
import CredentialsPage from './credentials.jsx';
import Nutrition from './nutrition.jsx';
import Home from './home.jsx';

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
      </Routes>
    </div>
  );
}

export default App;
