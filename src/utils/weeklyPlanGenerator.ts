import { BodyPart, Exercise, WorkoutPlan } from "@/types";
import { exercises, getExercisesByBodyPart } from "@/data/exercises";
import { v4 as uuidv4 } from "uuid";

// Define the muscle group combinations for each day of the week
type MuscleGroupSchedule = {
  [key: string]: BodyPart[];
};

const DEFAULT_SCHEDULE: MuscleGroupSchedule = {
  "Montag": ["chest", "triceps"],
  "Dienstag": ["back", "biceps"],
  "Mittwoch": ["legs"],
  "Donnerstag": ["shoulders", "abs"],
  "Freitag": ["abs", "cardio"],
  "Samstag": ["cardio"],
  "Sonntag": []  // Rest day
};

/**
 * Generates a weekly workout plan based on selected muscle groups
 * @param selectedMuscleGroups - The muscle groups selected by the user
 * @param userProfile - The user's profile for personalization
 * @returns A workout plan with exercises distributed across the week
 */
export const generateWeeklyWorkoutPlan = (
  selectedMuscleGroups: BodyPart[],
  userProfile: any,
  frequency = 5  // Default to 5 days per week
): WorkoutPlan => {
  console.log("Generating weekly plan with muscle groups:", selectedMuscleGroups);
  
  // Create the basic workout plan structure
  const plan: WorkoutPlan = {
    id: uuidv4(),
    name: "Personalisierter Wochenplan",
    description: `Wochentrainingsplan für ${userProfile?.firstName || ''} mit Fokus auf ${selectedMuscleGroups.join(', ')}`,
    frequency: frequency,
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
  
  // Keep track of used exercises to avoid duplicates
  const usedExerciseIds = new Set<string>();
  
  // Filter the schedule to only include days with selected muscle groups
  const filteredSchedule: MuscleGroupSchedule = {};
  let availableDays = Object.keys(DEFAULT_SCHEDULE);
  
  // First, determine which days should be included based on the selected muscle groups
  for (const day of availableDays) {
    const dayMuscleGroups = DEFAULT_SCHEDULE[day];
    const hasSelectedGroups = dayMuscleGroups.some(group => selectedMuscleGroups.includes(group));
    
    if (hasSelectedGroups || dayMuscleGroups.length === 0) {  // Include rest days
      filteredSchedule[day] = dayMuscleGroups.filter(group => selectedMuscleGroups.includes(group));
    }
  }
  
  // Adjust the days based on the requested frequency
  const scheduleDays = Object.keys(filteredSchedule);
  if (scheduleDays.length > frequency) {
    // If we have more days than the frequency allows, prioritize days with more muscle groups
    const daysByPriority = scheduleDays
      .map(day => ({ day, priority: filteredSchedule[day].length }))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, frequency)
      .map(item => item.day);
    
    // Update the filtered schedule
    for (const day of scheduleDays) {
      if (!daysByPriority.includes(day)) {
        delete filteredSchedule[day];
      }
    }
  }
  
  // Now assign exercises to each day
  for (const day in filteredSchedule) {
    const muscleGroups = filteredSchedule[day];
    
    if (muscleGroups.length === 0) {
      // This is a rest day, so we don't add exercises
      continue;
    }
    
    for (const muscleGroup of muscleGroups) {
      // Get exercises for this muscle group that haven't been used yet
      let availableExercises = getExercisesByBodyPart(muscleGroup)
        .filter(ex => !usedExerciseIds.has(ex.id));
      
      // If we don't have enough exercises, get any exercises for this muscle group
      if (availableExercises.length < 2) {
        availableExercises = getExercisesByBodyPart(muscleGroup);
        console.log(`Not enough unused exercises for ${muscleGroup}, reusing some exercises`);
      }
      
      // Select 2-3 exercises per muscle group
      const numExercises = Math.min(3, availableExercises.length);
      const selectedExercises = availableExercises
        .sort(() => 0.5 - Math.random()) // Shuffle exercises
        .slice(0, numExercises);
      
      // Add the selected exercises to the plan
      for (const exercise of selectedExercises) {
        usedExerciseIds.add(exercise.id);
        plan.exercises.push(exercise);
        plan.days[day].push(exercise);
      }
    }
    
    // If there are too few exercises for a day, add generic exercises or note
    if (plan.days[day].length < 2 && muscleGroups.length > 0) {
      const generatedExercises = generateFallbackExercises(muscleGroups[0], 2 - plan.days[day].length);
      for (const exercise of generatedExercises) {
        plan.exercises.push(exercise);
        plan.days[day].push(exercise);
      }
    }
  }
  
  // Save recently used exercises to localStorage to avoid repetition in future plans
  const recentlyUsedExercises = Array.from(usedExerciseIds);
  localStorage.setItem("recentlyUsedExercises", JSON.stringify(recentlyUsedExercises));
  
  return plan;
};

/**
 * Generates fallback exercises when there are not enough specific ones
 */
const generateFallbackExercises = (muscleGroup: BodyPart, count: number): Exercise[] => {
  const fallbackExercises: Exercise[] = [];
  
  for (let i = 0; i < count; i++) {
    fallbackExercises.push({
      id: uuidv4(),
      name: `Zusätzliche ${translateMuscleGroup(muscleGroup)}-Übung ${i + 1}`,
      bodyPart: muscleGroup,
      description: "Diese Übung wurde automatisch hinzugefügt, da nicht genügend spezifische Übungen für diese Muskelgruppe verfügbar waren.",
      videoUrl: "https://www.youtube.com/watch?v=example",
      sets: 3,
      reps: 12,
      restTime: 60,
      equipmentType: "bodyweight"
    });
  }
  
  return fallbackExercises;
};

/**
 * Translates muscle group names to German for display
 */
const translateMuscleGroup = (muscleGroup: BodyPart): string => {
  const translations: Record<BodyPart, string> = {
    chest: "Brust",
    back: "Rücken",
    shoulders: "Schultern",
    biceps: "Bizeps",
    triceps: "Trizeps",
    legs: "Beine",
    abs: "Bauch",
    cardio: "Kardio"
  };
  
  return translations[muscleGroup] || muscleGroup;
};
