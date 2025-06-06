
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
  const [isLoading, setIsLoading] = useState(false);
  
  // Add a mounted ref to prevent state updates after unmount
  const isMounted = useRef(true);
  
  useEffect(() => {
    // Set up the mounted ref
    isMounted.current = true;
    
    return () => {
      // Cleanup on unmount
      isMounted.current = false;
    };
  }, []);

  // Load saved workout plan on mount
  useEffect(() => {
    // Load saved data only if the component is mounted
    if (!isMounted.current) return;
    
    const savedWorkoutPlan = localStorage.getItem("workoutPlan");
    const savedBodyParts = localStorage.getItem("selectedBodyParts");
    
    if (savedBodyParts) {
      try {
        const parts = JSON.parse(savedBodyParts);
        console.log("Loaded saved body parts:", parts);
        if (isMounted.current) {
          setSelectedParts(parts);
        }
      } catch (error) {
        console.error("Error parsing saved body parts:", error);
      }
    }
    
    if (savedWorkoutPlan) {
      try {
        const plan = JSON.parse(savedWorkoutPlan);
        console.log("Loaded saved workout plan:", plan);
        if (isMounted.current) {
          setWorkoutPlan(plan);
          setStep(2); // Show the plan
        }
      } catch (error) {
        console.error("Fehler beim Parsen des gespeicherten Trainingsplans:", error);
      }
    }
  }, []);

  // Watch for changes to the workout plan and save to localStorage
  useEffect(() => {
    if (workoutPlan && isMounted.current) {
      localStorage.setItem("workoutPlan", JSON.stringify(workoutPlan));
    }
  }, [workoutPlan]);

  // Save selected body parts to localStorage when they change
  useEffect(() => {
    if (selectedParts.length > 0 && isMounted.current) {
      localStorage.setItem("selectedBodyParts", JSON.stringify(selectedParts));
    }
  }, [selectedParts]);

  // Use useCallback to memoize these functions
  const handleSaveBodyParts = useCallback((bodyParts: BodyPart[]) => {
    console.log("handleSaveBodyParts called with:", bodyParts);
    
    if (!isMounted.current) return;
    setIsLoading(true);
    setSelectedParts(bodyParts);
    
    if (!userProfile) {
      console.log("No user profile available, showing toast warning");
      if (isMounted.current) {
        setIsLoading(false);
        toast({
          title: "Profil fehlt",
          description: "Bitte erstelle zuerst dein persönliches Profil.",
          variant: "destructive",
        });
      }
      return;
    }
    
    if (bodyParts.length === 0) {
      if (isMounted.current) {
        setIsLoading(false);
        toast({
          title: "Keine Körperteile ausgewählt",
          description: "Bitte wähle mindestens ein Körperteil aus.",
          variant: "destructive",
        });
      }
      return;
    }
    
    try {
      // Create the workout plan
      const plan = createWorkoutPlan(bodyParts, userProfile);
      console.log("Created workout plan:", plan);
      
      // Ensure we don't update state if the component unmounted
      if (!isMounted.current) return;
      setWorkoutPlan(plan);
      
      // Save the plan to localStorage
      localStorage.setItem("workoutPlan", JSON.stringify(plan));
      localStorage.setItem("selectedBodyParts", JSON.stringify(bodyParts));
      
      if (isMounted.current) {
        toast({
          title: "Trainingsplan erstellt",
          description: "Dein personalisierter Wochentrainingsplan wurde erstellt. Die Übungen wurden optimal auf die Wochentage verteilt.",
        });
      }
      
      if (isMounted.current) {
        setStep(2);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating workout plan:", error);
      if (isMounted.current) {
        setIsLoading(false);
        toast({
          title: "Fehler",
          description: "Es gab ein Problem beim Erstellen des Trainingsplans.",
          variant: "destructive",
        });
      }
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
    isLoading,
    setSelectedEquipment,
    handleSaveBodyParts,
    handleReset
  };
};
