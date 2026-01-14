function TemplatePage({ children }) {
  return (
    <div className="container @container min-h-dvh bg-gradient-to-b from-gray-900 to-black flex flex-col items-center px-2 py-2">
      {/* vertikale Zentrierung */}
      <div className="flex-1 flex items-start sm:items-center  w-full pt-16 pb-8">
        <div
          className="
            w-full
            max-w-sm sm:max-w-md
            space-y-6
            rounded-xl
            bg-black/20
            border border-white/20
            p-6 sm:p-8
            shadow-xl
            backdrop-blur-lg
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default TemplatePage;
