
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import ProgressTracker from "@/components/ProgressTracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressEntry, UserProfile } from "@/types";
import { LineChart, Calendar, TrendingUp } from "lucide-react";
import { format } from "date-fns";

const ProgressPage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  
  // Load user profile and progress entries from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error("Error parsing user profile:", error);
      }
    }
    
    const savedEntries = localStorage.getItem("progressEntries");
    if (savedEntries) {
      try {
        setProgressEntries(JSON.parse(savedEntries));
      } catch (error) {
        console.error("Error parsing progress entries:", error);
      }
    }
  }, []);
  
  // Save progress entries to localStorage whenever they change
  useEffect(() => {
    if (progressEntries.length > 0) {
      localStorage.setItem("progressEntries", JSON.stringify(progressEntries));
    }
  }, [progressEntries]);
  
  const handleProgressUpdate = (entry: ProgressEntry) => {
    setProgressEntries(prev => [entry, ...prev]);
  };
  
  const latestEntry = progressEntries.length > 0 ? progressEntries[0] : undefined;
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Dein Fortschritt</h1>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Progress Tracker */}
          <ProgressTracker 
            userProfile={userProfile}
            onProgressUpdate={handleProgressUpdate}
            latestEntry={latestEntry}
          />
          
          {/* Progress History */}
          {progressEntries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-fitness-primary" />
                  Fortschritts-Historie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressEntries.map(entry => (
                    <Card key={entry.id} className="bg-slate-50 border-slate-100">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{format(new Date(entry.date), "dd.MM.yyyy")}</p>
                            <p className="text-sm text-fitness-primary mt-1">
                              Gewicht: {entry.weight} kg
                            </p>
                            
                            {entry.measurements && Object.values(entry.measurements).some(v => v !== undefined) && (
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                                {entry.measurements.chest && <div>Brust: {entry.measurements.chest} cm</div>}
                                {entry.measurements.waist && <div>Taille: {entry.measurements.waist} cm</div>}
                                {entry.measurements.hips && <div>Hüfte: {entry.measurements.hips} cm</div>}
                                {entry.measurements.thighs && <div>Oberschenkel: {entry.measurements.thighs} cm</div>}
                                {entry.measurements.arms && <div>Arme: {entry.measurements.arms} cm</div>}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center">
                            {entry.workoutCompleted && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                Training abgeschlossen
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {entry.notes && (
                          <p className="text-sm text-muted-foreground mt-2 border-t pt-2">
                            {entry.notes}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProgressPage;
