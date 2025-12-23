import './index.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './HeaderLogout.jsx';
import api from './api.js';
import TemplatePage from './templatepage.jsx';
import EmailInput from './emailinput.jsx';
import PasswordInput from './passwordinput.jsx';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e);
  };

  async function handleLogin() {
    try {
      const response = await api.get('/login', {
        params: {
          email,
          password,
        },
      });
      console.log(response[0]);

      navigate('/');
    } catch (error) {
      console.error(error);
      setMessage('Login failed. Please check your credentials.');
    }
  }

  return (
    <div>
      <Header />
      <TemplatePage>
        <div className="flex flex-col  space-y-2 ">
          <h1 className="text-2xl font-bold">Login</h1>
          <div className="divider divider-primary"></div>
          <div>
            <h1 className="text-shadow-lg font-mono">E-Mail</h1>

            <EmailInput
              value={email}
              onChange={handleEmailChange}
              onError={(error) => setEmailError(error)}
              errorMessage={'Please enter a valid email.'}
            />
          </div>
          <h1 className="text-shadow-lg font-mono">Password</h1>

          <div>
            <PasswordInput
              value={password}
              type="password"
              placeholder={'Password'}
              className="w-full px-4 py-2 rounded-xl border border-blue-400 bg-white/10 text-white shadow-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-200"
              style={{
                background: 'rgba(30, 41, 59, 0.25)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                border: '1.5px solid rgba(59, 130, 246, 0.25)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              onChange={handlePasswordChange}
              onError={(error) => console.log('Password error:', error)}
              errorMessage={''}
            />
          </div>
          <h1 className="text-red-500 text-sm ">{message}</h1>
          <button
            onClick={() => handleLogin()}
            className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
            style={{
              background: 'rgba(30, 41, 59, 0.25)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
              border: '1.5px solid #08ad4dff',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(8, 173, 77, 0.3)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
          >
            Login
          </button>
          <div className="space-y-0 flex flex-col items-center">
            <button onClick={() => navigate('/register')} className="btn btn-link w-80 text-white">
              Are you new here?
            </button>
            <button
              onClick={() => navigate('/passwordforget')}
              className="btn btn-link w-80 text-white"
            >
              Do you have forgot your password?
            </button>
            <div className="divider divider-primary"></div>
            <div className="flex flex-row space-x-0">
              <button
                onClick={() => navigate('/privacypolicy')}
                className="btn btn-link w-30 text-white"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => navigate('/impressum')}
                className="btn btn-link w-30 text-white"
              >
                Imprint
              </button>
            </div>
            <button
              onClick={() => navigate('/attribution')}
              className="btn btn-link w-30 text-white"
            >
              Attribution
            </button>
          </div>
        </div>
      </TemplatePage>
    </div>
  );
}

export default LoginForm;
