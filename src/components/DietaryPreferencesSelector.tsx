
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DietaryPreference } from "@/types";
import { Meat, Fish, Egg, Carrot, Apple, Utensils, ChefHat } from "lucide-react";

type DietaryPreferenceOption = {
  id: DietaryPreference;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
};

const dietaryOptions: DietaryPreferenceOption[] = [
  {
    id: "meat",
    label: "Fleisch",
    icon: Meat,
    description: "Rindfleisch, Schweinefleisch, Lamm, etc."
  },
  {
    id: "poultry",
    label: "Geflügel",
    icon: ChefHat,
    description: "Huhn, Pute, Ente, etc."
  },
  {
    id: "fish",
    label: "Fisch & Meeresfrüchte",
    icon: Fish,
    description: "Lachs, Thunfisch, Garnelen, etc."
  },
  {
    id: "eggs",
    label: "Eier & Milchprodukte",
    icon: Egg,
    description: "Eier, Käse, Joghurt, etc."
  },
  {
    id: "vegetarian",
    label: "Vegetarisch",
    icon: Carrot,
    description: "Kein Fleisch, aber Eier und Milchprodukte sind ok"
  },
  {
    id: "vegan",
    label: "Vegan",
    icon: Apple,
    description: "Keine tierischen Produkte"
  },
  {
    id: "gluten_free",
    label: "Glutenfrei",
    icon: Utensils,
    description: "Ohne Weizen, Roggen, Gerste"
  }
];

type DietaryPreferencesSelectorProps = {
  initialPreferences: DietaryPreference[];
  onSave: (preferences: DietaryPreference[]) => void;
  onCancel: () => void;
};

const DietaryPreferencesSelector = ({ 
  initialPreferences,
  onSave,
  onCancel
}: DietaryPreferencesSelectorProps) => {
  const [selectedPreferences, setSelectedPreferences] = useState<DietaryPreference[]>(initialPreferences);

  const togglePreference = (preference: DietaryPreference) => {
    if (selectedPreferences.includes(preference)) {
      setSelectedPreferences(selectedPreferences.filter(p => p !== preference));
    } else {
      // Spezielle Logik für sich gegenseitig ausschließende Optionen
      let newPreferences = [...selectedPreferences, preference];
      
      // Wenn vegan ausgewählt wurde, entferne alle tierischen Produkte
      if (preference === "vegan") {
        newPreferences = newPreferences.filter(p => !["meat", "poultry", "fish", "eggs"].includes(p));
      }
      
      // Wenn vegetarisch ausgewählt wurde, entferne alle Fleischprodukte
      if (preference === "vegetarian") {
        newPreferences = newPreferences.filter(p => !["meat", "poultry", "fish"].includes(p));
      }
      
      // Wenn Fleisch, Geflügel oder Fisch ausgewählt wurde, entferne vegan
      if (["meat", "poultry", "fish"].includes(preference)) {
        newPreferences = newPreferences.filter(p => p !== "vegan" && p !== "vegetarian");
      }
      
      // Wenn Eier ausgewählt wurden, entferne vegan
      if (preference === "eggs") {
        newPreferences = newPreferences.filter(p => p !== "vegan");
      }
      
      setSelectedPreferences(newPreferences);
    }
  };

  const handleSave = () => {
    onSave(selectedPreferences);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-fitness-primary" />
          Ernährungsvorlieben
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dietaryOptions.map(option => (
            <div key={option.id} className="flex items-start space-x-3 p-3 border rounded-md hover:bg-slate-50 transition-colors">
              <Checkbox
                id={option.id}
                checked={selectedPreferences.includes(option.id)}
                onCheckedChange={() => togglePreference(option.id)}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <option.icon className="h-5 w-5 text-fitness-primary" />
                  <Label htmlFor={option.id} className="font-medium">
                    {option.label}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>Abbrechen</Button>
        <Button onClick={handleSave}>Speichern</Button>
      </CardFooter>
    </Card>
  );
};

export default DietaryPreferencesSelector;
