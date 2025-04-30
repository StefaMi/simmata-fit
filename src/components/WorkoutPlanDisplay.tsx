
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Exercise, WorkoutPlan } from "@/types";
import { Dumbbell, ExternalLink } from "lucide-react";

type WorkoutPlanDisplayProps = {
  workoutPlan: WorkoutPlan;
};

const WorkoutPlanDisplay = ({ workoutPlan }: WorkoutPlanDisplayProps) => {
  const dayNames = Object.keys(workoutPlan.days);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-fitness-primary" />
          {workoutPlan.name}
        </CardTitle>
        <CardDescription>{workoutPlan.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={dayNames[0]}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-4">
            {dayNames.map((day) => (
              <TabsTrigger key={day} value={day}>
                {day}
              </TabsTrigger>
            ))}
          </TabsList>

          {dayNames.map((day) => (
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
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Dieser Plan ist auf deine Ziele und Trainingsfrequenz angepasst. Passe das Training nach Bedarf an und achte auf die richtige Ausführung.
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
            <div className="flex gap-x-6 mt-2">
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
