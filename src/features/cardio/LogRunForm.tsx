import Input from '../../shared/Components/input';
import { CardioFormValues } from '../../types';
import { JSX } from 'react';
import { formatPace } from './helper';

type LogRunFormProps = {
  formValues: CardioFormValues;
  handleChange: (field: keyof CardioFormValues, value: string) => void;
  previewPace: number;
};

export function LogRunForm({
  formValues,
  handleChange,
  previewPace,
}: LogRunFormProps): JSX.Element {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto overflow-x-hidden max-h-[50dvh] ">
      <div className="grid grid-cols-2 gap-3">
        {/* Date – full width */}
        <div className="flex flex-col gap-1 col-span-2">
          <label className="text-slate-300 text-xs font-mono">Date </label>
          <input
            type="date"
            value={formValues.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-75 px-4 py-2 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            style={{
              background: 'rgba(30, 41, 59, 0.25)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
              border: '1.5px solid rgba(59, 130, 246, 0.25)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              colorScheme: 'dark',
            }}
          />
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-1">
          <label className="text-slate-300 text-xs font-mono">Duration (min) </label>
          <Input
            value={formValues.durationMin}
            onChange={(v) => handleChange('durationMin', v)}
            placeholder="e.g. 35"
            w="w-full"
          />
        </div>

        {/* Distance */}
        <div className="flex flex-col gap-1">
          <label className="text-slate-300 text-xs font-mono">Distance (km) </label>
          <Input
            value={formValues.distanceKm}
            onChange={(v) => handleChange('distanceKm', v)}
            placeholder="e.g. 5.0"
            w="w-full"
          />
        </div>

        {/* Pace – auto-calculated, read-only, full width */}
        <div className="flex flex-col gap-1 col-span-2">
          <label className="text-slate-300 text-xs font-mono">Pace (auto-calculated)</label>
          <div
            className="px-4 py-2 rounded-xl text-blue-300 text-sm font-mono"
            style={{
              background: 'rgba(30, 41, 59, 0.25)',
              border: '1.5px solid rgba(59, 130, 246, 0.25)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {previewPace > 0 ? formatPace(previewPace) : '– (enter duration & distance)'}
          </div>
        </div>

        {/* Avg BPM */}
        <div className="flex flex-col gap-1">
          <label className="text-slate-300 text-xs font-mono">Avg BPM </label>
          <Input
            value={formValues.avgBpm}
            onChange={(v) => handleChange('avgBpm', v)}
            placeholder="e.g. 155"
            w="w-full"
          />
        </div>

        {/* Max BPM */}
        <div className="flex flex-col gap-1">
          <label className="text-slate-300 text-xs font-mono">Max BPM</label>
          <Input
            value={formValues.maxBpm}
            onChange={(v) => handleChange('maxBpm', v)}
            placeholder="e.g. 178"
            w="w-full"
          />
        </div>

        {/* Power */}
        <div className="flex flex-col gap-1">
          <label className="text-slate-300 text-xs font-mono">Power (W)</label>
          <Input
            value={formValues.powerW}
            onChange={(v) => handleChange('powerW', v)}
            placeholder="e.g. 220"
            w="w-full"
          />
        </div>

        {/* Cadence */}
        <div className="flex flex-col gap-1">
          <label className="text-slate-300 text-xs font-mono">Cadence (spm)</label>
          <Input
            value={formValues.cadenceSpm}
            onChange={(v) => handleChange('cadenceSpm', v)}
            placeholder="e.g. 175"
            w="w-full"
          />
        </div>

        {/* Calories – full width */}
        <div className="flex flex-col gap-1 col-span-2">
          <label className="text-slate-300 text-xs font-mono">Calories (kcal)</label>
          <Input
            value={formValues.calories}
            onChange={(v) => handleChange('calories', v)}
            placeholder="e.g. 420"
            w="w-full"
          />
        </div>

        {/* Notes – full width */}
        <div className="flex flex-col gap-1 col-span-2">
          <label className="text-slate-300 text-xs font-mono">Notes</label>
          <Input
            value={formValues.notes}
            onChange={(v) => handleChange('notes', v)}
            placeholder="Easy run, felt good..."
            w="w-full"
          />
        </div>
      </div>
    </div>
  );
}
