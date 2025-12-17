import { useEffect, useState } from 'react';

function Notify({ title, message, type, duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className="flex flex-col items-center ">
      <div
        className={`card w-65 lg:w-40 h-auto lg:h-30 border-2 border-blue-500 shadow-xl rounded-xl backdrop-blur-lg flex flex-col items-center mb-2`}
        style={{
          background: 'rgba(0,0,0,0.20)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: `${type == 'success' ? '2px solid #22c55e' : '2px solid #ef4444'}`,
        }}
      >
        <h1
          className={`${
            type === 'success' ? 'text-green-400' : 'text-red-400'
          } font-bold text-lg mb-2`}
        >
          {title}
        </h1>
        <p className="text-slate-200 text-sm">{message}</p>
      </div>
    </div>
  );
}

export default Notify;
