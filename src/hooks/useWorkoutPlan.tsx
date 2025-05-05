
import { useState, useEffect, useCallback, useRef } from "react";
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
  
  // Add a mounted ref to prevent state updates after unmount
  const isMounted = useRef(true);
  
  useEffect(() => {
    // Set up the mounted ref
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Load saved workout plan on mount
  useEffect(() => {
    const savedWorkoutPlan = localStorage.getItem("workoutPlan");
    const savedBodyParts = localStorage.getItem("selectedBodyParts");
    
    if (savedBodyParts && isMounted.current) {
      try {
        const parts = JSON.parse(savedBodyParts);
        console.log("Loaded saved body parts:", parts);
        setSelectedParts(parts);
      } catch (error) {
        console.error("Error parsing saved body parts:", error);
      }
    }
    
    if (savedWorkoutPlan && isMounted.current) {
      try {
        const plan = JSON.parse(savedWorkoutPlan);
        console.log("Loaded saved workout plan:", plan);
        setWorkoutPlan(plan);
        setStep(2); // Show the plan
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

  // Save selected body parts to localStorage when they change
  useEffect(() => {
    if (selectedParts.length > 0) {
      localStorage.setItem("selectedBodyParts", JSON.stringify(selectedParts));
    }
  }, [selectedParts]);

  // Use useCallback to memoize these functions
  const handleSaveBodyParts = useCallback((bodyParts: BodyPart[]) => {
    console.log("handleSaveBodyParts called with:", bodyParts);
    
    if (!isMounted.current) return;
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
    
    if (bodyParts.length === 0) {
      toast({
        title: "Keine Körperteile ausgewählt",
        description: "Bitte wähle mindestens ein Körperteil aus.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Erstelle den Trainingsplan mit optimierten Trainingstagen
      const plan = createWorkoutPlan(bodyParts, userProfile);
      console.log("Created workout plan:", plan);
      
      // Optimierte Trainingstage nach Frequenz
      const optimizedPlan = optimizeWorkoutDays(plan);
      console.log("Optimized workout plan:", optimizedPlan);
      
      if (!isMounted.current) return;
      setWorkoutPlan(optimizedPlan);
      
      // Speichere den Plan im localStorage
      localStorage.setItem("workoutPlan", JSON.stringify(optimizedPlan));
      localStorage.setItem("selectedBodyParts", JSON.stringify(bodyParts));
      
      toast({
        title: "Trainingsplan erstellt",
        description: "Dein personalisierter Trainingsplan wurde erstellt. Du kannst die Trainingshäufigkeit jederzeit anpassen.",
      });
      
      if (!isMounted.current) return;
      setStep(2);
    } catch (error) {
      console.error("Error creating workout plan:", error);
      toast({
        title: "Fehler",
        description: "Es gab ein Problem beim Erstellen des Trainingsplans.",
        variant: "destructive",
      });
    }
  }, [userProfile, toast]);

  const handleReset = useCallback(() => {
    console.log("Resetting workout plan");
    
    if (!isMounted.current) return;
    setStep(1);
    setWorkoutPlan(null);
    localStorage.removeItem("workoutPlan");
  }, []);

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
