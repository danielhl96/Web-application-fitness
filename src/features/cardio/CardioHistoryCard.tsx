import '../../index.css';
import { JSX } from 'react';
import Button from '../../shared/Components/button';
import type { CardioSession } from '../../types';
import { formatDate, formatDuration, formatPace } from './helper';
import { useState } from 'react';
export function CardioHistoryCard({
  session,
  onSelect,
  onDelete,
  onEdit,
}: {
  session: CardioSession;
  onSelect: () => void;
  onDelete: () => void;
  onEdit: () => void;
  setActiveView?: (view: 'log' | 'history' | 'edit') => void;
}): JSX.Element {
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <div
      className="w-full bg-black/20 border border-blue-500 transition-all duration-200 rounded-xl p-4 backdrop-blur-lg"
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
    >
      {/* Clickable summary area */}
      <div
        onClick={() => setIsMaximized(!isMaximized)}
        className="w-full text-left focus:outline-none rounded-lg"
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-blue-400 font-semibold text-sm">{formatDate(session.date)}</span>
          <span className="text-slate-400 text-xs">{formatDuration(session.duration_min)}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="flex flex-col items-center">
            <span className="text-blue-400 font-bold text-base">{session.distance_km} km</span>
            <span className="text-slate-400 text-xs">Distance</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-red-400 font-bold text-base">{session.calories} kcal</span>
            <span className="text-slate-400 text-xs">Calories</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-green-400 font-bold text-base">
              {formatPace(session.pace_min_per_km)}
            </span>
            <span className="text-slate-400 text-xs">Pace</span>
          </div>
        </div>

        {isMaximized && (
          <div className="grid grid-cols-3 gap-1 mb-3">
            <div className="flex flex-col items-center">
              <span className="text-red-400 font-bold text-base">
                {session.avg_bpm > 0 ? `${session.avg_bpm} ` : '–'}
              </span>
              <span className="text-slate-400 text-xs">Avg BPM</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-red-400 font-bold text-base">
                {session.max_bpm > 0 ? `${session.max_bpm}` : '–'}
              </span>

              <span className="text-slate-400 text-xs">Max BPM</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-yellow-400 font-bold text-base">{session.power_w} W</span>

              <span className="text-slate-400 text-xs">Power</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-yellow-400 font-bold text-base">{session.cadence_spm} </span>
              <span className="text-slate-400 text-xs">Cadence</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-slate-400 font-bold text-base">{session.notes || '–'}</span>
              <span className="text-slate-400 text-xs">Notes</span>
            </div>
          </div>
        )}
      </div>

      {/* Edit and Delete button */}
      <div className="flex justify-end  pt-2 gap-2 border-t border-white/10">
        <Button
          border="#3b82f6"
          onClick={() => {
            onEdit();
          }}
        >
          ✎ Edit
        </Button>
        <Button border="#f87171" onClick={onDelete}>
          ✕ Delete
        </Button>
      </div>
    </div>
  );
}

export default CardioHistoryCard;
