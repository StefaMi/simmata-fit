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
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(value);
  };

  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    if (checked !== "indeterminate") {
      onToggle(value);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle(value);
        }
      }}
      className={`border rounded-lg p-4 cursor-pointer transition-all select-none focus:outline-none focus:ring-2 focus:ring-fitness-primary ${
        isSelected
          ? "border-fitness-primary bg-fitness-primary bg-opacity-10 dark:border-fitness-accent dark:bg-fitness-accent/20"
          : "border-gray-200 dark:border-gray-700 hover:border-fitness-primary dark:hover:border-fitness-accent"
      }`}
    >
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-fitness-primary bg-opacity-10 dark:bg-fitness-primary/20">
          {icon}
        </div>
        <Label
          htmlFor={`bodypart-${value}`}
          className="text-sm font-medium dark:text-gray-200"
        >
          {label}
        </Label>
        <div className="flex items-center justify-center">
          <Checkbox
            id={`bodypart-${value}`}
            checked={isSelected}
            className="data-[state=checked]:bg-fitness-primary data-[state=checked]:text-white"
            onCheckedChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </div>
  );
};

export default BodyPartOption;
