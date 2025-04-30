
import { useState, useEffect } from "react";
import BodyPartSelector from "@/components/BodyPartSelector";
import WorkoutPlanDisplay from "@/components/WorkoutPlanDisplay";
import { BodyPart, UserProfile, WorkoutPlan } from "@/types";
import Layout from "@/components/Layout";
import { createWorkoutPlan } from "@/utils/calculators";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Define step types for better clarity
type WorkoutStep = 1 | 2;

const WorkoutPage = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<WorkoutStep>(1);
  const [selectedParts, setSelectedParts] = useState<BodyPart[]>([]);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Lade das Nutzerprofil beim ersten Rendern
  useEffect(() => {
    console.log("WorkoutPage mounting, loading profile and plan");
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
    
    // Lade den gespeicherten Trainingsplan
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

  // Optimiert die Trainingstage nach Frequenz
  const optimizeWorkoutDays = (plan: WorkoutPlan): WorkoutPlan => {
    const frequency = plan.frequency;
    const allDays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
    
    // Bestimme optimale Trainingstage basierend auf Frequenz
    let optimalDays: string[] = [];
    
    switch(frequency) {
      case 2:
        optimalDays = ["Montag", "Donnerstag"];
        break;
      case 3:
        optimalDays = ["Montag", "Mittwoch", "Freitag"];
        break;
      case 4:
        optimalDays = ["Montag", "Dienstag", "Donnerstag", "Freitag"];
        break;
      case 5:
        optimalDays = ["Montag", "Dienstag", "Mittwoch", "Freitag", "Samstag"];
        break;
      case 6:
        optimalDays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
        break;
      default:
        optimalDays = allDays.slice(0, frequency);
    }
    
    // Erstelle neues Tagesschema mit optimierten Tagen
    const newDays: { [key: string]: Exercise[] } = {};
    
    // Initialisiere alle Tage (auch Ruhetage)
    allDays.forEach(day => {
      newDays[day] = [];
    });
    
    // Füge Übungen nur an optimalen Tagen ein
    const oldDayNames = Object.keys(plan.days);
    oldDayNames.sort(); // Sortiere, um konsistente Reihenfolge zu gewährleisten
    
    optimalDays.forEach((optimalDay, index) => {
      if (index < oldDayNames.length) {
        newDays[optimalDay] = plan.days[oldDayNames[index]];
      }
    });
    
    // Aktualisiere die Beschreibung
    const updatedDescription = `Trainingsplan für ${
      userProfile?.goal === "lose" ? "Gewichtsabnahme" : 
      userProfile?.goal === "gain" ? "Muskelaufbau" : 
      "Gewichtserhaltung"
    } (${frequency}x pro Woche)`;
    
    // Erstelle aktualisierten Plan
    return {
      ...plan,
      description: updatedDescription,
      days: newDays
    };
  };

  const handleReset = () => {
    console.log("Resetting workout plan");
    setStep(1);
    setSelectedParts([]);
    setWorkoutPlan(null);
    localStorage.removeItem("workoutPlan");
  };

  console.log("Current step:", step, "Workout plan exists:", !!workoutPlan);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {!userProfile && step === 1 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div>
                <p className="text-sm text-yellow-700">
                  Du hast noch kein Profil erstellt. Für einen optimal angepassten Trainingsplan empfehlen wir dir, zuerst dein Profil zu vervollständigen.
                </p>
                <p className="mt-3">
                  <Button asChild variant="outline">
                    <a href="/profile">Zum Profil</a>
                  </Button>
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <BodyPartSelector onSave={handleSaveBodyParts} initialSelection={selectedParts} />
        ) : null}

        {step === 2 && workoutPlan ? (
          <>
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
            <WorkoutPlanDisplay workoutPlan={workoutPlan} />
          </>
        ) : null}
      </div>
    </Layout>
  );
};

export default WorkoutPage;
