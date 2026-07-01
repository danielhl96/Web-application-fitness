import '../../index.css';
import { JSX } from 'react';
import Header from '../header/Header';
import TemplatePage from '../../shared/Components/templatepage';
import Button from '../../shared/Components/button';
import Input from '../../shared/Components/input';
import Notify from '../../shared/Components/notify';
import TemplateModal from '../../shared/Components/templatemodal';
import useCardio from './useCardio';
import type { CardioSession } from '../../types';

// ── Format helpers ─────────────────────────────────────────────────────────────

/** Converts decimal min/km to "mm:ss /km" display string. */
function formatPace(minPerKm: number): string {
  if (!minPerKm || minPerKm <= 0) return '–';
  const mins = Math.floor(minPerKm);
  const secs = Math.round((minPerKm - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, '0')} /km`;
}

/** Converts total minutes to "Xh Ymin" or "Y min". */
function formatDuration(totalMin: number): string {
  if (!totalMin) return '–';
  const h = Math.floor(totalMin / 60);
  const m = Math.round(totalMin % 60);
  return h > 0 ? `${h}h ${m}min` : `${m} min`;
}

/** Formats an ISO date string to "DD.MM.YYYY, HH:mm". */
function formatDate(dateStr: string): string {
  if (!dateStr) return '–';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();

  return `${day}.${month}.${year} `;
}

// ── Sub-components ─────────────────────────────────────────────────────────────

/** Single label/value row used inside the detail modal. */
function StatRow({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="flex justify-between py-1.5 border-b border-white/10">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className="text-white text-sm font-medium">{value}</span>
    </div>
  );
}

/** History entry card – click opens detail, delete button removes the session. */
function CardioHistoryCard({
  session,
  onSelect,
  onDelete,
}: {
  session: CardioSession;
  onSelect: () => void;
  onDelete: () => void;
}): JSX.Element {
  return (
    <div
      className="w-full bg-black/20 border border-blue-500 rounded-xl p-4 backdrop-blur-lg"
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
    >
      {/* Clickable summary area */}
      <button onClick={onSelect} className="w-full text-left focus:outline-none rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <span className="text-blue-400 font-semibold text-sm">{formatDate(session.date)}</span>
          <span className="text-slate-400 text-xs">{formatDuration(session.duration_min)}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center">
            <span className="text-white font-bold text-base">{session.distance_km} km</span>
            <span className="text-slate-400 text-xs">Distance</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white font-bold text-base">
              {formatPace(session.pace_min_per_km)}
            </span>
            <span className="text-slate-400 text-xs">Pace</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white font-bold text-base">
              {session.avg_bpm > 0 ? `${session.avg_bpm}` : '–'}
            </span>
            <span className="text-slate-400 text-xs">Avg BPM</span>
          </div>
        </div>
        {session.calories > 0 && (
          <p className="text-slate-500 text-xs text-right mt-2">{session.calories} kcal</p>
        )}
      </button>

      {/* Delete button */}
      <div className="flex justify-end mt-3 pt-2 border-t border-white/10">
        <button
          onClick={onDelete}
          className="text-red-400 text-xs hover:text-red-300 transition-colors px-1"
        >
          ✕ Delete
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

function CardioPage(): JSX.Element {
  const {
    sessions,
    formValues,
    activeView,
    selectedSession,
    notification,
    previewPace,
    setActiveView,
    setNotification,
    handleChange,
    handleSubmit,
    handleDelete,
    handleSelectSession,
    handleCloseDetail,
  } = useCardio();

  return (
    <div>
      <Header />

      {/* Toast notification */}
      {notification && (
        <Notify
          title={notification.title}
          message={notification.message}
          duration={2000}
          type={notification.type}
          key={notification.message + Date.now()}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Detail modal – shown when a history entry is selected */}
      {selectedSession && (
        <TemplateModal border="1.5px solid rgba(59, 130, 246, 0.4)">
          <div className="p-2 flex flex-col gap-3">
            {/* Modal header */}
            <div className="flex justify-between items-center">
              <h2 className="text-blue-400 font-bold text-base">
                Run – {formatDate(selectedSession.date)}
              </h2>
              <button
                onClick={handleCloseDetail}
                className="text-slate-400 hover:text-white text-lg leading-none"
                aria-label="Close detail"
              >
                ✕
              </button>
            </div>

            {/* Stat rows */}
            <div className="flex flex-col">
              <StatRow label="Duration" value={formatDuration(selectedSession.duration_min)} />
              <StatRow label="Distance" value={`${selectedSession.distance_km} km`} />
              <StatRow label="Pace" value={formatPace(selectedSession.pace_min_per_km)} />
              <StatRow
                label="Avg BPM"
                value={selectedSession.avg_bpm > 0 ? `${selectedSession.avg_bpm} bpm` : '–'}
              />
              <StatRow
                label="Max BPM"
                value={selectedSession.max_bpm > 0 ? `${selectedSession.max_bpm} bpm` : '–'}
              />
              <StatRow
                label="Power"
                value={selectedSession.power_w > 0 ? `${selectedSession.power_w} W` : '–'}
              />
              <StatRow
                label="Cadence"
                value={selectedSession.cadence_spm > 0 ? `${selectedSession.cadence_spm} spm` : '–'}
              />
              <StatRow
                label="Calories"
                value={selectedSession.calories > 0 ? `${selectedSession.calories} kcal` : '–'}
              />
            </div>

            {/* Notes */}
            {selectedSession.notes && (
              <div>
                <p className="text-slate-400 text-xs mb-1">Notes</p>
                <p className="text-slate-200 text-sm">{selectedSession.notes}</p>
              </div>
            )}

            {/* Modal actions */}
            <div className="flex gap-2 mt-2">
              <Button onClick={handleCloseDetail} border="rgba(255,255,255,0.2)" w="flex-1">
                Close
              </Button>
              <Button onClick={() => handleDelete(selectedSession.id)} border="#ef4444" w="flex-1">
                Delete
              </Button>
            </div>
          </div>
        </TemplateModal>
      )}

      <TemplatePage dockDisabled={false}>
        <div className="flex flex-col gap-4">
          {/* Page title + view tabs */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-white">Cardio</h1>
            <div className="divider divider-primary mt-0 mb-0" />
            <div className="flex gap-2">
              <Button
                onClick={() => setActiveView('log')}
                border={activeView === 'log' ? '#08ad4dff' : 'rgba(255,255,255,0.2)'}
              >
                Log Run
              </Button>
              <Button
                onClick={() => setActiveView('history')}
                border={activeView === 'history' ? '#3b82f6' : 'rgba(255,255,255,0.2)'}
              >
                History ({sessions.length})
              </Button>
            </div>
          </div>

          {/* ── Log Run Form ───────────────────────────────────────────────── */}
          {activeView === 'log' && (
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] pr-1">
              <div className="grid grid-cols-2 gap-3">
                {/* Date – full width */}
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-slate-300 text-xs font-mono">Date *</label>
                  <input
                    type="date"
                    value={formValues.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="w-full px-4 py-2 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                  <label className="text-slate-300 text-xs font-mono">Duration (min) *</label>
                  <Input
                    value={formValues.durationMin}
                    onChange={(v) => handleChange('durationMin', v)}
                    placeholder="e.g. 35"
                    w="w-full"
                  />
                </div>

                {/* Distance */}
                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 text-xs font-mono">Distance (km) *</label>
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
                  <label className="text-slate-300 text-xs font-mono">Avg BPM *</label>
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

              <p className="text-slate-500 text-xs">* Required fields</p>

              <div className="flex flex-row justify-center gap-2">
                <Button onClick={handleSubmit} border="#08ad4dff">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </Button>

                <Button onClick={null} border="red">
                  Close
                </Button>
              </div>
            </div>
          )}

          {/* ── History View ───────────────────────────────────────────────── */}
          {activeView === 'history' && (
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[60vh] pr-1">
              {sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <p className="text-slate-500 text-sm">No runs logged yet.</p>
                  <Button onClick={() => setActiveView('log')} border="#3b82f6">
                    Log your first run
                  </Button>
                </div>
              ) : (
                sessions.map((session) => (
                  <CardioHistoryCard
                    key={session.id}
                    session={session}
                    onSelect={() => handleSelectSession(session)}
                    onDelete={() => handleDelete(session.id)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </TemplatePage>
    </div>
  );
}

export default CardioPage;
