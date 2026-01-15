import react from 'react';

const Button = ({ onClick, disabled, border, children }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`btn btn-outline btn-primary shadow-lg backdrop-blur-md border text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 flex items-center gap-2 ${
        disabled ? 'border-transparent' : border ? '' : 'border-blue-400'
      }`}
      style={border && !disabled ? { border: `1.5px solid ${border}` } : undefined}
    >
      {children}
    </button>
  );
};

export default Button;
