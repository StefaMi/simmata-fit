
import { useState } from "react";
import { BodyPart } from "@/types";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface BodyPartOption {
  value: BodyPart;
  label: string;
  svgPath: string;
}

interface BodyPartSelectorProps {
  selectedParts: BodyPart[];
  onToggle: (part: BodyPart) => void;
}

const BodyPartSelector = ({ selectedParts, onToggle }: BodyPartSelectorProps) => {
  const bodyPartOptions: BodyPartOption[] = [
    {
      value: "chest",
      label: "Brust",
      svgPath: "M12 8c-1.8 0-3.4.4-4.9 1.3C8.4 12.4 10 14 12 14c2 0 3.6-1.6 4.9-4.7C15.4 8.4 13.8 8 12 8z"
    },
    {
      value: "back",
      label: "Rücken",
      svgPath: "M6 8l2 3-2 3H4l2-3-2-3h2zm12 0h2l-2 3 2 3h-2l-2-3 2-3z"
    },
    {
      value: "shoulders",
      label: "Schultern",
      svgPath: "M8 4C6 4 4.6 5.6 4 7c-.6 1.5-1 3-1 5s.4 3.5 1 5c.6 1.4 2 3 4 3h8c2 0 3.4-1.6 4-3 .6-1.5 1-3 1-5s-.4-3.5-1-5c-.6-1.4-2-3-4-3H8z"
    },
    {
      value: "biceps",
      label: "Bizeps",
      svgPath: "M7 11c-1.7 0-3 1.3-3 3s1.3 3 3 3h1v-6H7zm9 0h-1v6h1c1.7 0 3-1.3 3-3s-1.3-3-3-3z"
    },
    {
      value: "triceps",
      label: "Trizeps",
      svgPath: "M7 9c-1.7 0-3 1.3-3 3s1.3 3 3 3h1V9H7zm9 0h-1v6h1c1.7 0 3-1.3 3-3s-1.3-3-3-3z"
    },
    {
      value: "legs",
      label: "Beine",
      svgPath: "M9 10v10H7V10c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v10h-2V10H9z"
    },
    {
      value: "abs",
      label: "Bauch",
      svgPath: "M8 9h8v2H8V9zm0 4h8v2H8v-2z"
    },
    {
      value: "cardio",
      label: "Cardio",
      svgPath: "M12 4c2.1 0 4 1.3 4.8 3.2l1.5-1.1c-1.1-2.3-3.4-3.9-6-4.1v2C12.2 4 12.1 4 12 4zM6.6 6.1L5.2 5C4 6.1 3.1 7.5 2.7 9h2c.3-1.1.9-2 1.8-2.9z"
    }
  ];

  const isSelected = (part: BodyPart) => selectedParts.includes(part);

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground mb-2">
        Wähle die Körperteile aus, die du trainieren möchtest
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {bodyPartOptions.map((part) => {
          const selected = isSelected(part.value);
          
          return (
            <Card
              key={part.value}
              className={`relative p-4 cursor-pointer transition-all border-2 activity-selection-card ${
                selected ? "selected" : ""
              }`}
              onClick={() => onToggle(part.value)}
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
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={selected ? "currentColor" : "#71717a"} 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="h-6 w-6"
                  >
                    <path d={part.svgPath} />
                  </svg>
                </div>
                <h3 className="font-medium">{part.label}</h3>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BodyPartSelector;
