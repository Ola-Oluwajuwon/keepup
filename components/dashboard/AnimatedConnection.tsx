"use client";

interface AnimatedConnectionProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  color?: string;
}

export function AnimatedConnection({
  fromX,
  fromY,
  toX,
  toY,
  color = "#64748b", // slate-500
}: AnimatedConnectionProps) {
  // Calculate midpoint for a curved path
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;

  // Create a quadratic bezier curve path
  const pathData = `M ${fromX} ${fromY} Q ${midX} ${midY} ${toX} ${toY}`;

  return (
    <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {/* Main connection line */}
      <path
        d={pathData}
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeDasharray="5,5"
      />

      {/* Animated dot traveling along the path */}
      <circle r="4" fill={color}>
        <animateMotion dur="3s" repeatCount="indefinite" path={pathData} />
      </circle>
    </svg>
  );
}
