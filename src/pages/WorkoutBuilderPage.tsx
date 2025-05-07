
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PlanBuilderLayout from "@/components/workout-builder/PlanBuilderLayout";
import PlanDurationSelector from "@/components/workout-builder/PlanDurationSelector";
import WeeklyFrequencySelector from "@/components/workout-builder/WeeklyFrequencySelector";
import SessionDurationSelector from "@/components/workout-builder/SessionDurationSelector";
import ActivitySelector from "@/components/workout-builder/ActivitySelector";
import BodyPartSelector from "@/components/workout-builder/BodyPartSelector";
import PlanSummary from "@/components/workout-builder/PlanSummary";
import { BodyPart } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { generateWeeklyWorkoutPlan } from "@/utils/weeklyPlanGenerator";
import { v4 as uuidv4 } from "uuid";

// Steps enum for better readability
enum BuilderStep {
  PlanDuration = 1,
  WeeklyFrequency,
  SessionDuration,
  Activities,
  BodyParts,
  Summary
}

const WorkoutBuilderPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<BuilderStep>(BuilderStep.PlanDuration);
  const [planDuration, setPlanDuration] = useState<number>(4); // 4 weeks default
  const [weeklyFrequency, setWeeklyFrequency] = useState<number>(4); // 4x per week default
  const [sessionDuration, setSessionDuration] = useState<number>(30); // 30 minutes default
  const [selectedActivities, setSelectedActivities] = useState<string[]>(["strength", "cardio"]);
  const [selectedBodyParts, setSelectedBodyParts] = useState<BodyPart[]>(["chest", "back", "legs"]);
  const [isMounted, setIsMounted] = useState<boolean>(true);

  // Mock user profile for plan generation
  const mockUserProfile = {
    firstName: "User",
    gender: "male",
    age: 30,
    height: 175,
    weight: 75,
    goal: "build"
  };

  // Activity options for reference in summary
  const activityOptions = [
    { id: "cardio", label: "Cardio", icon: () => null, description: "" },
    { id: "strength", label: "Krafttraining", icon: () => null, description: "" },
    { id: "hiit", label: "HIIT", icon: () => null, description: "" },
    { id: "flexibility", label: "Flexibilität", icon: () => null, description: "" },
    { id: "core", label: "Core", icon: () => null, description: "" }
  ];

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Handle activity toggle
  const handleToggleActivity = (id: string) => {
    if (!isMounted) return;
    
    setSelectedActivities(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      return [...prev, id];
    });
  };

  // Handle body part toggle
  const handleToggleBodyPart = (part: BodyPart) => {
    if (!isMounted) return;
    
    setSelectedBodyParts(prev => {
      if (prev.includes(part)) {
        return prev.filter(item => item !== part);
      }
      return [...prev, part];
    });
  };

  // Get current step title and subtitle
  const getStepInfo = () => {
    switch (currentStep) {
      case BuilderStep.PlanDuration:
        return {
          title: "Plandauer",
          subtitle: "Wie lange soll dein Trainingsplan laufen?"
        };
      case BuilderStep.WeeklyFrequency:
        return {
          title: "Trainingsfrequenz",
          subtitle: "Wie oft möchtest du pro Woche trainieren?"
        };
      case BuilderStep.SessionDuration:
        return {
          title: "Trainingsdauer",
          subtitle: "Wie lang soll eine einzelne Trainingseinheit sein?"
        };
      case BuilderStep.Activities:
        return {
          title: "Trainingsarten",
          subtitle: "Welche Arten von Training möchtest du machen?"
        };
      case BuilderStep.BodyParts:
        return {
          title: "Körperteile",
          subtitle: "Welche Körperteile möchtest du trainieren?"
        };
      case BuilderStep.Summary:
        return {
          title: "Zusammenfassung",
          subtitle: "Überprüfe deinen Plan und erstelle ihn"
        };
      default:
        return { title: "", subtitle: "" };
    }
  };

  const handleNext = () => {
    if (!isMounted) return;
    
    // Validations
    if (currentStep === BuilderStep.Activities && selectedActivities.length === 0) {
      toast({
        title: "Bitte wähle mindestens eine Trainingsart aus",
        variant: "destructive"
      });
      return;
    }

    if (currentStep === BuilderStep.BodyParts && selectedBodyParts.length === 0) {
      toast({
        title: "Bitte wähle mindestens einen Körperteil aus",
        variant: "destructive"
      });
      return;
    }

    // If we're at the final step, create the plan
    if (currentStep === BuilderStep.Summary) {
      createWorkoutPlan();
      return;
    }

    // Otherwise move to the next step
    setCurrentStep(prev => (prev + 1) as BuilderStep);
  };

  const handleBack = () => {
    if (!isMounted) return;
    
    if (currentStep === BuilderStep.PlanDuration) {
      navigate(-1);
      return;
    }
    
    setCurrentStep(prev => (prev - 1) as BuilderStep);
  };

  const createWorkoutPlan = () => {
    if (!isMounted) return;
    
    try {
      // Generate a workout plan using the utility function
      const workoutPlan = generateWeeklyWorkoutPlan(
        selectedBodyParts,
        mockUserProfile,
        weeklyFrequency
      );
      
      // Add additional metadata
      const enhancedPlan = {
        ...workoutPlan,
        planDuration,
        sessionDuration,
        activities: selectedActivities,
        selectedBodyParts,
        createdAt: new Date().toISOString(),
      };
      
      // Save to localStorage
      localStorage.setItem("workoutPlan", JSON.stringify(enhancedPlan));
      
      // Show success toast
      toast({
        title: "Trainingsplan erstellt!",
        description: "Dein personalisierter Trainingsplan wurde erfolgreich erstellt."
      });
      
      // Navigate to workout dashboard to see the plan
      navigate("/workout-dashboard");
    } catch (error) {
      console.error("Error creating workout plan:", error);
      toast({
        title: "Fehler",
        description: "Es gab ein Problem beim Erstellen des Trainingsplans.",
        variant: "destructive"
      });
    }
  };

  const { title, subtitle } = getStepInfo();
  
  // Check if the next button should be disabled
  const isNextDisabled = () => {
    switch (currentStep) {
      case BuilderStep.Activities:
        return selectedActivities.length === 0;
      case BuilderStep.BodyParts:
        return selectedBodyParts.length === 0;
      default:
        return false;
    }
  };

  // Get the appropriate label for the next button
  const getNextLabel = () => {
    return currentStep === BuilderStep.Summary ? "Plan erstellen" : "Weiter";
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case BuilderStep.PlanDuration:
        return (
          <PlanDurationSelector
            selectedDuration={planDuration}
            onChange={setPlanDuration}
          />
        );
      case BuilderStep.WeeklyFrequency:
        return (
          <WeeklyFrequencySelector
            selectedFrequency={weeklyFrequency}
            onChange={setWeeklyFrequency}
          />
        );
      case BuilderStep.SessionDuration:
        return (
          <SessionDurationSelector
            selectedDuration={sessionDuration}
            onChange={setSessionDuration}
          />
        );
      case BuilderStep.Activities:
        return (
          <ActivitySelector
            selectedActivities={selectedActivities}
            onToggleActivity={handleToggleActivity}
          />
        );
      case BuilderStep.BodyParts:
        return (
          <BodyPartSelector
            selectedParts={selectedBodyParts}
            onToggle={handleToggleBodyPart}
          />
        );
      case BuilderStep.Summary:
        return (
          <PlanSummary
            planDuration={planDuration}
            weeklyFrequency={weeklyFrequency}
            sessionDuration={sessionDuration}
            selectedActivities={selectedActivities}
            selectedBodyParts={selectedBodyParts}
            activityOptions={activityOptions}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PlanBuilderLayout
      title={title}
      subtitle={subtitle}
      currentStep={currentStep}
      totalSteps={Object.keys(BuilderStep).length / 2} // Divide by 2 because enum has both string and number keys
      onBack={handleBack}
      onNext={handleNext}
      nextDisabled={isNextDisabled()}
      nextLabel={getNextLabel()}
    >
      {renderStepContent()}
    </PlanBuilderLayout>
  );
};

export default WorkoutBuilderPage;
