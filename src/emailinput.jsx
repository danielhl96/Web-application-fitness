import { useState } from 'react';
import './index.css';
function EmailInput({ value, onChange, onError }) {
  const [touched, setTouched] = useState(false);

  const validEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const error = value && !validEmail(value);

  // Inform parent about error state
  if (onError) {
    onError(error);
  }

  return (
    <div className="input-group">
      <input
        placeholder="Email:"
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        className={`input input-primary border ${error && touched ? 'border-red-500' : ''}`}
      />
      {error && touched && <h1 className="text-red-500 text-xs ">Please enter a valid email.</h1>}
    </div>
  );
}

export default EmailInput;
