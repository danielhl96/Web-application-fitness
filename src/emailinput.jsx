import { useEffect, useState } from 'react';
import './index.css';
function EmailInput({ value, onChange, onError }) {
  const [touched, setTouched] = useState(false);

  const validEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    validEmail(value);
  }, [value]);
  const error = value && !validEmail(value);

  // Inform parent about error state
  if (onError) {
    onError(error);
  }

  return (
    <div className="input-group">
      <input
        type="text"
        className="w-full px-4 py-2 rounded-xl border border-blue-400 bg-white/10
      text-white shadow-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400
      placeholder:text-blue-200"
        style={{
          background: 'rgba(30, 41, 59, 0.25)', // dunkles Glas
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
          border: '1.5px solid rgba(59, 130, 246, 0.25)', // blue-500
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        placeholder="Email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
      />
      {error && touched && <h1 className="text-red-500 text-xs ">Please enter a valid email.</h1>}
    </div>
  );
}

export default EmailInput;
