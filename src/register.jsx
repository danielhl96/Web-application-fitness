import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import Header from './HeaderLogout.jsx';
import TemplatePage from './templatepage.jsx';
import EmailInput from './emailinput.jsx';
import PasswordInput from './passwordinput.jsx';
function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [message, setMessage] = useState('');
  const [succesRegister, setSuccesRegister] = useState(false);

  const handleRegister = () => {
    api
      .post('/register', {
        email,
        password,
      })
      .then(() => {
        setMessage('Registration successful! You can now log in.');
        setSuccesRegister(true);
      })
      .catch((err) => {
        console.log(err);
        setMessage(err.response.data.message);
      });
  };

  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handlePasswordChange = (value) => {
    console.log('Password changed:', value);
    setPassword(value);
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
  };

  const checkEmail = (email) => {
    // Simple email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    setEmailError(!checkEmail(email));
  }, [email]);

  useEffect(() => {
    setConfirmPasswordError(confirmPassword !== password);
  }, [confirmPassword, password]);

  return (
    <div>
      <Header />
      <TemplatePage>
        <div>
          <h1 className="text-2xl font-bold">Register</h1>
          <div className="divider divider-primary">Your data</div>

          <h1 className="text-shadow-lg font-mono">E-Mail</h1>

          <EmailInput
            value={email}
            disabled={succesRegister}
            onChange={handleEmailChange}
            onError={(error) => setEmailError(error)}
          />
        </div>
        <div>
          <h1 className="text-shadow-lg font-mono">Password</h1>
          <PasswordInput
            value={password}
            disabled={succesRegister}
            onChange={handlePasswordChange}
            errorMessage={
              <ul className="list-disc text-xs pl-4 text-left">
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One number</li>
                <li>One special character</li>
              </ul>
            }
            onError={(error) => setPasswordError(error)}
            placeholder={'Password:'}
          />
        </div>
        <div>
          <h1 className="text-shadow-lg font-mono">Repat password</h1>
          <PasswordInput
            value={confirmPassword}
            disabled={succesRegister}
            errorMessage={''}
            onChange={handleConfirmPasswordChange}
            onError={(error) => setConfirmPasswordError(confirmPassword !== password)}
            placeholder={'Repeat your password:'}
          />

          {confirmPasswordError && (
            <h1 className="text-red-500 text-xs ">Passwords do not match.</h1>
          )}
        </div>
        <div className="mt-4 mb-4">
          {message && (
            <span
              className={`${
                message === 'Registration successful! You can now log in.'
                  ? 'text-green-500'
                  : 'text-red-500'
              } text-sm`}
            >
              {message}
            </span>
          )}
        </div>

        <div className="divider divider-primary"></div>
        <div className="flex flex-row space-x-2 items-center justify-center">
          <button
            onClick={() => handleRegister()}
            disabled={
              emailError ||
              passwordError ||
              confirmPasswordError ||
              email.length === 0 ||
              password.length === 0 ||
              confirmPassword.length === 0 ||
              succesRegister
            }
            className="w-auto px-4 py-2 rounded-xl border border-blue-400 bg-white/10 text-white shadow-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-200"
            style={{
              background: 'rgba(30, 41, 59, 0.25)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
              border: '1.5px solid rgba(59, 130, 246, 0.25)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(8, 173, 77, 0.3)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
          >
            Register
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-auto px-4 py-2 rounded-xl border border-blue-400 bg-white/10 text-white shadow-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-200"
            style={{
              background: 'rgba(30, 41, 59, 0.25)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
              border: '1.5px solid rgba(59, 130, 246, 0.25)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f63b3bff')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
          >
            Back
          </button>
        </div>
      </TemplatePage>
    </div>
  );
}
export default RegisterPage;
