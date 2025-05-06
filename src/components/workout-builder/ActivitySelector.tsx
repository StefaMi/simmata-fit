
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Check, Dumbbell, Heart, Activity, TrendingUp, Triangle } from "lucide-react";

export interface ActivityOption {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface ActivitySelectorProps {
  selectedActivities: string[];
  onToggleActivity: (id: string) => void;
}

const ActivitySelector = ({ selectedActivities, onToggleActivity }: ActivitySelectorProps) => {
  const activityOptions: ActivityOption[] = [
    {
      id: "cardio",
      label: "Cardio",
      icon: Heart,
      description: "Ausdauertraining für Herz und Kreislauf"
    },
    {
      id: "strength",
      label: "Krafttraining",
      icon: Dumbbell,
      description: "Muskelaufbau und Kraftentwicklung"
    },
    {
      id: "hiit",
      label: "HIIT",
      icon: Activity,
      description: "Hochintensives Intervall-Training"
    },
    {
      id: "flexibility",
      label: "Flexibilität",
      icon: Triangle,
      description: "Beweglichkeit und Dehnung"
    },
    {
      id: "core",
      label: "Core",
      icon: TrendingUp,
      description: "Stärkung der Rumpfmuskulatur"
    }
  ];

  const isSelected = (id: string) => selectedActivities.includes(id);

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground mb-2">
        Wähle die Trainingsarten aus, die du in deinem Plan haben möchtest
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        {activityOptions.map((activity) => {
          const Icon = activity.icon;
          const selected = isSelected(activity.id);
          
          return (
            <Card
              key={activity.id}
              className={`relative p-4 cursor-pointer transition-all border-2 activity-selection-card ${
                selected ? "selected" : ""
              }`}
              onClick={() => onToggleActivity(activity.id)}
            >
              <div className="absolute top-2 right-2">
                {selected && (
                  <div className="bg-primary text-white p-0.5 rounded-full">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center text-center py-2">
                <div className={`p-3 rounded-full mb-3 ${selected ? "bg-primary/20" : "bg-slate-100 dark:bg-slate-800"}`}>
                  <Icon className={`h-6 w-6 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <h3 className="font-medium">{activity.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ActivitySelector;
