
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
  
  // Füge Übungen nur an optimalen Tagen ein
  const oldDayNames = Object.keys(plan.days);
  oldDayNames.sort(); // Sortiere, um konsistente Reihenfolge zu gewährleisten
  
  optimalDays.forEach((optimalDay, index) => {
    if (index < oldDayNames.length) {
      newDays[optimalDay] = [...plan.days[oldDayNames[index]]];
    }
  });
  
  // Aktualisiere die Beschreibung
  const updatedDescription = `Trainingsplan für ${
    plan.description.includes("Gewichtsabnahme") ? "Gewichtsabnahme" : 
    plan.description.includes("Muskelaufbau") ? "Muskelaufbau" : 
    "Gewichtserhaltung"
  } (${frequency}x pro Woche)`;
  
  // Erstelle aktualisierten Plan
  return {
    ...plan,
    description: updatedDescription,
    days: newDays
  };
};
