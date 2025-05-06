
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface PlanDurationOption {
  value: number;
  label: string;
  description: string;
}

interface PlanDurationSelectorProps {
  selectedDuration: number;
  onChange: (duration: number) => void;
}

const PlanDurationSelector = ({ selectedDuration, onChange }: PlanDurationSelectorProps) => {
  const durationOptions: PlanDurationOption[] = [
    {
      value: 2,
      label: "2 Wochen",
      description: "Ideal für kurze Ziele oder zum Ausprobieren"
    },
    {
      value: 4,
      label: "4 Wochen",
      description: "Empfohlene Dauer für erste Ergebnisse"
    },
    {
      value: 8,
      label: "8 Wochen",
      description: "Für langfristige Ziele und maximale Ergebnisse"
    },
    {
      value: 12,
      label: "12 Wochen",
      description: "Umfassender Plan für tiefgreifende Veränderungen"
    }
  ];

  return (
    <div className="space-y-4">
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
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{option.label}</h3>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
            {selectedDuration === option.value && (
              <div className="bg-primary text-white p-1 rounded-full">
                <Check className="h-4 w-4" />
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PlanDurationSelector;
