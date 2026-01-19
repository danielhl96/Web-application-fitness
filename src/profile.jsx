import './index.css';
import Header from './Header';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import TemplatePage from './templatepage.jsx';
import Notify from './notify.jsx';
import PasswordInput from './passwordinput.jsx';
import EmailInput from './emailinput.jsx';
import Input from './input.jsx';
import Button from './button.jsx';
function Profile() {
  const navigate = useNavigate();
  const [bmi, setBmi] = useState(0);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [hwr, setHwr] = useState(0);
  const [hip, setHip] = useState(0);
  const [waist, setWaist] = useState(0);
  const [goal, setGoal] = useState(0);
  const [bfp, setBFP] = useState(0);
  const [gender, setGender] = useState('');
  const [age, setAge] = useState(0);
  const [calories, setCalories] = useState(0.0);
  const [activity, setActivity] = useState('');
  const [failureHeight, setFailureHeight] = useState(false);
  const [failureWeight, setFailureWeight] = useState(false);
  const [failureHip, setFailureHip] = useState(false);
  const [failureWaist, setFailureWaist] = useState(false);
  const [failureAge, setFailureAge] = useState(false);
  const [failureBFP, setFailureBFP] = useState(false);
  const [edit, setEdit] = useState(false);
  const [bri, setBri] = useState(0);
  const [modalPassword, setModalPassword] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [inputTouched, setInputTouched] = useState(false);
  const [message, setMessage] = useState('');
  const [errorEmailMessage, setErrorEmailMessage] = useState('');
  const [errorEmailMessageAPI, setErrorEmailMessageAPI] = useState('');
  const [modalDeleteAccount, setModalDeleteAccount] = useState(false);
  const [messageDeleteAccount, setMessageDeleteAccount] = useState('');
  const [notification, setNotification] = useState(null);

  const activityLevels = {
    1.2: 'Not active',
    1.4: 'Lightly active',
    1.7: 'Moderately active',
    '2.0': 'Very active',
  };
  useEffect(() => {
    api
      .get('/get_profile')
      .then((response) => {
        const data = response.data;
        console.log('Fetched profile data:', data);
        setBmi(data.bmi);
        setHeight(data.height);
        setWeight(data.weight);
        setHwr(data.waist / data.hip);
        setHip(data.hip);
        setWaist(data.waist);
        setGoal(data.goal);
        setBFP(data.bfp);
        setGender(data.gender);
        setAge(data.age);
        setCalories(data.calories);
        setActivity(data.activity_level);
      })
      .catch((error) => {
        console.error('Error fetching profile data:', error);
      });
  }, [edit]);

  const handleEdit = () => {
    api
      .put('/profile', {
        bmi,
        height,
        weight,
        hwr,
        hip,
        waist,
        goal,
        bfp,
        gender,
        age,
        calories,
        activity,
      })
      .then((response) => {
        console.log('Profile updated successfully:', response.data);
        setNotification({
          title: 'Profile Updated',
          message: 'Your profile has been updated successfully.',
          type: 'success',
        });
        setEdit(false);
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        setNotification({
          title: 'Error',
          message: 'There was an error updating your profile.',
          type: 'error',
        });
      });
  };

  const handleBmi = () => {
    setBmi(weight / (((height / 100) * height) / 100));
  };

  const handleAge = (e) => {
    const value = parseFloat(e.target.value);
    if (value <= 0 || isNaN(value)) {
      setFailureAge(true);
    } else {
      setAge(value);
      setFailureAge(false);
    }
  };
  const handleActivity = (activity) => {
    console.log(activity);
    setActivity(activity);
  };

  const handleBri = () => {
    if (height === 0 || waist === 0) return; // Vermeide Division durch 0
    setBri(364.2 - 365.5 * Math.sqrt(1 - Math.pow(waist / Math.PI / height, 2)));
  };

  const handleHeight = (e) => {
    const value = parseFloat(e.target.value);

    if (value < 100 || isNaN(value)) {
      setFailureHeight(true);
    } else {
      setHeight(value);
      setFailureHeight(false);
    }
  };

  const handleWeight = (e) => {
    const value = parseFloat(e.target.value);
    if (value < 20 || isNaN(value)) {
      setFailureWeight(true);
    } else {
      setWeight(value);
      console.log(value);
      setFailureWeight(false);
    }
  };

  const handleHwr = () => {
    setHwr(waist / hip);
  };

  const handleHip = (e) => {
    const value = parseFloat(e.target.value);
    if (value < 50 || isNaN(value)) {
      setFailureHip(true);
    } else {
      setHip(value);
      handleHwr();
      setFailureHip(false);
    }
  };

  const handleWaist = (e) => {
    const value = parseFloat(e.target.value);
    if (value < 20 || isNaN(value)) {
      setFailureWaist(true);
    } else {
      setWaist(value);
      handleHwr();
      setFailureWaist(false);
    }
  };

  const handleGender = (gender) => {
    setGender(gender);
  };

  const handleGoal = (goal) => {
    setGoal(goal);
  };

  const handleBFP = (e) => {
    const value = parseFloat(e.target.value);
    if (value <= 0 || isNaN(value)) {
      setFailureBFP(true);
    } else {
      setBFP(value);
      setFailureBFP(false);
    }
  };

  const calcCalories = () => {
    let l = 0;
    if (goal == 1) {
      l -= weight * 0.01 * 1000;
    }
    if (goal == 3) {
      l += 200;
    }
    if (gender == 'male') {
      setCalories((weight * 10 + 6.25 * height - 5 * age + 5) * parseFloat(activity) + l);
    } else if (gender == 'female') {
      setCalories((weight * 10 + 6.25 * height - 5 * age - 161) * parseFloat(activity) + l);
    }
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

  const handlelogout = () => {
    api.post('/logout', {}, { withCredentials: true }).then(() => navigate('/login'));
  };

  const handleDeleteAccount = () => {
    api
      .delete('/delete_account', {
        data: { password: password },
      })
      .then((response) => {
        console.log('Account deleted successfully:', response.data);
        setNotification({
          title: 'Account Deleted',
          message: 'Your account has been deleted successfully.',
          type: 'success',
        });
        setTimeout(() => {
          handlelogout();
        }, 1200); // 1,2 Sekunden warten, damit Notify sichtbar ist
      })
      .catch((error) => {
        console.error('Error deleting account:', error);
        setNotification({
          title: 'Error',
          message: 'There was an error deleting your account.',
          type: 'error',
        });
      });
  };

  useEffect(() => {
    setPasswordError(
      newPassword.length < 8 ||
        newPassword.length < 8 ||
        !/[A-Z]/.test(newPassword) ||
        !/[a-z]/.test(newPassword) ||
        !/\d/.test(newPassword) ||
        !/[!@#$%^&*]/.test(newPassword)
    );
  }, [password, newPassword, confirmNewPassword]);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (newEmail && !emailRegex.test(newEmail)) {
      setErrorEmailMessage(
        <span className="text-red-500 text-xs text-center">
          Please enter a valid email address.
        </span>
      );
    } else {
      setErrorEmailMessage(null);
    }
  }, [newEmail]);

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
            />
            <div className="divider divider-primary"></div>
            <div className="flex flex-row space-x-2 items-center justify-center">
              <button
                onClick={() => handleChangeEmail()}
                disabled={!!errorEmailMessage || password.length === 0}
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
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
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
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
                  className="w-4 h-4 mr-2"
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
            {errorEmailMessageAPI}
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
              onError={(error) => console.log('Password error:', error)}
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
                disabled={passwordError || newPassword !== confirmNewPassword}
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
                style={{
                  background: 'rgba(30, 41, 59, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                  border:
                    passwordError || newPassword !== confirmNewPassword
                      ? '1.5px solid transparent'
                      : '1.5px solid #f63b3bff',
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setModalPassword(false)}
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
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
                  className="w-4 h-4 mr-2"
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
            {message}
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
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
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
                  className="w-4 h-4 mr-2"
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
                className="btn btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
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
              {messageDeleteAccount}
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

  useEffect(() => {
    if (edit) {
      calcCalories();
    }
    handleBri();
  }, [gender, weight, height, age, activity, goal]);

  useEffect(() => {
    handleBmi();
  }, [height, weight]);
  useEffect(() => {
    if (edit) {
      handleHwr();
    }
  }, [hip, waist]);

  return (
    <div>
      <Header />
      <TemplatePage>
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
        {edit ? (
          <div className="space-y-2 flex flex-col items-center ">
            <div className="divider  text-amber-50 font-bold mb-2  divider-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-amber-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1  h-15">
                <h1>Age</h1>
                <Input
                  placeholder={age + ' years'}
                  id={'age'}
                  onChange={handleAge}
                  w="w-24"
                  h="h-8"
                />
                {failureAge && (
                  <h1 style={{ color: 'red', fontSize: 8 }}>Please enter a valid age</h1>
                )}
              </div>
              <div className="flex flex-col space-y-1 h-15">
                <h1>Weight</h1>
                <Input
                  placeholder={weight + ' kg'}
                  id={'weight'}
                  onChange={handleWeight}
                  w="w-24"
                  h="h-8"
                />
                {failureWeight && (
                  <h1 style={{ color: 'red', fontSize: 8 }}>Please enter a valid weight</h1>
                )}
              </div>
              <div className="flex flex-col space-y-1  h-15">
                <h1>Height</h1>
                <Input
                  placeholder={height + ' cm'}
                  id={'height'}
                  onChange={handleHeight}
                  w="w-24"
                  h="h-8"
                />
                {failureHeight && (
                  <h1 style={{ color: 'red', fontSize: 8 }}>Please enter a valid height</h1>
                )}
              </div>
              <div className="flex flex-col space-y-1  h-15">
                <h1>Waist</h1>
                <Input
                  placeholder={waist + ' cm'}
                  id={'waist'}
                  onChange={handleWaist}
                  w="w-24"
                  h="h-8"
                />
                {failureWaist && (
                  <h1 style={{ color: 'red', fontSize: 8 }}>Please enter a valid waist</h1>
                )}
              </div>
              <div className="flex flex-col space-y-1  h-15">
                <h1>Hip</h1>
                <Input placeholder={hip + ' cm'} id={'hip'} onChange={handleHip} w="w-24" h="h-8" />
                {failureHip && (
                  <h1 style={{ color: 'red', fontSize: 8 }}>Please enter a valid hip</h1>
                )}
              </div>
              <div className="flex flex-col space-y-1  h-15">
                <h1>BFP</h1>
                <Input placeholder={bfp + ' %'} id={'bfp'} onChange={handleBFP} w="w-24" h="h-8" />
                {failureBFP && (
                  <h1 style={{ color: 'red', fontSize: 8 }}>Please enter a valid bfp</h1>
                )}
              </div>
            </div>
            <h1>Your gender:</h1>
            <div className="flex flex-row space-x-2  items-center justify-center">
              <Button
                border={gender === 'male' ? '#3b82f6' : 'transparent'}
                onClick={() => handleGender('male')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M9 1a1 1 0 0 0 0 2h2.586L8.707 5.879a5 5 0 1 0 1.414 1.414L13 4.414V7a1 1 0 0 0 2 0V1H9zM6 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
                </svg>
              </Button>
              <Button
                border={gender === 'female' ? '#3b82f6' : 'transparent'}
                onClick={() => handleGender('female')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0a5 5 0 0 0 0 10v1H6a.5.5 0 0 0 0 1h2v2a.5.5 0 0 0 1 0v-2h2a.5.5 0 0 0 0-1H9v-1a5 5 0 0 0 0-10zm0 1a4 4 0 1 1 0 8A4 4 0 0 1 8 1z" />
                </svg>
              </Button>
            </div>

            <select
              value={activity}
              defaultValue=""
              onChange={(e) => handleActivity(e.target.value)}
              className="select select-primary w-full max-w-xs shadow-lg border border-blue-400 text-white rounded-xl focus:ring-2 focus:ring-blue-400"
              style={{
                background: 'rgba(30, 41, 59, 0.25)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                border: '1.5px solid #3b82f6',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              <option value="" disabled>
                Activity level
              </option>
              <option value="1.2">Not active</option>
              <option value="1.4">Light activity</option>
              <option value="1.7">Moderate activity</option>
              <option value="2.0">Very active</option>
            </select>

            <div className="divider divider-neutral">Your goals:</div>
            <div className="flex flex-row space-x-2 items-center justify-center">
              <Button
                border={goal === '1' ? '#3b82f6' : 'transparent'}
                onClick={() => handleGoal('1')}
              >
                Cut
              </Button>
              <Button
                border={goal === '2' ? '#3b82f6' : 'transparent'}
                onClick={() => handleGoal('2')}
              >
                Hold
              </Button>
              <Button
                border={goal === '3' ? '#3b82f6' : 'transparent'}
                onClick={() => handleGoal('3')}
              >
                Bulk
              </Button>
            </div>
            <div className="divider divider-neutral">Important values</div>
            <div className="flex justify-center">
              <div className="flex flex-col space-y-2 items-center justify-center">
                <h1>Your calories: {calories} kcal</h1>
                <h1
                  style={{
                    color: bmi > 30 ? 'red' : bmi > 25 ? 'orange' : bmi < 20 ? 'yellow' : 'green',
                  }}
                >
                  Your BMI:{' '}
                  {bmi > 30
                    ? 'Adipoistas'
                    : bmi > 25
                      ? 'Overweight'
                      : bmi < 20
                        ? 'Underweight'
                        : 'Normal'}{' '}
                  ({Math.round(bmi)}){' '}
                </h1>
                <h1 style={{ color: hwr >= 0.85 ? 'red' : 'green' }}>
                  Your WHR: {hwr >= 0.85 ? 'Risk' : 'Good'}
                </h1>
              </div>
            </div>
            <div className="flex flex-row space-x-2 items-center justify-center">
              <Button
                onClick={() => handleEdit()}
                border="#3b82f6"
                disabled={
                  failureHeight == true ||
                  failureHip == true ||
                  failureWeight == true ||
                  failureWaist == true ||
                  failureHip == true
                }
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
              </Button>
              <Button onClick={() => setEdit(false)} border="#ef4444">
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
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <div className="divider  text-amber-50 font-bold mb-2  divider-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-amber-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <h1>Weight: {Math.round(weight)} kg</h1>
              <h1>Height: {Math.round(height)} cm</h1>
              <h1>Age: {Math.round(age)} years</h1>
              <div className="flex flex-row space-x-2 items-center">
                <h1>Gender:</h1>
                {gender == 'male' ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M9 1a1 1 0 0 0 0 2h2.586L8.707 5.879a5 5 0 1 0 1.414 1.414L13 4.414V7a1 1 0 0 0 2 0V1H9zM6 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0a5 5 0 0 0 0 10v1H6a.5.5 0 0 0 0 1h2v2a.5.5 0 0 0 1 0v-2h2a.5.5 0 0 0 0-1H9v-1a5 5 0 0 0 0-10zm0 1a4 4 0 1 1 0 8A4 4 0 0 1 8 1z" />
                  </svg>
                )}
              </div>
              <h1>Hip: {Math.round(hip)} cm</h1>
              <h1>Waist: {Math.round(waist)} cm</h1>
              <h1
                style={{
                  color: bmi > 30 ? 'red' : bmi > 25 ? 'orange' : bmi < 20 ? 'yellow' : 'green',
                }}
              >
                BMI: {Math.round(bmi)}{' '}
                {bmi > 30
                  ? '(Adipoistas)'
                  : bmi > 25
                    ? '(Overweight)'
                    : bmi < 20
                      ? '(Underweight)'
                      : '(Normal)'}
              </h1>
              <h1
                style={{
                  color: bri > 4.5 ? 'red' : bri > 3 ? 'orange' : 'green',
                }}
              >
                BRI: {bri.toFixed(2)}
              </h1>
              <h1 style={{ color: hwr >= 0.85 ? 'red' : 'green' }}>
                WHR: {(hwr || 0).toFixed(2)} {hwr >= 0.85 ? '(Risk)' : '(Good)'}
              </h1>
              <h1 style={{ color: bfp > 25 ? 'red' : 'green' }}>BFP: {Math.round(bfp)} %</h1>
              <h1>Calories: {Math.round(calories)} kcal</h1>

              <h1>Goal: {goal == 1 ? 'Cut' : goal == 2 ? 'Hold' : 'Bulk'}</h1>
              <h1
                style={
                  parseFloat(activity) <= 1.2
                    ? { color: 'red' }
                    : parseFloat(activity) >= 1.5
                      ? { color: 'green' }
                      : { color: 'orange' }
                }
              >
                Activity level: {activityLevels[activity] ?? 'UNS'}
              </h1>
            </div>
            <div className="divider  text-amber-50 font-light mb-2  divider-primary">
              Change your personal information
            </div>
            <div className="flex flex-row space-x-2 items-center justify-center">
              <Button onClick={() => setEdit(true)} border="#3b82f6">
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </Button>
              <Button onClick={() => navigate('/')} border="#ef4444">
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
              </Button>
            </div>
          </div>
        )}
      </TemplatePage>
    </div>
  );
}

export default Profile;
