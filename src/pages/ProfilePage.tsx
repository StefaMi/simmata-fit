import { useState, useEffect } from "react";
import UserProfileForm from "@/components/UserProfileForm";
import { UserProfile } from "@/types";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User, Edit, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Lade das gespeicherte Profil beim ersten Rendern
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error("Fehler beim Parsen des gespeicherten Profils:", error);
      }
    }
  }, []);

  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setIsEditing(false);
    
    // Speichere das Profil im localStorage
    localStorage.setItem("userProfile", JSON.stringify(newProfile));
    
    toast({
      title: "Profil gespeichert",
      description: "Deine persönlichen Daten wurden erfolgreich aktualisiert.",
    });
    
    // Automatically navigate to workout page
    navigate("/workout");
  };

  // Functionality to handle login redirect
  const handleLoginRedirect = () => {
    navigate("/login");
  };

  // Zeige BMI und Gewichtsstatus an
  const calculateBMI = (weight: number, height: number): number => {
    // Höhe in Meter umrechnen (von cm)
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return "Untergewicht";
    if (bmi < 25) return "Normalgewicht";
    if (bmi < 30) return "Übergewicht";
    return "Adipositas";
  };

  // If no user is logged in, show a message to login first
  if (!user) {
    return (
      <Layout>
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <User className="h-6 w-6 text-fitness-primary" />
                Profil erstellen
              </CardTitle>
              <CardDescription>
                Du musst dich anmelden oder registrieren, um dein Profil zu erstellen und Trainingspläne anzulegen.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleLoginRedirect} 
                className="w-full flex items-center justify-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Anmelden oder Registrieren
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Show edit form or profile info for logged in users
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {isEditing || !profile ? (
          <UserProfileForm onSave={handleSaveProfile} initialProfile={profile || undefined} />
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <User className="h-6 w-6 text-fitness-primary" />
                  Persönliches Profil
                </CardTitle>
                <CardDescription>
                  Deine persönlichen Fitnessdaten und Ziele
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Alter</h3>
                    <p className="text-xl font-semibold">{profile.age} Jahre</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Größe</h3>
                    <p className="text-xl font-semibold">{profile.height} cm</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Aktuelles Gewicht</h3>
                    <p className="text-xl font-semibold">{profile.currentWeight} kg</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Zielgewicht</h3>
                    <p className="text-xl font-semibold">{profile.targetWeight} kg</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Geschlecht</h3>
                    <p className="text-xl font-semibold">
                      {profile.gender === "male" 
                        ? "Männlich" 
                        : profile.gender === "female" 
                        ? "Weiblich" 
                        : "Anderes"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Aktivitätslevel</h3>
                    <p className="text-xl font-semibold">
                      {profile.activityLevel === "sedentary" 
                        ? "Sitzend" 
                        : profile.activityLevel === "light" 
                        ? "Leicht aktiv" 
                        : profile.activityLevel === "moderate"
                        ? "Mäßig aktiv"
                        : profile.activityLevel === "active"
                        ? "Sehr aktiv"
                        : "Extrem aktiv"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Ziel</h3>
                    <p className="text-xl font-semibold">
                      {profile.goal === "lose" 
                        ? "Gewicht verlieren" 
                        : profile.goal === "maintain" 
                        ? "Gewicht halten" 
                        : "Muskelaufbau"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <Button 
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="flex items-center gap-2 border-fitness-primary text-fitness-primary hover:bg-fitness-primary hover:text-white"
                  >
                    <Edit className="h-4 w-4" />
                    Profil bearbeiten
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>BMI-Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Dein BMI</h3>
                      <p className="text-2xl font-bold">{bmi.toFixed(1)}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Kategorie: <span className="font-medium">{bmiCategory}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm">
                        Der Body-Mass-Index (BMI) ist ein Richtwert zur Bewertung des Körpergewichts im Verhältnis zur Körpergröße. 
                        Er berücksichtigt jedoch nicht Faktoren wie Muskelmasse oder Körperbau.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gewichtsziel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {isWeightLoss ? "Geplante Gewichtsabnahme" : "Geplante Gewichtszunahme"}
                      </h3>
                      <p className="text-2xl font-bold">{weightDifference} kg</p>
                    </div>
                    <div>
                      <p className="text-sm">
                        {isWeightLoss 
                          ? "Eine gesunde Gewichtsabnahme liegt bei etwa 0,5-1 kg pro Woche. Für nachhaltige Ergebnisse kombiniere deine Ernährungsumstellung mit regelmäßiger Bewegung."
                          : "Eine gesunde Gewichtszunahme liegt bei etwa 0,25-0,5 kg pro Woche. Achte auf proteinreiche Ernährung und Krafttraining für Muskelaufbau."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
