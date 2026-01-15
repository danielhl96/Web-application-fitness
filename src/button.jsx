import react from 'react';

const Button = ({ onClick, disabled, border, children }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="btn w-11 btn-outline btn-primary shadow-lg backdrop-blur-md border border-blue-400 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
      style={{
        background: 'rgba(30, 41, 59, 0.25)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
        border: disabled ? '1.5px solid transparent' : `1.5px solid ${border}`,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(8, 173, 77, 0.3)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.25)')}
    >
      {children}
    </button>
  );
};

export default Button;
