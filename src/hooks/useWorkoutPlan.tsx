
import { useState, useEffect } from "react";
import { WorkoutPlan, UserProfile, BodyPart } from "@/types";
import { createWorkoutPlan } from "@/utils/calculators";
import { optimizeWorkoutDays } from "@/utils/workoutUtils";
import { useToast } from "@/components/ui/use-toast";

export const useWorkoutPlan = (userProfile: UserProfile | null) => {
  const { toast } = useToast();
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [selectedParts, setSelectedParts] = useState<BodyPart[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(['bodyweight', 'dumbbells']);
  const [step, setStep] = useState<1 | 2>(1);

  // Load saved workout plan on mount
  useEffect(() => {
    const savedWorkoutPlan = localStorage.getItem("workoutPlan");
    if (savedWorkoutPlan) {
      try {
        const plan = JSON.parse(savedWorkoutPlan);
        console.log("Loaded saved workout plan:", plan);
        setWorkoutPlan(plan);
        setStep(2); // Springe direkt zur Anzeige des Plans
      } catch (error) {
        console.error("Fehler beim Parsen des gespeicherten Trainingsplans:", error);
      }
    }
  }, []);

  // Watch for changes to the workout plan and save to localStorage
  useEffect(() => {
    if (workoutPlan) {
      localStorage.setItem("workoutPlan", JSON.stringify(workoutPlan));
    }
  }, [workoutPlan]);

  // Handler für die Auswahl der Körperteile
  const handleSaveBodyParts = (bodyParts: BodyPart[]) => {
    console.log("handleSaveBodyParts called with:", bodyParts);
    setSelectedParts(bodyParts);
    
    if (!userProfile) {
      console.log("No user profile available, showing toast warning");
      toast({
        title: "Profil fehlt",
        description: "Bitte erstelle zuerst dein persönliches Profil.",
        variant: "destructive",
      });
      return;
    }
    
    // Erstelle den Trainingsplan mit optimierten Trainingstagen
    const plan = createWorkoutPlan(bodyParts, userProfile);
    console.log("Created workout plan:", plan);
    
    // Optimierte Trainingstage nach Frequenz
    const optimizedPlan = optimizeWorkoutDays(plan);
    setWorkoutPlan(optimizedPlan);
    
    // Speichere den Plan im localStorage
    localStorage.setItem("workoutPlan", JSON.stringify(optimizedPlan));
    
    toast({
      title: "Trainingsplan erstellt",
      description: "Dein personalisierter Trainingsplan wurde erstellt. Du kannst die Trainingshäufigkeit jederzeit anpassen.",
    });
    
    setStep(2);
  };

  const handleReset = () => {
    console.log("Resetting workout plan");
    setStep(1);
    setSelectedParts([]);
    setWorkoutPlan(null);
    localStorage.removeItem("workoutPlan");
  };

  return {
    workoutPlan,
    selectedParts,
    selectedEquipment,
    step,
    setSelectedEquipment,
    handleSaveBodyParts,
    handleReset
  };
};
