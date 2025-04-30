
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NutritionEntry } from "@/types";
import { useToast } from "@/components/ui/use-toast";

type NutritionFormProps = {
  onSave: (entry: NutritionEntry) => void;
};

const NutritionForm = ({ onSave }: NutritionFormProps) => {
  const { toast } = useToast();
  const [nutritionEntry, setNutritionEntry] = useState<NutritionEntry>({
    id: `entry-${Date.now()}`,
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    date: new Date().toISOString().split("T")[0],
    mealType: "breakfast",
  });

  const handleChange = (field: keyof NutritionEntry, value: string | number) => {
    setNutritionEntry((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validierung
    if (!nutritionEntry.name || nutritionEntry.calories <= 0) {
      toast({
        title: "Fehlende Angaben",
        description: "Bitte gib mindestens einen Namen und Kalorien ein.",
        variant: "destructive",
      });
      return;
    }

    onSave(nutritionEntry);
    toast({
      title: "Eintrag gespeichert",
      description: "Dein Ernährungseintrag wurde erfolgreich hinzugefügt.",
    });
    
    // Reset-Formular
    setNutritionEntry({
      id: `entry-${Date.now()}`,
      name: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      date: new Date().toISOString().split("T")[0],
      mealType: "breakfast",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Ernährungseintrag</CardTitle>
        <CardDescription>
          Erfasse deine Mahlzeiten und verfolge deinen Nährstoffverbrauch.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="food-name">Lebensmittel/Mahlzeit</Label>
            <Input
              id="food-name"
              value={nutritionEntry.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="z.B. Haferflocken mit Beeren"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Kalorien (kcal)</Label>
              <Input
                id="calories"
                type="number"
                value={nutritionEntry.calories}
                onChange={(e) => handleChange("calories", parseInt(e.target.value))}
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                value={nutritionEntry.protein}
                onChange={(e) => handleChange("protein", parseInt(e.target.value))}
                min="0"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carbs">Kohlenhydrate (g)</Label>
              <Input
                id="carbs"
                type="number"
                value={nutritionEntry.carbs}
                onChange={(e) => handleChange("carbs", parseInt(e.target.value))}
                min="0"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fat">Fett (g)</Label>
              <Input
                id="fat"
                type="number"
                value={nutritionEntry.fat}
                onChange={(e) => handleChange("fat", parseInt(e.target.value))}
                min="0"
                step="0.1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meal-type">Mahlzeitentyp</Label>
            <Select
              value={nutritionEntry.mealType}
              onValueChange={(value) => handleChange("mealType", value as "breakfast" | "lunch" | "dinner" | "snack")}
            >
              <SelectTrigger id="meal-type">
                <SelectValue placeholder="Wähle einen Mahlzeitentyp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Frühstück</SelectItem>
                <SelectItem value="lunch">Mittagessen</SelectItem>
                <SelectItem value="dinner">Abendessen</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Datum</Label>
            <Input
              id="date"
              type="date"
              value={nutritionEntry.date}
              onChange={(e) => handleChange("date", e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full fitness-gradient">
            Eintrag speichern
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NutritionForm;
