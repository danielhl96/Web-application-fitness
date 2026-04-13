import { useState, useEffect, JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Utils/api.js';
import Header from '../Components/HeaderLogout.js';
import TemplatePage from '../Components/templatepage.js';
import EmailInput from '../Components/emailinput.js';
import PasswordInput from '../Components/passwordinput.js';
import Button from '../Components/button.js';
import Input from '../Components/input.js';
function PasswordForget() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [securityCode, setSecurityCode] = useState<string>('');
  const [message, setMessage] = useState<JSX.Element | null>(null);
  const [requireCode, setRequireCode] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordRepeat, setPasswordRepeat] = useState<string>('');
  const [successfully, setSuccessfully] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(true);
  const [passwordError, setPasswordError] = useState<boolean>(true);
  const [passwordMatchError, setPasswordMatchError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const checkEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    setEmailError(!checkEmail(email));
  }, [email]);

  useEffect(() => {
    setPasswordMatchError(() => {
      return password !== passwordRepeat;
    });
  }, [password, passwordRepeat]);

  useEffect(() => {
    setPasswordError(
      password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/\d/.test(password) ||
        !/[!@#$%^&*]/.test(password)
    );
  }, [password]);

  const handleCode = (): void => {
    setIsLoading(true);
    api
      .post('/auth/password_forget', { email })
      .then(() => {
        setMessage(<div className="text-green-500">Check your email for the security code.</div>);
        setRequireCode(true);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setMessage(
          <div className="text-red-500">Error sending security code. Please try again.</div>
        );
      });
  };

  const checkCode = (): void => {
    setIsLoading(true);
    api
      .post('/auth/password_reset', {
        email: email,
        newPassword: password,
        safetycode: securityCode,
      })
      .then((response) => {
        setMessage(<div className="text-green-500">{response.data.message}</div>);
        setIsLoading(false);

        setSuccessfully(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setMessage(
          <div className="text-xs text-red-500">
            {e.response?.data?.message || 'Error changing password.'}
          </div>
        );
      });
  };

  const handlePasswordChange = (): void => {
    checkCode();
  };

  const handleEmail = (value: string): void => {
    setEmail(value);
  };
  const handleSafetyCode = (value: string): void => {
    setSecurityCode(value);
  };
  const handlePasswordRepeat = (value: string): void => {
    setPasswordRepeat(value);
  };
  const handlePassword = (value: string): void => {
    setPassword(value);
  };
  return (
    <div>
      <Header />
      <TemplatePage dockDisabled={true}>
        <div className="items-start">
          <h1 className="text-2xl text-left font-bold">Password forget</h1>
        </div>
        <div>
          <h1 className="text-shadow-lg font-mono">E-Mail</h1>

          <EmailInput
            value={email}
            onChange={handleEmail}
            onError={(error) => setEmailError(error)}
          />
        </div>
        <div>
          {requireCode && (
            <>
              <h1 className="text-shadow-lg font-mono">Security-Code</h1>
              <Input
                placeholder={'Security-Code '}
                onChange={handleSafetyCode}
                value={securityCode}
                w="w-full"
              />
            </>
          )}
        </div>
        <div>
          {requireCode && (
            <>
              <h1 className="text-shadow-lg font-mono">New password</h1>

              <PasswordInput
                value={password}
                onChange={handlePassword}
                onError={(error) => setPasswordError(error)}
                errorMessage={
                  'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
                }
                placeholder={'New password'}
              />

              <h1>Repeat your password</h1>
              <PasswordInput
                value={passwordRepeat}
                placeholder={'Repeat your password '}
                errorMessage={''}
                onError={(error) => setPasswordMatchError(password !== passwordRepeat)}
                onChange={handlePasswordRepeat}
              />
              {passwordMatchError && (
                <p className="text-red-500 text-sm">Passwords do not match.</p>
              )}
            </>
          )}
        </div>
        <div className="flex space-x-2 items-center justify-start">
          <Button
            isLoading={isLoading}
            disabled={
              email.length === 0 ||
              emailError ||
              (requireCode &&
                (securityCode.length === 0 ||
                  password.length === 0 ||
                  passwordError ||
                  passwordMatchError))
            }
            onClick={!requireCode ? () => handleCode() : () => handlePasswordChange()}
            border="#3b82f6"
          >
            {requireCode ? 'Change password' : 'Require code'}
          </Button>

          <Button onClick={() => navigate('/login')} border="#ef4444">
            {successfully ? 'Go to Login' : 'Cancel'}
          </Button>
        </div>
        {message && <h1 className="text-green-500">{message}</h1>}
      </TemplatePage>
    </div>
  );
}
export default PasswordForget;
