
import { UserProfile, NutritionPlan, DietaryPreference, WorkoutPlan, BodyPart, Exercise } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { nutritionDatabase, getMealsByType } from "@/data/nutrition";

// This function was added to export createWorkoutPlan
export const createWorkoutPlan = (bodyParts: BodyPart[], userProfile: UserProfile): WorkoutPlan => {
  console.log("Creating workout plan for body parts:", bodyParts);
  
  // Create a basic workout plan structure
  const plan: WorkoutPlan = {
    id: uuidv4(),
    name: "Dein personalisierter Trainingsplan",
    description: `Trainingsplan für ${userProfile.firstName || ''} mit Fokus auf ${bodyParts.join(', ')}`,
    frequency: 3, // Default to 3 times per week
    exercises: [],
    days: {
      "Montag": [],
      "Dienstag": [],
      "Mittwoch": [],
      "Donnerstag": [],
      "Freitag": [],
      "Samstag": [],
      "Sonntag": []
    }
  };
  
  // Default exercises for each body part
  const exercisesByBodyPart: Record<BodyPart, Exercise[]> = {
    chest: [
      {
        id: uuidv4(),
        name: "Liegestütze",
        bodyPart: "chest",
        description: "Standard Liegestütze für die Brustmuskeln",
        videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4",
        sets: 3,
        reps: 12,
        restTime: 60,
        equipmentType: "bodyweight"
      },
      {
        id: uuidv4(),
        name: "Bankdrücken",
        bodyPart: "chest",
        description: "Klassisches Bankdrücken mit Langhantel",
        videoUrl: "https://www.youtube.com/watch?v=rT7DgCr-3pg",
        sets: 4,
        reps: 8,
        restTime: 90,
        equipmentType: "barbell"
      }
    ],
    back: [
      {
        id: uuidv4(),
        name: "Klimmzüge",
        bodyPart: "back",
        description: "Grundübung für den Rücken",
        videoUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
        sets: 3,
        reps: 8,
        restTime: 90,
        equipmentType: "bodyweight"
      },
      {
        id: uuidv4(),
        name: "Rudern vorgebeugt",
        bodyPart: "back",
        description: "Vorgebeugtes Rudern mit Langhantel",
        videoUrl: "https://www.youtube.com/watch?v=kBWAon7ItDw",
        sets: 4,
        reps: 10,
        restTime: 60,
        equipmentType: "barbell"
      }
    ],
    legs: [
      {
        id: uuidv4(),
        name: "Kniebeugen",
        bodyPart: "legs",
        description: "Klassische Kniebeugen für die Beine",
        videoUrl: "https://www.youtube.com/watch?v=ultWZbUMPL8",
        sets: 4,
        reps: 10,
        restTime: 90,
        equipmentType: "bodyweight"
      },
      {
        id: uuidv4(),
        name: "Ausfallschritte",
        bodyPart: "legs",
        description: "Ausfallschritte für Beine und Po",
        videoUrl: "https://www.youtube.com/watch?v=QOVaHwm-Q6U",
        sets: 3,
        reps: 12,
        restTime: 60,
        equipmentType: "bodyweight"
      }
    ],
    shoulders: [
      {
        id: uuidv4(),
        name: "Schulterdrücken",
        bodyPart: "shoulders",
        description: "Schulterdrücken mit Kurzhanteln",
        videoUrl: "https://www.youtube.com/watch?v=qEwKCR5JCog",
        sets: 3,
        reps: 10,
        restTime: 60,
        equipmentType: "dumbbells"
      },
      {
        id: uuidv4(),
        name: "Seitheben",
        bodyPart: "shoulders",
        description: "Seitheben mit Kurzhanteln für die Schultern",
        videoUrl: "https://www.youtube.com/watch?v=3VcKaXpzqRo",
        sets: 3,
        reps: 12,
        restTime: 45,
        equipmentType: "dumbbells"
      }
    ],
    biceps: [
      {
        id: uuidv4(),
        name: "Bizeps Curls",
        bodyPart: "biceps",
        description: "Klassische Bizeps Curls mit Kurzhanteln",
        videoUrl: "https://www.youtube.com/watch?v=ykJmrZ5v0Oo",
        sets: 3,
        reps: 12,
        restTime: 60,
        equipmentType: "dumbbells"
      },
      {
        id: uuidv4(),
        name: "Hammercurls",
        bodyPart: "biceps",
        description: "Hammercurls für Bizeps und Unterarme",
        videoUrl: "https://www.youtube.com/watch?v=zC3nLlEvin4",
        sets: 3,
        reps: 10,
        restTime: 45,
        equipmentType: "dumbbells"
      }
    ],
    triceps: [
      {
        id: uuidv4(),
        name: "Dips",
        bodyPart: "triceps",
        description: "Dips für den Trizeps",
        videoUrl: "https://www.youtube.com/watch?v=6kALZikXxLc",
        sets: 3,
        reps: 10,
        restTime: 60,
        equipmentType: "bodyweight"
      },
      {
        id: uuidv4(),
        name: "Trizepsdrücken",
        bodyPart: "triceps",
        description: "Trizepsdrücken am Kabelzug",
        videoUrl: "https://www.youtube.com/watch?v=2-LAMcpzODU",
        sets: 3,
        reps: 12,
        restTime: 45,
        equipmentType: "machine"
      }
    ],
    abs: [
      {
        id: uuidv4(),
        name: "Crunches",
        bodyPart: "abs",
        description: "Klassische Crunches für die Bauchmuskeln",
        videoUrl: "https://www.youtube.com/watch?v=Xyd_fa5zoEU",
        sets: 3,
        reps: 15,
        restTime: 45,
        equipmentType: "bodyweight"
      },
      {
        id: uuidv4(),
        name: "Plank",
        bodyPart: "abs",
        description: "Unterarmstütz für die Körpermitte",
        videoUrl: "https://www.youtube.com/watch?v=pSHjTRCQxIw",
        sets: 3,
        reps: 30,
        restTime: 45,
        equipmentType: "bodyweight"
      }
    ],
    cardio: [
      {
        id: uuidv4(),
        name: "Laufen",
        bodyPart: "cardio",
        description: "Laufen für die Ausdauer",
        videoUrl: "https://www.youtube.com/watch?v=kje8U4gVjUY",
        sets: 1,
        reps: 20,
        restTime: 0,
        equipmentType: "bodyweight"
      },
      {
        id: uuidv4(),
        name: "Burpees",
        bodyPart: "cardio",
        description: "Burpees für Kraft und Ausdauer",
        videoUrl: "https://www.youtube.com/watch?v=tJrdJBWBu40",
        sets: 3,
        reps: 10,
        restTime: 30,
        equipmentType: "bodyweight"
      }
    ]
  };
  
  // Add exercises to the plan based on selected body parts
  let allExercises: Exercise[] = [];
  bodyParts.forEach(bodyPart => {
    const exercisesForPart = exercisesByBodyPart[bodyPart] || [];
    allExercises = [...allExercises, ...exercisesForPart];
  });
  
  // Sort exercises to ensure primary muscle groups are trained first
  allExercises.sort((a, b) => {
    // Prioritize compound exercises over isolation
    const compoundFirst = ["chest", "back", "legs"].indexOf(a.bodyPart) - 
                         ["chest", "back", "legs"].indexOf(b.bodyPart);
    return compoundFirst;
  });
  
  plan.exercises = allExercises;
  
  // Basic distribution: Split exercises over 3 days
  const weekDays = ["Montag", "Mittwoch", "Freitag"];
  let dayIndex = 0;
  
  allExercises.forEach(exercise => {
    const day = weekDays[dayIndex % weekDays.length];
    if (!plan.days[day]) {
      plan.days[day] = [];
    }
    plan.days[day].push(exercise);
    dayIndex++;
  });
  
  return plan;
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
