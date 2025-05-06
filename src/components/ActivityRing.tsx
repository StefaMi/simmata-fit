
import { useEffect, useState } from "react";

interface ActivityRingProps {
  progress: number; // 0 to 100
  size?: number; // Size in pixels
  strokeWidth?: number; // Stroke width in pixels
  color?: string;
  className?: string;
}

const ActivityRing = ({
  progress,
  size = 120,
  strokeWidth = 12,
  color = "#22c55e", // Default to fitness green
  className = "",
}: ActivityRingProps) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  
  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentProgress / 100) * circumference;
  
  // Animate progress
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentProgress(progress);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Background Ring */}
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted/20"
        />
      </svg>
      
      {/* Progress Ring */}
      <svg width={size} height={size} className="absolute top-0 left-0 rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
        />
      </svg>
      
      {/* Progress Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{Math.round(currentProgress)}%</span>
      </div>
    </div>
  );
};

export default ActivityRing;
