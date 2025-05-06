
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Exercise, WorkoutPlan } from "@/types";
import { Dumbbell, ExternalLink, Calendar } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { optimizeWorkoutDays } from "@/utils/workoutUtils";

type WorkoutPlanDisplayProps = {
  workoutPlan: WorkoutPlan;
};

const WorkoutPlanDisplay = ({ workoutPlan }: WorkoutPlanDisplayProps) => {
  const [frequency, setFrequency] = useState<number>(workoutPlan.frequency);
  const [plan, setPlan] = useState<WorkoutPlan>(workoutPlan);
  const isMounted = useRef(true);
  
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Update plan when frequency changes
  useEffect(() => {
    if (frequency !== workoutPlan.frequency && isMounted.current) {
      // Create a copy of the workout plan with new frequency
      const updatedPlan = { ...workoutPlan, frequency };
      
      // Use the optimizeWorkoutDays utility to redistribute exercises
      const optimizedPlan = optimizeWorkoutDays(updatedPlan);
      
      setPlan(optimizedPlan);
      
      // Save updated plan to localStorage
      localStorage.setItem("workoutPlan", JSON.stringify(optimizedPlan));
    }
  }, [frequency, workoutPlan]);
  
  // Get the optimal days for the current frequency
  const optimalDays = (() => {
    const allDays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
    
    switch(frequency) {
      case 2:
        return ["Montag", "Donnerstag"];
      case 3:
        return ["Montag", "Mittwoch", "Freitag"];
      case 4:
        return ["Montag", "Dienstag", "Donnerstag", "Freitag"];
      case 5:
        return ["Montag", "Dienstag", "Mittwoch", "Freitag", "Samstag"];
      case 6:
        return ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
      default:
        return allDays.slice(0, frequency);
    }
  })();
  
  // Available days will be ordered according to the week
  const weekdayOrder = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
  const availableDays = optimalDays.sort((a, b) => weekdayOrder.indexOf(a) - weekdayOrder.indexOf(b));
  
  // Create a list of all days showing which ones are rest days
  const allWeekDays = weekdayOrder.map(day => ({
    name: day,
    isRestDay: !availableDays.includes(day)
  }));

  // Check if a day has exercises (non-empty)
  const dayHasExercises = (day: string): boolean => {
    return Array.isArray(plan.days[day]) && plan.days[day].length > 0;
  };

  // Count how many days actually have exercises
  const daysWithExercises = availableDays.filter(day => dayHasExercises(day));
  console.log("Days with exercises:", daysWithExercises);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-fitness-primary" />
          {plan.name}
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {plan.description}
        </CardDescription>
        
        <div className="mt-4 flex flex-col gap-2">
          <Label htmlFor="frequency-select">Trainingshäufigkeit anpassen:</Label>
          <Select 
            value={String(frequency)} 
            onValueChange={(value) => {
              if (isMounted.current) {
                setFrequency(Number(value));
              }
            }}
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
        
        {/* Display the weekly schedule overview */}
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Wochenübersicht:</p>
          <div className="flex flex-wrap gap-2">
            {allWeekDays.map((day) => (
              <span 
                key={day.name}
                className={`text-xs px-2 py-1 rounded-full ${
                  day.isRestDay 
                    ? "bg-slate-100 text-slate-500" 
                    : "bg-fitness-primary/10 text-fitness-primary font-medium"
                }`}
              >
                {day.name.substring(0, 2)}
                {day.isRestDay ? " (R)" : ""}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={availableDays.length > 0 ? availableDays[0] : "overview"}>
          <TabsList className="flex flex-wrap mb-4 overflow-x-auto">
            {/* Overview tab for complete summary */}
            <TabsTrigger value="overview" className="whitespace-nowrap">Übersicht</TabsTrigger>
            
            {/* Individual day tabs */}
            {availableDays.map((day) => (
              <TabsTrigger key={day} value={day} className="whitespace-nowrap">
                {day}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {/* Overview content showing all days */}
          <TabsContent value="overview">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Wochenplanung</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allWeekDays.map((day) => (
                  <Card key={day.name}>
                    <CardHeader className="py-3">
                      <CardTitle className="text-md">{day.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      {!dayHasExercises(day.name) ? (
                        <p className="text-muted-foreground">Ruhetag</p>
                      ) : (
                        <ul className="list-disc pl-4 space-y-1">
                          {plan.days[day.name]?.slice(0, 3).map((exercise) => (
                            <li key={exercise.id} className="text-sm">{exercise.name}</li>
                          ))}
                          {plan.days[day.name]?.length > 3 && (
                            <li className="text-sm text-muted-foreground">
                              +{plan.days[day.name].length - 3} weitere
                            </li>
                          )}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Individual day content */}
          {availableDays.map((day) => (
            <TabsContent key={day} value={day}>
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">{day} Training</h3>
                {!dayHasExercises(day) ? (
                  <p className="text-muted-foreground">Ruhetag</p>
                ) : (
                  <div className="space-y-4">
                    {plan.days[day]?.map((exercise) => (
                      <ExerciseCard key={exercise.id} exercise={exercise} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
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
            className="flex-shrink-0 flex items-center gap-2 border-fitness-primary text-fitness-primary hover:bg-fitness-primary hover:text-white mt-2 md:mt-0"
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
