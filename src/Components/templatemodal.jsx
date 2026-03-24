function TemplateModal({ children, border }) {
  return (
    <div className="modal modal-open modal-bottom sm:modal-middle items-center justify-center">
      <div
        className="modal-box  bg-gradient-to-b from-gray-900 to-black shadow-xl rounded-xl h-auto max-h-130"
        style={{
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: border || 'rgba(255,255,255,0.2)  1.5px solid',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default TemplateModal;
