
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
    <Card className="w-full max-w-2xl mx-auto backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xl">
      <CardHeader className="border-b border-slate-100 dark:border-slate-700">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-fitness-primary to-fitness-accent bg-clip-text text-transparent">
          Ernährungseintrag
        </CardTitle>
        <CardDescription className="dark:text-slate-300">
          Erfasse deine Mahlzeiten und verfolge deinen Nährstoffverbrauch.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="food-name">Lebensmittel/Mahlzeit</Label>
            <Input
              id="food-name"
              value={nutritionEntry.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="z.B. Haferflocken mit Beeren"
              className="bg-white dark:bg-slate-700"
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
                className="bg-white dark:bg-slate-700"
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
                className="bg-white dark:bg-slate-700"
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
                className="bg-white dark:bg-slate-700"
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
                className="bg-white dark:bg-slate-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meal-type">Mahlzeitentyp</Label>
            <Select
              value={nutritionEntry.mealType}
              onValueChange={(value) => handleChange("mealType", value as "breakfast" | "lunch" | "dinner" | "snack")}
            >
              <SelectTrigger id="meal-type" className="bg-white dark:bg-slate-700">
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
              className="bg-white dark:bg-slate-700"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-fitness-primary to-fitness-accent text-white hover:from-fitness-secondary hover:to-fitness-primary transition-all duration-300"
          >
            Eintrag speichern
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NutritionForm;
