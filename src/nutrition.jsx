import TemplatePage from './templatepage';

function Nutrition() {
  return (
    <div>
      <TemplatePage>
        <div className="overflow-auto max-h-[80vh]">
          <h1 className="text-2xl font-bold text-white mb-4">Nutrition</h1>
          <div className="divider divider-primary"></div>
          <p>This page provides nutrition information and tracking features.</p>
        </div>
      </TemplatePage>
    </div>
  );
}

export default Nutrition;
