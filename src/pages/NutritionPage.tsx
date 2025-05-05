
import { useState, useEffect } from "react";
import NutritionForm from "@/components/NutritionForm";
import NutritionPlanDisplay from "@/components/NutritionPlanDisplay";
import { NutritionEntry, NutritionPlan, UserProfile, DietaryPreference } from "@/types";
import Layout from "@/components/Layout";
import { createNutritionPlan } from "@/utils/calculators";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, RefreshCw, Plus, Heart, Meat, Fish, Carrot, Apple } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import DietaryPreferencesSelector from "@/components/DietaryPreferencesSelector";

const NutritionPage = () => {
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [nutritionEntries, setNutritionEntries] = useState<NutritionEntry[]>([]);
  const [activeTab, setActiveTab] = useState("plan");
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>([]);
  const [showPreferences, setShowPreferences] = useState(false);

  // Lade das Nutzerprofil und den Ernährungsplan beim ersten Rendern
  useEffect(() => {
    // Lade Profil
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
        
        // Lade gespeicherte Ernährungsvorlieben
        const savedPreferences = localStorage.getItem("dietaryPreferences");
        if (savedPreferences) {
          setDietaryPreferences(JSON.parse(savedPreferences));
        }
        
        // Erstelle automatisch einen Ernährungsplan, wenn noch keiner existiert
        const savedNutritionPlan = localStorage.getItem("nutritionPlan");
        if (savedNutritionPlan) {
          setNutritionPlan(JSON.parse(savedNutritionPlan));
        } else if (profile) {
          handleCreateNewPlan(profile, savedPreferences ? JSON.parse(savedPreferences) : []);
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

  // Handler für die Speicherung der Ernährungsvorlieben
  const handleSaveDietaryPreferences = (preferences: DietaryPreference[]) => {
    setDietaryPreferences(preferences);
    localStorage.setItem("dietaryPreferences", JSON.stringify(preferences));
    setShowPreferences(false);
    
    // Erstelle einen neuen Ernährungsplan basierend auf den Vorlieben
    if (userProfile) {
      handleCreateNewPlan(userProfile, preferences);
    }
    
    toast({
      title: "Vorlieben gespeichert",
      description: "Deine Ernährungsvorlieben wurden erfolgreich gespeichert und ein neuer Plan wurde erstellt.",
    });
  };

  // Handler für die Erstellung eines neuen Ernährungsplans
  const handleCreateNewPlan = (profile = userProfile, preferences = dietaryPreferences) => {
    if (!profile) {
      toast({
        title: "Profil fehlt",
        description: "Bitte erstelle zuerst dein persönliches Profil.",
        variant: "destructive",
      });
      return;
    }
    
    const newPlan = createNutritionPlan(profile, preferences);
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
            {showPreferences ? (
              <DietaryPreferencesSelector 
                initialPreferences={dietaryPreferences}
                onSave={handleSaveDietaryPreferences}
                onCancel={() => setShowPreferences(false)}
              />
            ) : nutritionPlan ? (
              <>
                <div className="flex justify-between flex-wrap gap-2">
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => setShowPreferences(true)}
                  >
                    {dietaryPreferences.length > 0 ? (
                      <>
                        <Carrot className="h-4 w-4" />
                        Vorlieben ändern
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Vorlieben festlegen
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => handleCreateNewPlan()}
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
                    Erstelle einen personalisierten Ernährungsplan basierend auf deinen Zielen und Vorlieben.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex flex-col items-center md:items-start gap-2 flex-1">
                      <div className="flex gap-2 items-center">
                        <Meat className="h-5 w-5 text-fitness-primary" />
                        <span>Fleisch</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Fish className="h-5 w-5 text-fitness-primary" />
                        <span>Fisch</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Carrot className="h-5 w-5 text-fitness-primary" />
                        <span>Vegetarisch</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Apple className="h-5 w-5 text-fitness-primary" />
                        <span>Vegan</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-4">
                        Lege deine Ernährungsvorlieben fest, um einen individuellen Plan zu erhalten, 
                        der zu deinen Zielen und Geschmacksvorlieben passt.
                      </p>
                      <Button 
                        onClick={() => setShowPreferences(true)} 
                        className="w-full fitness-gradient"
                      >
                        Vorlieben festlegen & Plan erstellen
                      </Button>
                    </div>
                  </div>
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
