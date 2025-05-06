
import { Card } from "@/components/ui/card";
import { Dumbbell, Calendar, Clock, Activity } from "lucide-react";
import { BodyPart } from "@/types";
import { ActivityOption } from "./ActivitySelector";

interface PlanSummaryProps {
  planDuration: number;
  weeklyFrequency: number;
  sessionDuration: number;
  selectedActivities: string[];
  selectedBodyParts: BodyPart[];
  activityOptions: ActivityOption[];
}

const PlanSummary = ({
  planDuration,
  weeklyFrequency,
  sessionDuration,
  selectedActivities,
  selectedBodyParts,
  activityOptions
}: PlanSummaryProps) => {
  // Convert body parts to German
  const bodyPartLabels: Record<BodyPart, string> = {
    chest: "Brust",
    back: "Rücken",
    shoulders: "Schultern",
    biceps: "Bizeps",
    triceps: "Trizeps",
    legs: "Beine",
    abs: "Bauch",
    cardio: "Cardio"
  };

  // Get selected activity labels
  const selectedActivityLabels = activityOptions
    .filter(option => selectedActivities.includes(option.id))
    .map(option => option.label);

  // Get selected body part labels
  const selectedBodyPartLabels = selectedBodyParts.map(part => bodyPartLabels[part]);

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold">Dein Trainingsplan</h3>
      
      <div className="space-y-4">
        {/* Plan Duration */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/15 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">Plandauer</h4>
              <p className="text-sm text-muted-foreground">{planDuration} Wochen</p>
            </div>
          </div>
        </Card>
        
        {/* Weekly Frequency */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/15 p-2 rounded-full">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">Trainingsfrequenz</h4>
              <p className="text-sm text-muted-foreground">{weeklyFrequency}x pro Woche</p>
            </div>
          </div>
        </Card>
        
        {/* Session Duration */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/15 p-2 rounded-full">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">Trainingsdauer</h4>
              <p className="text-sm text-muted-foreground">{sessionDuration} Minuten pro Einheit</p>
            </div>
          </div>
        </Card>
        
        {/* Selected Activities */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/15 p-2 rounded-full">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">Trainingsarten</h4>
              <p className="text-sm text-muted-foreground">{selectedActivityLabels.join(", ")}</p>
            </div>
          </div>
        </Card>
        
        {/* Selected Body Parts */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/15 p-2 rounded-full">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">Körperteile</h4>
              <p className="text-sm text-muted-foreground">{selectedBodyPartLabels.join(", ")}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PlanSummary;
