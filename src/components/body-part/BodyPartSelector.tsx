
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BodyPart } from "@/types";
import BodyPartOptions from "./BodyPartOptions";

type BodyPartSelectorProps = {
  onSave: (bodyParts: BodyPart[]) => void;
  initialSelection?: BodyPart[];
};

const BodyPartSelector = ({ onSave, initialSelection = [] }: BodyPartSelectorProps) => {
  const [selectedParts, setSelectedParts] = useState<BodyPart[]>(initialSelection);
  
  // Update local state when initialSelection changes
  useEffect(() => {
    if (initialSelection.length > 0) {
      setSelectedParts(initialSelection);
    }
  }, [initialSelection]);

  const handleToggle = (bodyPart: BodyPart) => {
    console.log(`Toggling ${bodyPart}`);
    setSelectedParts((prev) =>
      prev.includes(bodyPart)
        ? prev.filter((part) => part !== bodyPart)
        : [...prev, bodyPart]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting selected parts:", selectedParts);
    onSave(selectedParts);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold dark:text-white">Körperteile auswählen</CardTitle>
        <CardDescription className="dark:text-gray-300">
          Wähle die Körperteile aus, die du trainieren möchtest. Basierend auf deiner Auswahl erstellen wir einen personalisierten Trainingsplan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <BodyPartOptions 
            selectedParts={selectedParts} 
            onToggle={handleToggle} 
          />

          <Button
            type="submit"
            className="w-full fitness-gradient dark:hover:bg-fitness-accent/80"
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
