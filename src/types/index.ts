
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
  equipmentType?: 'bodyweight' | 'dumbbells' | 'barbell' | 'machine' | 'other';
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

// Typen für Atem- & Fokus-Übungen
export type FocusExercise = {
  id: string;
  name: string;
  description: string;
  duration: number; // in Sekunden
  type: 'breathing' | 'meditation' | 'focus' | 'nesma';
  instructions: string;
  videoUrl?: string;
};

// Typen für Progress-Tracking
export type ProgressEntry = {
  id: string;
  date: string;
  weight: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    thighs?: number;
    arms?: number;
  };
  notes?: string;
  workoutCompleted?: boolean;
  nutritionCompleted?: boolean;
};

// Typen für Motivations-Zitate
export type MotivationalQuote = {
  id: string;
  quoteAssyrian: string;
  quoteGerman: string;
  author?: string;
};

// Typen für Musik-Integration
export type MusicProvider = 'spotify' | 'apple';

export type MusicPlaylist = {
  id: string;
  name: string;
  provider: MusicProvider;
  url: string;
  imageUrl?: string;
  description?: string;
};
