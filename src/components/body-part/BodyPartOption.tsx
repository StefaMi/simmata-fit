
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BodyPart } from "@/types";

type BodyPartOptionProps = {
  value: BodyPart;
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onToggle: (bodyPart: BodyPart) => void;
};

const BodyPartOption = ({ value, label, icon, isSelected, onToggle }: BodyPartOptionProps) => {
  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected
          ? "border-fitness-primary bg-fitness-primary bg-opacity-10"
          : "border-gray-200 hover:border-fitness-primary"
      }`}
      onClick={() => onToggle(value)}
    >
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-fitness-primary bg-opacity-10">
          {icon}
        </div>
        <div className="text-center">
          <Label
            htmlFor={`bodypart-${value}`}
            className="text-sm font-medium cursor-pointer"
          >
            {label}
          </Label>
        </div>
        <div className="flex items-center justify-center">
          <Checkbox
            id={`bodypart-${value}`}
            checked={isSelected}
            onCheckedChange={() => onToggle(value)}
            className="data-[state=checked]:bg-fitness-primary data-[state=checked]:text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default BodyPartOption;
