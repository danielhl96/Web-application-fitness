import { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import './index.css';

function PasswordInput({ value, onChange, onError, errorMessage, placeholder }) {
  const [touched, setTouched] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setPasswordError(
      value.length < 8 ||
        !/[A-Z]/.test(value) ||
        !/[a-z]/.test(value) ||
        !/\d/.test(value) ||
        !/[!@#$%^&*]/.test(value)
    );
  }, [value]);

  const error = !!value && passwordError;

  useEffect(() => {
    if (onError) {
      onError(error);
    }
  }, [error, onError]);

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onBlur={() => setTouched(true)}
        className={`w-full px-4 py-2 pl-9 pr-4 rounded-xl border border-blue-400 bg-white/10
      text-white shadow-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400
      placeholder:text-blue-200${error && touched ? 'border-red-500' : ''}`}
        style={{
          background: 'rgba(30, 41, 59, 0.25)', // dunkles Glas
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
          border: '1.5px solid rgba(59, 130, 246, 0.25)', // blue-500
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      />
      <LockClosedIcon className="absolute left-2 top-2.5 h-5 w-5 text-white-400" />
      <button
        className="absolute right-2 top-2.5 text-white-400"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
      </button>
      {error && touched && <h1 className="text-red-500 text-xs ">{errorMessage}</h1>}
    </div>
  );
}
export default PasswordInput;
