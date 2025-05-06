
import { useState, useEffect, useCallback, useRef } from "react";
import Layout from "@/components/Layout";
import DailyQuote from "@/components/DailyQuote";
import { UserProfile } from "@/types";
import { useWorkoutPlan } from "@/hooks/useWorkoutPlan";
import WorkoutSteps from "@/components/workout/WorkoutSteps";
import WorkoutDisplay from "@/components/workout/WorkoutDisplay";
import PreWorkoutWarning from "@/components/workout/PreWorkoutWarning";
import { Skeleton } from "@/components/ui/skeleton";

const WorkoutPage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [progressEntries, setProgressEntries] = useState<any[]>([]);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  
  // Component mounted ref to prevent state updates after unmount
  const isMounted = useRef(true);
  
  useEffect(() => {
    // Set the mounted flag to true when component mounts
    isMounted.current = true;
    
    // Load user profile and progress entries on mount
    console.log("WorkoutPage mounting, loading profile and plan");
    
    const loadData = async () => {
      if (!isMounted.current) return;
      
      setIsProfileLoading(true);
      try {
        // Load user profile
        const savedProfile = localStorage.getItem("userProfile");
        if (savedProfile && isMounted.current) {
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
        if (savedEntries && isMounted.current) {
          try {
            setProgressEntries(JSON.parse(savedEntries));
          } catch (error) {
            console.error("Error parsing progress entries:", error);
          }
        }
      } finally {
        if (isMounted.current) {
          setIsProfileLoading(false);
        }
      }
    };
    
    loadData();
    
    // Cleanup when component unmounts
    return () => {
      isMounted.current = false;
      console.log("WorkoutPage unmounting");
    };
  }, []);

  const {
    workoutPlan,
    selectedParts,
    selectedEquipment,
    step,
    isLoading: isPlanLoading,
    setSelectedEquipment,
    handleSaveBodyParts,
    handleReset
  } = useWorkoutPlan(userProfile);

  const handleProgressUpdate = useCallback((entry: any) => {
    if (!isMounted.current) return;
    
    setProgressEntries(prevEntries => {
      const updatedEntries = [entry, ...prevEntries];
      localStorage.setItem("progressEntries", JSON.stringify(updatedEntries));
      return updatedEntries;
    });
  }, []);

  console.log("Current step:", step, "Workout plan exists:", !!workoutPlan);
  const isLoading = isProfileLoading || isPlanLoading;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Show the daily quote at the top */}
        <DailyQuote />

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </Layout>
  );
};

export default WorkoutPage;
