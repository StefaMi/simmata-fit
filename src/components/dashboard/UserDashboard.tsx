import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserProfile, ProgressEntry, WorkoutPlan } from "@/types";
import { User, Activity, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, parseISO, isThisWeek } from "date-fns";
import { de } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type UserDashboardProps = {
  userProfile: UserProfile | null;
  progressEntries: ProgressEntry[];
  workoutPlan: WorkoutPlan | null;
};

const UserDashboard = ({ userProfile, progressEntries, workoutPlan }: UserDashboardProps) => {
  const navigate = useNavigate();
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  
  useEffect(() => {
    // Lade gespeicherte Workout-Sessions aus localStorage
    const savedSessions = localStorage.getItem("workoutSessions");
    if (savedSessions) {
      try {
        const sessions = JSON.parse(savedSessions);
        setRecentWorkouts(sessions);
      } catch (error) {
        console.error("Fehler beim Laden der Workout-Sessions:", error);
      }
    }
  }, []);
  
  // Filtern der Fortschrittsdaten für den Gewichtsverlauf der letzten 8 Einträge
  const weightData = progressEntries
    .slice(0, 8)
    .map((entry) => ({
      date: format(new Date(entry.date), "dd.MM."),
      weight: entry.weight,
    }))
    .reverse();
  
  // Ermitteln, ob diese Woche bereits trainiert wurde
  const hasTrainedThisWeek = recentWorkouts.some(session => 
    isThisWeek(new Date(session.date)));

  // Get user full name for greeting
  const userFullName = userProfile ? 
    `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() : '';
  
  const greeting = userFullName ? 
    `Hallo ${userFullName}!` :
    userProfile?.gender === "male" ? "Hallo Sportler!" : 
    userProfile?.gender === "female" ? "Hallo Sportlerin!" : 
    "Hallo Sportsfreund/in!";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        
        {userProfile && (
          <div className="flex items-center">
            <span className="font-medium mr-2">
              {greeting}
            </span>
            <div className="bg-fitness-primary text-white p-1 rounded-full">
              <User className="h-6 w-6" />
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="progress">Fortschritt</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>
        
        {/* Übersichtstab */}
        <TabsContent value="overview" className="space-y-4">
          {userProfile && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Dein Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Aktuelles Gewicht</p>
                    <p className="text-xl font-semibold">
                      {progressEntries.length > 0 
                        ? progressEntries[0].weight 
                        : userProfile.currentWeight} kg
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Zielgewicht</p>
                    <p className="text-xl font-semibold">{userProfile.targetWeight} kg</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Start: {userProfile.currentWeight} kg</span>
                    <span>Ziel: {userProfile.targetWeight} kg</span>
                  </div>
                  
                  {(() => {
                    const startWeight = userProfile.currentWeight;
                    const targetWeight = userProfile.targetWeight;
                    const currentWeight = progressEntries.length > 0 
                      ? progressEntries[0].weight 
                      : startWeight;
                    
                    const weightDiff = targetWeight - startWeight;
                    const achievedDiff = currentWeight - startWeight;
                    
                    // Prozentuale Berechnung des Fortschritts
                    let progressPercentage = 0;
                    if (weightDiff !== 0) {
                      progressPercentage = Math.min(100, Math.max(0, (achievedDiff / weightDiff) * 100));
                    }
                    
                    return (
                      <Progress 
                        value={progressPercentage} 
                        className="h-2" 
                        indicatorClassName={
                          userProfile.targetWeight < userProfile.currentWeight 
                            ? "bg-green-500" 
                            : "bg-fitness-primary"
                        }
                      />
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trainingsaktivität */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-fitness-primary" />
                Trainingsaktivität
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasTrainedThisWeek ? (
                <div className="bg-green-50 p-3 rounded-md border border-green-100">
                  <p className="text-green-700 font-medium">
                    Du hast diese Woche bereits trainiert! 💪
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Bleib dran und halte deinen Trainingsplan ein.
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
                  <p className="text-amber-700 font-medium">
                    Du hast diese Woche noch nicht trainiert!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Zeit, deine nächste Einheit zu starten.
                  </p>
                  <Button 
                    className="mt-3 bg-fitness-primary hover:bg-fitness-primary/90"
                    size="sm"
                    onClick={() => navigate("/workout")}
                  >
                    Jetzt trainieren
                  </Button>
                </div>
              )}
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Letzte Trainingseinheiten:</h4>
                {recentWorkouts.length > 0 ? (
                  <div className="space-y-2">
                    {recentWorkouts.slice(0, 3).map((session, index) => (
                      <div 
                        key={index} 
                        className="flex justify-between items-center p-2 bg-slate-50 rounded"
                      >
                        <div>
                          <p className="font-medium">{session.description || "Training"}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(session.date), "EEEE, dd.MM.yyyy", {locale: de})}
                          </p>
                        </div>
                        <div className="text-sm">
                          {session.duration} Min
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Noch keine Trainingseinheiten erfasst.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Schnellzugriff */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="flex flex-col h-auto py-4 border-fitness-primary/30"
              onClick={() => navigate("/workout")}
            >
              <Activity className="h-6 w-6 mb-1 text-fitness-primary" />
              <span>Training starten</span>
            </Button>
            <Button 
              variant="outline"
              className="flex flex-col h-auto py-4 border-fitness-primary/30"
              onClick={() => navigate("/progress")}
            >
              <TrendingUp className="h-6 w-6 mb-1 text-fitness-primary" />
              <span>Fortschritt tracken</span>
            </Button>
          </div>
        </TabsContent>
        
        {/* Fortschrittstab */}
        <TabsContent value="progress" className="space-y-4">
          {progressEntries.length > 0 ? (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Gewichtsverlauf</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightData}>
                      <XAxis 
                        dataKey="date" 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#5956E9" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Button 
                variant="outline" 
                className="w-full flex justify-between items-center"
                onClick={() => navigate("/progress")}
              >
                <span>Detaillierte Fortschrittsanalyse anzeigen</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Noch keine Fortschrittsdaten</h3>
                <p className="text-muted-foreground mb-4">
                  Erfasse deinen ersten Fortschritt, um deine Entwicklung zu verfolgen.
                </p>
                <Button onClick={() => navigate("/progress")}>
                  Fortschritt erfassen
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Trainingstab */}
        <TabsContent value="training" className="space-y-4">
          {workoutPlan ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Dein aktueller Plan</CardTitle>
                <CardDescription>
                  {workoutPlan.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.keys(workoutPlan.days).slice(0, 3).map((day) => (
                    <div key={day} className="p-3 bg-slate-50 rounded-md">
                      <h4 className="font-medium">{day}</h4>
                      <ul className="text-sm mt-1 space-y-1">
                        {workoutPlan.days[day].slice(0, 3).map((exercise) => (
                          <li key={exercise.id} className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-fitness-primary mr-2"></span>
                            {exercise.name}
                          </li>
                        ))}
                        {workoutPlan.days[day].length > 3 && (
                          <li className="text-xs text-muted-foreground">
                            + {workoutPlan.days[day].length - 3} weitere Übungen
                          </li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full mt-4"
                  onClick={() => navigate("/workout")}
                >
                  Zum vollständigen Plan
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Kein aktiver Trainingsplan</h3>
                <p className="text-muted-foreground mb-4">
                  Erstelle deinen persönlichen Trainingsplan, um loszulegen.
                </p>
                <Button onClick={() => navigate("/workout")}>
                  Trainingsplan erstellen
                </Button>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-fitness-primary" />
                Training planen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="mb-4">
                  Nutze unser neues Feature, um deine eigenen Workouts zu erstellen:
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/workout-builder")}
                >
                  Custom Workout Builder öffnen
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
