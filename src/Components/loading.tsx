function loadingComponente(description: string) {
  return (
    <div className="flex flex-col items-center gap-4">
      <span className="loading loading-dots loading-lg" />
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

export default loadingComponente;
