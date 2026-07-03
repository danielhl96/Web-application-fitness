import '../../index.css';
import { JSX } from 'react';
import Header from '../header/Header';
import TemplatePage from '../../shared/Components/templatepage';
import Button from '../../shared/Components/button';
import Input from '../../shared/Components/input';
import Notify from '../../shared/Components/notify';
import useCardio from './useCardio';
import CardioHistoryCard from './CardioHistoryCard';
import { formatPace } from './helper';

// ── Page ──────────────────────────────────────────────────────────────────────

function CardioPage(): JSX.Element {
  const {
    sessions,
    formValues,
    activeView,
    selectedSession,
    notification,
    previewPace,
    buttonDisabled,
    setActiveView,
    setNotification,
    handleChange,
    handleSubmit,
    handleSubmitEdit,
    handleDelete,
    handleSelectSession,
    handleStartEdit,
    handleCloseDetail,
    navigate,
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
          {activeView === 'log' || activeView === 'edit' ? (
            <div className="flex flex-col gap-4 overflow-y-auto overflow-x-hidden max-h-[50dvh] ">
              <div className="grid grid-cols-2 gap-3">
                {/* Date – full width */}
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-slate-300 text-xs font-mono">Date *</label>
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
            </div>
          ) : null}

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
                    onEdit={() => handleStartEdit(session)}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {activeView === 'edit' && (
          <div className="flex flex-row justify-center gap-2">
            <Button
              disabled={buttonDisabled || !selectedSession}
              onClick={() => {
                if (selectedSession) handleSubmitEdit(Number(selectedSession.id));
              }}
              border="#08ad4dff"
            >
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

            <Button
              onClick={() => {
                navigate('/');
                handleCloseDetail();
              }}
              border="red"
            >
              Close
            </Button>
          </div>
        )}

        {activeView === 'log' && (
          <div className="flex flex-row justify-center gap-2">
            <Button disabled={buttonDisabled} onClick={handleSubmit} border="#08ad4dff">
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

            <Button
              onClick={() => {
                navigate('/');
                handleCloseDetail();
              }}
              border="red"
            >
              Close
            </Button>
          </div>
        )}
      </TemplatePage>
    </div>
  );
}

export default CardioPage;
