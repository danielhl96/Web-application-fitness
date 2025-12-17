function WorkoutCard({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-pressed="false"
      className="card w-55 md:w-65 bg-black/20 border border-blue-500 shadow-xl mb-4 rounded-xl backdrop-blur-lg cursor-pointer transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-400 hover:scale-[1.025] hover:shadow-blue-400/40 active:scale-95 active:shadow-blue-500/60 group"
      style={{
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        border: '2px solid #3b82f6',
      }}
    >
      <div className="card-body text-xl items-center text-center select-none group-hover:text-blue-300 group-active:text-blue-500">
        {children}
      </div>
    </div>
  );
}

export default WorkoutCard;
