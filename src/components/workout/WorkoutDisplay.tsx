
import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import WorkoutPlanDisplay from "@/components/WorkoutPlanDisplay";
import ProgressTracker from "@/components/ProgressTracker";
import { UserProfile, WorkoutPlan } from "@/types";

type WorkoutDisplayProps = {
  step: number;
  workoutPlan: WorkoutPlan | null;
  userProfile: UserProfile | null;
  progressEntries: any[];
  onProgressUpdate: (entry: any) => void;
  onReset: () => void;
};

const WorkoutDisplay = ({ 
  step, 
  workoutPlan, 
  userProfile, 
  progressEntries,
  onProgressUpdate,
  onReset
}: WorkoutDisplayProps) => {
  const isMounted = useRef(true);
  
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Return early if not on step 2 or if workoutPlan is null
  if (step !== 2 || !workoutPlan) {
    return null;
  }

  const handleReset = () => {
    onReset();
  };
  
  const handleProgressUpdate = (entry: any) => {
    if (isMounted.current) {
      onProgressUpdate(entry);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleReset}
        >
          <ArrowLeft className="h-4 w-4" />
          Neuen Plan erstellen
        </Button>
      </div>
      
      {workoutPlan && <WorkoutPlanDisplay workoutPlan={workoutPlan} />}
      
      {userProfile && (
        <div className="mt-8">
          <ProgressTracker 
            userProfile={userProfile}
            onProgressUpdate={handleProgressUpdate}
            latestEntry={progressEntries.length > 0 ? progressEntries[0] : undefined}
          />
        </div>
      )}
    </div>
  );
};

export default WorkoutDisplay;
