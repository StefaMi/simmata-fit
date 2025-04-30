
import { useState, useEffect } from "react";
import NutritionForm from "@/components/NutritionForm";
import NutritionPlanDisplay from "@/components/NutritionPlanDisplay";
import { NutritionEntry, NutritionPlan, UserProfile } from "@/types";
import Layout from "@/components/Layout";
import { createNutritionPlan } from "@/utils/calculators";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, RefreshCw, Plus, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const NutritionPage = () => {
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [nutritionEntries, setNutritionEntries] = useState<NutritionEntry[]>([]);
  const [activeTab, setActiveTab] = useState("plan");

  // Lade das Nutzerprofil und den Ernährungsplan beim ersten Rendern
  useEffect(() => {
    // Lade Profil
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
        
        // Erstelle automatisch einen Ernährungsplan, wenn noch keiner existiert
        const savedNutritionPlan = localStorage.getItem("nutritionPlan");
        if (savedNutritionPlan) {
          setNutritionPlan(JSON.parse(savedNutritionPlan));
        } else {
          const newPlan = createNutritionPlan(profile);
          setNutritionPlan(newPlan);
          localStorage.setItem("nutritionPlan", JSON.stringify(newPlan));
        }
      } catch (error) {
        console.error("Fehler beim Parsen des gespeicherten Profils:", error);
      }
    }
    
    // Lade gespeicherte Ernährungseinträge
    const savedEntries = localStorage.getItem("nutritionEntries");
    if (savedEntries) {
      try {
        setNutritionEntries(JSON.parse(savedEntries));
      } catch (error) {
        console.error("Fehler beim Parsen der gespeicherten Ernährungseinträge:", error);
      }
    }
  }, []);

  // Handler für das Hinzufügen neuer Ernährungseinträge
  const handleSaveNutritionEntry = (entry: NutritionEntry) => {
    const updatedEntries = [...nutritionEntries, entry];
    setNutritionEntries(updatedEntries);
    
    // Speichere die Einträge im localStorage
    localStorage.setItem("nutritionEntries", JSON.stringify(updatedEntries));
    
    toast({
      title: "Eintrag gespeichert",
      description: "Dein Ernährungseintrag wurde erfolgreich hinzugefügt.",
    });
  };

  // Handler für die Erstellung eines neuen Ernährungsplans
  const handleCreateNewPlan = () => {
    if (!userProfile) {
      toast({
        title: "Profil fehlt",
        description: "Bitte erstelle zuerst dein persönliches Profil.",
        variant: "destructive",
      });
      return;
    }
    
    const newPlan = createNutritionPlan(userProfile);
    setNutritionPlan(newPlan);
    localStorage.setItem("nutritionPlan", JSON.stringify(newPlan));
    
    toast({
      title: "Ernährungsplan aktualisiert",
      description: "Dein personalisierter Ernährungsplan wurde neu erstellt.",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {!userProfile ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div>
                <p className="text-sm text-yellow-700">
                  Du hast noch kein Profil erstellt. Für einen optimal angepassten Ernährungsplan empfehlen wir dir, zuerst dein Profil zu vervollständigen.
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="plan">Ernährungsplan</TabsTrigger>
            <TabsTrigger value="tracking">Essen erfassen</TabsTrigger>
          </TabsList>

          <TabsContent value="plan" className="space-y-6">
            {nutritionPlan ? (
              <>
                <div className="flex justify-end">
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={handleCreateNewPlan}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Plan aktualisieren
                  </Button>
                </div>
                <NutritionPlanDisplay nutritionPlan={nutritionPlan} />
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Heart className="h-6 w-6 text-fitness-primary" />
                    Ernährungsplan erstellen
                  </CardTitle>
                  <CardDescription>
                    Erstelle einen personalisierten Ernährungsplan basierend auf deinen Zielen.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleCreateNewPlan} className="w-full fitness-gradient">
                    Plan erstellen
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tracking">
            <div className="space-y-6">
              <NutritionForm onSave={handleSaveNutritionEntry} />

              {nutritionEntries.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Deine Ernährungseinträge</CardTitle>
                    <CardDescription>Übersicht über deine erfassten Mahlzeiten</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {nutritionEntries.slice().reverse().map((entry) => (
                        <Card key={entry.id}>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                              <div>
                                <div className="flex items-center">
                                  <h4 className="text-md font-semibold">{entry.name}</h4>
                                  <span className="ml-2 text-xs px-2 py-1 bg-gray-100 rounded-full">
                                    {entry.mealType === "breakfast" ? "Frühstück" :
                                     entry.mealType === "lunch" ? "Mittagessen" :
                                     entry.mealType === "dinner" ? "Abendessen" : "Snack"}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{entry.date}</p>
                                <div className="flex flex-wrap gap-x-4 mt-2">
                                  <div className="text-sm">
                                    <span className="text-fitness-primary">{entry.calories}</span>{" "}
                                    <span className="text-muted-foreground">kcal</span>
                                  </div>
                                  <div className="text-sm">
                                    <span className="text-fitness-success">{entry.protein}</span>{" "}
                                    <span className="text-muted-foreground">g Protein</span>
                                  </div>
                                  <div className="text-sm">
                                    <span className="text-fitness-warning">{entry.carbs}</span>{" "}
                                    <span className="text-muted-foreground">g Kohlenhydrate</span>
                                  </div>
                                  <div className="text-sm">
                                    <span className="text-fitness-accent">{entry.fat}</span>{" "}
                                    <span className="text-muted-foreground">g Fett</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default NutritionPage;
