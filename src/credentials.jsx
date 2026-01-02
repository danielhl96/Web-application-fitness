import TemplatePage from './templatepage';
import Header from './Header.jsx';
import WorkoutCard from './workoutcard.jsx';
import Notify from './notify.jsx';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from './api.js';
import EmailInput from './emailinput.jsx';
import PasswordInput from './passwordinput.jsx';

function CredentialsPage() {
  const [emailModal, setEmailModal] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);
  const [modalDeleteAccount, setModalDeleteAccount] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [inputTouched, setInputTouched] = useState(false);
  const [notification, setNotification] = useState(null);
  const [errorEmailMessage, setErrorEmailMessage] = useState(null);
  const [passwordError, setPasswordError] = useState(false);

  const navigate = useNavigate();

  const handleChangeEmail = () => {
    api
      .put('/change_email', {
        new_email: newEmail,
        password: password,
      })
      .then(() => {
        setNotification({
          title: 'Email Changed',
          message: 'Your email has been changed successfully.',
          type: 'success',
        });
        setEmailModal(false);
      })
      .catch(() => {
        setNotification({
          title: 'Error',
          message: 'There was an error changing your email.',
          type: 'error',
        });
      });
  };

  const handleChangePassword = () => {
    api
      .put('/change_password', {
        old_password: password,
        new_password: newPassword,
      })
      .then(() => {
        setNotification({
          title: 'Password Changed',
          message: 'Your password has been changed successfully.',
          type: 'success',
        });
        setModalPassword(false);
      })
      .catch(() => {
        setNotification({
          title: 'Error',
          message: 'There was an error changing your password.',
          type: 'error',
        });
      });
  };

  const handleDeleteAccount = () => {
    api
      .delete('/delete_account', {
        data: { password: password },
      })
      .then(() => {
        setNotification({
          title: 'Account Deleted',
          message: 'Your account has been deleted successfully.',
          type: 'success',
        });
        // Optionally, redirect to homepage or logout
        navigate('/login');
      })
      .catch(() => {
        setNotification({
          title: 'Error',
          message: 'There was an error deleting your account.',
          type: 'error',
        });
      });
  };

  const handleEmailModal = () => {
    return (
      <div className="modal modal-open modal-bottom sm:modal-middle items-center justify-center">
        {notification && (
          <Notify
            title={notification.title}
            message={notification.message}
            duration={1500}
            key={notification.message + notification.title + Date.now()}
            type={notification.type}
            // Notify handles its own visibility, but we clear notification after duration to allow re-showing
            onClose={() => setNotification(null)}
          />
        )}
        <div
          className="modal-box border border-blue-500 shadow-xl rounded-xl"
          style={{
            background: 'rgba(10, 20, 40, 0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid #3b82f6',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          }}
        >
          <div className="flex flex-row justify-center items-center  text-xs"></div>
          <h3 className="font-bold text-lg text-amber-50">Change your email</h3>
          <div className="flex flex-col space-y-2 mt-2">
            <EmailInput
              onChange={setNewEmail}
              type="email"
              value={newEmail}
              placeholder="New email"
            />

            <PasswordInput
              onChange={setPassword}
              type="password"
              value={password}
              errorMessage={''}
              placeholder="Current password"
              setPasswordError={setPasswordError}
            />
            <div className="divider divider-primary"></div>
            <div className="flex flex-row space-x-2 items-center justify-center">
              <button
                onClick={() => handleChangeEmail()}
                disabled={!!errorEmailMessage || password.length === 0}
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(30, 41, 59, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                  border: '1.5px solid #3b82f6',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setEmailModal(false)}
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(30, 41, 59, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                  border: '1.5px solid #f63b3bff',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(246, 59, 59, 0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleModalforPassword = () => {
    return (
      <div className="modal modal-open modal-bottom sm:modal-middle items-center justify-center">
        {notification && (
          <Notify
            title={notification.title}
            message={notification.message}
            duration={1500}
            key={notification.message + notification.title + Date.now()}
            type={notification.type}
            // Notify handles its own visibility, but we clear notification after duration to allow re-showing
            onClose={() => setNotification(null)}
          />
        )}
        <div
          className="modal-box border border-blue-500 shadow-xl rounded-xl"
          style={{
            background: 'rgba(10, 20, 40, 0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid #3b82f6',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          }}
        >
          <div className="flex flex-row justify-center items-center  text-xs"></div>
          <h3 className="font-bold text-lg text-amber-50">Change your password</h3>
          <div className="flex flex-col space-y-2 mt-2">
            <PasswordInput
              value={password}
              type="password"
              placeholder={'Password'}
              onChange={setPassword}
              onError={setPasswordError}
              errorMessage={
                'Password must be at least 8 characters uppercase, lowercase, number, and special character.'
              }
            />
            <PasswordInput
              onChange={setNewPassword}
              onBlur={() => setInputTouched(true)}
              type="password"
              placeholder="New password"
              value={newPassword}
              errorMessage={
                'Password must be at least 8 characters uppercase, lowercase, number, and special character.'
              }
            />
            {passwordError && inputTouched && (
              <span className="text-red-500 text-xs">
                Password must be at least 8 characters uppercase, lowercase, number, and special
                character.
              </span>
            )}
            <PasswordInput
              onChange={setConfirmNewPassword}
              type="password"
              placeholder="Confirm new password"
              value={confirmNewPassword}
              errorMessage={'Passwords do not match.'}
            />
            {newPassword !== confirmNewPassword && (
              <span className="text-red-500 text-xs">Passwords do not match.</span>
            )}
            <div className="divider divider-primary"></div>
            <div className="flex flex-row space-x-2 items-center justify-center">
              <button
                onClick={() => handleChangePassword()}
                disabled={
                  passwordError ||
                  newPassword !== confirmNewPassword ||
                  password.length === 0 ||
                  newPassword.length === 0 ||
                  confirmNewPassword.length === 0
                }
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(30, 41, 59, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                  border: '1.5px solid #3b82f6',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setModalPassword(false)}
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(30, 41, 59, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                  border: '1.5px solid #f63b3bff',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(246, 59, 59, 0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleModalforAccountDelete = () => {
    return (
      <div className="modal modal-open modal-bottom sm:modal-middle items-center justify-center">
        {notification && (
          <Notify
            title={notification.title}
            message={notification.message}
            duration={1500}
            key={notification.message + notification.title + Date.now()}
            type={notification.type}
            // Notify handles its own visibility, but we clear notification after duration to allow re-showing
            onClose={() => setNotification(null)}
          />
        )}
        <div
          className="modal-box border border-blue-500 shadow-xl rounded-xl"
          style={{
            background: 'rgba(10, 20, 40, 0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid #3b82f6',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          }}
        >
          <h3 className="font-bold text-lg text-amber-50">Delete your account</h3>
          <div className="flex flex-col justify-start  text-xs">
            <PasswordInput
              value={password}
              errorMessage={''}
              placeholder="Your password"
              type="password"
              onChange={setPassword}
            />
            <div className="flex flex-row justify-start space-x-2 space-y-2 mt-4">
              <button
                onClick={() => handleDeleteAccount()}
                disabled={password.length === 0}
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(30, 41, 59, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                  border: '1.5px solid #3b82f6',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
              <button
                onClick={() => setModalDeleteAccount(false)}
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(30, 41, 59, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                  border: '1.5px solid #f63b3bff',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(246, 59, 59, 0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="divider divider-primary"></div>
            <p className="text-amber-50 mt-2 text-center text-xs">
              Hint: This process will not be returnable. You will be logged out immediately.
            </p>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div>
      <Header />
      <TemplatePage>
        <div>
          {emailModal && handleEmailModal()}
          {modalPassword && handleModalforPassword()}
          {modalDeleteAccount && handleModalforAccountDelete()}

          <div className="divider divider-primary">Credentials</div>
          <div className="flex flex-col items-center overflow-y-auto  max-h-130">
            <WorkoutCard onClick={() => setEmailModal(true)}>
              <img
                style={{ filter: 'brightness(0) invert(1)' }}
                src="/mail.png"
                alt="Email Icon"
                className="w-8 h-8 mb-2"
              />
            </WorkoutCard>
            <WorkoutCard onClick={() => setModalPassword(true)}>
              <img
                style={{ filter: 'brightness(0) invert(1)' }}
                src="/password.png"
                alt="Password Icon"
                className="w-8 h-8 mb-2"
              />
            </WorkoutCard>
            <WorkoutCard onClick={() => setModalDeleteAccount(true)}>
              <img
                style={{ filter: 'brightness(0) invert(1)' }}
                src="/recycle-bin.png"
                alt="Delete Account Icon"
                className="w-8 h-8 mb-2"
              />
            </WorkoutCard>
          </div>
        </div>
      </TemplatePage>
    </div>
  );
}

export default CredentialsPage;
