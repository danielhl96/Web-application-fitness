import '../index.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, JSX } from 'react';
import Header from '../Components/HeaderLogout.js';
import api from '../Utils/api.js';
import TemplatePage from '../Components/templatepage.js';
import EmailInput from '../Components/emailinput.js';
import PasswordInput from '../Components/passwordinput.js';
import Button from '../Components/button.js';

function LoginForm(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  async function handleLogin(): Promise<void> {
    setIsLoading(true);
    try {
      await api.post('/auth/login', {
        email,
        password,
      });
      setIsLoading(false);
      navigate('/');
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      setMessage(error.response?.data?.message || 'An error occurred during login.');
    }
  }

  return (
    <div>
      <Header />
      <TemplatePage dockDisabled={true}>
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
              placeholder={'Password'}
              onChange={handlePasswordChange}
              onError={(error) => console.log('Password error:', error)}
              errorMessage={''}
            />
          </div>
          <h1 className="text-red-500 text-sm ">{message}</h1>

          <Button
            isLoading={isLoading}
            onClick={() => handleLogin()}
            disabled={false}
            border="#08ad4dff"
          >
            Login
          </Button>
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
