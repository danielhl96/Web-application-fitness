import '../index.css';
import { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header.tsx';
import TemplatePage from '../Components/templatepage.js';
import Notify from '../Components/notify.js';
import Input from '../Components/input.js';
import Button from '../Components/button.js';
import TemplateModal from '../Components/templatemodal.js';
import Workouts from '../Components/workouts.js';
import EditWorkoutPage from '../Components/editworkout.tsx';
import { useEditTrain } from '../hooks/useEditTrain.ts';
import loadingComponente from '../Components/loading.tsx';

const EditTrain = (): JSX.Element => {
  const navigate = useNavigate();
  const {
    showState,
    showModal,
    showEditWorkoutNameModal,
    setShowEditWorkoutNameModal,
    savekey,
    setSaveKey,
    addExercise,
    setAddExercise,
    workoutName,
    setWorkoutName,
    notification,
    setNotification,
    confirmationModalForDelete,
    setConfirmationModalforWorkoutDelete,
    selectedExercise,
    setSelectedExercise,
    handleEditWorkout,
    changePosition,
    changeWorkoutNameAPI,
    handleShowModal,
    handleRemoveWorkoutAPI,
    handleAddExercise,
  } = useEditTrain();

  function renderConfirmDeleteModal(): JSX.Element {
    return (
      <TemplateModal border="#ef4444 1.5px solid">
        <div>
          <h3 className="font-bold text-lg text-amber-50 mb-4">Delete Workout Plan</h3>
          <p className="text-amber-50 mb-4">Are you sure you want to delete this workout plan?</p>
          <div className="modal-action">
            <Button onClick={() => handleRemoveWorkoutAPI(savekey)} border="#ef4444">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </Button>
            <Button onClick={() => setConfirmationModalforWorkoutDelete(false)} border="#3b82f6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
        </div>
      </TemplateModal>
    );
  }

  function renderRenameModal(): JSX.Element {
    return (
      <TemplateModal>
        <div>
          <h3 className="font-bold text-lg text-amber-50 mb-4">Change Workout Name</h3>
          <Input
            placeholder="New Workout Name"
            w="w-full"
            h="h-10"
            value={workoutName}
            onChange={setWorkoutName}
          />
          <div className="modal-action">
            <Button
              onClick={() => changeWorkoutNameAPI()}
              border="#3b82f6"
              disabled={workoutName.length === 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </Button>
            <Button onClick={() => setShowEditWorkoutNameModal(false)} border="#ef4444">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
        </div>
      </TemplateModal>
    );
  }

  return (
    <div>
      <Header />

      <TemplatePage>
        {notification && (
          <Notify
            title={notification.title}
            message={notification.message}
            duration={1500}
            key={notification.message + notification.title + Date.now()}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
        {showEditWorkoutNameModal && renderRenameModal()}
        {confirmationModalForDelete && renderConfirmDeleteModal()}

        <div className="flex flex-col items-center justify-center min-h-0">
          <div className="divider divider-primary text-white font-bold mb-2">
            <div className="flex flex-row items-center justify-center">
              {showModal ? savekey : 'Edit your workout plans'}
              {showModal && (
                <Button onClick={() => setShowEditWorkoutNameModal(true)} border="transparent">
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </Button>
              )}
            </div>
          </div>

          <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl justify-center flex grid lg:grid-cols-3 gap-4 items-center pt-2 overflow-y-auto max-h-[70dvh]">
            {showModal ? (
              <div>
                <EditWorkoutPage
                  addExercise={addExercise}
                  setAddExercise={setAddExercise}
                  selectedExercise={selectedExercise}
                  savekey={savekey}
                  handleAddExercise={handleAddExercise}
                  setSelectedExercise={setSelectedExercise}
                  handleEditWorkout={handleEditWorkout}
                  handleShowModal={handleShowModal}
                  changePosition={changePosition}
                />
              </div>
            ) : showState.type === 'success' ? (
              Object.keys(selectedExercise).map((workout, index) => (
                <Workouts
                  exercise={workout}
                  key={index}
                  handleShowModal={handleShowModal}
                  setConfirmationModalforWorkoutDelete={setConfirmationModalforWorkoutDelete}
                  setSaveKey={setSaveKey}
                  selectedExercise={selectedExercise}
                />
              ))
            ) : showState.type === 'error' ? (
              <>
                <p className="text-white">No workout plans available. Please create one first.</p>
                <Button border="#ef4444" onClick={() => navigate('/createtrain')}>
                  Create Workout
                </Button>
              </>
            ) : (
              <div className="min-h-[50dvh] flex items-center justify-center flex-col">
                {loadingComponente('Loading your workout plans')}
              </div>
            )}
          </div>
        </div>
      </TemplatePage>
    </div>
  );
};

export default EditTrain;
