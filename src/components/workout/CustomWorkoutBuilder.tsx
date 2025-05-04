
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save, Edit, Clock } from "lucide-react";
import { Exercise, BodyPart } from "@/types";
import { bodyPartOptions } from "@/components/body-part/BodyPartOptions";
import { exercises as exerciseData } from "@/data/exercises";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

type CustomWorkout = {
  id: string;
  name: string;
  description: string;
  exercises: CustomExercise[];
  createdAt: string;
}

type CustomExercise = {
  id: string;
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
  restTime: number;
  notes: string;
}

const CustomWorkoutBuilder = () => {
  const { toast } = useToast();
  
  // State für den Workout-Builder
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<CustomExercise[]>([]);
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null);
  const [savedWorkouts, setSavedWorkouts] = useState<CustomWorkout[]>(() => {
    const saved = localStorage.getItem("customWorkouts");
    return saved ? JSON.parse(saved) : [];
  });
  
  // State für Übungs-Auswahl
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | "">("");
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [exerciseSets, setExerciseSets] = useState(3);
  const [exerciseReps, setExerciseReps] = useState("10");
  const [exerciseWeight, setExerciseWeight] = useState("0");
  const [exerciseRestTime, setExerciseRestTime] = useState(60);
  const [exerciseNotes, setExerciseNotes] = useState("");
  
  // Gefilterte Übungen basierend auf der Körperteil-Auswahl
  const filteredExercises = selectedBodyPart 
    ? exerciseData.filter(ex => ex.bodyPart === selectedBodyPart) 
    : [];
  
  const resetExerciseForm = () => {
    setSelectedBodyPart("");
    setSelectedExerciseId("");
    setExerciseSets(3);
    setExerciseReps("10");
    setExerciseWeight("0");
    setExerciseRestTime(60);
    setExerciseNotes("");
    setEditingExerciseIndex(null);
  };
  
  const handleAddExercise = () => {
    if (!selectedExerciseId) {
      toast({
        title: "Übung fehlt",
        description: "Bitte wähle eine Übung aus.",
        variant: "destructive",
      });
      return;
    }
    
    const selectedExercise = exerciseData.find(ex => ex.id === selectedExerciseId);
    if (!selectedExercise) return;
    
    const newExercise: CustomExercise = {
      id: uuidv4(),
      exerciseId: selectedExerciseId,
      name: selectedExercise.name,
      sets: exerciseSets,
      reps: exerciseReps,
      weight: exerciseWeight,
      restTime: exerciseRestTime,
      notes: exerciseNotes
    };
    
    if (editingExerciseIndex !== null) {
      // Übung bearbeiten
      const updatedExercises = [...selectedExercises];
      updatedExercises[editingExerciseIndex] = newExercise;
      setSelectedExercises(updatedExercises);
      
      toast({
        title: "Übung aktualisiert",
        description: `${selectedExercise.name} wurde aktualisiert.`,
      });
    } else {
      // Neue Übung hinzufügen
      setSelectedExercises([...selectedExercises, newExercise]);
      
      toast({
        title: "Übung hinzugefügt",
        description: `${selectedExercise.name} wurde zum Workout hinzugefügt.`,
      });
    }
    
    resetExerciseForm();
  };
  
  const handleEditExercise = (index: number) => {
    const exercise = selectedExercises[index];
    const exerciseData = exercise.exerciseId ? 
      exerciseData.find(ex => ex.id === exercise.exerciseId) : null;
    
    if (exerciseData) {
      setSelectedBodyPart(exerciseData.bodyPart);
      setSelectedExerciseId(exercise.exerciseId);
      setExerciseSets(exercise.sets);
      setExerciseReps(exercise.reps);
      setExerciseWeight(exercise.weight);
      setExerciseRestTime(exercise.restTime);
      setExerciseNotes(exercise.notes || "");
      setEditingExerciseIndex(index);
    }
  };
  
  const handleRemoveExercise = (index: number) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises.splice(index, 1);
    setSelectedExercises(updatedExercises);
    
    toast({
      title: "Übung entfernt",
      description: "Die Übung wurde aus deinem Workout entfernt.",
    });
  };
  
  const handleSaveWorkout = () => {
    if (!workoutName) {
      toast({
        title: "Name fehlt",
        description: "Bitte gib deinem Workout einen Namen.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedExercises.length === 0) {
      toast({
        title: "Keine Übungen",
        description: "Füge mindestens eine Übung zu deinem Workout hinzu.",
        variant: "destructive",
      });
      return;
    }
    
    const newWorkout: CustomWorkout = {
      id: uuidv4(),
      name: workoutName,
      description: workoutDescription,
      exercises: selectedExercises,
      createdAt: new Date().toISOString(),
    };
    
    const updatedWorkouts = [...savedWorkouts, newWorkout];
    setSavedWorkouts(updatedWorkouts);
    localStorage.setItem("customWorkouts", JSON.stringify(updatedWorkouts));
    
    // Reset form
    setWorkoutName("");
    setWorkoutDescription("");
    setSelectedExercises([]);
    
    toast({
      title: "Workout gespeichert",
      description: `${workoutName} wurde erfolgreich gespeichert.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Custom Workout Builder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workout-name">Workout-Name</Label>
            <Input 
              id="workout-name"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="z.B. Oberkörper Intensiv"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workout-description">Beschreibung (optional)</Label>
            <Textarea 
              id="workout-description"
              value={workoutDescription}
              onChange={(e) => setWorkoutDescription(e.target.value)}
              placeholder="Kurze Beschreibung des Workouts"
              rows={2}
            />
          </div>
          
          {/* Übungen hinzufügen */}
          <div className="bg-slate-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-3">
              {editingExerciseIndex !== null ? "Übung bearbeiten" : "Übung hinzufügen"}
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="body-part">Körperteil</Label>
                <Select
                  value={selectedBodyPart}
                  onValueChange={(value) => {
                    setSelectedBodyPart(value as BodyPart);
                    setSelectedExerciseId("");
                  }}
                >
                  <SelectTrigger id="body-part">
                    <SelectValue placeholder="Körperteil auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {bodyPartOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          {option.icon}
                          <span className="ml-2">{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="exercise">Übung</Label>
                <Select
                  value={selectedExerciseId}
                  onValueChange={setSelectedExerciseId}
                  disabled={!selectedBodyPart}
                >
                  <SelectTrigger id="exercise">
                    <SelectValue placeholder="Übung auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredExercises.map((exercise) => (
                      <SelectItem key={exercise.id} value={exercise.id}>
                        {exercise.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sets">Sätze</Label>
                  <div className="flex items-center space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setExerciseSets(Math.max(1, exerciseSets - 1))}
                    >-</Button>
                    <Input 
                      id="sets"
                      type="number"
                      className="text-center"
                      value={exerciseSets}
                      onChange={(e) => setExerciseSets(parseInt(e.target.value) || 1)}
                      min={1}
                      max={10}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setExerciseSets(Math.min(10, exerciseSets + 1))}
                    >+</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reps">Wiederholungen</Label>
                  <Input 
                    id="reps"
                    value={exerciseReps}
                    onChange={(e) => setExerciseReps(e.target.value)}
                    placeholder="z.B. 10-12"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Gewicht (kg)</Label>
                  <Input 
                    id="weight"
                    value={exerciseWeight}
                    onChange={(e) => setExerciseWeight(e.target.value)}
                    placeholder="z.B. 10 oder 10-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rest">Pause (Sekunden)</Label>
                  <div className="pt-2">
                    <Slider
                      id="rest"
                      defaultValue={[60]}
                      max={180}
                      step={5}
                      value={[exerciseRestTime]}
                      onValueChange={(values) => setExerciseRestTime(values[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>30s</span>
                      <span>{exerciseRestTime}s</span>
                      <span>180s</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notizen (optional)</Label>
                <Input 
                  id="notes"
                  value={exerciseNotes}
                  onChange={(e) => setExerciseNotes(e.target.value)}
                  placeholder="z.B. Langsame Ausführung, voller Bewegungsradius"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                {editingExerciseIndex !== null && (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={resetExerciseForm}
                  >
                    Abbrechen
                  </Button>
                )}
                
                <Button 
                  type="button" 
                  onClick={handleAddExercise}
                  className="flex items-center gap-2"
                >
                  {editingExerciseIndex !== null ? (
                    <>
                      <Save className="h-4 w-4" />
                      Aktualisieren
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Übung hinzufügen
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Liste der ausgewählten Übungen */}
          {selectedExercises.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Ausgewählte Übungen</h3>
              <div className="space-y-2">
                {selectedExercises.map((exercise, index) => (
                  <div 
                    key={exercise.id || index} 
                    className="flex justify-between items-start bg-white p-3 border rounded-md"
                  >
                    <div>
                      <p className="font-medium">{exercise.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {exercise.sets} Sätze × {exercise.reps} Wdh
                        {exercise.weight !== "0" && ` @ ${exercise.weight} kg`}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" /> {exercise.restTime}s Pause
                      </p>
                    </div>
                    <div className="flex">
                      <Button 
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditExercise(index)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveExercise(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full"
            onClick={handleSaveWorkout}
            disabled={selectedExercises.length === 0 || !workoutName}
          >
            <Save className="h-4 w-4 mr-2" />
            Workout speichern
          </Button>
        </CardFooter>
      </Card>
      
      {/* Liste der gespeicherten Workouts */}
      {savedWorkouts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Gespeicherte Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedWorkouts.map((workout, index) => (
                <div 
                  key={workout.id || index} 
                  className="p-3 border rounded-md"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">{workout.name}</h4>
                    <Button variant="outline" size="sm">
                      Starten
                    </Button>
                  </div>
                  {workout.description && (
                    <p className="text-sm text-muted-foreground mt-1">{workout.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {workout.exercises.length} Übungen
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomWorkoutBuilder;
