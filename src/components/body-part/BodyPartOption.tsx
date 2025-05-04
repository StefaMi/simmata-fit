
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
  // Handler for click on the entire component
  const handleCardClick = () => {
    onToggle(value);
  };

  // Handle checkbox change separately to avoid event propagation issues
  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    if (checked !== "indeterminate") {
      onToggle(value);
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected
          ? "border-fitness-primary bg-fitness-primary bg-opacity-10 dark:border-fitness-accent dark:bg-fitness-accent/20"
          : "border-gray-200 dark:border-gray-700 hover:border-fitness-primary dark:hover:border-fitness-accent"
      }`}
      onClick={handleCardClick}
    >
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-fitness-primary bg-opacity-10 dark:bg-fitness-primary/20">
          {icon}
        </div>
        <div className="text-center">
          <Label
            htmlFor={`bodypart-${value}`}
            className="text-sm font-medium cursor-pointer dark:text-gray-200"
          >
            {label}
          </Label>
        </div>
        <div className="flex items-center justify-center">
          <Checkbox
            id={`bodypart-${value}`}
            checked={isSelected}
            className="data-[state=checked]:bg-fitness-primary data-[state=checked]:text-white"
            onCheckedChange={handleCheckboxChange}
            // Stop propagation to prevent double-triggering with the card click
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </div>
  );
};

export default BodyPartOption;
