import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Utils/api';
import type { WorkoutPlan, TrainingExercise, Notification, UI_STATE } from '../types';

// ── Types ─────────────────────────────────────────────────────────────────────

type PlanMap = Record<string, TrainingExercise[]>;
type PlanUIState = UI_STATE<PlanMap>;

// ── API helpers ───────────────────────────────────────────────────────────────

const mapPlans = (plans: WorkoutPlan[]): PlanMap =>
  plans.reduce<PlanMap>((acc, plan) => {
    acc[plan.name] = plan.plan_exercise_templates.map((template) => {
      const match = plan.exercises.find((e) => e.name === template.name);
      return {
        exercise: template.name,
        reps: template.reps_template,
        sets: template.sets,
        weights: match?.weights ?? Array<number>(template.sets).fill(0),
        previousReps: match?.reps ?? Array<number>(template.sets).fill(0),
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
  const [planState, setPlanState] = useState<PlanUIState>({ type: 'loading' });
  const [currentExercises, setCurrentExercises] = useState<TrainingExercise[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  const [training1, setTraining] = useState<TrainingExercise | undefined>();
  const [idxExercise, setidx] = useState<number>(0);
  const [inputValue, setInputValue] = useState<number[]>([]);

  const [selectedTrainingSite, setSelectedTrainingSite] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [exerciseList, setExerciseList] = useState<boolean>(false);
  const [showRepsInfo, setShowRepsInfo] = useState<boolean>(false);
  const [lastTrainingModalValue, setLastTrainingModal] = useState<boolean>(false);

  const [breakModal, setBreakModal] = useState<boolean>(false);
  const [breakTime, setBreakTime] = useState<number>(0);
  const [counterisRunning, setCounterisRunning] = useState<boolean>(false);

  const [selectedWeight1, setSelectedWeight1] = useState<number[]>([3]);

  const [idx, setWeightidx] = useState<number>(0);

  const [notification, setNotification] = useState<Notification | null>(null);

  // ── Refs ───────────────────────────────────────────────────────────────────
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrollRef2 = useRef<HTMLDivElement | null>(null);

  // ── Fetch workout plans on mount ───────────────────────────────────────────
  useEffect(() => {
    setPlanState({ type: 'loading' });
    api
      .get<WorkoutPlan[]>('workout_plans/get_workout_plans')
      .then((response) => {
        const mapped = response.data?.length > 0 ? mapPlans(response.data) : {};
        setPlanState({ type: 'success', data: mapped });
      })
      .catch((err: Error) => {
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

  // ── API: save exercise ─────────────────────────────────────────────────────
  const postData = (updatedCurrent: TrainingExercise): void => {
    if (!training1) return;
    api
      .post('workout_plans/create_exercise', {
        workout_plan_id: updatedCurrent.plan_id,
        name: updatedCurrent.exercise,
        sets: updatedCurrent.sets,
        reps:
          Array.isArray(updatedCurrent.reps) &&
          updatedCurrent.reps.length === updatedCurrent.sets &&
          updatedCurrent.reps.every((r) => r != null)
            ? updatedCurrent.reps
            : Array<number>(updatedCurrent.sets).fill(training1.reps[0]),
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
  const handleExercise = (): void => {
    const isLast = idxExercise === currentExercises.length - 1;

    if (isLast) {
      const updatedCurrent: TrainingExercise = {
        ...currentExercises[idxExercise],
        reps: inputValue,
      };
      if (!updatedCurrent.isFinished) postData(updatedCurrent);
      const updatedExercises = [...currentExercises];
      updatedExercises[idxExercise] = { ...updatedCurrent, isFinished: true };
      setCurrentExercises(updatedExercises);
    }

    if (Object.keys(currentExercises).every((ex) => currentExercises[Number(ex)].isFinished)) {
      setNotification({
        title: 'Workout Complete',
        message: 'Congratulations! You have completed the workout.',
        type: 'success',
      });
      setSelectedTrainingSite(true);
    }

    if (!isLast) {
      const updatedCurrent: TrainingExercise = {
        ...currentExercises[idxExercise],
        reps: inputValue,
      };
      if (!updatedCurrent.isFinished) postData(updatedCurrent);
      const finishedCurrent: TrainingExercise = { ...updatedCurrent, isFinished: true };
      const updatedExercises = [...currentExercises];
      updatedExercises[idxExercise] = finishedCurrent;
      setCurrentExercises(updatedExercises);

      setPlanState((prev) =>
        prev.type === 'success' && currentPlan
          ? { ...prev, data: { ...prev.data, [currentPlan]: updatedExercises } }
          : prev
      );

      const newIdx = idxExercise + 1;
      const nextExercise: TrainingExercise = { ...updatedExercises[newIdx] };
      if (!nextExercise.reps || nextExercise.reps.length !== nextExercise.sets) {
        nextExercise.reps = Array<number>(nextExercise.sets).fill(0);
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

  const handleExerciseBack = (): void => {
    if (idxExercise > 0) {
      const newIdx = idxExercise - 1;
      const prevExercise: TrainingExercise = { ...currentExercises[newIdx] };
      if (!prevExercise.reps || prevExercise.reps.length !== prevExercise.sets) {
        prevExercise.reps = Array<number>(prevExercise.sets).fill(0);
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
  const selectPlan = (planName: string): void => {
    if (planState.type !== 'success') return;
    setCurrentExercises(planState.data[planName]);
    setCurrentPlan(planName);
    setTraining(planState.data[planName][0]);
    setSelectedTrainingSite(false);
  };

  // ── Reps input ─────────────────────────────────────────────────────────────
  const addInput = (value: number, index: number): void => {
    const updated = [...inputValue];
    updated[index] = value;
    setInputValue(updated);
    setTraining((prev) => (prev ? { ...prev, reps: updated } : prev));
  };

  // ── Sets ───────────────────────────────────────────────────────────────────
  const handleAddSets = (): void => {
    if (!training1) return;
    const updatedExercise: TrainingExercise = {
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

  const handleReduceSets = (): void => {
    if (!training1) return;
    const updatedSets = training1.sets - 1;
    const updatedExercise: TrainingExercise = {
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
  const handleModal = (index: number, flag: boolean): void => {
    setShowModal(flag);
    setWeightidx(index);
  };

  const handleWeightSelect = (weight: number | undefined): void => {
    setSelectedWeight1((prev) => {
      const updated = [...prev];
      updated[idx] = weight as number;
      return updated;
    });
  };

  const changeWeight = (index: number, flag: boolean): void => {
    if (!currentPlan) return;
    const totalWeight = selectedWeight1[index] ?? 0;
    const updatedSetw = [...currentExercises[idxExercise].weights];
    updatedSetw[index] = totalWeight;
    const updatedExercise: TrainingExercise = {
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
  const startCounter = (): void => {
    setCounterisRunning(true);
    intervalRef.current = setInterval(() => {
      setBreakTime((prev) => prev + 1);
    }, 1000);
  };

  const stopCounter = (): void => {
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    setCounterisRunning(false);
  };

  // ── Exposed API ────────────────────────────────────────────────────────────
  return {
    navigate,
    // UI_STATE — switch on planState.type in the UI
    planState,
    // convenience shorthand: {} while loading/error, filled map on success
    selectedExercise: planState.type === 'success' ? planState.data : ({} as PlanMap),
    currentExercises,
    setCurrentExercises,
    currentPlan,
    training1,
    setTraining,
    idxExercise,
    setidx,
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

    changeWeight,
    startCounter,
    stopCounter,
  };
}
