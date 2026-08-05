export default function AshokaCss({ size = 120, className = "", color = "#000080" }: { size?: number; className?: string; color?: string }) {
  const spokes = Array.from({ length: 24 }, (_, i) => i);
  const r = size / 2;
  const strokeW = Math.max(1, size / 60);
  const f = (n: number) => n.toFixed(3);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-label="Ashoka Chakra"
      suppressHydrationWarning
    >
      {/* Outer ring */}
      <circle cx={r} cy={r} r={r * 0.88} fill="none" stroke={color} strokeWidth={strokeW * 2.2} />
      {/* Inner ring */}
      <circle cx={r} cy={r} r={r * 0.13} fill={color} />
      {/* 24 spokes */}
      {spokes.map((i) => {
        const rad = (i / 24) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={f(r + Math.cos(rad) * r * 0.15)}
            y1={f(r + Math.sin(rad) * r * 0.15)}
            x2={f(r + Math.cos(rad) * r * 0.86)}
            y2={f(r + Math.sin(rad) * r * 0.86)}
            stroke={color}
            strokeWidth={strokeW}
            suppressHydrationWarning
          />
        );
      })}
    </svg>
  );
}
