import { useState, useEffect } from 'react';
import api from '../Utils/api.js';
import { Meal, NotificationState } from '../types';

export default function useNutrition() {
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const [calories, setCalories] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);

  const [dinnerMeals, setDinnerMeals] = useState<Meal[]>([]);
  const [launchMeals, setLaunchMeals] = useState<Meal[]>([]);
  const [breakfastMeals, setBreakfastMeals] = useState<Meal[]>([]);
  const [snackMeals, setSnackMeals] = useState<Meal[]>([]);

  const [meal, setMeal] = useState<Meal | null>(null);
  const [mealtype, setMealtype] = useState<string>('');
  const [calorieFactor, setCalorieFactor] = useState<number>(0);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showMeal, setShowMeal] = useState<boolean>(false);
  const [showFileUpload, setShowFileUpload] = useState<boolean>(false);
  const [showEditMeal, setShowEditMeal] = useState<boolean>(false);

  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationState>(null);

  const dateString = `${year}-${month.toString().padStart(2, '0')}-${selectedDay
    .toString()
    .padStart(2, '0')}`;

  useEffect(() => {
    getProfile();
    getDinnerMeals();
    getLunchMeals();
    getBreakfastMeals();
    getSnackMeals();
  }, [selectedDay, month, year]);

  function getProfile() {
    api.get('users/profile').then((response) => {
      setCalories(response.data.calories);
      setWeight(response.data.weight);
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

  function refreshAllMeals() {
    getDinnerMeals();
    getLunchMeals();
    getBreakfastMeals();
    getSnackMeals();
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

  function handleMeal(mealTypeArg: string, image: File | null) {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('meal_type', mealTypeArg);
    formData.append('image', image);
    if (prompt) formData.append('prompt', prompt);
    api
      .post('meals/calculate_meal', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        setMeal(response.data);
        setShowFileUpload(false);
        setShowMeal(true);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error creating meal:', error);
        setShowFileUpload(false);
        setLoading(false);
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
    return weight * 2.0;
  }
  function calculateFatsGoal(): number {
    return weight * 1.0;
  }
  function calculateCarbsGoal(): number {
    return (calories - (weight * 2.0 * 4 + weight * 1.0 * 9)) / 4;
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
    calories,
    weight,
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
    // Input
    prompt,
    setPrompt,
    loading,
    notification,
    setNotification,
    // API actions
    deleteMeal,
    handleMeal,
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
