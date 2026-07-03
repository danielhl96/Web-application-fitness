import { useState, useEffect } from 'react';
import { cardioService } from './cardioService';
import type { CardioSession, CardioFormValues, NotificationState } from '../../types';

import { useNavigate } from 'react-router-dom';

// ── Types ─────────────────────────────────────────────────────────────────────

export type CardioView = 'log' | 'history' | 'edit';

// ── Helpers ───────────────────────────────────────────────────────────────────

const EMPTY_FORM: CardioFormValues = {
  date: new Date().toISOString().split('T')[0],
  durationMin: '',
  distanceKm: '',
  avgBpm: '',
  maxBpm: '',
  powerW: '',
  cadenceSpm: '',
  calories: '',
  notes: '',
};

function parseNum(val: string): number {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

export function calcPace(durationMin: number, distanceKm: number): number {
  if (!distanceKm || distanceKm <= 0) return 0;
  return durationMin / distanceKm;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export default function useCardio() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<CardioSession[]>([]);
  const [formValues, setFormValues] = useState<CardioFormValues>(EMPTY_FORM);
  const [activeView, setActiveView] = useState<CardioView>('log');
  const [selectedSession, setSelectedSession] = useState<CardioSession | null>(null);
  const [notification, setNotification] = useState<NotificationState>(null);

  const buttonDisabled = !(
    formValues.date &&
    formValues.durationMin &&
    formValues.distanceKm &&
    formValues.avgBpm
  );

  // ── Load sessions from localStorage on mount ───────────────────────────────
  useEffect(() => {
    cardioService.getCardioWorkouts().then((data) => {
      setSessions(data);
      console.log('Cardio sessions loaded:', data);
    });
  }, []);

  // ── Derived: live pace preview ─────────────────────────────────────────────
  const previewPace = calcPace(parseNum(formValues.durationMin), parseNum(formValues.distanceKm));

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleChange(field: keyof CardioFormValues, value: string): void {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(): Promise<void> {
    const { date, durationMin, distanceKm, avgBpm } = formValues;

    if (!date || !durationMin || !distanceKm || !avgBpm) {
      setNotification({
        title: 'Validation Error',
        message: 'Date, duration, distance, and avg. BPM are required.',
        type: 'error',
      });
      return;
    }

    const dur = parseNum(durationMin);
    const dist = parseNum(distanceKm);

    if (dur <= 0 || dist <= 0) {
      setNotification({
        title: 'Validation Error',
        message: 'Duration and distance must be greater than 0.',
        type: 'error',
      });
      return;
    }

    await cardioService.createCardioWorkout({
      date,
      durationMin: dur,
      distanceKm: dist,
      avgBpm: parseNum(avgBpm),
      maxBpm: parseNum(formValues.maxBpm) || undefined,
      powerW: parseNum(formValues.powerW) || undefined,
      cadenceSpm: parseNum(formValues.cadenceSpm) || undefined,
      calories: parseNum(formValues.calories) || undefined,
      notes: formValues.notes.trim() || undefined,
    });

    const updated = await cardioService.getCardioWorkouts();
    setSessions(updated);
    setFormValues({ ...EMPTY_FORM, date: new Date().toISOString().split('T')[0] });
    setNotification({
      title: 'Run Saved',
      message: 'Your cardio session has been saved.',
      type: 'success',
    });
    setActiveView('history');
  }

  async function handleSubmitEdit(id: number): Promise<void> {
    const { date, durationMin, distanceKm, avgBpm } = formValues;

    if (!date || !durationMin || !distanceKm || !avgBpm) {
      setNotification({
        title: 'Validation Error',
        message: 'Date, duration, distance, and avg. BPM are required.',
        type: 'error',
      });
      return;
    }

    const dur = parseNum(durationMin);
    const dist = parseNum(distanceKm);

    if (dur <= 0 || dist <= 0) {
      setNotification({
        title: 'Validation Error',
        message: 'Duration and distance must be greater than 0.',
        type: 'error',
      });
      return;
    }

    console.log('Submitting edit for workout ID:', id, 'with data:', formValues);

    await cardioService.updateCardioWorkout(id, {
      date,
      durationMin: dur,
      distanceKm: dist,
      avgBpm: parseNum(avgBpm),
      maxBpm: parseNum(formValues.maxBpm) || undefined,
      powerW: parseNum(formValues.powerW) || undefined,
      cadenceSpm: parseNum(formValues.cadenceSpm) || undefined,
      calories: parseNum(formValues.calories) || undefined,
      notes: formValues.notes.trim() || undefined,
    });

    const updated = await cardioService.getCardioWorkouts();
    setSessions(updated);
    console.log('Cardio sessions updated:', updated);
    setFormValues({ ...EMPTY_FORM, date: new Date().toISOString().split('T')[0] });
    setNotification({
      title: 'Run Edited',
      message: 'Your cardio session has been edited.',
      type: 'success',
    });
  }

  async function handleDelete(id: string): Promise<void> {
    try {
      await cardioService.deleteCardioWorkout(parseInt(id, 10));
      const updated = await cardioService.getCardioWorkouts();
      setSessions(updated);
      setSelectedSession(null);
      setNotification({ title: 'Deleted', message: 'Session removed.', type: 'success' });
    } catch (error) {
      console.error('Error deleting session:', error);
      setNotification({ title: 'Error', message: 'Failed to delete session.', type: 'error' });
    }
  }

  function handleSelectSession(session: CardioSession): void {
    setSelectedSession(session);
  }

  function handleStartEdit(session: CardioSession): void {
    setSelectedSession(session);
    setFormValues({
      date: session.date ? session.date.split('T')[0] : new Date().toISOString().split('T')[0],
      durationMin: String(session.duration_min ?? ''),
      distanceKm: String(session.distance_km ?? ''),
      avgBpm: String(session.avg_bpm ?? ''),
      maxBpm: session.max_bpm ? String(session.max_bpm) : '',
      powerW: session.power_w ? String(session.power_w) : '',
      cadenceSpm: session.cadence_spm ? String(session.cadence_spm) : '',
      calories: session.calories ? String(session.calories) : '',
      notes: session.notes ?? '',
    });

    setActiveView('edit');
  }

  function handleCloseDetail(): void {
    setSelectedSession(null);
  }

  return {
    // State
    sessions,
    formValues,
    activeView,
    selectedSession,
    notification,
    previewPace,
    buttonDisabled,
    // Setters
    setActiveView,
    setNotification,
    // Handlers
    handleChange,
    handleSubmit,
    handleSubmitEdit,
    handleDelete,
    handleSelectSession,
    handleStartEdit,
    handleCloseDetail,
    navigate, // Expose navigate for external use
  };
}
