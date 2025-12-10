function WorkoutCard({ exercise, props }) {
  return (
    <div
      className="card w-55 md:w-65 bg-black/20 border border-blue-500 shadow-xl mb-4 rounded-xl backdrop-blur-lg"
      style={{
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
      }}
    >
      <div className="card-body text-xl items-center text-center">
        <h2 className="text-amber-50 font-bold mb-2">Workout: {exercise}</h2>
        {props.children}
      </div>
    </div>
  );
}

export default WorkoutCard;
