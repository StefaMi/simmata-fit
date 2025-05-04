
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
  // Only render components when we're on step 1
  if (step !== 1) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <BodyPartSelector onSave={onSaveBodyParts} initialSelection={selectedParts} />
      <EquipmentSelector onChange={onSelectEquipment} initialSelection={['bodyweight', 'dumbbells']} />
    </div>
  );
};

export default WorkoutSteps;
