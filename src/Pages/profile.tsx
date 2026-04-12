import '../index.css';
import Header from '../Components/Header.js';
import { useEffect, useState } from 'react';
import api from '../Utils/api.js';
import TemplatePage from '../Components/templatepage.js';
import Notify from '../Components/notify.js';
import History from '../Components/history.tsx';
import EditProfile from '../Components/editprofile.tsx';
import ViewProfile from '../Components/viewprofile.tsx';
import { UI_STATE } from './types.ts';
import { User } from './types.ts';
function Profile() {
  const [bmi, setBmi] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0.0);
  const [hwr, setHwr] = useState<number>(0);
  const [hip, setHip] = useState<number>(0);
  const [waist, setWaist] = useState<number>(0);
  const [goal, setGoal] = useState<number>(0);
  const [bfp, setBFP] = useState<number>(0);
  const [gender, setGender] = useState<string>('');
  const [age, setAge] = useState<number>(0);
  const [calories, setCalories] = useState<number>(0.0);
  const [activity, setActivity] = useState<string>('');
  const [failureHeight, setFailureHeight] = useState<boolean>(false);
  const [failureWeight, setFailureWeight] = useState<boolean>(false);
  const [failureHip, setFailureHip] = useState<boolean>(false);
  const [failureWaist, setFailureWaist] = useState<boolean>(false);
  const [failureAge, setFailureAge] = useState<boolean>(false);
  const [failureBFP, setFailureBFP] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [bri, setBri] = useState<number>(0);
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const [user, setUser] = useState<UI_STATE<User>>({ type: 'loading' });
  const [showTrend, setShowTrend] = useState<boolean>(false);
  const [bodyvalue, setBodyvalue] = useState<any>(null);
  const [selectedBodyValue, setSelectedBodyValue] = useState<string>('weight');

  useEffect(() => {
    getProfile();
    get_history();
  }, [edit]);

  const activityLevels = {
    1.2: 'Not active',
    1.4: 'Lightly active',
    1.7: 'Moderately active',
    '2.0': 'Very active',
  };

  const get_history = () => {
    api.get('/users/get_history').then((response) => {
      const data = response.data;

      console.log('Fetched history data:', data);
      setBodyvalue(data);
    });
  };

  const getProfile = (): void => {
    setUser({ type: 'loading' });
    api
      .get('/users/profile')
      .then((response: { data: User }) => {
        const data = response.data;
        setUser({ type: 'success', data: data });
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
  };

  const handleEdit = (): void => {
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
      .then((response: { data: any }) => {
        console.log('Profile updated successfully:', response.data);
        setNotification({
          title: 'Profile Updated',
          message: 'Your profile has been updated successfully.',
          type: 'success',
        });
        setEdit(false);
      })
      .catch((error: any) => {
        console.error('Error updating profile:', error);
        setNotification({
          title: 'Error',
          message: 'There was an error updating your profile.',
          type: 'error',
        });
      });
  };

  const handleBmi = (): void => {
    setBmi(weight / (((height / 100) * height) / 100));
  };

  const handleAge = (e: string): void => {
    const value = parseFloat(e);
    if (value <= 0 || isNaN(value)) {
      setFailureAge(true);
    } else {
      setAge(value);
      setFailureAge(false);
    }
  };
  const handleActivity = (activity: string) => {
    setActivity(activity);
  };

  const handleBri = (): void => {
    if (height === 0 || waist === 0) return; // Vermeide Division durch 0
    setBri(364.2 - 365.5 * Math.sqrt(1 - Math.pow(waist / Math.PI / height, 2)));
  };

  const handleHeight = (e: string): void => {
    const value = parseFloat(e);

    if (value < 100 || isNaN(value)) {
      setFailureHeight(true);
    } else {
      setHeight(value);
      setFailureHeight(false);
    }
  };

  const handleWeight = (e: string): void => {
    const value = parseFloat(e);
    if (value < 20 || isNaN(value)) {
      setFailureWeight(true);
    } else {
      setWeight(value);
      console.log(value);
      setFailureWeight(false);
    }
  };

  const handleHwr = (): void => {
    setHwr(waist / hip);
  };

  const handleHip = (e: string): void => {
    const value = parseFloat(e);
    if (value < 50 || isNaN(value)) {
      setFailureHip(true);
    } else {
      setHip(value);
      handleHwr();
      setFailureHip(false);
    }
  };

  const handleWaist = (e) => {
    const value = parseFloat(e);
    if (value < 20 || isNaN(value)) {
      setFailureWaist(true);
    } else {
      setWaist(value);
      handleHwr();
      setFailureWaist(false);
    }
  };

  const handleGender = (gender: string) => {
    setGender(gender);
  };

  const handleGoal = (goal: string): void => {
    setGoal(parseInt(goal, 10));
  };

  const handleBFP = (e: string): void => {
    const value = parseFloat(e);
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
          <History
            bodyvalue={bodyvalue}
            selectedBodyValue={selectedBodyValue}
            setSelectedBodyValue={setSelectedBodyValue}
            setShowTrend={setShowTrend}
          />
        )}

        {edit ? (
          <EditProfile
            bmi={bmi}
            height={height}
            weight={weight}
            hwr={hwr}
            hip={hip}
            waist={waist}
            goal={goal.toString()}
            bfp={bfp}
            failureAge={failureAge}
            failureWeight={failureWeight}
            failureHeight={failureHeight}
            failureWaist={failureWaist}
            failureHip={failureHip}
            failureBFP={failureBFP}
            gender={gender}
            age={age}
            calories={calories}
            activity={activity}
            handleAge={handleAge}
            handleWeight={handleWeight}
            handleHeight={handleHeight}
            handleHip={handleHip}
            handleWaist={handleWaist}
            handleGender={handleGender}
            handleGoal={handleGoal}
            handleBFP={handleBFP}
            handleActivity={handleActivity}
            handleEdit={handleEdit}
            setEdit={setEdit}
          />
        ) : (
          !showTrend &&
          (user.type === 'success' ? (
            <ViewProfile
              bmi={bmi}
              height={height}
              weight={weight}
              hwr={hwr}
              hip={hip}
              waist={waist}
              goal={goal}
              bfp={bfp}
              gender={gender}
              age={age}
              calories={calories}
              activity={activityLevels[activity] || 'Unknown'}
              bri={bri}
              setShowTrend={setShowTrend}
              setEdit={setEdit}
            />
          ) : user.type === 'error' ? (
            <div className="flex flex-col justify-center items-center mt-8 gap-3">
              <span className="text-red-400">Error loading user data</span>
              <button className="btn btn-sm btn-outline btn-error" onClick={getProfile}>
                Retry
              </button>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <span className="loading loading-bars loading-xl"></span>
              <div className="text-gray-500 mt-4">Loading profile...</div>
            </div>
          ))
        )}
      </TemplatePage>
    </div>
  );
}

export default Profile;
