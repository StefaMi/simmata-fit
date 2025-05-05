
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FocusExercise } from "@/types";
import FocusExerciseTimer from "./FocusExerciseTimer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Wind, Clock, Heart } from "lucide-react";

// Sample focus exercises data
const focusExercises: FocusExercise[] = [
  {
    id: "fe1",
    name: "4-7-8 Atemübung",
    description: "Einfache Atemtechnik zur Beruhigung",
    duration: 120,
    type: "breathing",
    instructions: "Atme 4 Sekunden ein, halte 7 Sekunden, atme 8 Sekunden aus. Wiederhole den Zyklus."
  },
  {
    id: "fe2",
    name: "Bodyscan Meditation",
    description: "Achtsame Körperwahrnehmung",
    duration: 300,
    type: "meditation",
    instructions: "Richte deine Aufmerksamkeit nacheinander auf verschiedene Bereiche deines Körpers."
  },
  {
    id: "fe3",
    name: "Fokussiertes Atmen",
    description: "Konzentrationsübung durch bewusstes Atmen",
    duration: 180,
    type: "focus",
    instructions: "Konzentriere dich nur auf deinen Atem. Zähle bis 10 und beginne dann wieder."
  },
  {
    id: "fe4",
    name: "Nesma-Übung",
    description: "Traditionelle assyrische Atemübung",
    duration: 240,
    type: "nesma",
    instructions: "Atme tief durch die Nase ein und durch den Mund wieder aus. Spüre die Verbindung mit deinen Wurzeln."
  }
];

type FocusExercisesProps = {
  onComplete?: () => void;
};

const FocusExercises = ({ onComplete }: FocusExercisesProps) => {
  const [selectedExercise, setSelectedExercise] = useState<FocusExercise | null>(null);
  const [activeTab, setActiveTab] = useState<string>("breathing");

  const handleExerciseComplete = () => {
    setSelectedExercise(null);
    if (onComplete) {
      onComplete();
    }
  };

  const filteredExercises = focusExercises.filter(
    (exercise) => exercise.type === activeTab
  );

  const getTabIcon = (type: string) => {
    switch (type) {
      case "breathing":
        return <Wind className="h-4 w-4 mr-1" />;
      case "meditation":
        return <Brain className="h-4 w-4 mr-1" />;
      case "focus":
        return <Clock className="h-4 w-4 mr-1" />;
      case "nesma":
        return <Heart className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  if (selectedExercise) {
    return (
      <FocusExerciseTimer
        exercise={selectedExercise}
        onComplete={handleExerciseComplete}
        onCancel={() => setSelectedExercise(null)}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-fitness-primary" />
          Fokus & Atemübungen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="breathing" className="flex items-center">
              {getTabIcon("breathing")} Atmung
            </TabsTrigger>
            <TabsTrigger value="meditation" className="flex items-center">
              {getTabIcon("meditation")} Meditation
            </TabsTrigger>
            <TabsTrigger value="focus" className="flex items-center">
              {getTabIcon("focus")} Fokus
            </TabsTrigger>
            <TabsTrigger value="nesma" className="flex items-center">
              {getTabIcon("nesma")} Nesma
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
  {filteredExercises.length === 0 ? (
    <div className="text-sm text-muted-foreground">
      Für diese Kategorie sind aktuell keine Übungen verfügbar.
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {filteredExercises.map((exercise) => (
        <Card key={exercise.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-1">{exercise.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {exercise.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {Math.floor(exercise.duration / 60)}:{(exercise.duration % 60).toString().padStart(2, '0')} Min
              </span>
              <Button size="sm" onClick={() => setSelectedExercise(exercise)}>
                Starten
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )}
</TabsContent>

        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FocusExercises;
