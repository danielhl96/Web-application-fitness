// ── Exported classification helpers (reusable across components) ─────────────

export function getBmiLabel(bmi: number): string {
  if (bmi > 30) return 'Adipositas';
  if (bmi > 25) return 'Overweight';
  if (bmi < 20) return 'Underweight';
  return 'Normal';
}

export function getBmiColor(bmi: number): string {
  if (bmi > 30) return 'red';
  if (bmi > 25) return 'orange';
  if (bmi < 20) return 'yellow';
  return 'green';
}

export function getBriColor(bri: number): string {
  if (bri > 4.5) return 'red';
  if (bri > 3) return 'orange';
  return 'green';
}

export function getHwrColor(hwr: number): string {
  return hwr >= 0.85 ? 'red' : 'green';
}

export function getHwrLabel(hwr: number): string {
  return hwr >= 0.85 ? 'Risk' : 'Good';
}

export function getBfpColor(bfp: number): string {
  return bfp > 25 ? 'red' : 'green';
}

export function getGoalLabel(goal: number): string {
  if (goal === 1) return 'Cut';
  if (goal === 2) return 'Hold';
  return 'Bulk';
}

// OCP: add new activity level here — no other changes needed
export const activityColors: Record<string, string> = {
  '1.2': 'red',
  '1.4': 'yellow',
  '1.7': 'green',
  '2.0': 'green',
};

export function getActivityColor(activity: string): string {
  return activityColors[activity] ?? 'orange';
}

// ── Component ─────────────────────────────────────────────────────────────────

interface HealthMetricsProps {
  calories: number;
  bmi: number;
  hwr: number;
}

export default function HealthMetrics({ calories, bmi, hwr }: HealthMetricsProps) {
  return (
    <div className="flex flex-col space-y-2 items-center justify-center">
      <h1>Your calories: {calories} kcal</h1>
      <h1 style={{ color: getBmiColor(bmi) }}>
        Your BMI: {getBmiLabel(bmi)} ({Math.round(bmi)})
      </h1>
      <h1 style={{ color: getHwrColor(hwr) }}>Your WHR: {getHwrLabel(hwr)}</h1>
    </div>
  );
}
