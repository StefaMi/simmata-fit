
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BodyPart } from "@/types";
import { Dumbbell, Heart, Scale, Weight } from "lucide-react";

type BodyPartSelectorProps = {
  onSave: (bodyParts: BodyPart[]) => void;
  initialSelection?: BodyPart[];
};

const bodyPartOptions: { value: BodyPart; label: string; icon: React.ReactNode }[] = [
  { value: "chest", label: "Brust", icon: <Dumbbell className="w-5 h-5 mr-2" /> },
  { value: "back", label: "Rücken", icon: <Weight className="w-5 h-5 mr-2" /> },
  { value: "shoulders", label: "Schultern", icon: <Dumbbell className="w-5 h-5 mr-2" /> },
  { value: "biceps", label: "Bizeps", icon: <Dumbbell className="w-5 h-5 mr-2" /> },
  { value: "triceps", label: "Trizeps", icon: <Dumbbell className="w-5 h-5 mr-2" /> },
  { value: "legs", label: "Beine", icon: <Weight className="w-5 h-5 mr-2" /> },
  { value: "abs", label: "Bauch", icon: <Scale className="w-5 h-5 mr-2" /> },
  { value: "cardio", label: "Kardio", icon: <Heart className="w-5 h-5 mr-2" /> },
];

const BodyPartSelector = ({ onSave, initialSelection = [] }: BodyPartSelectorProps) => {
  const [selectedParts, setSelectedParts] = useState<BodyPart[]>(initialSelection);

  const handleToggle = (bodyPart: BodyPart) => {
    setSelectedParts((prev) =>
      prev.includes(bodyPart)
        ? prev.filter((part) => part !== bodyPart)
        : [...prev, bodyPart]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(selectedParts);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Körperteile auswählen</CardTitle>
        <CardDescription>
          Wähle die Körperteile aus, die du trainieren möchtest. Basierend auf deiner Auswahl erstellen wir einen personalisierten Trainingsplan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bodyPartOptions.map((option) => (
              <div
                key={option.value}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedParts.includes(option.value)
                    ? "border-fitness-primary bg-fitness-primary bg-opacity-10"
                    : "border-gray-200 hover:border-fitness-primary"
                }`}
                onClick={() => handleToggle(option.value)}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-fitness-primary bg-opacity-10">
                    {option.icon}
                  </div>
                  <div className="text-center">
                    <Label
                      htmlFor={`bodypart-${option.value}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                  <div className="flex items-center justify-center">
                    <Checkbox
                      id={`bodypart-${option.value}`}
                      checked={selectedParts.includes(option.value)}
                      className="data-[state=checked]:bg-fitness-primary data-[state=checked]:text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="submit"
            className="w-full fitness-gradient"
            disabled={selectedParts.length === 0}
          >
            Trainingsplan erstellen
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BodyPartSelector;
