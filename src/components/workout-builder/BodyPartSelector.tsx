
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Check, ChevronDown } from "lucide-react";
import { BodyPart } from "@/types";
import { bodyPartOptions } from "@/components/body-part/BodyPartOptions";

interface BodyPartSelectorProps {
  selectedParts: BodyPart[];
  onToggle: (bodyPart: BodyPart) => void;
}

const BodyPartSelector = ({ selectedParts, onToggle }: BodyPartSelectorProps) => {
  const isSelected = (bodyPart: BodyPart) => selectedParts.includes(bodyPart);

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground mb-2">
        Wähle die Körperteile aus, die du in deinem Plan trainieren möchtest
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        {bodyPartOptions.map((option) => {
          const selected = isSelected(option.value as BodyPart);
          
          return (
            <Card
              key={option.value}
              className={`relative p-4 cursor-pointer transition-all border-2 body-part-selection-card ${
                selected ? "selected" : ""
              }`}
              onClick={() => onToggle(option.value as BodyPart)}
            >
              <div className="absolute top-2 right-2">
                {selected && (
                  <div className="bg-primary text-white p-0.5 rounded-full">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${selected ? "bg-primary/20" : "bg-slate-100 dark:bg-slate-800"}`}>
                  {option.icon}
                </div>
                <div>
                  <h3 className="font-medium">{option.label}</h3>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BodyPartSelector;
