
import React, { useState } from "react";
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
  if (step !== 1) {
    return null;
  }
  
  return (
    <>
      <BodyPartSelector onSave={onSaveBodyParts} initialSelection={selectedParts} />
      <EquipmentSelector onChange={onSelectEquipment} initialSelection={['bodyweight', 'dumbbells']} />
    </>
  );
};

export default WorkoutSteps;
