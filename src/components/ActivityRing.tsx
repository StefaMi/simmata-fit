
import { useEffect, useState, useRef } from "react";

interface ActivityRingProps {
  progress: number; // 0 to 100
  size?: number; // Size in pixels
  strokeWidth?: number; // Stroke width in pixels
  color?: string;
  className?: string;
}

const ActivityRing = ({
  progress = 0,
  size = 120,
  strokeWidth = 12,
  color = "#FF375F", // Red Apple Fitness color
  className = "",
}: ActivityRingProps) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const animationRef = useRef<number>();
  const targetProgressRef = useRef(progress);
  
  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentProgress / 100) * circumference;
  
  // Use RAF for smooth animation
  useEffect(() => {
    targetProgressRef.current = progress;
    
    if (currentProgress === progress) return;
    
    let startTime: number;
    const duration = 800; // Animation duration in ms
    const startProgress = currentProgress;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = easeOutCubic(progress);
      
      const nextProgress = startProgress + (targetProgressRef.current - startProgress) * easedProgress;
      setCurrentProgress(nextProgress);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [progress]);
  
  // Easing function for smoother animation
  const easeOutCubic = (x: number): number => {
    return 1 - Math.pow(1 - x, 3);
  };
  
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
          className="text-slate-800"
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
          style={{ 
            transition: "none", // Using RAF for animation instead
            filter: "drop-shadow(0 0 6px rgba(255, 55, 95, 0.5))" 
          }}
        />
      </svg>
      
      {/* Progress Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{Math.round(currentProgress)}%</span>
      </div>
    </div>
  );
};

export default ActivityRing;
