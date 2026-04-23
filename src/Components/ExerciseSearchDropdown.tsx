import exercise from './exercises.ts';
import Input from './input.tsx';
interface ExerciseSearchDropdownProps {
  value: string;
  onChange: (value: string) => void;
  excludeNames: string[];
  onSelect: (exerciseName: string) => void;
}

export default function ExerciseSearchDropdown({
  value,
  onChange,
  excludeNames,
  onSelect,
}: ExerciseSearchDropdownProps) {
  const filtered = exercise.filter(
    (ex) => ex.name.toLowerCase().includes(value.toLowerCase()) && !excludeNames.includes(ex.name)
  );
  const showDropdown = filtered.length > 0 && value.length > 0;

  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <Input
        w="w-55"
        id="input-e"
        value={value}
        onChange={onChange}
        placeholder="Add an exercise..."
      />
      <div
        className={`h-32 overflow-y-scroll border border-gray-800 ${showDropdown ? 'block' : 'hidden'}`}
      >
        {filtered.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center cursor-pointer max-h-auto overflow-y-auto"
          >
            <div
              onClick={() => onSelect(item.name)}
              className="card w-65 sm:w-40 md:w-60 border border-blue-500 shadow-xl rounded-xl backdrop-blur-lg flex flex-col items-center mb-2"
              style={{
                background: 'rgba(0,0,0,0.20)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                border: '1px solid rgba(0, 0, 0, 0.18)',
                padding: '0.5rem',
              }}
            >
              <h2 className="text-amber-400 font-bold mb-2">{item.name}</h2>
              <figure className="w-6 h-6 mb-2">
                <img
                  src={item.img}
                  style={{ filter: 'invert(1)' }}
                  className="w-full h-full object-cover rounded-md"
                />
              </figure>
              <h1 className="text-slate-200 font-light text-xs mb-2 text-center">
                {item.description}
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
