
import { useState } from "react";
import { UserProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

type UserProfileFormProps = {
  onSave: (profile: UserProfile) => void;
  initialProfile?: UserProfile;
};

const UserProfileForm = ({ onSave, initialProfile }: UserProfileFormProps) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>(
    initialProfile || {
      id: "user1",
      age: 30,
      height: 175,
      currentWeight: 75,
      targetWeight: 70,
      gender: "male",
      activityLevel: "moderate",
      goal: "lose",
    }
  );

  const handleChange = (field: keyof UserProfile, value: string | number) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validierung
    if (
      !profile.age ||
      !profile.height ||
      !profile.currentWeight ||
      !profile.targetWeight
    ) {
      toast({
        title: "Fehlende Angaben",
        description: "Bitte fülle alle Felder aus.",
        variant: "destructive",
      });
      return;
    }

    onSave(profile);
    toast({
      title: "Profil gespeichert",
      description: "Deine persönlichen Daten wurden erfolgreich gespeichert.",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Persönliche Daten</CardTitle>
        <CardDescription>
          Gib deine persönlichen Daten ein, um deinen individuellen Fitness- und Ernährungsplan zu erstellen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Alter</Label>
              <Input
                id="age"
                type="number"
                value={profile.age}
                onChange={(e) => handleChange("age", parseInt(e.target.value))}
                min="16"
                max="100"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Größe (cm)</Label>
              <Input
                id="height"
                type="number"
                value={profile.height}
                onChange={(e) => handleChange("height", parseInt(e.target.value))}
                min="120"
                max="250"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentWeight">Aktuelles Gewicht (kg)</Label>
              <Input
                id="currentWeight"
                type="number"
                value={profile.currentWeight}
                onChange={(e) =>
                  handleChange("currentWeight", parseInt(e.target.value))
                }
                min="30"
                max="300"
                step="0.1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetWeight">Zielgewicht (kg)</Label>
              <Input
                id="targetWeight"
                type="number"
                value={profile.targetWeight}
                onChange={(e) =>
                  handleChange("targetWeight", parseInt(e.target.value))
                }
                min="30"
                max="300"
                step="0.1"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Geschlecht</Label>
            <RadioGroup
              value={profile.gender}
              onValueChange={(value) => handleChange("gender", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Männlich</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Weiblich</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Anderes</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label htmlFor="activity-level">Aktivitätslevel</Label>
            <Select
              value={profile.activityLevel}
              onValueChange={(value) => handleChange("activityLevel", value)}
            >
              <SelectTrigger id="activity-level">
                <SelectValue placeholder="Wähle dein Aktivitätslevel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sitzend (wenig/keine Übung)</SelectItem>
                <SelectItem value="light">Leicht aktiv (1-3x Training/Woche)</SelectItem>
                <SelectItem value="moderate">Mäßig aktiv (3-5x Training/Woche)</SelectItem>
                <SelectItem value="active">Sehr aktiv (6-7x Training/Woche)</SelectItem>
                <SelectItem value="veryActive">Extrem aktiv (2x täglich Training)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="goal">Ziel</Label>
            <Select
              value={profile.goal}
              onValueChange={(value) => handleChange("goal", value as "lose" | "maintain" | "gain")}
            >
              <SelectTrigger id="goal">
                <SelectValue placeholder="Wähle dein Ziel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose">Gewicht verlieren</SelectItem>
                <SelectItem value="maintain">Gewicht halten</SelectItem>
                <SelectItem value="gain">Muskelaufbau</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full fitness-gradient">
            Speichern und Fortfahren
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserProfileForm;
