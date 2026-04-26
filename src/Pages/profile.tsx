import '../index.css';
import Header from '../Components/Header.js';

import TemplatePage from '../Components/templatepage.js';
import Notify from '../Components/notify.js';
import History from '../Components/history.tsx';
import EditProfile from '../Components/editprofile.tsx';
import ViewProfile from '../Components/viewprofile.tsx';
import loadingComponente from '../Components/loading.tsx';
import { useProfile } from '../hooks/useProfile.ts';

function Profile() {
  const {
    form,
    formErrors,
    edit,
    notification,
    user,
    showTrend,
    bodyvalue,
    selectedBodyValue,
    setSelectedBodyValue,
    setShowTrend,
    handleAge,
    handleActivity,
    handleHeight,
    handleWeight,
    handleHip,
    handleWaist,
    handleGender,
    handleGoal,
    handleBFP,
    handleEdit,
    setNotification,
    setEdit,
  } = useProfile();

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
            // Notify handles its own visibility, but we clear notification after duration to allow re-showing
            onClose={() => setNotification(null)}
          />
        )}

        {showTrend && (
          <History
            bodyvalue={bodyvalue}
            selectedBodyValue={selectedBodyValue}
            setSelectedBodyValue={setSelectedBodyValue}
            setShowTrend={setShowTrend}
          />
        )}

        {edit ? (
          <EditProfile
            bmi={form.bmi}
            height={form.height}
            weight={form.weight}
            hwr={form.hwr}
            hip={form.hip}
            waist={form.waist}
            goal={form.goal.toString()}
            bfp={form.bfp}
            failureAge={formErrors.age}
            failureWeight={formErrors.weight}
            failureHeight={formErrors.height}
            failureWaist={formErrors.waist}
            failureHip={formErrors.hip}
            failureBFP={formErrors.bfp}
            gender={form.gender}
            age={form.age}
            calories={form.calories}
            activity={form.activity}
            handleAge={handleAge}
            handleWeight={handleWeight}
            handleHeight={handleHeight}
            handleHip={handleHip}
            handleWaist={handleWaist}
            handleGender={handleGender}
            handleGoal={handleGoal}
            handleBFP={handleBFP}
            handleActivity={handleActivity}
            handleEdit={handleEdit}
            setEdit={setEdit}
          />
        ) : (
          !showTrend &&
          (user.type === 'success' ? (
            <ViewProfile
              bmi={form.bmi}
              height={form.height}
              weight={form.weight}
              hwr={form.hwr}
              hip={form.hip}
              waist={form.waist}
              goal={form.goal}
              bfp={form.bfp}
              gender={form.gender}
              age={form.age}
              calories={form.calories}
              activity={form.activity}
              bri={form.bri}
              setShowTrend={setShowTrend}
              setEdit={setEdit}
            />
          ) : user.type === 'error' ? (
            <div className="flex flex-col justify-center items-center mt-8 gap-3">
              <span className="text-red-400">Error loading user data</span>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-[60vh]">
              {loadingComponente('Loading profile...')}
            </div>
          ))
        )}
      </TemplatePage>
    </div>
  );
}

export default Profile;
