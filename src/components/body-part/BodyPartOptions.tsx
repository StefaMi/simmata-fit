
import React from "react";
import { Dumbbell, Heart, Scale, Weight } from "lucide-react";
import { BodyPart } from "@/types";
import BodyPartOption from "./BodyPartOption";

export const bodyPartOptions: { value: BodyPart; label: string; icon: React.ReactNode }[] = [
  { value: "chest", label: "Brust", icon: <Dumbbell className="w-5 h-5 mr-2" /> },
  { value: "back", label: "Rücken", icon: <Weight className="w-5 h-5 mr-2" /> },
  { value: "shoulders", label: "Schultern", icon: <Dumbbell className="w-5 h-5 mr-2" /> },
  { value: "biceps", label: "Bizeps", icon: <Dumbbell className="w-5 h-5 mr-2" /> },
  { value: "triceps", label: "Trizeps", icon: <Dumbbell className="w-5 h-5 mr-2" /> },
  { value: "legs", label: "Beine", icon: <Weight className="w-5 h-5 mr-2" /> },
  { value: "abs", label: "Bauch", icon: <Scale className="w-5 h-5 mr-2" /> },
  { value: "cardio", label: "Kardio", icon: <Heart className="w-5 h-5 mr-2" /> },
];

type BodyPartOptionsProps = {
  selectedParts: BodyPart[];
  onToggle: (bodyPart: BodyPart) => void;
};

const BodyPartOptions = ({ selectedParts, onToggle }: BodyPartOptionsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {bodyPartOptions.map((option) => (
        <BodyPartOption
          key={option.value}
          value={option.value}
          label={option.label}
          icon={option.icon}
          isSelected={selectedParts.includes(option.value)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};

export default BodyPartOptions;
