
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Check, Calendar } from "lucide-react";

interface FrequencyOption {
  value: number;
  label: string;
  description: string;
}

interface WeeklyFrequencySelectorProps {
  selectedFrequency: number;
  onChange: (frequency: number) => void;
}

const WeeklyFrequencySelector = ({ selectedFrequency, onChange }: WeeklyFrequencySelectorProps) => {
  const frequencyOptions: FrequencyOption[] = [
    {
      value: 3,
      label: "3x pro Woche",
      description: "Ideal für Einsteiger und moderates Training"
    },
    {
      value: 4,
      label: "4x pro Woche",
      description: "Empfohlen für regelmäßige Trainingsfortschritte"
    },
    {
      value: 5,
      label: "5x pro Woche",
      description: "Für fortgeschrittene Trainierende und schnellere Ergebnisse"
    },
    {
      value: 6,
      label: "6x pro Woche",
      description: "Intensives Training für maximale Resultate"
    }
  ];

  return (
    <div className="space-y-4">
      {frequencyOptions.map((option) => (
        <Card
          key={option.value}
          className={`relative p-4 cursor-pointer transition-all border-2 ${
            selectedFrequency === option.value 
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
            {selectedFrequency === option.value && (
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

export default WeeklyFrequencySelector;
