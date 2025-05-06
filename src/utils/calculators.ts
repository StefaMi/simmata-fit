
import { UserProfile, NutritionPlan, DietaryPreference, WorkoutPlan, BodyPart, Exercise } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { nutritionDatabase, getMealsByType } from "@/data/nutrition";
import { generateWeeklyWorkoutPlan } from "@/utils/weeklyPlanGenerator";

// This function was added to export createWorkoutPlan and now includes our weekly plan generator
export const createWorkoutPlan = (selectedBodyParts: BodyPart[], userProfile: UserProfile): WorkoutPlan => {
  console.log("Creating workout plan for:", selectedBodyParts, userProfile);
  
  // Use a default frequency since workoutFrequency doesn't exist in UserProfile
  const frequency = 5; // Default to 5 days per week
  
  // Generate the workout plan using the weekly plan generator
  const workoutPlan = generateWeeklyWorkoutPlan(selectedBodyParts, userProfile, frequency);
  
  console.log("Generated workout plan:", workoutPlan);
  
  return workoutPlan;
};

// Berechnet den täglichen Kalorienbedarf basierend auf dem Profil
export const calculateDailyCalories = (profile: UserProfile): number => {
  // Harris-Benedict-Formel für den Grundumsatz (BMR)
  let bmr = 0;
  
  if (profile.gender === "male") {
    bmr = 88.362 + (13.397 * profile.currentWeight) + (4.799 * profile.height) - (5.677 * profile.age);
  } else {
    bmr = 447.593 + (9.247 * profile.currentWeight) + (3.098 * profile.height) - (4.330 * profile.age);
  }
  
  // Multiplikator basierend auf dem Aktivitätslevel
  const activityMultiplier = {
    sedentary: 1.2, // Sitzende Tätigkeit mit wenig oder keiner Übung
    light: 1.375, // Leichte Übung 1-3 Tage pro Woche
    moderate: 1.55, // Moderate Übung 3-5 Tage pro Woche
    active: 1.725, // Starkes Training 6-7 Tage pro Woche
    veryActive: 1.9 // Sehr intensives Training, körperliche Arbeit oder 2x Training pro Tag
  };
  
  // Täglicher Kalorienbedarf zum Gewichthalten
  const maintenanceCalories = bmr * activityMultiplier[profile.activityLevel];
  
  // Kalorienanpassung basierend auf dem Ziel
  let dailyCalories = maintenanceCalories;
  
  if (profile.goal === "lose") {
    // Kaloriendefizit für Gewichtsverlust (etwa 500 kcal pro Tag für 0,5 kg pro Woche)
    dailyCalories = maintenanceCalories - 500;
  } else if (profile.goal === "gain") {
    // Kalorienüberschuss für Gewichtszunahme (etwa 300-500 kcal pro Tag)
    dailyCalories = maintenanceCalories + 300;
  }
  
  // Runde auf eine ganze Zahl
  return Math.round(dailyCalories);
};

// Erstellt einen personalisierten Ernährungsplan basierend auf dem Profil
export const createNutritionPlan = (
  profile: UserProfile, 
  dietaryPreferences: DietaryPreference[] = []
): NutritionPlan => {
  // Berechne täglichen Kalorienbedarf
  const dailyCalories = calculateDailyCalories(profile);
  
  // Makronährstoffaufteilung basierend auf dem Ziel
  let proteinPercentage = 0.30; // 30% Protein als Basis
  let fatPercentage = 0.30; // 30% Fett als Basis
  let carbsPercentage = 0.40; // 40% Kohlenhydrate als Basis
  
  // Passe Makronährstoff-Verhältnis basierend auf dem Ziel an
  if (profile.goal === "lose") {
    proteinPercentage = 0.35; // Erhöhe Protein beim Abnehmen
    fatPercentage = 0.30;
    carbsPercentage = 0.35; // Reduziere Kohlenhydrate beim Abnehmen
  } else if (profile.goal === "gain") {
    proteinPercentage = 0.30;
    fatPercentage = 0.25; // Reduziere Fett beim Zunehmen
    carbsPercentage = 0.45; // Erhöhe Kohlenhydrate beim Zunehmen
  }
  
  // Anpassen der Makros basierend auf Ernährungsvorlieben
  if (dietaryPreferences.includes("low_carb")) {
    carbsPercentage = 0.25;
    proteinPercentage = 0.35;
    fatPercentage = 0.40;
  }
  
  if (dietaryPreferences.includes("keto")) {
    carbsPercentage = 0.1;
    proteinPercentage = 0.3;
    fatPercentage = 0.6;
  }
  
  if (dietaryPreferences.includes("vegan") || dietaryPreferences.includes("vegetarian")) {
    // Pflanzliche Ernährung kann etwas weniger Protein und mehr Kohlenhydrate haben
    proteinPercentage = 0.25;
    carbsPercentage = carbsPercentage + 0.05;
  }
  
  // Berechne die Makronährstoffziele in Gramm
  const proteinTarget = Math.round((dailyCalories * proteinPercentage) / 4); // 4 kcal pro Gramm Protein
  const carbsTarget = Math.round((dailyCalories * carbsPercentage) / 4); // 4 kcal pro Gramm Kohlenhydrate
  const fatTarget = Math.round((dailyCalories * fatPercentage) / 9); // 9 kcal pro Gramm Fett
  
  // Filter Gerichte basierend auf Ernährungsvorlieben
  const filteredMeals = [...nutritionDatabase].filter(meal => {
    // Wenn vegetarisch ausgewählt, keine Fleisch- oder Fischgerichte
    if (dietaryPreferences.includes("vegetarian") && 
        (meal.name.toLowerCase().includes("fleisch") || 
         meal.name.toLowerCase().includes("hähnchen") || 
         meal.name.toLowerCase().includes("fisch") ||
         meal.name.toLowerCase().includes("lachs") ||
         meal.name.toLowerCase().includes("thunfisch") ||
         meal.name.toLowerCase().includes("rindfleisch"))) {
      return false;
    }
    
    // Wenn vegan ausgewählt, keine tierischen Produkte
    if (dietaryPreferences.includes("vegan") && 
        (meal.name.toLowerCase().includes("fleisch") || 
         meal.name.toLowerCase().includes("hähnchen") || 
         meal.name.toLowerCase().includes("fisch") ||
         meal.name.toLowerCase().includes("ei") ||
         meal.name.toLowerCase().includes("joghurt") ||
         meal.name.toLowerCase().includes("käse") ||
         meal.name.toLowerCase().includes("milch") ||
         meal.name.toLowerCase().includes("lachs") ||
         meal.name.toLowerCase().includes("thunfisch") ||
         meal.name.toLowerCase().includes("rindfleisch"))) {
      return false;
    }
    
    return true;
  });
  
  // Erstelle einen personalisierten Plan basierend auf den gefilterten Gerichten
  const breakfast = getRandomMeals(filteredMeals.filter(meal => meal.mealType === "breakfast"), 2);
  const lunch = getRandomMeals(filteredMeals.filter(meal => meal.mealType === "lunch"), 2);
  const dinner = getRandomMeals(filteredMeals.filter(meal => meal.mealType === "dinner"), 2);
  const snacks = getRandomMeals(filteredMeals.filter(meal => meal.mealType === "snack"), 2);
  
  // Erstelle den Plan
  const plan: NutritionPlan = {
    id: uuidv4(),
    name: "Dein personalisierter Ernährungsplan",
    description: getDescription(profile, dietaryPreferences),
    dailyCalories,
    proteinTarget,
    carbsTarget,
    fatTarget,
    meals: {
      Frühstück: breakfast,
      Mittagessen: lunch,
      Abendessen: dinner,
      Snacks: snacks
    },
    dietaryPreferences: dietaryPreferences
  };
  
  return plan;
};

// Generiert Beschreibung basierend auf Profil und Vorlieben
const getDescription = (profile: UserProfile, dietaryPreferences: DietaryPreference[]): string => {
  let description = `Personalisierter ${profile.goal === "lose" ? "Abnehm" : profile.goal === "gain" ? "Aufbau" : "Erhaltungs"}plan`;
  
  if (dietaryPreferences.length > 0) {
    description += " mit ";
    
    if (dietaryPreferences.includes("vegan")) {
      description += "veganer Ernährung";
    } else if (dietaryPreferences.includes("vegetarian")) {
      description += "vegetarischer Ernährung";
    } else {
      const prefLabels = {
        meat: "Fleisch",
        poultry: "Geflügel",
        fish: "Fisch",
        eggs: "Eiern",
        gluten_free: "glutenfreien Optionen",
        lactose_free: "laktosefreien Optionen",
        low_carb: "wenig Kohlenhydraten",
        keto: "Keto-Ansatz",
        paleo: "Paleo-Fokus"
      };
      
      const prefsText = dietaryPreferences
        .filter(pref => prefLabels[pref])
        .map(pref => prefLabels[pref])
        .join(", ");
      
      if (prefsText) {
        description += prefsText;
      }
    }
  }
  
  return description;
};

// Hilfsfunktion um zufällige Mahlzeiten zu erhalten
const getRandomMeals = (meals: any[], count: number) => {
  const shuffled = [...meals].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
