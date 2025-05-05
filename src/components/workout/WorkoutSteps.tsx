
import React from "react";
import BodyPartSelector from "@/components/body-part/BodyPartSelector";
import EquipmentSelector from "@/components/EquipmentSelector";
import { BodyPart } from "@/types";

type WorkoutStepsProps = {
  step: number;
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
  
  // Only render if we're on step 1
  if (step !== 1) {
    return null;
  }
  
  const handleSaveBodyParts = (bodyParts: BodyPart[]) => {
    console.log("Saving body parts:", bodyParts);
    onSaveBodyParts(bodyParts);
  };
  
  const handleSelectEquipment = (equipment: string[]) => {
    console.log("Selected equipment:", equipment);
    onSelectEquipment(equipment);
  };
  
  return (
    <div className="space-y-6">
      <BodyPartSelector 
        onSave={handleSaveBodyParts}
        initialSelection={selectedParts} 
      />
      <EquipmentSelector 
        onChange={handleSelectEquipment} 
        initialSelection={['bodyweight', 'dumbbells']} 
      />
    </div>
  );
};

export default WorkoutSteps;
