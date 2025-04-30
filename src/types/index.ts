
// Typen für die Benutzerprofile
export type UserProfile = {
  id: string;
  age: number;
  height: number;
  currentWeight: number;
  targetWeight: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  goal: 'lose' | 'maintain' | 'gain';
};

// Typen für Ernährungsdaten
export type NutritionEntry = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
};

// Typen für Körperteile
export type BodyPart = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'legs' | 'abs' | 'cardio';

// Typen für Übungen
export type Exercise = {
  id: string;
  name: string;
  bodyPart: BodyPart;
  description: string;
  videoUrl: string;
  sets: number;
  reps: number;
  restTime: number;
};

// Typen für Trainingspläne
export type WorkoutPlan = {
  id: string;
  name: string;
  description: string;
  frequency: number;
  exercises: Exercise[];
  days: {
    [key: string]: Exercise[];
  };
};

// Typen für Ernährungspläne
export type NutritionPlan = {
  id: string;
  name: string;
  description: string;
  dailyCalories: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  meals: {
    [key: string]: NutritionEntry[];
  };
};
