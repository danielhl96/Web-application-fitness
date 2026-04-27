import { JSX } from 'react';
type ButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  border?: string;
  w?: string;
  children: React.ReactNode;
  isLoading?: boolean;
};

const Button = ({
  onClick,
  disabled,
  border,
  w,
  children,
  isLoading,
}: ButtonProps): JSX.Element => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`relative overflow-hidden text-xs ${w ?? ''} px-4 py-2 rounded-2xl border border-white/30 shadow-xl backdrop-blur-md bg-white/10 text-white flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:bg-white/20 focus:ring-2 focus:ring-blue-400 ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      }`}
      style={border && !disabled ? { border: `1.5px solid ${border}` } : undefined}
    >
      {/* Glas-Glanz-Effekt */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(120deg, rgba(10,10,15,0.85) 0%, rgba(20,20,30,0.92) 100%)',
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18), 0 1px 4px 0 rgba(0,0,0,0.12) inset',
          WebkitBackdropFilter: 'blur(2px)',
          backdropFilter: 'blur(2px)',
          zIndex: 0,
        }}
      />
      <span className="relative z-10 flex items-center gap-2 w-full justify-center">
        {isLoading ? (
          <span className="loading loading-spinner text-white loading-xs"></span>
        ) : (
          children
        )}
      </span>
    </button>
  );
};

export default Button;
