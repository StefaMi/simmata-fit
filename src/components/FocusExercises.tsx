
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FocusExercise } from "@/types";
import { Wind, Activity } from "lucide-react";

const focusExercises: FocusExercise[] = [
  {
    id: "fe1",
    name: "Nesma Atemübung",
    description: "Eine traditionelle assyrische Atemübung für innere Ruhe",
    duration: 300, // 5 Minuten
    type: "nesma",
    instructions: "Sitze aufrecht und atme tief ein, halte den Atem für 4 Sekunden, und atme langsam aus. Wiederhole für 5 Minuten."
  },
  {
    id: "fe2",
    name: "4-7-8 Atmung",
    description: "Atme ein für 4 Sekunden, halte für 7, ausatmen für 8",
    duration: 180, // 3 Minuten
    type: "breathing",
    instructions: "Atme durch die Nase für 4 Sekunden ein, halte den Atem für 7 Sekunden, atme durch den Mund für 8 Sekunden aus. Wiederhole."
  },
  {
    id: "fe3",
    name: "Fokussierte Aufmerksamkeit",
    description: "Konzentration auf einen einzelnen Punkt",
    duration: 300, // 5 Minuten
    type: "focus",
    instructions: "Fixiere einen Punkt oder Gegenstand mit deinen Augen. Konzentriere dich nur darauf und kehre sanft zur Aufmerksamkeit zurück, wenn deine Gedanken abschweifen."
  },
  {
    id: "fe4",
    name: "Nesma Bodyscan",
    description: "Traditionelle Körperwahrnehmungsübung",
    duration: 600, // 10 Minuten
    type: "nesma",
    instructions: "Beginne bei deinen Füßen und arbeite dich nach oben, indem du jede Körperregion bewusst wahrnimmst und entspannst. Verbinde dich mit jedem Teil deines Körpers."
  }
];

type ExerciseTimerProps = {
  exercise: FocusExercise;
  onComplete: () => void;
  onCancel: () => void;
};

const ExerciseTimer = ({ exercise, onComplete, onCancel }: ExerciseTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(exercise.duration);
  const [isPaused, setIsPaused] = useState(false);
  
  useState(() => {
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
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">{formatTime(timeLeft)}</h3>
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
          className="text-fitness-error" 
          onClick={onCancel}
        >
          Abbrechen
        </Button>
      </div>
    </div>
  );
};

const FocusExercises = () => {
  const [selectedExercise, setSelectedExercise] = useState<FocusExercise | null>(null);
  
  const handleExerciseComplete = () => {
    setSelectedExercise(null);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5 text-fitness-primary" />
          Atem- & Fokusübungen
        </CardTitle>
        <CardDescription>
          Stärke deinen Geist mit diesen Nesma-inspirierten Übungen
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectedExercise ? (
          <ExerciseTimer 
            exercise={selectedExercise}
            onComplete={handleExerciseComplete}
            onCancel={() => setSelectedExercise(null)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {focusExercises.map(exercise => (
              <Card key={exercise.id} className="border border-slate-200">
                <CardContent className="p-4">
                  <div className="flex flex-col h-full">
                    <div className="mb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium mb-1">{exercise.name}</h3>
                          <p className="text-sm text-muted-foreground">{exercise.description}</p>
                        </div>
                        {exercise.type === "nesma" && (
                          <Badge className="bg-fitness-primary">Nesma</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                        <Activity className="h-4 w-4" />
                        <span>{Math.floor(exercise.duration / 60)} Min</span>
                      </div>
                    </div>
                    <div className="mt-auto pt-3">
                      <Button 
                        className="w-full"
                        onClick={() => setSelectedExercise(exercise)}
                      >
                        Übung starten
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FocusExercises;
