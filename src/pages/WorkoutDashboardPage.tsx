
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import EnhancedWorkoutPlan from "@/components/workout/EnhancedWorkoutPlan";
import FocusExercises from "@/components/FocusExercises";
import SpotifyPlaylists from "@/components/music/SpotifyPlaylists";
import { Button } from "@/components/ui/button";
import { PlusCircle, Share } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkoutPlan } from "@/types";
import LoadingSpinner from "@/components/ui/loading-spinner";

const WorkoutDashboardPage = () => {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load saved workout plan
    const loadWorkoutPlan = () => {
      setIsLoading(true);
      const savedPlan = localStorage.getItem("workoutPlan");
      
      if (savedPlan) {
        try {
          setWorkoutPlan(JSON.parse(savedPlan));
        } catch (error) {
          console.error("Error parsing saved workout plan:", error);
        }
      }
      
      setIsLoading(false);
    };
    
    loadWorkoutPlan();
  }, []);

  const handleCreateNewPlan = () => {
    navigate("/workout-builder");
  };

  const handleSharePlan = () => {
    // In a real app, this would open a share dialog
    alert("Sharing functionality would be implemented here");
  };

  return (
    <Layout hideNav={false} showHeader={true} title="Rush">
      <div className="space-y-8">
        <Tabs defaultValue="plan" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="plan">Trainingsplan</TabsTrigger>
            <TabsTrigger value="focus">Fokusübungen</TabsTrigger>
            <TabsTrigger value="music">Musik</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plan" className="pt-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" text="Lade Trainingsplan..." />
              </div>
            ) : workoutPlan ? (
              <div className="space-y-4">
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={handleCreateNewPlan}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Neuen Plan erstellen
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleSharePlan}>
                    <Share className="h-4 w-4 mr-2" />
                    Plan teilen
                  </Button>
                </div>
                <EnhancedWorkoutPlan plan={workoutPlan} />
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <h3 className="text-xl font-semibold">Kein Trainingsplan gefunden</h3>
                <p className="text-muted-foreground">
                  Du hast noch keinen Trainingsplan erstellt. Erstelle jetzt deinen individuellen Trainingsplan.
                </p>
                <Button onClick={handleCreateNewPlan}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Trainingsplan erstellen
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="focus" className="pt-6">
            <FocusExercises />
          </TabsContent>
          
          <TabsContent value="music" className="pt-6">
            <SpotifyPlaylists />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default WorkoutDashboardPage;
