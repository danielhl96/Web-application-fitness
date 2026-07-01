import { useState, useEffect } from 'react';
import { cardioService } from './cardioService';
import type { CardioSession, CardioFormValues, NotificationState } from '../../types';

// ── Types ─────────────────────────────────────────────────────────────────────

export type CardioView = 'log' | 'history';

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
  const [sessions, setSessions] = useState<CardioSession[]>([]);
  const [formValues, setFormValues] = useState<CardioFormValues>(EMPTY_FORM);
  const [activeView, setActiveView] = useState<CardioView>('log');
  const [selectedSession, setSelectedSession] = useState<CardioSession | null>(null);
  const [notification, setNotification] = useState<NotificationState>(null);

  // ── Load sessions from localStorage on mount ───────────────────────────────
  useEffect(() => {
    cardioService.getCardioWorkouts().then((data) => setSessions(data));
  }, []);

  // ── Derived: live pace preview ─────────────────────────────────────────────
  const previewPace = calcPace(parseNum(formValues.durationMin), parseNum(formValues.distanceKm));

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleChange(field: keyof CardioFormValues, value: string): void {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(): void {
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

    const saved = cardioService.createCardioWorkout({
      date,
      duration_min: dur,
      distance_km: dist,
      avg_bpm: parseNum(avgBpm),
      max_bpm: parseNum(formValues.maxBpm),
      power_w: parseNum(formValues.powerW),
      cadence_spm: parseNum(formValues.cadenceSpm),
      calories: parseNum(formValues.calories),
      notes: formValues.notes.trim(),
    });

    setFormValues({ ...EMPTY_FORM, date: new Date().toISOString().split('T')[0] });
    setNotification({
      title: 'Run Saved',
      message: 'Your cardio session has been saved.',
      type: 'success',
    });
    setActiveView('history');
  }

  function handleDelete(id: string): void {
    cardioService.deleteCardioWorkout(parseInt(id, 10));
    setSelectedSession(null);
    setNotification({ title: 'Deleted', message: 'Session removed.', type: 'success' });
  }

  function handleSelectSession(session: CardioSession): void {
    setSelectedSession(session);
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
    // Setters
    setActiveView,
    setNotification,
    // Handlers
    handleChange,
    handleSubmit,
    handleDelete,
    handleSelectSession,
    handleCloseDetail,
  };
}
