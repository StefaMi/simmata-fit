
import { useState } from "react";
import Layout from "@/components/Layout";
import DailyQuote from "@/components/DailyQuote";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, Activity, Check } from "lucide-react";
import { FocusExercise } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FocusExerciseTimer from "@/components/FocusExerciseTimer";

// Vorhandene Fokusübungen
const focusExercises: FocusExercise[] = [
  {
    id: "fe1",
    name: "Nesma Atemübung",
    description: "Eine traditionelle assyrische Atemübung für innere Ruhe",
    duration: 300, // 5 Minuten
    type: "nesma",
    instructions: "Sitze aufrecht und atme tief ein, halte den Atem für 4 Sekunden, und atme langsam aus. Wiederhole für 5 Minuten."
  },
  {
    id: "fe2",
    name: "4-7-8 Atmung",
    description: "Atme ein für 4 Sekunden, halte für 7, ausatmen für 8",
    duration: 180, // 3 Minuten
    type: "breathing",
    instructions: "Atme durch die Nase für 4 Sekunden ein, halte den Atem für 7 Sekunden, atme durch den Mund für 8 Sekunden aus. Wiederhole."
  },
  {
    id: "fe3",
    name: "Fokussierte Aufmerksamkeit",
    description: "Konzentration auf einen einzelnen Punkt",
    duration: 300, // 5 Minuten
    type: "focus",
    instructions: "Fixiere einen Punkt oder Gegenstand mit deinen Augen. Konzentriere dich nur darauf und kehre sanft zur Aufmerksamkeit zurück, wenn deine Gedanken abschweifen."
  },
  {
    id: "fe4",
    name: "Nesma Bodyscan",
    description: "Traditionelle Körperwahrnehmungsübung",
    duration: 600, // 10 Minuten
    type: "nesma",
    instructions: "Beginne bei deinen Füßen und arbeite dich nach oben, indem du jede Körperregion bewusst wahrnimmst und entspannst. Verbinde dich mit jedem Teil deines Körpers."
  }
];

const FocusPage = () => {
  const [selectedExercise, setSelectedExercise] = useState<FocusExercise | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const handleExerciseComplete = (exerciseId: string) => {
    setSelectedExercise(null);
    if (!completedExercises.includes(exerciseId)) {
      setCompletedExercises([...completedExercises, exerciseId]);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Fokus & Achtsamkeit</h1>
        
        {/* Daily Quote */}
        <DailyQuote />
        
        {/* Focus Exercises */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-fitness-primary" />
              Atem- & Fokusübungen
            </CardTitle>
            <CardDescription>
              Wähle eine Übung aus und stärke deinen Geist mit diesen Nesma-inspirierten Techniken
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedExercise ? (
              <FocusExerciseTimer 
                exercise={selectedExercise}
                onComplete={() => handleExerciseComplete(selectedExercise.id)}
                onCancel={() => setSelectedExercise(null)}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {focusExercises.map(exercise => (
                  <Card key={exercise.id} className={`border ${completedExercises.includes(exercise.id) ? 'border-fitness-success bg-green-50/30' : 'border-slate-200'}`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col h-full">
                        <div className="mb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {completedExercises.includes(exercise.id) && (
                                <Check className="h-4 w-4 text-fitness-success" />
                              )}
                              <h3 className="font-medium">{exercise.name}</h3>
                            </div>
                            {exercise.type === "nesma" && (
                              <Badge variant="default" className="bg-fitness-primary">Nesma</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{exercise.description}</p>
                          <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                            <Activity className="h-4 w-4" />
                            <span>{Math.floor(exercise.duration / 60)} Min</span>
                          </div>
                        </div>
                        <div className="mt-auto pt-3">
                          <Button 
                            className="w-full"
                            onClick={() => setSelectedExercise(exercise)}
                          >
                            {completedExercises.includes(exercise.id) ? 'Übung wiederholen' : 'Übung starten'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Information about Nesma */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-fitness-primary" />
              Über Nesma
            </CardTitle>
            <CardDescription>
              Die traditionellen assyrischen Fokus- und Atemtechniken
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Nesma ist ein traditionelles assyrisches Konzept, das Atemübungen, 
              Meditation und Konzentrationstechniken kombiniert. Diese Praktiken wurden über 
              Generationen weitergegeben, um körperliche und geistige Gesundheit zu fördern.
            </p>
            <p className="text-muted-foreground mt-4">
              Die hier vorgestellten Übungen sind von diesen traditionellen Techniken 
              inspiriert und unterstützen dich dabei, Stress abzubauen, deine Konzentration 
              zu verbessern und eine tiefere Verbindung zwischen Körper und Geist herzustellen.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FocusPage;
