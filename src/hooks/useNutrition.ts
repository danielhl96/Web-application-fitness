import { useState, useEffect } from 'react';
import api from '../Utils/api';
import { Meal, NotificationState, UI_STATE } from '../types';

export default function useNutrition() {
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const [dinnerMeals, setDinnerMeals] = useState<Meal[]>([]);
  const [launchMeals, setLaunchMeals] = useState<Meal[]>([]);
  const [breakfastMeals, setBreakfastMeals] = useState<Meal[]>([]);
  const [snackMeals, setSnackMeals] = useState<Meal[]>([]);
  const [showAudioModal, setShowAudioModal] = useState<boolean>(false);
  const [showInputSelect, setShowInputSelect] = useState<boolean>(false);
  const [meal, setMeal] = useState<Meal | null>(null);
  const [mealtype, setMealtype] = useState<string>('');
  const [calorieFactor, setCalorieFactor] = useState<number>(0);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showMeal, setShowMeal] = useState<boolean>(false);
  const [showFileUpload, setShowFileUpload] = useState<boolean>(false);
  const [showEditMeal, setShowEditMeal] = useState<boolean>(false);

  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<UI_STATE<Meal>>({ type: 'success', data: null });
  const [loadingMeals, setLoadingMeals] = useState<UI_STATE<Meal[]>>({ type: 'loading' });
  const [loadingProfile, setLoadingProfile] = useState<
    UI_STATE<{ calories: number; weight: number }>
  >({ type: 'loading' });
  const [notification, setNotification] = useState<NotificationState>(null);

  const dateString = `${year}-${month.toString().padStart(2, '0')}-${selectedDay
    .toString()
    .padStart(2, '0')}`;

  useEffect(() => {
    getProfile();
    refreshAllMeals();
  }, [selectedDay, month, year]);

  function getProfile() {
    setLoadingProfile({ type: 'loading' });
    api.get('users/profile').then((response) => {
      setLoadingProfile({
        type: 'success',
        data: { calories: response.data.calories, weight: response.data.weight },
      });
    });
  }

  function getDinnerMeals() {
    api
      .get('meals/get_dinner', { params: { date: dateString } })
      .then((response) => setDinnerMeals(response.data));
  }

  function getLunchMeals() {
    api
      .get('meals/get_lunch', { params: { date: dateString } })
      .then((response) => setLaunchMeals(response.data));
  }

  function getBreakfastMeals() {
    api
      .get('meals/get_breakfast', { params: { date: dateString } })
      .then((response) => setBreakfastMeals(response.data));
  }

  function getSnackMeals() {
    api
      .get('meals/get_snack', { params: { date: dateString } })
      .then((response) => setSnackMeals(response.data));
  }

  async function refreshAllMeals() {
    setLoadingMeals({ type: 'loading' });
    await Promise.all([getDinnerMeals(), getLunchMeals(), getBreakfastMeals(), getSnackMeals()]);
    setLoadingMeals({ type: 'success', data: [] });
  }

  function deleteMeal(mealId: number) {
    api
      .delete('meals/delete_meal', { data: { mealId } })
      .then(() => {
        refreshAllMeals();
        setNotification({
          title: 'Delete Meal',
          type: 'success',
          message: 'Meal deleted successfully!',
        });
        setShowEditMeal(false);
      })
      .catch((error) => {
        console.error('Error deleting meal:', error);
        setNotification({ title: 'Delete Meal', type: 'error', message: 'Failed to delete meal.' });
      });
  }

  function resetPrompt() {
    setPrompt('');
  }

  function handleMealFromText(text: string) {
    if (!text.trim()) return;
    setLoading({ type: 'loading' });

    api
      .post('meals/analyze_food_text', { text })
      .then((response) => {
        setMeal(response.data);
        setShowMeal(true);
        setShowAudioModal(false);
        setLoading({ type: 'success', data: response.data });
      })
      .catch(() => {
        setLoading({ type: 'error', error: 'Failed to analyze meal from text.' });
        setNotification({
          title: 'Analyze Meal',
          type: 'error',
          message: 'Failed to analyze meal from text.',
        });
      });
  }

  function handleMeal(mealTypeArg: string, image: File | null) {
    if (!image) return;

    const formData = new FormData();
    formData.append('meal_type', mealTypeArg);
    formData.append('image', image);
    if (prompt) formData.append('prompt', prompt);
    setLoading({ type: 'loading' });
    api
      .post('meals/calculate_meal', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        setMeal(response.data);
        setShowFileUpload(false);
        setShowMeal(true);
        setLoading({ type: 'success', data: response.data });
        resetPrompt();
      })
      .catch(() => {
        setShowFileUpload(false);
        setLoading({ type: 'error', error: 'Failed to calculate meal.' });
        setNotification({
          title: 'Calculate Meal',
          type: 'error',
          message: 'Failed to calculate meal.',
        });
        resetPrompt();
      });
  }

  function handleMealSave() {
    if (!meal) return;
    api
      .post('meals/create_meal', {
        name: meal.name,
        calories: meal.calories * (1 + calorieFactor / 100),
        protein: meal.protein * (1 + calorieFactor / 100),
        carbs: meal.carbs * (1 + calorieFactor / 100),
        fats: meal.fats * (1 + calorieFactor / 100),
        mealtype,
        date: dateString,
      })
      .then(() => {
        setNotification({
          title: 'Add Meal',
          type: 'success',
          message: 'Meal added successfully!',
        });
        setShowMeal(false);
        setShowAudioModal(false);
        refreshAllMeals();
        setCalorieFactor(0);
      })
      .catch((error) => console.error('Error saving meal:', error));
  }

  function handleEditMealSave() {
    if (!meal) return;
    api
      .put('meals/edit_meal', {
        mealId: meal.id,
        name: meal.name,
        calories: meal.calories * (1 + calorieFactor / 100),
        protein: meal.protein * (1 + calorieFactor / 100),
        carbs: meal.carbs * (1 + calorieFactor / 100),
        fats: meal.fats * (1 + calorieFactor / 100),
      })
      .then(() => {
        setNotification({
          title: 'Edit Meal',
          type: 'success',
          message: 'Meal edited successfully!',
        });
        refreshAllMeals();
        setShowEditMeal(false);
        setCalorieFactor(0);
      })
      .catch((error) => console.error('Error editing meal:', error));
  }

  // ── Berechnungen ──────────────────────────────────────────────
  function sumField(meals: Meal[], field: keyof Meal): number {
    return meals.reduce((acc, m) => acc + (m[field] as number), 0);
  }

  function calculateCalories() {
    return [...dinnerMeals, ...launchMeals, ...breakfastMeals, ...snackMeals].reduce(
      (acc, m) => acc + m.calories,
      0
    );
  }
  function calculateProteins() {
    return sumField([...dinnerMeals, ...launchMeals, ...breakfastMeals, ...snackMeals], 'protein');
  }
  function calculateCarbs() {
    return sumField([...dinnerMeals, ...launchMeals, ...breakfastMeals, ...snackMeals], 'carbs');
  }
  function calculateFats() {
    return sumField([...dinnerMeals, ...launchMeals, ...breakfastMeals, ...snackMeals], 'fats');
  }

  function calculateProteinsGoal(): number {
    return loadingProfile.type === 'success' ? loadingProfile.data.weight * 2.0 : 0;
  }
  function calculateFatsGoal(): number {
    return loadingProfile.type === 'success' ? loadingProfile.data.weight * 1.0 : 0;
  }
  function calculateCarbsGoal(): number {
    return loadingProfile.type === 'success'
      ? (loadingProfile.data.calories -
          (loadingProfile.data.weight * 2.0 * 4 + loadingProfile.data.weight * 1.0 * 9)) /
          4
      : 0;
  }

  return {
    // Date
    selectedDay,
    setSelectedDay,
    month,
    setMonth,
    year,
    setYear,
    dateString,
    // Profile
    loadingProfile,
    // Meals
    dinnerMeals,
    launchMeals,
    breakfastMeals,
    snackMeals,
    meal,
    setMeal,
    mealtype,
    setMealtype,
    calorieFactor,
    setCalorieFactor,
    // Modal visibility
    showModal,
    setShowModal,
    showMeal,
    setShowMeal,
    showFileUpload,
    setShowFileUpload,
    showEditMeal,
    setShowEditMeal,
    setShowAudioModal,
    showInputSelect,
    setShowInputSelect,
    showAudioModal,
    // Input
    prompt,
    setPrompt,
    loading,
    loadingMeals,
    notification,
    setNotification,
    // API actions
    deleteMeal,
    handleMeal,
    handleMealFromText,
    handleMealSave,
    handleEditMealSave,
    // Berechnungen
    calculateCalories,
    calculateProteins,
    calculateCarbs,
    calculateFats,
    calculateProteinsGoal,
    calculateFatsGoal,
    calculateCarbsGoal,
  };
}
