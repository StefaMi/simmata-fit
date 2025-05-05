
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FocusExercise } from "@/types";

type FocusExerciseTimerProps = {
  exercise: FocusExercise;
  onComplete: () => void;
  onCancel: () => void;
};

const FocusExerciseTimer = ({ exercise, onComplete, onCancel }: FocusExerciseTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(exercise.duration);
  const [isPaused, setIsPaused] = useState(false);
  
  useEffect(() => {
    const timer = !isPaused 
      ? setInterval(() => {
          setTimeLeft(prevTime => {
            const newTime = prevTime - 1;
            if (newTime <= 0) {
              clearInterval(timer);
              onComplete();
              return 0;
            }
            return newTime;
          });
        }, 1000)
      : null;
      
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPaused, onComplete]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const progressPercentage = ((exercise.duration - timeLeft) / exercise.duration) * 100;
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-3xl font-bold mb-2">{formatTime(timeLeft)}</h3>
        
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-fitness-primary h-full" 
            style={{width: `${progressPercentage}%`}}
          />
        </div>
        
        <p className="text-lg mt-6">{exercise.name}</p>
        <p className="text-muted-foreground">{exercise.instructions}</p>
      </div>
      
      <div className="flex justify-center space-x-3">
        <Button 
          variant="outline" 
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? "Fortsetzen" : "Pausieren"}
        </Button>
        <Button 
          variant="outline"
          className="text-red-500" 
          onClick={onCancel}
        >
          Abbrechen
        </Button>
      </div>
    </div>
  );
};

export default FocusExerciseTimer;
