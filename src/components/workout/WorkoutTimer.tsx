import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";

type WorkoutTimerProps = {
  onComplete?: () => void;
  defaultTime?: number;
  title?: string;
  description?: string;
};

const WorkoutTimer = ({
  onComplete,
  defaultTime = 60,
  title = "Pause",
  description = "Ruhe dich aus und bereite dich auf den nächsten Satz vor"
}: WorkoutTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(defaultTime);
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(100);
  
  // Sound-Effekte
  const beepSound = new Audio("/assets/sounds/beep.mp3");
  const completeSound = new Audio("/assets/sounds/complete.mp3");

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      intervalId = setInterval(() => {
        const newTime = timeLeft - 1;
        setTimeLeft(newTime);
        
        // Berechne Fortschritt in Prozent
        const progressPercent = (newTime / defaultTime) * 100;
        setProgress(progressPercent);
        
        // Spiele Sound bei bestimmten Zeitpunkten
        if (!isMuted && newTime <= 3 && newTime > 0) {
          beepSound.play();
        }
        
        // Timer abgelaufen
        if (newTime === 0) {
          if (!isMuted) {
            completeSound.play();
          }
          setIsActive(false);
          if (onComplete) {
            onComplete();
          }
        }
      }, 1000);
    }
    
    return () => clearInterval(intervalId);
  }, [isActive, timeLeft, defaultTime, onComplete, isMuted]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(defaultTime);
    setProgress(100);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  // Custom preset times
  const presetTimes = [30, 60, 90, 120];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-fitness-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer-Anzeige */}
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold tracking-tighter mb-2">
            {formatTime(timeLeft)}
          </div>
          <Progress value={progress} className="h-2 w-full" />
        </div>
        
        {/* Timer-Steuerung */}
        <div className="flex justify-center space-x-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleStartPause}
            className="h-12 w-12 rounded-full"
          >
            {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleReset}
            className="h-12 w-12 rounded-full"
          >
            <RotateCcw className="h-6 w-6" />
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleMute}
            className={`h-12 w-12 rounded-full ${isMuted ? "bg-slate-100" : ""}`}
          >
            {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
          </Button>
        </div>
        
        {/* Voreingestellte Zeiten */}
        <div className="grid grid-cols-4 gap-2">
          {presetTimes.map((time) => (
            <Button
              key={time}
              variant="outline"
              className={timeLeft === time ? "border-fitness-primary" : ""}
              onClick={() => {
                setTimeLeft(time);
                setProgress(100);
              }}
            >
              {time}s
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        {onComplete && (
          <Button 
            className="w-full" 
            onClick={() => {
              if (onComplete) onComplete();
            }}
          >
            Nächste Übung
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default WorkoutTimer;
