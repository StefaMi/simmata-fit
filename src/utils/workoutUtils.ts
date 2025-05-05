
import { WorkoutPlan } from "@/types";

// Optimiert die Trainingstage nach Frequenz
export const optimizeWorkoutDays = (plan: WorkoutPlan): WorkoutPlan => {
  const frequency = plan.frequency;
  const allDays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
  
  // Bestimme optimale Trainingstage basierend auf Frequenz
  let optimalDays: string[] = [];
  
  switch(frequency) {
    case 2:
      optimalDays = ["Montag", "Donnerstag"];
      break;
    case 3:
      optimalDays = ["Montag", "Mittwoch", "Freitag"];
      break;
    case 4:
      optimalDays = ["Montag", "Dienstag", "Donnerstag", "Freitag"];
      break;
    case 5:
      optimalDays = ["Montag", "Dienstag", "Mittwoch", "Freitag", "Samstag"];
      break;
    case 6:
      optimalDays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
      break;
    default:
      optimalDays = allDays.slice(0, frequency);
  }
  
  // Erstelle neues Tagesschema mit optimierten Tagen
  const newDays: { [key: string]: any[] } = {};
  
  // Initialisiere alle Tage (auch Ruhetage)
  allDays.forEach(day => {
    newDays[day] = [];
  });
  
  // Sammle alle Übungen aus dem ursprünglichen Plan
  const allExercises = Object.values(plan.days).flat();
  
  console.log("Total exercises to distribute:", allExercises.length);
  console.log("Optimal days:", optimalDays);
  
  // Übungen gleichmäßig auf die Trainingstage verteilen
  if (allExercises.length > 0 && optimalDays.length > 0) {
    // Sortiere Übungen nach Körperteilen für bessere Gruppierung
    allExercises.sort((a, b) => a.bodyPart.localeCompare(b.bodyPart));
    
    // Berechne, wie viele Übungen pro Tag
    const exercisesPerDay = Math.ceil(allExercises.length / optimalDays.length);
    
    console.log("Exercises per day:", exercisesPerDay);
    
    // Verteile die Übungen
    optimalDays.forEach((day, index) => {
      const startIdx = index * exercisesPerDay;
      const endIdx = Math.min(startIdx + exercisesPerDay, allExercises.length);
      console.log(`Day ${day}: Assigning exercises from ${startIdx} to ${endIdx}`);
      
      if (startIdx < allExercises.length) {
        const exercisesForDay = allExercises.slice(startIdx, endIdx);
        newDays[day] = JSON.parse(JSON.stringify(exercisesForDay)); // Tiefe Kopie erstellen
        console.log(`Assigned ${exercisesForDay.length} exercises to ${day}`);
      }
    });
  }
  
  // Aktualisiere die Beschreibung
  const updatedDescription = `Trainingsplan für ${
    plan.description.includes("Gewichtsabnahme") ? "Gewichtsabnahme" : 
    plan.description.includes("Muskelaufbau") ? "Muskelaufbau" : 
    "Gewichtserhaltung"
  } (${frequency}x pro Woche)`;
  
  // Erstelle aktualisierten Plan
  const optimizedPlan = {
    ...plan,
    description: updatedDescription,
    days: newDays
  };
  
  console.log("Optimized plan:", JSON.stringify(optimizedPlan, null, 2));
  
  return optimizedPlan;
};
