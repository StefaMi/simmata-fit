
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Exercise, WorkoutPlan } from "@/types";
import { Dumbbell, ExternalLink, Calendar } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type WorkoutPlanDisplayProps = {
  workoutPlan: WorkoutPlan;
};

const WorkoutPlanDisplay = ({ workoutPlan }: WorkoutPlanDisplayProps) => {
  const [frequency, setFrequency] = useState<number>(workoutPlan.frequency);
  const dayNames = Object.keys(workoutPlan.days);
  
  // Filter days based on selected frequency
  const availableDays = dayNames.slice(0, frequency);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-fitness-primary" />
          {workoutPlan.name}
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {workoutPlan.description}
        </CardDescription>
        
        <div className="mt-4 flex flex-col gap-2">
          <Label htmlFor="frequency-select">Trainingshäufigkeit anpassen:</Label>
          <Select 
            value={String(frequency)} 
            onValueChange={(value) => setFrequency(Number(value))}
          >
            <SelectTrigger id="frequency-select" className="w-full sm:w-[180px]">
              <SelectValue placeholder="Wähle Trainingshäufigkeit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2x pro Woche</SelectItem>
              <SelectItem value="3">3x pro Woche</SelectItem>
              <SelectItem value="4">4x pro Woche</SelectItem>
              <SelectItem value="5">5x pro Woche</SelectItem>
              <SelectItem value="6">6x pro Woche</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Passe deine Trainingshäufigkeit an deinen Zeitplan an. 
            Das Training wird automatisch auf {frequency} Tage verteilt.
          </p>
        </div>
      </CardHeader>
      <CardContent>
        {availableDays.length > 0 ? (
          <Tabs defaultValue={availableDays[0]}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-4">
              {availableDays.map((day) => (
                <TabsTrigger key={day} value={day}>
                  {day}
                </TabsTrigger>
              ))}
            </TabsList>

            {availableDays.map((day) => (
              <TabsContent key={day} value={day}>
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">{day} Training</h3>
                  {workoutPlan.days[day].length === 0 ? (
                    <p className="text-muted-foreground">Ruhetag</p>
                  ) : (
                    <div className="space-y-4">
                      {workoutPlan.days[day].map((exercise) => (
                        <ExerciseCard key={exercise.id} exercise={exercise} />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">
              Es konnten keine passenden Übungen für deine Auswahl gefunden werden.
              Bitte wähle andere Körperteile aus.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Dieser Plan ist auf deine Ziele und Trainingsfrequenz ({frequency}x pro Woche) angepasst. 
          Passe das Training nach Bedarf an und achte auf die richtige Ausführung.
        </p>
      </CardFooter>
    </Card>
  );
};

const ExerciseCard = ({ exercise }: { exercise: Exercise }) => {
  const openVideo = () => {
    window.open(exercise.videoUrl, "_blank");
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="text-md font-semibold">{exercise.name}</h4>
            <p className="text-sm text-muted-foreground">{exercise.description}</p>
            <div className="flex flex-wrap gap-x-6 mt-2">
              <div className="text-sm">
                <span className="font-medium">Sätze:</span> {exercise.sets}
              </div>
              <div className="text-sm">
                <span className="font-medium">Wiederholungen:</span> {exercise.reps}
              </div>
              <div className="text-sm">
                <span className="font-medium">Pause:</span> {exercise.restTime}s
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-fitness-primary text-fitness-primary hover:bg-fitness-primary hover:text-white"
            onClick={openVideo}
          >
            <ExternalLink className="h-4 w-4" />
            Video ansehen
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutPlanDisplay;
