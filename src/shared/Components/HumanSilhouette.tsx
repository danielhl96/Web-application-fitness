type HumanSilhouetteProps = {
  gender: string;
  bmi: number;
  height: number;
  waist: number;
  hip: number;
  age: number;
  weight: number;
  onClick: () => void;
};

export default function HumanSilhouette({
  gender = 'female',
  bmi = 22,
  height = 0,
  waist = 0,
  hip = 0,
  onClick,
}: HumanSilhouetteProps) {
  const male = gender !== 'female';
  const torsoPath = male
    ? 'M 26,36 C 24,52 36,68 36,80 C 31,88 31,97 31,104 L 69,104 C 69,97 69,88 64,80 C 64,68 76,52 74,36 Z'
    : 'M 29,36 C 28,52 38,66 37,78 C 28,87 27,97 27,104 L 73,104 C 73,97 72,87 63,78 C 62,66 72,52 71,36 Z';

  const baseColor =
    bmi > 30 ? '#ef4444' : bmi > 25 ? '#f97316' : bmi < 18.5 ? '#facc15' : '#4ade80';
  const glowColor =
    bmi > 30
      ? 'rgba(239,68,68,0.35)'
      : bmi > 25
        ? 'rgba(249,115,22,0.35)'
        : bmi < 18.5
          ? 'rgba(250,204,21,0.35)'
          : 'rgba(74,222,128,0.35)';

  const waistY = male ? 78 : 74;
  const hipY = 104;

  return (
    <svg
      onClick={onClick}
      viewBox="0 0 200 220"
      className="w-66 h-50 drop-shadow-lg cursor-pointer"
    >
      <defs>
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={baseColor} stopOpacity="0.95" />
          <stop offset="100%" stopColor={baseColor} stopOpacity="0.55" />
        </linearGradient>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="bodyClip">
          <rect x="20" y="0" width="120" height="190" rx="8" />
        </clipPath>
      </defs>

      {/* Body glow halo */}
      <g transform="translate(30,0)" filter="url(#glow)" opacity="0.6">
        <ellipse cx="50" cy="12" rx="11" ry="12" fill={glowColor} />
        <path d={torsoPath} fill={glowColor} />
      </g>

      {/* Body */}
      <g fill="url(#bodyGrad)" transform="translate(30,0)">
        <ellipse cx="50" cy="12" rx="11" ry="12" />
        <path d="M 44,24 L 56,24 L 57,34 L 43,34 Z" />
        <path d="M 26,36 C 19,50 17,68 19,90 L 27,90 C 25,68 26,52 30,38 Z" />
        <path d="M 74,36 C 81,50 83,68 81,90 L 73,90 C 75,68 74,52 70,38 Z" />
        <path d={torsoPath} />
        <path d="M 31,104 C 29,112 26,128 27,150 L 27,178 L 39,178 L 39,150 C 40,128 41,112 42,104 Z" />
        <path d="M 69,104 C 71,112 74,128 73,150 L 73,178 L 61,178 L 61,150 C 60,128 59,112 58,104 Z" />
      </g>

      {/* Shine overlay */}
      <g transform="translate(30,0)" opacity="0.18">
        <ellipse cx="46" cy="10" rx="5" ry="4" fill="white" />
        <path d="M 32,40 C 31,52 33,64 34,72 C 36,68 36,52 34,40 Z" fill="white" />
      </g>

      {/* Measurement markers */}
      <g fill="none">
        {height > 0 && (
          <g>
            <line
              x1="153"
              y1="2"
              x2="153"
              y2="178"
              stroke="rgba(147,197,253,0.5)"
              strokeWidth="0.8"
            />
            <line
              x1="150"
              y1="2"
              x2="156"
              y2="2"
              stroke="rgba(147,197,253,0.7)"
              strokeWidth="0.8"
            />
            <line
              x1="150"
              y1="178"
              x2="156"
              y2="178"
              stroke="rgba(147,197,253,0.7)"
              strokeWidth="0.8"
            />
            <path d="M 151,6 L 153,2 L 155,6" stroke="rgba(147,197,253,0.9)" strokeWidth="0.8" />
            <path
              d="M 151,174 L 153,178 L 155,174"
              stroke="rgba(147,197,253,0.9)"
              strokeWidth="0.8"
            />
            <rect
              x="130"
              y="185"
              width="46"
              height="13"
              rx="6"
              fill="rgba(15,23,42,0.7)"
              stroke="rgba(147,197,253,0.3)"
              strokeWidth="0.7"
            />
            <text
              x="153"
              y="194.5"
              fill="rgba(147,197,253,1)"
              stroke="none"
              fontSize="7"
              fontWeight="600"
              textAnchor="middle"
            >
              {height} cm
            </text>
          </g>
        )}
        {waist > 0 && (
          <g>
            <line
              x1="47"
              y1={waistY}
              x2="143"
              y2={waistY}
              stroke="rgba(147,197,253,0.45)"
              strokeWidth="0.8"
              strokeDasharray="3,2"
            />
            <rect
              x="120"
              y={waistY - 7}
              width="38"
              height="12"
              rx="5"
              fill="rgba(15,23,42,0.7)"
              stroke="rgba(147,197,253,0.3)"
              strokeWidth="0.7"
            />
            <text
              x="139"
              y={waistY + 1.5}
              fill="rgba(147,197,253,1)"
              stroke="none"
              fontSize="6.5"
              fontWeight="600"
              textAnchor="middle"
            >
              W: {waist} cm
            </text>
          </g>
        )}
        {hip > 0 && (
          <g>
            <line
              x1="47"
              y1={hipY}
              x2="143"
              y2={hipY}
              stroke="rgba(147,197,253,0.45)"
              strokeWidth="0.8"
              strokeDasharray="3,2"
            />
            <rect
              x="120"
              y={hipY - 7}
              width="38"
              height="12"
              rx="5"
              fill="rgba(15,23,42,0.7)"
              stroke="rgba(147,197,253,0.3)"
              strokeWidth="0.7"
            />
            <text
              x="139"
              y={hipY + 1.5}
              fill="rgba(147,197,253,1)"
              stroke="none"
              fontSize="6.5"
              fontWeight="600"
              textAnchor="middle"
            >
              H: {hip} cm
            </text>
          </g>
        )}
      </g>
    </svg>
  );
}
