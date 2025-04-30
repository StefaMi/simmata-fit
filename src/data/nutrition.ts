
import { NutritionEntry } from "@/types";

export const nutritionDatabase: NutritionEntry[] = [
  // Frühstück
  {
    id: "n1",
    name: "Haferflocken mit Beeren",
    calories: 350,
    protein: 12,
    carbs: 45,
    fat: 10,
    date: "",
    mealType: "breakfast"
  },
  {
    id: "n2",
    name: "Rührei mit Vollkorntoast",
    calories: 420,
    protein: 22,
    carbs: 30,
    fat: 18,
    date: "",
    mealType: "breakfast"
  },
  {
    id: "n3",
    name: "Griechischer Joghurt mit Honig und Nüssen",
    calories: 380,
    protein: 18,
    carbs: 25,
    fat: 15,
    date: "",
    mealType: "breakfast"
  },
  
  // Mittagessen
  {
    id: "n4",
    name: "Hähnchenbrust mit Quinoa und Gemüse",
    calories: 450,
    protein: 35,
    carbs: 40,
    fat: 12,
    date: "",
    mealType: "lunch"
  },
  {
    id: "n5",
    name: "Thunfisch-Salat mit Olivenöl",
    calories: 380,
    protein: 30,
    carbs: 15,
    fat: 18,
    date: "",
    mealType: "lunch"
  },
  {
    id: "n6",
    name: "Linsensuppe mit Vollkornbrot",
    calories: 400,
    protein: 18,
    carbs: 50,
    fat: 10,
    date: "",
    mealType: "lunch"
  },
  
  // Abendessen
  {
    id: "n7",
    name: "Lachs mit Süßkartoffeln und Brokkoli",
    calories: 480,
    protein: 32,
    carbs: 35,
    fat: 20,
    date: "",
    mealType: "dinner"
  },
  {
    id: "n8",
    name: "Rindfleisch-Stir-Fry mit braunem Reis",
    calories: 520,
    protein: 38,
    carbs: 45,
    fat: 18,
    date: "",
    mealType: "dinner"
  },
  {
    id: "n9",
    name: "Tofu mit Gemüse und Vollkornnudeln",
    calories: 400,
    protein: 22,
    carbs: 48,
    fat: 12,
    date: "",
    mealType: "dinner"
  },
  
  // Snacks
  {
    id: "n10",
    name: "Proteinshake",
    calories: 200,
    protein: 25,
    carbs: 10,
    fat: 5,
    date: "",
    mealType: "snack"
  },
  {
    id: "n11",
    name: "Apfel mit Mandelbutter",
    calories: 180,
    protein: 5,
    carbs: 20,
    fat: 10,
    date: "",
    mealType: "snack"
  },
  {
    id: "n12",
    name: "Hüttenkäse mit Gemüsesticks",
    calories: 150,
    protein: 18,
    carbs: 8,
    fat: 5,
    date: "",
    mealType: "snack"
  }
];

export const getMealsByType = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'): NutritionEntry[] => {
  return nutritionDatabase.filter(meal => meal.mealType === mealType);
};

export const getMealById = (id: string): NutritionEntry | undefined => {
  return nutritionDatabase.find(meal => meal.id === id);
};
