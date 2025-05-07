
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Info, CalendarIcon, Clock, Dumbbell, Heart, Play, Check, X } from "lucide-react";
import { WorkoutPlan, Exercise } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FeedbackForm from "./FeedbackForm";

interface EnhancedWorkoutPlanProps {
  plan: WorkoutPlan;
  onSave?: () => void;
}

const EnhancedWorkoutPlan = ({ plan, onSave }: EnhancedWorkoutPlanProps) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [completedWorkouts, setCompletedWorkouts] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Load completed workouts from localStorage on component mount
  useEffect(() => {
    const savedCompletedWorkouts = localStorage.getItem(`completedWorkouts_${plan.id}`);
    if (savedCompletedWorkouts) {
      setCompletedWorkouts(JSON.parse(savedCompletedWorkouts));
    }
  }, [plan.id]);

  // Save completed workouts to localStorage when they change
  useEffect(() => {
    if (Object.keys(completedWorkouts).length > 0) {
      localStorage.setItem(`completedWorkouts_${plan.id}`, JSON.stringify(completedWorkouts));
    }
  }, [completedWorkouts, plan.id]);

  // Mark a day's workout as completed or not completed
  const toggleDayCompletion = (day: string) => {
    setCompletedWorkouts(prev => {
      const newState = { 
        ...prev, 
        [day]: !prev[day] 
      };
      
      // Save immediately to localStorage
      localStorage.setItem(`completedWorkouts_${plan.id}`, JSON.stringify(newState));
      
      return newState;
    });

    toast({
      title: completedWorkouts[day] ? "Training als nicht absolviert markiert" : "Training als absolviert markiert",
      description: `${day} Training ${completedWorkouts[day] ? "nicht " : ""}absolviert.`
    });
  };

  // Format day names to their short forms for the weekly overview
  const formatDayShort = (day: string): string => {
    const days: Record<string, string> = {
      "Montag": "Mo",
      "Dienstag": "Di",
      "Mittwoch": "Mi",
      "Donnerstag": "Do",
      "Freitag": "Fr",
      "Samstag": "Sa",
      "Sonntag": "So"
    };
    return days[day] || day.substring(0, 2);
  };

  // Get all days in the workout plan
  const allDays = Object.keys(plan.days).sort((a, b) => {
    const order = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
    return order.indexOf(a) - order.indexOf(b);
  });

  // Calculate weekly progress
  const completedCount = Object.values(completedWorkouts).filter(Boolean).length;
  const totalWorkoutDays = allDays.filter(day => (plan.days[day]?.length || 0) > 0).length;
  const progressPercentage = totalWorkoutDays > 0 ? (completedCount / totalWorkoutDays) * 100 : 0;

  return (
    <>
      <Card className="w-full backdrop-blur-md bg-background/80 border border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {plan.frequency}x pro Woche • {plan.description}
              </CardDescription>
            </div>
            <FeedbackForm />
          </div>
          
          {/* Weekly overview */}
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Wochenfortschritt: {Math.round(progressPercentage)}%</h3>
            <div className="flex flex-wrap gap-2">
              {allDays.map((day) => (
                <Badge 
                  key={day}
                  variant={completedWorkouts[day] ? "default" : "outline"}
                  className={`cursor-pointer ${
                    (plan.days[day]?.length || 0) === 0 
                      ? "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700" 
                      : completedWorkouts[day]
                        ? "bg-green-500 hover:bg-green-600" 
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => (plan.days[day]?.length || 0) > 0 && toggleDayCompletion(day)}
                >
                  {formatDayShort(day)}
                  {(plan.days[day]?.length || 0) === 0 ? (
                    <span className="ml-1">•</span>
                  ) : completedWorkouts[day] ? (
                    <Check className="h-3 w-3 ml-1" />
                  ) : null}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        
        <Tabs defaultValue={allDays[0]} className="w-full">
          <div className="px-6 border-b border-slate-100 dark:border-slate-800">
            <TabsList className="flex overflow-x-auto pb-px">
              {allDays.map((day) => (
                <TabsTrigger 
                  key={day} 
                  value={day} 
                  disabled={(plan.days[day]?.length || 0) === 0}
                  className="whitespace-nowrap relative"
                >
                  {day}
                  {completedWorkouts[day] && (
                    <span className="absolute -top-1 -right-1">
                      <Check className="h-3 w-3 text-green-500" />
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {allDays.map((day) => (
            <TabsContent key={day} value={day} className="px-6 py-4">
              {(plan.days[day]?.length || 0) === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Ruhetag</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{day} Training</h3>
                    <Button
                      size="sm"
                      variant={completedWorkouts[day] ? "outline" : "default"}
                      onClick={() => toggleDayCompletion(day)}
                      className={completedWorkouts[day] ? "border-green-500 text-green-500" : ""}
                    >
                      {completedWorkouts[day] ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Absolviert
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Training starten
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {plan.days[day]?.map((exercise, index) => (
                      <Card 
                        key={`${exercise.id}_${index}`}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                        onClick={() => setSelectedExercise(exercise)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="flex items-center justify-center bg-primary/10 rounded-full h-8 w-8 mr-3">
                                <span className="text-sm font-medium">{index + 1}</span>
                              </div>
                              <div>
                                <h4 className="font-medium">{exercise.name}</h4>
                                <div className="flex flex-wrap gap-x-4 mt-1 text-sm text-muted-foreground">
                                  <div className="flex items-center">
                                    <span>{exercise.sets} Sätze</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span>{exercise.reps} Wdh.</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>{exercise.restTime}s Pause</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        <CardFooter className="flex justify-between border-t border-slate-100 dark:border-slate-800 px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Trainingsplan angepasst auf {plan.frequency}x pro Woche
          </div>
          {onSave && (
            <Button variant="outline" onClick={onSave}>
              <Heart className="h-4 w-4 mr-2" />
              Als Favorit speichern
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Exercise detail dialog */}
      {selectedExercise && (
        <Dialog open={!!selectedExercise} onOpenChange={() => setSelectedExercise(null)}>
          <DialogContent className="max-w-lg backdrop-blur-md bg-background/80">
            <DialogHeader>
              <DialogTitle>{selectedExercise.name}</DialogTitle>
              <DialogDescription className="flex items-center">
                <Dumbbell className="h-4 w-4 mr-1" /> 
                {selectedExercise.bodyPart.charAt(0).toUpperCase() + selectedExercise.bodyPart.slice(1)} Übung
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Exercise image or video thumbnail */}
              <div className="bg-slate-100 dark:bg-slate-800 rounded-md aspect-video overflow-hidden">
                {selectedExercise.videoUrl ? (
                  <img 
                    src="/lovable-uploads/0c670c6e-02ac-423d-b258-b3b0d7acfe1e.png" 
                    alt={selectedExercise.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Dumbbell className="h-12 w-12 text-muted-foreground opacity-50" />
                  </div>
                )}
              </div>
              
              {/* Exercise details */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                  <p className="text-sm text-muted-foreground">Sätze</p>
                  <p className="text-xl font-semibold">{selectedExercise.sets}</p>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                  <p className="text-sm text-muted-foreground">Wiederholungen</p>
                  <p className="text-xl font-semibold">{selectedExercise.reps}</p>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                  <p className="text-sm text-muted-foreground">Pause</p>
                  <p className="text-xl font-semibold">{selectedExercise.restTime}s</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Beschreibung</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedExercise.description || "Diese Übung stärkt und trainiert die Muskeln im Bereich des " + selectedExercise.bodyPart + "."}
                </p>
              </div>
              
              {selectedExercise.equipmentType && (
                <div>
                  <h4 className="font-medium mb-1">Ausrüstung</h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {selectedExercise.equipmentType}
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedExercise(null)}>
                Schließen
              </Button>
              {selectedExercise.videoUrl && (
                <Button 
                  className="flex items-center" 
                  onClick={() => window.open(selectedExercise.videoUrl, "_blank")}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Video ansehen
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default EnhancedWorkoutPlan;
