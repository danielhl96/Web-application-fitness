import { useState, useEffect } from 'react';
import './index.css';
function Input({ value, onChange, w, h, placeholder, onDisable, id, onBlur }) {
  return (
    <div className="input-group">
      <input
        placeholder={placeholder}
        disabled={onDisable}
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`${w} ${h} px-4 py-2 rounded-xl border border-blue-400 bg-white/10
      text-white shadow-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400
      placeholder:text-blue-200 ${onDisable ? 'cursor-not-allowed opacity-50' : ''}`}
        style={{
          background: 'rgba(30, 41, 59, 0.25)', // dunkles Glas
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
          border: '1.5px solid rgba(59, 130, 246, 0.25)', // blue-500
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      />
    </div>
  );
}
export default Input;
