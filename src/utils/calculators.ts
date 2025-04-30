
import { UserProfile, BodyPart, WorkoutPlan, NutritionPlan, Exercise, NutritionEntry } from "@/types";
import { getExercisesByBodyPart } from "@/data/exercises";
import { getMealsByType } from "@/data/nutrition";

// Berechnet den Grundumsatz (BMR) basierend auf Harris-Benedict-Gleichung
export const calculateBMR = (profile: UserProfile): number => {
  if (profile.gender === "male") {
    return 88.362 + (13.397 * profile.currentWeight) + (4.799 * profile.height) - (5.677 * profile.age);
  } else {
    return 447.593 + (9.247 * profile.currentWeight) + (3.098 * profile.height) - (4.330 * profile.age);
  }
};

// Berechnet den täglichen Kalorienbedarf
export const calculateTDEE = (profile: UserProfile): number => {
  const bmr = calculateBMR(profile);
  
  // Aktivitätsfaktor
  const activityFactors: { [key: string]: number } = {
    sedentary: 1.2,     // Minimal oder keine Bewegung
    light: 1.375,       // Leichte Aktivität (1-3 mal pro Woche)
    moderate: 1.55,     // Mäßige Aktivität (3-5 mal pro Woche)
    active: 1.725,      // Hohe Aktivität (6-7 mal pro Woche)
    veryActive: 1.9     // Sehr hohe Aktivität (2x täglich, sehr intensiv)
  };
  
  return Math.round(bmr * activityFactors[profile.activityLevel]);
};

// Berechnet den Kalorienzielbedarf basierend auf dem Ziel des Nutzers
export const calculateCalorieTarget = (profile: UserProfile): number => {
  const tdee = calculateTDEE(profile);
  
  switch (profile.goal) {
    case "lose":
      return Math.round(tdee * 0.8); // 20% Kaloriendefizit zum Abnehmen
    case "gain":
      return Math.round(tdee * 1.15); // 15% Kalorienüberschuss zum Zunehmen
    case "maintain":
    default:
      return tdee;
  }
};

// Berechnet die Makronährstoffverteilung
export const calculateMacros = (profile: UserProfile): { protein: number, carbs: number, fat: number } => {
  const calorieTarget = calculateCalorieTarget(profile);
  
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  
  switch (profile.goal) {
    case "lose":
      // Höherer Proteinanteil zum Muskelerhalt während der Diät
      protein = Math.round((calorieTarget * 0.35) / 4); // 35% Protein, 4 kcal pro Gramm
      fat = Math.round((calorieTarget * 0.3) / 9);      // 30% Fett, 9 kcal pro Gramm
      carbs = Math.round((calorieTarget * 0.35) / 4);   // 35% Kohlenhydrate, 4 kcal pro Gramm
      break;
    case "gain":
      // Höherer Kohlenhydratanteil für Training und Muskelaufbau
      protein = Math.round((calorieTarget * 0.3) / 4);  // 30% Protein
      fat = Math.round((calorieTarget * 0.25) / 9);     // 25% Fett
      carbs = Math.round((calorieTarget * 0.45) / 4);   // 45% Kohlenhydrate
      break;
    case "maintain":
    default:
      // Ausgewogene Verteilung
      protein = Math.round((calorieTarget * 0.3) / 4);  // 30% Protein
      fat = Math.round((calorieTarget * 0.3) / 9);      // 30% Fett
      carbs = Math.round((calorieTarget * 0.4) / 4);    // 40% Kohlenhydrate
      break;
  }
  
  return { protein, carbs, fat };
};

// Erstellt einen Trainingsplan basierend auf den gewählten Körperteilen
export const createWorkoutPlan = (bodyParts: BodyPart[], profile: UserProfile): WorkoutPlan => {
  const workoutFrequency = determineWorkoutFrequency(profile);
  const exercises: Exercise[] = [];
  
  // Übungen für jedes gewählte Körperteil sammeln
  bodyParts.forEach(bodyPart => {
    const bodyPartExercises = getExercisesByBodyPart(bodyPart);
    exercises.push(...bodyPartExercises.slice(0, 2)); // Nimm bis zu 2 Übungen pro Körperteil
  });
  
  // Trainingstage erstellen
  const days: { [key: string]: Exercise[] } = {};
  const daysOfWeek = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
  
  // Verteile die Übungen auf die Trainingstage
  for (let i = 0; i < workoutFrequency; i++) {
    const dayExercises: Exercise[] = [];
    const exercisesPerDay = Math.ceil(exercises.length / workoutFrequency);
    const startIndex = i * exercisesPerDay;
    const endIndex = Math.min((i + 1) * exercisesPerDay, exercises.length);
    
    for (let j = startIndex; j < endIndex; j++) {
      if (exercises[j]) {
        dayExercises.push(exercises[j]);
      }
    }
    
    days[daysOfWeek[i]] = dayExercises;
  }
  
  return {
    id: "wp" + Date.now().toString(),
    name: "Personalisierter Trainingsplan",
    description: `Trainingsplan für ${profile.goal === "lose" ? "Gewichtsabnahme" : profile.goal === "gain" ? "Muskelaufbau" : "Gewichtserhaltung"}`,
    frequency: workoutFrequency,
    exercises: exercises,
    days: days
  };
};

// Bestimmt die optimale Trainingshäufigkeit basierend auf dem Nutzerprofil
const determineWorkoutFrequency = (profile: UserProfile): number => {
  switch (profile.activityLevel) {
    case "sedentary":
      return 3; // 3 Tage pro Woche für Anfänger
    case "light":
      return 4; // 4 Tage pro Woche für leicht Aktive
    case "moderate":
      return 5; // 5 Tage pro Woche für mäßig Aktive
    case "active":
    case "veryActive":
      return 6; // 6 Tage pro Woche für sehr Aktive
    default:
      return 4;
  }
};

// Erstellt einen Ernährungsplan basierend auf dem Nutzerprofil
export const createNutritionPlan = (profile: UserProfile): NutritionPlan => {
  const calorieTarget = calculateCalorieTarget(profile);
  const macros = calculateMacros(profile);
  
  // Mahlzeiten aus der Datenbank abrufen
  const breakfast = getMealsByType("breakfast");
  const lunch = getMealsByType("lunch");
  const dinner = getMealsByType("dinner");
  const snacks = getMealsByType("snack");
  
  // Mahlzeiten auswählen, die am besten zum Kalorienziel passen
  const selectedBreakfast = selectBestMeal(breakfast, calorieTarget * 0.25);
  const selectedLunch = selectBestMeal(lunch, calorieTarget * 0.35);
  const selectedDinner = selectBestMeal(dinner, calorieTarget * 0.3);
  const selectedSnack = selectBestMeal(snacks, calorieTarget * 0.1);
  
  // Erstellen des Ernährungsplans
  const meals: { [key: string]: NutritionEntry[] } = {
    "Frühstück": [selectedBreakfast],
    "Mittagessen": [selectedLunch],
    "Abendessen": [selectedDinner],
    "Snack": [selectedSnack]
  };
  
  return {
    id: "np" + Date.now().toString(),
    name: "Personalisierter Ernährungsplan",
    description: `Ernährungsplan für ${profile.goal === "lose" ? "Gewichtsabnahme" : profile.goal === "gain" ? "Muskelaufbau" : "Gewichtserhaltung"}`,
    dailyCalories: calorieTarget,
    proteinTarget: macros.protein,
    carbsTarget: macros.carbs,
    fatTarget: macros.fat,
    meals: meals
  };
};

// Wählt die Mahlzeit aus, die am besten zum Kalorienziel passt
const selectBestMeal = (meals: NutritionEntry[], calorieTarget: number): NutritionEntry => {
  return meals.reduce((best, current) => {
    return Math.abs(current.calories - calorieTarget) < Math.abs(best.calories - calorieTarget)
      ? current
      : best;
  }, meals[0]);
};
