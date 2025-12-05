import './index.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './HeaderLogout.jsx';
import api from './api.js';
import TemplatePage from './templatepage.jsx';
import EmailInput from './emailinput.jsx';

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
    setPassword(e.target.value);
    console.log('Password changed:', e.target.value);
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
            <input
              type="password"
              placeholder={'Password: '}
              className="input input-primary"
              onChange={(e) => handlePasswordChange(e)}
            />
          </div>
          <h1 className="text-red-500 text-sm ">{message}</h1>
          <button
            onClick={() => handleLogin()}
            className="btn btn-outline btn-success w-auto md:w-80 lg:w-80"
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
