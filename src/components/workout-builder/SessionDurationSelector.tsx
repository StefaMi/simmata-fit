
import { Card } from "@/components/ui/card";
import { Check, Clock } from "lucide-react";

interface DurationOption {
  value: number;
  label: string;
  description: string;
}

interface SessionDurationSelectorProps {
  selectedDuration: number;
  onChange: (duration: number) => void;
}

const SessionDurationSelector = ({ selectedDuration, onChange }: SessionDurationSelectorProps) => {
  const durationOptions: DurationOption[] = [
    {
      value: 15,
      label: "15 Min",
      description: "Kurze, effektive Trainingseinheiten"
    },
    {
      value: 30,
      label: "30 Min",
      description: "Ausgewogenes Training für den Alltag"
    },
    {
      value: 45,
      label: "45 Min",
      description: "Optimale Trainingsdauer für Fortschritte"
    },
    {
      value: 60,
      label: "60 Min",
      description: "Umfassendes Training für maximale Ergebnisse"
    }
  ];

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground mb-2">
        Wie lange soll eine typische Trainingseinheit dauern?
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        {durationOptions.map((option) => (
          <Card
            key={option.value}
            className={`relative p-4 cursor-pointer transition-all border-2 ${
              selectedDuration === option.value 
                ? "border-primary bg-primary/10" 
                : "border-slate-200/50 dark:border-slate-700/50"
            }`}
            onClick={() => onChange(option.value)}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-2">
                <Clock className={`h-8 w-8 ${selectedDuration === option.value ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <h3 className="font-semibold">{option.label}</h3>
              <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SessionDurationSelector;
