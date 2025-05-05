
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import DailyQuote from "@/components/DailyQuote";
import { UserProfile } from "@/types";
import { useWorkoutPlan } from "@/hooks/useWorkoutPlan";
import WorkoutSteps from "@/components/workout/WorkoutSteps";
import WorkoutDisplay from "@/components/workout/WorkoutDisplay";
import PreWorkoutWarning from "@/components/workout/PreWorkoutWarning";

const WorkoutPage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [progressEntries, setProgressEntries] = useState<any[]>([]);
  
  // Load user profile and progress entries on mount
  useEffect(() => {
    console.log("WorkoutPage mounting, loading profile and plan");
    // Load user profile
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        console.log("Loaded user profile:", profile);
        setUserProfile(profile);
      } catch (error) {
        console.error("Fehler beim Parsen des gespeicherten Profils:", error);
      }
    } else {
      console.log("No user profile found in localStorage");
    }
    
    // Load progress entries
    const savedEntries = localStorage.getItem("progressEntries");
    if (savedEntries) {
      try {
        setProgressEntries(JSON.parse(savedEntries));
      } catch (error) {
        console.error("Error parsing progress entries:", error);
      }
    }
  }, []);

  const {
    workoutPlan,
    selectedParts,
    selectedEquipment,
    step,
    setSelectedEquipment,
    handleSaveBodyParts,
    handleReset
  } = useWorkoutPlan(userProfile);

  const handleProgressUpdate = (entry: any) => {
    const updatedEntries = [entry, ...progressEntries];
    setProgressEntries(updatedEntries);
    localStorage.setItem("progressEntries", JSON.stringify(updatedEntries));
  };

  console.log("Current step:", step, "Workout plan exists:", !!workoutPlan);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Show the daily quote at the top */}
        <DailyQuote />

        {/* Show warning if no profile */}
        <PreWorkoutWarning 
          userProfile={userProfile} 
          step={step} 
        />

        {/* Workout steps (Step 1) */}
        <WorkoutSteps
          step={step}
          selectedParts={selectedParts}
          onSaveBodyParts={handleSaveBodyParts}
          onSelectEquipment={setSelectedEquipment}
        />

        {/* Workout display (Step 2) */}
        <WorkoutDisplay
          step={step}
          workoutPlan={workoutPlan}
          userProfile={userProfile}
          progressEntries={progressEntries}
          onProgressUpdate={handleProgressUpdate}
          onReset={handleReset}
        />
      </div>
    </Layout>
  );
};

export default WorkoutPage;
