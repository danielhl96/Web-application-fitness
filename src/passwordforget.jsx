import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import Header from './HeaderLogout.jsx';
import TemplatePage from './templatepage.jsx';
import EmailInput from './emailinput.jsx';
import PasswordInput from './passwordinput.jsx';
function PasswordForget() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [message, setMessage] = useState('');
  const [requireCode, setRequireCode] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [successfully, setSuccessfully] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailinputtouch, setemailinputtouch] = useState(false);
  const [passwordinputtouch, setpasswordinputtouch] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const checkEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    setEmailError(!checkEmail(email));
    console.log(emailError);
    console.log(email);
    console.log(passwordError);
    console.log(passwordMatchError);
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

  const handleCode = () => {
    api
      .post('/password_forget', { email })
      .then(() => {
        setMessage(<div className="text-green-500">Check your email for the security code.</div>);
        setRequireCode(true);
      })
      .catch(() => {
        setMessage(<div className="text-green-500">Check your email for the security code.</div>);
      });
  };

  const checkCode = () => {
    api
      .post('/check_safety_code', {
        email: email,
        password: password,
        safety_code: securityCode,
      })
      .then((response) => {
        setMessage(<div className="text-green-500">{response.data.message}</div>);

        setSuccessfully(false);
      })
      .catch((e) => {
        setMessage(
          <div className="text-xs text-red-500">
            {e.response?.data?.message || 'Error changing password.'}
          </div>
        );
      });
  };

  const handlePasswordChange = () => {
    checkCode();
  };

  const handleEmail = (value) => {
    setEmail(value);
  };
  const handleSafetyCode = (value) => {
    setSecurityCode(value);
  };
  const handlePasswordRepeat = (value) => {
    setPasswordRepeat(value);
  };
  const handlePassword = (value) => {
    setPassword(value);
  };
  return (
    <div>
      <Header />
      <TemplatePage>
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
              <input
                type="text"
                placeholder={'Security-Code: '}
                className="input input-primary"
                onChange={(e) => handleSafetyCode(e.target.value)}
                value={securityCode}
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
                placeholder={'New password: '}
              />

              <h1>Repeat your password</h1>
              <PasswordInput
                value={passwordRepeat}
                placeholder={'Repeat your password: '}
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
          <button
            disabled={
              emailError ||
              (requireCode && (securityCode.length === 0 || passwordError || passwordMatchError))
            }
            onClick={!requireCode ? () => handleCode() : () => handlePasswordChange()}
            className="btn btn-outline btn-success"
          >
            {requireCode ? 'Change password' : 'Require code'}
          </button>

          <button onClick={() => navigate('/login')} className="btn btn-outline btn-error">
            {successfully ? 'Go to Login' : 'Cancel'}
          </button>
        </div>
        {message && <h1 className="text-green-500">{message}</h1>}
      </TemplatePage>
    </div>
  );
}
export default PasswordForget;
