import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Utils/api';
/** @typedef {import('../types').UI_STATE<import('../types').WorkoutPlanMap>} PlanUIState */

// ── API helpers ───────────────────────────────────────────────────────────────

/** Map raw API response into { PlanName: [ exerciseObj, ... ] } */
const mapPlans = (plans) =>
  plans.reduce((acc, plan) => {
    acc[plan.name] = plan.plan_exercise_templates.map((exercise) => {
      const match = plan.exercises.find((e) => e.name === exercise.name);
      return {
        exercise: exercise.name,
        reps: exercise.reps_template,
        sets: exercise.sets,
        weights: match?.weights ?? Array(exercise.sets).fill(0),
        previousReps: match?.reps ?? Array(exercise.sets).fill(0),
        plan_id: plan.id,
        isFinished: false,
      };
    });
    return acc;
  }, {});

// ── Hook ──────────────────────────────────────────────────────────────────────

export default function useTraining() {
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────────────────────
  /** @type {[PlanUIState, React.Dispatch<React.SetStateAction<PlanUIState>>]} */
  const [planState, setPlanState] = useState({ type: 'loading' });
  const [currentExercises, setCurrentExercises] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);

  const [training1, setTraining] = useState();
  const [idxExercise, setidx] = useState(0);
  const [inputValue, setInputValue] = useState([]);

  const [selectedTrainingSite, setSelectedTrainingSite] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [exerciseList, setExerciseList] = useState(false);
  const [showRepsInfo, setShowRepsInfo] = useState(false);
  const [lastTrainingModalValue, setLastTrainingModal] = useState(false);

  const [breakModal, setBreakModal] = useState(false);
  const [breakTime, setBreakTime] = useState(0);
  const [counterisRunning, setCounterisRunning] = useState(false);

  const [selectedWeight1, setSelectedWeight1] = useState([3]);
  const [selectedWeight2, setSelectedWeight2] = useState([3]);
  const [idx, setWeightidx] = useState(0);

  const [notification, setNotification] = useState(null);

  // ── Refs ───────────────────────────────────────────────────────────────────
  const intervalRef = useRef();
  const scrollRef = useRef(null);
  const scrollRef2 = useRef(null);

  // ── Fetch workout plans on mount ───────────────────────────────────────────
  useEffect(() => {
    setPlanState({ type: 'loading' });
    api
      .get('workout_plans/get_workout_plans')
      .then((response) => {
        const mapped = response.data?.length > 0 ? mapPlans(response.data) : {};
        setPlanState({ type: 'success', data: mapped });
      })
      .catch((err) => {
        setPlanState({ type: 'error', error: err?.message ?? 'Failed to load workouts' });
      });
  }, []);

  // ── Sync inputValue when training changes ──────────────────────────────────
  useEffect(() => {
    if (training1?.reps) {
      setInputValue([...training1.reps]);
    }
  }, [training1]);

  // ── Scroll weight picker to pre-selected values when modal opens ───────────
  useEffect(() => {
    if (showModal && scrollRef.current && training1 != null) {
      let wholePart = Math.floor(training1.weights[idx]);
      setSelectedWeight1((prev) => {
        const updated = [...prev];
        updated[idx] = wholePart;
        return updated;
      });
      if (isNaN(wholePart)) wholePart = 0;
      const row = scrollRef.current.querySelector(`tr[data-weight="${wholePart}"]`);
      row?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showModal, idx]);

  useEffect(() => {
    if (showModal && scrollRef2.current && training1 != null) {
      let decimalPart = training1.weights[idx] % 1;
      setSelectedWeight2((prev) => {
        const updated = [...prev];
        updated[idx] = decimalPart;
        return updated;
      });
      if (isNaN(decimalPart)) decimalPart = 0;
      const row = scrollRef2.current.querySelector(`tr[data-weight2="${decimalPart}"]`);
      row?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showModal, idx]);

  // ── API: save exercise ─────────────────────────────────────────────────────
  const postData = (updatedCurrent) => {
    api
      .post('workout_plans/create_exercise', {
        workout_plan_id: updatedCurrent.plan_id,
        name: updatedCurrent.exercise,
        sets: updatedCurrent.sets,
        reps:
          updatedCurrent.reps &&
          updatedCurrent.reps.length === updatedCurrent.sets &&
          updatedCurrent.reps.every((r) => r != null)
            ? updatedCurrent.reps
            : Array(updatedCurrent.sets).fill(training1.reps[0]),
        weights: updatedCurrent.weights,
      })
      .then(() => {
        setNotification({
          title: 'Success',
          message: `Exercise ${updatedCurrent.exercise} saved successfully!`,
          type: 'success',
        });
      })
      .catch(console.error);
  };

  // ── Exercise navigation ────────────────────────────────────────────────────
  const handleExercise = () => {
    const isLast = idxExercise === currentExercises.length - 1;

    if (isLast) {
      const updatedCurrent = { ...currentExercises[idxExercise], reps: inputValue };
      if (!updatedCurrent.isFinished) postData(updatedCurrent);
      const updatedExercises = [...currentExercises];
      updatedExercises[idxExercise] = { ...updatedCurrent, isFinished: true };
      setCurrentExercises(updatedExercises);
    }

    if (Object.keys(currentExercises).every((ex) => currentExercises[ex].isFinished)) {
      setNotification({
        title: 'Workout Complete',
        message: 'Congratulations! You have completed the workout.',
        type: 'success',
      });
      setSelectedTrainingSite(true);
    }

    if (!isLast) {
      const updatedCurrent = { ...currentExercises[idxExercise], reps: inputValue };
      if (!updatedCurrent.isFinished) postData(updatedCurrent);
      const finishedCurrent = { ...updatedCurrent, isFinished: true };
      const updatedExercises = [...currentExercises];
      updatedExercises[idxExercise] = finishedCurrent;
      setCurrentExercises(updatedExercises);

      setPlanState((prev) =>
        prev.type === 'success'
          ? { ...prev, data: { ...prev.data, [currentPlan]: updatedExercises } }
          : prev
      );

      const newIdx = idxExercise + 1;
      const nextExercise = { ...updatedExercises[newIdx] };
      if (!nextExercise.reps || nextExercise.reps.length !== nextExercise.sets) {
        nextExercise.reps = Array(nextExercise.sets).fill(0);
      }
      setidx(newIdx);
      setTraining(nextExercise);
      setCurrentExercises((prev) => {
        const updated = [...prev];
        updated[newIdx] = nextExercise;
        return updated;
      });
      setInputValue([...nextExercise.reps]);
    }
  };

  const handleExerciseBack = () => {
    if (idxExercise > 0) {
      const newIdx = idxExercise - 1;
      const prevExercise = { ...currentExercises[newIdx] };
      if (!prevExercise.reps || prevExercise.reps.length !== prevExercise.sets) {
        prevExercise.reps = Array(prevExercise.sets).fill(0);
      }
      setidx(newIdx);
      setTraining(prevExercise);
      setCurrentExercises((prev) => {
        const updated = [...prev];
        updated[newIdx] = prevExercise;
        return updated;
      });
      setInputValue([...prevExercise.reps]);
    }
  };

  // ── Plan selection ─────────────────────────────────────────────────────────
  const selectPlan = (planName) => {
    if (planState.type !== 'success') return;
    setCurrentExercises(planState.data[planName]);
    setCurrentPlan(planName);
    setTraining(planState.data[planName][0]);
    setSelectedTrainingSite(false);
  };

  // ── Reps input ─────────────────────────────────────────────────────────────
  const addInput = (value, index) => {
    const updated = [...inputValue];
    updated[index] = value;
    setInputValue(updated);
    setTraining((prev) => ({ ...prev, reps: updated }));
  };

  // ── Sets ───────────────────────────────────────────────────────────────────
  const handleAddSets = () => {
    const updatedExercise = {
      ...training1,
      sets: training1.sets + 1,
      weights: [...training1.weights, 0],
      reps: [...training1.reps, 0],
    };
    setCurrentExercises((prev) => {
      const updated = [...prev];
      updated[idxExercise] = updatedExercise;
      return updated;
    });
    setTraining(updatedExercise);
  };

  const handleReduceSets = () => {
    const updatedSets = training1.sets - 1;
    const updatedExercise = {
      ...training1,
      sets: updatedSets,
      reps: training1.reps.slice(0, updatedSets),
      weights: training1.weights.slice(0, updatedSets),
    };
    setCurrentExercises((prev) => {
      const updated = [...prev];
      updated[idxExercise] = updatedExercise;
      return updated;
    });
    setTraining(updatedExercise);
    setInputValue(inputValue.slice(0, updatedSets));
  };

  // ── Weight modal ───────────────────────────────────────────────────────────
  const handleModal = (index, flag) => {
    setShowModal(flag);
    setWeightidx(index);
  };

  const handleWeightSelect = (weight) => {
    setSelectedWeight1((prev) => {
      const updated = [...prev];
      updated[idx] = weight;
      return updated;
    });
  };

  const handleWeightSelect2 = (weight) => {
    if (selectedWeight1[idx] !== null) {
      setSelectedWeight2((prev) => {
        const updated = [...prev];
        updated[idx] = weight;
        return updated;
      });
    }
  };

  const changeWeight = (index, flag) => {
    const totalWeight = (selectedWeight1[index] || 0) + (selectedWeight2[index] || 0);
    const updatedSetw = [...currentExercises[idxExercise].weights];
    updatedSetw[index] = totalWeight;
    const updatedExercise = {
      ...currentExercises[idxExercise],
      weights: updatedSetw,
      reps: [...inputValue],
    };
    setTraining(updatedExercise);
    setCurrentExercises((prev) => {
      const updated = [...prev];
      updated[idxExercise] = updatedExercise;
      return updated;
    });
    setPlanState((prev) =>
      prev.type === 'success'
        ? {
            ...prev,
            data: {
              ...prev.data,
              [currentPlan]: currentExercises.map((ex, i) =>
                i === idxExercise ? updatedExercise : ex
              ),
            },
          }
        : prev
    );
    setShowModal(flag);
  };

  // ── Break timer ────────────────────────────────────────────────────────────
  const startCounter = () => {
    setCounterisRunning(true);
    intervalRef.current = setInterval(() => {
      setBreakTime((prev) => prev + 1);
    }, 1000);
  };

  const stopCounter = () => {
    clearInterval(intervalRef.current);
    setCounterisRunning(false);
  };

  // ── Exposed API ────────────────────────────────────────────────────────────
  return {
    // navigation
    navigate,
    // UI_STATE for plan data — switch on planState.type in the UI
    planState,
    // convenience shorthand: {} while loading/error, filled map on success
    selectedExercise: planState.type === 'success' ? planState.data : {},
    currentExercises,
    setCurrentExercises,
    currentPlan,
    training1,
    setTraining,
    idxExercise,
    inputValue,
    // view state
    selectedTrainingSite,
    setSelectedTrainingSite,
    showModal,
    setShowModal,
    exerciseList,
    setExerciseList,
    showRepsInfo,
    setShowRepsInfo,
    lastTrainingModalValue,
    setLastTrainingModal,
    breakModal,
    setBreakModal,
    breakTime,
    setBreakTime,
    counterisRunning,
    notification,
    setNotification,
    // weight picker
    selectedWeight1,
    selectedWeight2,
    idx,
    scrollRef,
    scrollRef2,
    // handlers
    selectPlan,
    handleExercise,
    handleExerciseBack,
    addInput,
    handleAddSets,
    handleReduceSets,
    handleModal,
    handleWeightSelect,
    handleWeightSelect2,
    changeWeight,
    startCounter,
    stopCounter,
  };
}
