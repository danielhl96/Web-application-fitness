function TemplatePage(props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-black flex flex-col items-center pt-24 pb-8">
      <div
        className="space-y-6 card w-85 h-auto md:w-100 md:h-auto bg-black/20 border border-blue-500 shadow-xl p-8 rounded-xl flex flex-col backdrop-blur-lg"
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
export default TemplatePage;
