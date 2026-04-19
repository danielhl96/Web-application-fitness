import '../index.css';
import Header from '../Components/Header.js';
import { useEffect, useState } from 'react';
import api from '../Utils/api.js';
import TemplatePage from '../Components/templatepage.js';
import Notify from '../Components/notify.js';
import History from '../Components/history.tsx';
import EditProfile from '../Components/editprofile.tsx';
import ViewProfile from '../Components/viewprofile.tsx';
import loadingComponente from '../Components/loading.tsx';
import {
  UI_STATE,
  UserHistory,
  User,
  Notification,
  ProfileForm,
  ProfileFormErrors,
} from '../types';

function Profile() {
  const [form, setForm] = useState<ProfileForm>({
    bmi: 0,
    height: 0,
    weight: 0,
    hwr: 0,
    hip: 0,
    waist: 0,
    goal: 0,
    bfp: 0,
    gender: '',
    age: 0,
    calories: 0,
    activity: '',
    bri: 0,
  });
  const [formErrors, setFormErrors] = useState<ProfileFormErrors>({
    height: false,
    weight: false,
    hip: false,
    waist: false,
    age: false,
    bfp: false,
  });
  const [edit, setEdit] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  const [user, setUser] = useState<UI_STATE<User>>({ type: 'loading' });
  const [showTrend, setShowTrend] = useState<boolean>(false);
  const [bodyvalue, setBodyvalue] = useState<UserHistory[] | null>(null);
  const [selectedBodyValue, setSelectedBodyValue] = useState<string>('weight');

  useEffect(() => {
    getProfile();
    get_history();
  }, [edit]);

  const get_history = (): void => {
    api.get('/users/get_history').then((response: { data: UserHistory[] }) => {
      const data = response.data;
      setBodyvalue(data);
    });
  };

  const getProfile = (): void => {
    setUser({ type: 'loading' });
    api
      .get('/users/profile')
      .then((response: { data: User }) => {
        const data = response.data;
        console.log('Fetched user data:', data);
        setUser({ type: 'success', data });
        setForm({
          bmi: data.bmi,
          height: data.height,
          weight: data.weight,
          hwr: data.waist / data.hip,
          hip: data.hip,
          waist: data.waist,
          goal: data.goal,
          bfp: data.bfp,
          gender: data.gender,
          age: data.age,
          calories: data.calories,
          activity: data.activity_level,
          bri: 0,
        });
      })
      .catch((error) => {
        setUser({ type: 'error', error: error.message || 'Error fetching user data' });
      });
  };

  const handleEdit = (): void => {
    api
      .put('/users/edit_profile', {
        bmi: form.bmi,
        height: form.height,
        weight: form.weight,
        hip: form.hip,
        waist: form.waist,
        goal: form.goal.toString(),
        bfp: form.bfp,
        gender: form.gender,
        age: form.age,
        calories: form.calories,
        activity_level: form.activity,
      })
      .then(() => {
        setNotification({
          title: 'Profile Updated',
          message: 'Your profile has been updated successfully.',
          type: 'success',
        });
        setEdit(false);
      })
      .catch(() => {
        setNotification({
          title: 'Error',
          message: 'There was an error updating your profile.',
          type: 'error',
        });
      });
  };

  const handleBmi = (): void => {
    setForm((prev) => ({
      ...prev,
      bmi: prev.weight / ((prev.height / 100) * (prev.height / 100)),
    }));
  };

  const handleAge = (e: string): void => {
    const value = parseFloat(e);
    if (value <= 0 || isNaN(value)) {
      setFormErrors((prev) => ({ ...prev, age: true }));
    } else {
      setForm((prev) => ({ ...prev, age: value }));
      setFormErrors((prev) => ({ ...prev, age: false }));
    }
  };
  const handleActivity = (activity: string): void => {
    setForm((prev) => ({ ...prev, activity }));
  };

  const handleBri = (): void => {
    if (form.height === 0 || form.waist === 0) return;
    setForm((prev) => ({
      ...prev,
      bri: 364.2 - 365.5 * Math.sqrt(1 - Math.pow(prev.waist / Math.PI / prev.height, 2)),
    }));
  };

  const handleHeight = (e: string): void => {
    const value = parseFloat(e);
    if (value < 100 || isNaN(value)) {
      setFormErrors((prev) => ({ ...prev, height: true }));
    } else {
      setForm((prev) => ({ ...prev, height: value }));
      setFormErrors((prev) => ({ ...prev, height: false }));
    }
  };

  const handleWeight = (e: string): void => {
    const value = parseFloat(e);
    if (value < 20 || isNaN(value)) {
      setFormErrors((prev) => ({ ...prev, weight: true }));
    } else {
      setForm((prev) => ({ ...prev, weight: value }));
      setFormErrors((prev) => ({ ...prev, weight: false }));
    }
  };

  const handleHwr = (): void => {
    setForm((prev) => ({ ...prev, hwr: prev.waist / prev.hip }));
  };

  const handleHip = (e: string): void => {
    const value = parseFloat(e);
    if (value < 50 || isNaN(value)) {
      setFormErrors((prev) => ({ ...prev, hip: true }));
    } else {
      setForm((prev) => ({ ...prev, hip: value, hwr: prev.waist / value }));
      setFormErrors((prev) => ({ ...prev, hip: false }));
    }
  };

  const handleWaist = (e: string): void => {
    const value = parseFloat(e);
    if (value < 20 || isNaN(value)) {
      setFormErrors((prev) => ({ ...prev, waist: true }));
    } else {
      setForm((prev) => ({ ...prev, waist: value, hwr: value / prev.hip }));
      setFormErrors((prev) => ({ ...prev, waist: false }));
    }
  };

  const handleGender = (gender: string): void => {
    setForm((prev) => ({ ...prev, gender }));
  };

  const handleGoal = (goal: string): void => {
    setForm((prev) => ({ ...prev, goal: parseInt(goal, 10) }));
  };

  const handleBFP = (e: string): void => {
    const value = parseFloat(e);
    if (value <= 0 || isNaN(value)) {
      setFormErrors((prev) => ({ ...prev, bfp: true }));
    } else {
      setForm((prev) => ({ ...prev, bfp: value }));
      setFormErrors((prev) => ({ ...prev, bfp: false }));
    }
  };

  const calcCalories = (): void => {
    setForm((prev) => {
      let l = 0;
      if (prev.goal === 1) l -= prev.weight * 0.01 * 1000;
      if (prev.goal === 3) l += 200;
      if (prev.gender === 'male') {
        return {
          ...prev,
          calories:
            (prev.weight * 10 + 6.25 * prev.height - 5 * prev.age + 5) * parseFloat(prev.activity) +
            l,
        };
      } else if (prev.gender === 'female') {
        return {
          ...prev,
          calories:
            (prev.weight * 10 + 6.25 * prev.height - 5 * prev.age - 161) *
              parseFloat(prev.activity) +
            l,
        };
      }
      return prev;
    });
  };

  useEffect(() => {
    if (edit) calcCalories();
    handleBri();
  }, [form.gender, form.weight, form.height, form.age, form.activity, form.goal]);

  useEffect(() => {
    handleBmi();
  }, [form.height, form.weight]);

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
            bmi={form.bmi}
            height={form.height}
            weight={form.weight}
            hwr={form.hwr}
            hip={form.hip}
            waist={form.waist}
            goal={form.goal.toString()}
            bfp={form.bfp}
            failureAge={formErrors.age}
            failureWeight={formErrors.weight}
            failureHeight={formErrors.height}
            failureWaist={formErrors.waist}
            failureHip={formErrors.hip}
            failureBFP={formErrors.bfp}
            gender={form.gender}
            age={form.age}
            calories={form.calories}
            activity={form.activity}
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
              bmi={form.bmi}
              height={form.height}
              weight={form.weight}
              hwr={form.hwr}
              hip={form.hip}
              waist={form.waist}
              goal={form.goal}
              bfp={form.bfp}
              gender={form.gender}
              age={form.age}
              calories={form.calories}
              activity={form.activity}
              bri={form.bri}
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
            <div className="flex flex-col justify-center items-center h-[60vh]">
              {loadingComponente('Loading profile...')}
            </div>
          ))
        )}
      </TemplatePage>
    </div>
  );
}

export default Profile;
