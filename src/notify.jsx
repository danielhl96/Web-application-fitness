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
    <div className="modal modal-open modal-bottom sm:modal-middle items-center justify-center">
      <div
        className={`modal-box modal-sm border border-blue-500 shadow-xl rounded-xl p-2`}
        style={{
          width: '16rem', // ca. 256px, deutlich kleiner als Standard
          minWidth: '10rem',
          maxWidth: '90vw',
          background: 'rgba(0,0,0,0.20)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: `${type == 'success' ? '2px solid #22c55e' : '2px solid #ef4444'}`,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
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
