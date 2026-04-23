import { useState, useEffect } from 'react';
import { mealService } from '../services/mealService';
import { profileService } from '../services/profileService';
import {
  calcCalories,
  calcProteins,
  calcCarbs,
  calcFats,
  calcProteinsGoal,
  calcFatsGoal,
  calcCarbsGoal,
} from '../Utils/nutritionCalc';
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
    profileService.get().then((profile) => {
      setLoadingProfile({
        type: 'success',
        data: { calories: profile.calories, weight: profile.weight },
      });
    });
  }

  function getDinnerMeals() {
    return mealService
      .getMealsByTypAndDate('dinner', dateString)
      .then((data) => setDinnerMeals(data));
  }

  function getLunchMeals() {
    return mealService
      .getMealsByTypAndDate('lunch', dateString)
      .then((data) => setLaunchMeals(data));
  }

  function getBreakfastMeals() {
    return mealService
      .getMealsByTypAndDate('breakfast', dateString)
      .then((data) => setBreakfastMeals(data));
  }

  function getSnackMeals() {
    return mealService
      .getMealsByTypAndDate('snack', dateString)
      .then((data) => setSnackMeals(data));
  }

  async function refreshAllMeals() {
    setLoadingMeals({ type: 'loading' });
    await Promise.all([getDinnerMeals(), getLunchMeals(), getBreakfastMeals(), getSnackMeals()]);
    setLoadingMeals({ type: 'success', data: [] });
  }

  function deleteMeal(mealId: number) {
    mealService
      .deleteMeal(mealId, () => {})
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

    mealService
      .analyzeText(text)
      .then((data) => {
        setMeal(data);
        setShowMeal(true);
        setShowAudioModal(false);
        setLoading({ type: 'success', data });
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
    setLoading({ type: 'loading' });

    mealService
      .analyzeImage(image, mealTypeArg, prompt || undefined)
      .then((data) => {
        setMeal(data);
        setShowFileUpload(false);
        setShowMeal(true);
        setLoading({ type: 'success', data });
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
    const factor = 1 + calorieFactor / 100;
    mealService
      .create({
        name: meal.name,
        calories: meal.calories * factor,
        protein: meal.protein * factor,
        carbs: meal.carbs * factor,
        fats: meal.fats * factor,
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
    const factor = 1 + calorieFactor / 100;
    mealService
      .edit({
        mealId: meal.id,
        name: meal.name,
        calories: meal.calories * factor,
        protein: meal.protein * factor,
        carbs: meal.carbs * factor,
        fats: meal.fats * factor,
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

  // ── Berechnungen via nutritionCalc.ts ────────────────────────
  const allMeals = [...dinnerMeals, ...launchMeals, ...breakfastMeals, ...snackMeals];

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
    calculateCalories: () => calcCalories(allMeals),
    calculateProteins: () => calcProteins(allMeals),
    calculateCarbs: () => calcCarbs(allMeals),
    calculateFats: () => calcFats(allMeals),
    calculateProteinsGoal: () => calcProteinsGoal(loadingProfile),
    calculateFatsGoal: () => calcFatsGoal(loadingProfile),
    calculateCarbsGoal: () => calcCarbsGoal(loadingProfile),
  };
}
