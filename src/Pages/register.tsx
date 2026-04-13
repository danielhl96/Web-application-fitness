import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Utils/api.js';
import Header from '../Components/HeaderLogout.js';
import TemplatePage from '../Components/templatepage.js';
import EmailInput from '../Components/emailinput.js';
import PasswordInput from '../Components/passwordinput.js';
import Button from '../Components/button.js';
function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [succesRegister, setSuccesRegister] = useState<boolean>(false);

  const handleRegister = (): void => {
    setIsLoading(true);
    api
      .post('/auth/register', {
        email,
        password,
      })
      .then(() => {
        setMessage('Registration successful! You can now log in.');
        setSuccesRegister(true);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setMessage(err.response.data.message);
      });
  };

  const handleEmailChange = (value: string): void => {
    setEmail(value);
  };

  const handlePasswordChange = (value: string): void => {
    setPassword(value);
  };

  const handleConfirmPasswordChange = (value: string): void => {
    setConfirmPassword(value);
  };

  const checkEmail = (email: string): boolean => {
    // Simple email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkConfirmPassword = (confirmPassword: string, password: string): boolean => {
    return confirmPassword === password;
  };

  return (
    <div>
      <Header />
      <TemplatePage dockDisabled={true}>
        <div>
          <h1 className="text-2xl font-bold">Register</h1>
          <div className="divider divider-primary">Your data</div>

          <h1 className="text-shadow-lg font-mono">E-Mail</h1>

          <EmailInput
            value={email}
            disabled={succesRegister}
            onChange={handleEmailChange}
            onError={() => checkEmail(email)}
          />
        </div>
        <div>
          <h1 className="text-shadow-lg font-mono">Password</h1>
          <PasswordInput
            value={password}
            disabled={succesRegister}
            onChange={handlePasswordChange}
            errorMessage={
              'Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character.'
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
            onError={() => checkConfirmPassword(confirmPassword, password)}
            placeholder={'Repeat your password:'}
          />

          {!checkConfirmPassword(confirmPassword, password) && (
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
          <Button
            isLoading={isLoading}
            onClick={() => handleRegister()}
            disabled={
              !checkEmail(email) ||
              passwordError ||
              confirmPasswordError ||
              email.length === 0 ||
              password.length === 0 ||
              confirmPassword.length === 0 ||
              succesRegister
            }
            border="#3b82f6"
          >
            Register
          </Button>
          <Button onClick={() => navigate('/login')} border="#ef4444">
            Back
          </Button>
        </div>
      </TemplatePage>
    </div>
  );
}
export default RegisterPage;
