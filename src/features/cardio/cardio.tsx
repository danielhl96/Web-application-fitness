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
import loadingComponente from '../../shared/Components/loading';
import { LogRunForm } from './LogRunForm';

// ── Page ──────────────────────────────────────────────────────────────────────

function CardioPage(): JSX.Element {
  const {
    sessions,
    formValues,
    activeView,
    selectedSession,
    notification,
    previewPace,
    isLoading,
    buttonDisabled,
    uiState,
    setActiveView,
    setNotification,
    handleChange,
    handleSubmit,
    handleSubmitEdit,
    handleDelete,
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
            <>
              <LogRunForm
                formValues={formValues}
                handleChange={handleChange}
                previewPace={previewPace}
              />
            </>
          ) : null}

          {/* ── History View ───────────────────────────────────────────────── */}
          {activeView === 'history' && uiState.type === 'success' && (
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
                    isLoading={isLoading}
                    onDelete={() => handleDelete(session.id)}
                    onEdit={() => handleStartEdit(session)}
                  />
                ))
              )}
            </div>
          )}
          {activeView === 'history' && uiState.type === 'loading' && (
            <>{loadingComponente('Loading cardio sessions...')}</>
          )}
        </div>

        {activeView === 'edit' && (
          <div className="flex flex-row justify-center gap-2">
            <Button
              isLoading={isLoading}
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
            <Button
              isLoading={isLoading}
              disabled={buttonDisabled}
              onClick={handleSubmit}
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
      </TemplatePage>
    </div>
  );
}

export default CardioPage;
