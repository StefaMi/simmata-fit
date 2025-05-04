
import React from "react";
import BodyPartSelector from "@/components/BodyPartSelector";
import EquipmentSelector from "@/components/EquipmentSelector";
import { BodyPart } from "@/types";

type WorkoutStepsProps = {
  step: 1 | 2;
  selectedParts: BodyPart[];
  onSaveBodyParts: (bodyParts: BodyPart[]) => void;
  onSelectEquipment: (equipment: string[]) => void;
};

const WorkoutSteps = ({ 
  step, 
  selectedParts, 
  onSaveBodyParts, 
  onSelectEquipment 
}: WorkoutStepsProps) => {
  console.log("WorkoutSteps rendered", { step, selectedParts });
  
  // Only proceed if we're on step 1
  if (step !== 1) {
    return null;
  }
  
  const handleBodyPartSave = (bodyParts: BodyPart[]) => {
    console.log("Body parts selected:", bodyParts);
    onSaveBodyParts(bodyParts);
  };
  
  const handleEquipmentSelect = (equipment: string[]) => {
    console.log("Equipment selected:", equipment);
    onSelectEquipment(equipment);
  };
  
  return (
    <div className="space-y-6">
      <BodyPartSelector onSave={handleBodyPartSave} initialSelection={selectedParts} />
      <EquipmentSelector onChange={handleEquipmentSelect} initialSelection={['bodyweight', 'dumbbells']} />
    </div>
  );
};

export default WorkoutSteps;
