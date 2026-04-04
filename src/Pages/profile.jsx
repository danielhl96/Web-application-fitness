import '../index.css';
import Header from '../Components/Header.jsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Utils/api';
import TemplatePage from '../Components/templatepage.jsx';
import Notify from './notify.jsx';
import Input from '../Components/input.jsx';
import ApexCharts from 'apexcharts';
import Button from '../Components/button.jsx';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

function HumanSilhouette({ gender = 'female', bmi = 22, height = 0, waist = 0, hip = 0 }) {
  const male = gender !== 'female';
  const torsoPath = male
    ? 'M 26,36 C 24,52 36,68 36,80 C 31,88 31,97 31,104 L 69,104 C 69,97 69,88 64,80 C 64,68 76,52 74,36 Z'
    : 'M 29,36 C 28,52 38,66 37,78 C 28,87 27,97 27,104 L 73,104 C 73,97 72,87 63,78 C 62,66 72,52 71,36 Z';
  const color = bmi > 30 ? '#ef4444' : bmi > 25 ? '#f97316' : bmi < 18.5 ? '#facc15' : '#4ade80';

  // Y-positions of measurement levels
  const waistY = male ? 78 : 74;
  const hipY = 104;

  return (
    <svg viewBox="0 0 160 200" className="w-44 h-50 drop-shadow-lg">
      {/* ── Body (shifted right to visually center it between left edge and labels) ── */}
      <g fill={color} transform="translate(30, 0)">
        <ellipse cx="50" cy="12" rx="11" ry="12" />
        <path d="M 44,24 L 56,24 L 57,34 L 43,34 Z" />
        <path d="M 26,36 C 19,50 17,68 19,90 L 27,90 C 25,68 26,52 30,38 Z" />
        <path d="M 74,36 C 81,50 83,68 81,90 L 73,90 C 75,68 74,52 70,38 Z" />
        <path d={torsoPath} />
        <path d="M 31,104 C 29,112 26,128 27,150 L 27,178 L 39,178 L 39,150 C 40,128 41,112 42,104 Z" />
        <path d="M 69,104 C 71,112 74,128 73,150 L 73,178 L 61,178 L 61,150 C 60,128 59,112 58,104 Z" />
      </g>

      {/* ── Measurement markers (rendered on top of body) ── */}
      <g stroke="rgba(255,255,255,0.85)" strokeWidth="0.7" fill="none">
        {/* Height: vertical double-arrow on the right */}
        {height > 0 && (
          <g>
            <line x1="121" y1="2" x2="121" y2="178" />
            <line x1="118" y1="2" x2="124" y2="2" />
            <path d="M 119,6 L 121,2 L 123,6" />
            <line x1="118" y1="178" x2="124" y2="178" />
            <path d="M 119,174 L 121,178 L 123,174" />
            <text
              x="121"
              y="192"
              fill="rgba(255,255,255,0.95)"
              stroke="none"
              fontSize="8"
              fontWeight="bold"
              textAnchor="middle"
            >
              {height} cm
            </text>
          </g>
        )}

        {/* Waist: dashed horizontal level line */}
        {waist > 0 && (
          <g strokeDasharray="2.5,1.5">
            <line x1="47" y1={waistY} x2="119" y2={waistY} />
            <text
              x="123"
              y={waistY + 2.5}
              fill="rgba(255,255,255,0.95)"
              stroke="none"
              fontSize="8"
              fontWeight="bold"
              textAnchor="start"
              strokeDasharray="0"
            >
              W {waist}cm
            </text>
          </g>
        )}

        {/* Hip: dashed horizontal level line */}
        {hip > 0 && (
          <g strokeDasharray="2.5,1.5">
            <line x1="47" y1={hipY} x2="119" y2={hipY} />
            <text
              x="123"
              y={hipY + 2.5}
              fill="rgba(255,255,255,0.95)"
              stroke="none"
              fontSize="8"
              fontWeight="bold"
              textAnchor="start"
              strokeDasharray="0"
            >
              H {hip}cm
            </text>
          </g>
        )}
      </g>
    </svg>
  );
}

function Profile() {
  const navigate = useNavigate();
  const [bmi, setBmi] = useState(0);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0.0);
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
  const [showTrend, setShowTrend] = useState(false);
  const [bodyvalue, setBodyvalue] = useState(null);
  const [selectedBodyValue, setSelectedBodyValue] = useState('weight');

  function ChartRenderer({ bodyvalue, type }) {
    useEffect(() => {
      if (!bodyvalue) return;

      const dates = bodyvalue.map((e) => e.date);

      console.log(dates);

      const weights = bodyvalue.map((e) => e[type]);

      const options = {
        series: [
          {
            name: 'Weight (kg)',
            data: weights,
          },
        ],
        chart: {
          height: 300,
          type: 'area',
          zoom: { enabled: false },
          toolbar: { show: false },
          menubar: { show: false },
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' },
        title: {
          text: `Progress for ${type.charAt(0).toUpperCase() + type.slice(1)}`,
          align: 'left',
          style: { color: '#FFFFFF' },
        },
        grid: { show: false },
        xaxis: {
          categories: dates,
          labels: { style: { colors: '#FFFFFF', fontSize: '9px' } },
        },
        yaxis: {
          labels: {
            style: { colors: '#FFFFFF' },
            formatter: (value) =>
              value +
              (type === 'weight'
                ? ' kg'
                : type === 'waist'
                  ? ' cm'
                  : type === 'hip'
                    ? ' cm'
                    : type === 'bfp'
                      ? ' %'
                      : ''),
          },
        },
        tooltip: {
          theme: 'dark',
          style: {
            fontSize: '12px',
            color: '#000000',
          },
        },
      };

      const chart = new ApexCharts(document.querySelector('#chart'), options);
      chart.render();

      return () => chart.destroy();
    }, [bodyvalue]);
  }

  const activityLevels = {
    1.2: 'Not active',
    1.4: 'Lightly active',
    1.7: 'Moderately active',
    '2.0': 'Very active',
  };
  useEffect(() => {
    api
      .get('/users/profile')
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

    api.get('/users/get_history').then((response) => {
      const data = response.data;
      console.log('Fetched history data:', data);
      setBodyvalue(data);
    });
  }, [edit]);

  const handleEdit = () => {
    api
      .put('/users/edit_profile', {
        bmi,
        height,
        weight,
        hip,
        waist,
        goal,
        bfp,
        gender,
        age,
        calories,
        activity_level: activity,
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

  function cardForValues(children) {
    return (
      <div
        className="card w-full items-center justify-center  lg:w-40 h-[5dvh] bg-black/20 border border-blue-500 shadow-xl rounded-xl backdrop-blur-lg"
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}
      >
        {children}
      </div>
    );
  }

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

        {showTrend && (
          <div className="">
            <div id="chart"></div>

            <ChartRenderer bodyvalue={bodyvalue} type={selectedBodyValue} />
            <div className="divider divider-primary"></div>
            <div className="flex flex-row space-x-2 ">
              <select
                className="w-auto h-10 px-11 py-0 rounded-xl border border-blue-400 bg-white/10 text-white shadow-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{
                  background: 'rgba(30, 41, 59, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                  border: '1.5px solid rgba(59, 130, 246, 0.25)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                }}
                onChange={(e) => {
                  console.log(e.target.value);
                  setSelectedBodyValue(e.target.value);
                  // Hier kannst du die Logik hinzufügen, um den Chart basierend auf der Auswahl zu aktualisieren
                }}
              >
                <option disabled selected>
                  Select Body Value
                </option>
                <option value="weight">Weight</option>
                <option value="bfp">Body Fat Percentage</option>
                <option value="waist">Waist Circumference</option>
                <option value="hip">Hip Circumference</option>
              </select>
              <Button border="#f63b3bff" onClick={() => setShowTrend(false)}>
                Close{' '}
              </Button>
            </div>
          </div>
        )}

        {edit ? (
          <div className="space-y-2 flex flex-col items-center ">
            <div className="divider  text-amber-50 font-bold mb-2  divider-primary">Profile</div>

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

            <div className="flex flex-row space-x-2  items-center justify-center">
              <Button
                border={gender === 'male' ? '#3b82f6' : '#64748b'}
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
                border={gender === 'female' ? '#3b82f6' : '#64748b'}
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

            <div className="divider divider-primary">Your goals:</div>
            <div className="flex flex-row space-x-2 items-center justify-center">
              <Button border={goal === '1' ? '#3b82f6' : '#64748b'} onClick={() => handleGoal('1')}>
                Cut
              </Button>
              <Button border={goal === '2' ? '#3b82f6' : '#64748b'} onClick={() => handleGoal('2')}>
                Hold
              </Button>
              <Button border={goal === '3' ? '#3b82f6' : '#64748b'} onClick={() => handleGoal('3')}>
                Bulk
              </Button>
            </div>
            <div className="divider divider-primary">Important values</div>
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
          !showTrend && (
            <div className="flex flex-col justify-center items-center">
              <div className="divider  text-amber-50 font-bold mb-2  divider-primary">Profile</div>

              <HumanSilhouette gender={gender} bmi={bmi} height={height} waist={waist} hip={hip} />
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                {cardForValues(<h1>Age: {age} years</h1>)}

                {cardForValues(
                  <div className="flex flex-row items-center gap-2">
                    <img
                      src="/body-weight.png"
                      alt="weight"
                      className="w-5 h-5 object-contain invert"
                    />
                    <h1>{weight} kg</h1>
                  </div>
                )}

                {cardForValues(
                  <h1
                    style={{
                      color: bmi > 30 ? 'red' : bmi > 25 ? 'orange' : bmi < 20 ? 'yellow' : 'green',
                    }}
                  >
                    <div className="flex flex-row text-xs items-center gap-2">
                      <img src="/bmi.png" alt="weight" className="w-5 h-5 object-contain invert" />
                      {Math.round(bmi)}{' '}
                      {bmi > 30
                        ? '(Adipoistas)'
                        : bmi > 25
                          ? '(Overweight)'
                          : bmi < 20
                            ? '(Underweight)'
                            : '(Normal)'}
                    </div>
                  </h1>
                )}
                {cardForValues(
                  <h1
                    style={{
                      color: bri > 4.5 ? 'red' : bri > 3 ? 'orange' : 'green',
                    }}
                  >
                    BRI: {bri.toFixed(2)}
                  </h1>
                )}
                {cardForValues(
                  <h1 style={{ color: hwr >= 0.85 ? 'red' : 'green' }}>
                    WHR: {(hwr || 0).toFixed(2)} {hwr >= 0.85 ? '(Risk)' : '(Good)'}
                  </h1>
                )}
                {cardForValues(
                  <h1 style={{ color: bfp > 25 ? 'red' : 'green' }}>BFP: {Math.round(bfp)} %</h1>
                )}
                {cardForValues(
                  <div className="flex flex-row  items-center gap-2">
                    <img src="/meal.png" alt="weight" className="w-5 h-5 object-contain invert" />
                    <h1>{Math.round(calories)} kcal</h1>
                  </div>
                )}

                {cardForValues(
                  <div className="flex flex-row  items-center gap-2">
                    <img src="/goal.png" alt="weight" className="w-5 h-5 object-contain invert" />
                    <h1> {goal == 1 ? 'Cut' : goal == 2 ? 'Hold' : 'Bulk'}</h1>
                  </div>
                )}
                {cardForValues(
                  <h1
                    style={
                      parseFloat(activity) <= 1.2
                        ? { color: 'red' }
                        : parseFloat(activity) >= 1.5
                          ? { color: 'green' }
                          : { color: 'orange' }
                    }
                  >
                    Activity: {activityLevels[activity] ?? 'UNS'}
                  </h1>
                )}
              </div>
              <div className="divider  text-amber-50 font-light mb-2  divider-primary">
                Updates and Trends
              </div>

              <div className="flex flex-row space-x-2 items-center justify-center">
                <Button
                  onClick={() => {
                    setShowTrend(true);
                    setEdit(false);
                  }}
                  border="#3b82f6"
                >
                  <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                </Button>

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
          )
        )}
      </TemplatePage>
    </div>
  );
}

export default Profile;
