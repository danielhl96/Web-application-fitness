import { useState, useEffect } from 'react';
import './index.css';
function PasswordInput({ value, onChange, onError, errorMessage, placeholder }) {
  const [touched, setTouched] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

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
    <div className="input-group">
      <input
        placeholder={placeholder}
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        className={`input input-primary border ${error && touched ? 'border-red-500' : ''}`}
      />
      {error && touched && <h1 className="text-red-500 text-xs ">{errorMessage}</h1>}
    </div>
  );
}
export default PasswordInput;
