import { profileService } from '../services/profileService.ts';
import { useEffect, useState } from 'react';
import {
  UI_STATE,
  UserHistory,
  User,
  Notification,
  ProfileForm,
  ProfileFormErrors,
} from '../types';

export function useProfile() {
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
    profileService.getHistory().then((data: UserHistory[]) => {
      setBodyvalue(data);
    });
  };

  const getProfile = (): void => {
    setUser({ type: 'loading' });
    profileService
      .get()
      .then((data: User) => {
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
    profileService
      .EditProfile({
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
  return {
    form,
    formErrors,
    edit,
    notification,
    user,
    showTrend,
    bodyvalue,
    selectedBodyValue,
    setSelectedBodyValue,
    setShowTrend,
    handleAge,
    handleActivity,
    handleBri,
    handleHeight,
    handleWeight,
    handleHwr,
    handleHip,
    handleWaist,
    handleGender,
    handleGoal,
    handleBFP,
    handleEdit,
    setNotification,
    setEdit,
  };
}
