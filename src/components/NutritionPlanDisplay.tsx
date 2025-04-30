
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NutritionPlan, NutritionEntry } from "@/types";
import { Scale, Heart, Activity } from "lucide-react";

type NutritionPlanDisplayProps = {
  nutritionPlan: NutritionPlan;
};

const NutritionPlanDisplay = ({ nutritionPlan }: NutritionPlanDisplayProps) => {
  const mealTypes = Object.keys(nutritionPlan.meals);

  // Berechne die gesamten Makronährstoffe für den Tag
  const totalCalories = Object.values(nutritionPlan.meals)
    .flat()
    .reduce((acc, meal) => acc + meal.calories, 0);

  const totalProtein = Object.values(nutritionPlan.meals)
    .flat()
    .reduce((acc, meal) => acc + meal.protein, 0);

  const totalCarbs = Object.values(nutritionPlan.meals)
    .flat()
    .reduce((acc, meal) => acc + meal.carbs, 0);

  const totalFat = Object.values(nutritionPlan.meals)
    .flat()
    .reduce((acc, meal) => acc + meal.fat, 0);

  // Berechne Prozentsätze für die Fortschrittsbalken
  const caloriePercentage = Math.min(
    (totalCalories / nutritionPlan.dailyCalories) * 100,
    100
  );
  const proteinPercentage = Math.min(
    (totalProtein / nutritionPlan.proteinTarget) * 100,
    100
  );
  const carbsPercentage = Math.min(
    (totalCarbs / nutritionPlan.carbsTarget) * 100,
    100
  );
  const fatPercentage = Math.min(
    (totalFat / nutritionPlan.fatTarget) * 100,
    100
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Scale className="h-6 w-6 text-fitness-primary" />
          {nutritionPlan.name}
        </CardTitle>
        <CardDescription>{nutritionPlan.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tagesbedarf</CardTitle>
              <CardDescription>
                Dein täglicher Kalorienbedarf und Makronährstoffziele
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <Activity className="h-4 w-4 mr-1 text-fitness-primary" />
                    Kalorien
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {totalCalories} / {nutritionPlan.dailyCalories} kcal
                  </span>
                </div>
                <Progress
                  value={caloriePercentage}
                  className="h-2 bg-slate-200"
                  indicatorClassName="bg-fitness-primary"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Protein</span>
                  <span className="text-sm text-muted-foreground">
                    {totalProtein} / {nutritionPlan.proteinTarget} g
                  </span>
                </div>
                <Progress
                  value={proteinPercentage}
                  className="h-2 bg-slate-200"
                  indicatorClassName="bg-fitness-success"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Kohlenhydrate</span>
                  <span className="text-sm text-muted-foreground">
                    {totalCarbs} / {nutritionPlan.carbsTarget} g
                  </span>
                </div>
                <Progress
                  value={carbsPercentage}
                  className="h-2 bg-slate-200"
                  indicatorClassName="bg-fitness-warning"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Fett</span>
                  <span className="text-sm text-muted-foreground">
                    {totalFat} / {nutritionPlan.fatTarget} g
                  </span>
                </div>
                <Progress
                  value={fatPercentage}
                  className="h-2 bg-slate-200"
                  indicatorClassName="bg-fitness-accent"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Makroverteilung</CardTitle>
              <CardDescription>
                Prozentuale Verteilung deiner Makronährstoffe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40">
                <div className="flex space-x-4">
                  {/* Vereinfachte Darstellung der Makroverteilung als Balkendiagramm */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-10 bg-fitness-success rounded-t"
                      style={{
                        height: `${(nutritionPlan.proteinTarget * 4 / nutritionPlan.dailyCalories) * 100}px`,
                      }}
                    ></div>
                    <p className="text-xs mt-2 font-medium">Protein</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(
                        (nutritionPlan.proteinTarget * 4 / nutritionPlan.dailyCalories) * 100
                      )}%
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-10 bg-fitness-warning rounded-t"
                      style={{
                        height: `${(nutritionPlan.carbsTarget * 4 / nutritionPlan.dailyCalories) * 100}px`,
                      }}
                    ></div>
                    <p className="text-xs mt-2 font-medium">Kohlen.</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(
                        (nutritionPlan.carbsTarget * 4 / nutritionPlan.dailyCalories) * 100
                      )}%
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-10 bg-fitness-accent rounded-t"
                      style={{
                        height: `${(nutritionPlan.fatTarget * 9 / nutritionPlan.dailyCalories) * 100}px`,
                      }}
                    ></div>
                    <p className="text-xs mt-2 font-medium">Fett</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(
                        (nutritionPlan.fatTarget * 9 / nutritionPlan.dailyCalories) * 100
                      )}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue={mealTypes[0]}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            {mealTypes.map((mealType) => (
              <TabsTrigger key={mealType} value={mealType}>
                {mealType}
              </TabsTrigger>
            ))}
          </TabsList>

          {mealTypes.map((mealType) => (
            <TabsContent key={mealType} value={mealType}>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{mealType}</h3>
                {nutritionPlan.meals[mealType].map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Dieser Ernährungsplan ist auf deine individuellen Ziele und Bedürfnisse abgestimmt.
          Achte auf regelmäßige Mahlzeiten und eine ausreichende Flüssigkeitszufuhr.
        </p>
      </CardFooter>
    </Card>
  );
};

const MealCard = ({ meal }: { meal: NutritionEntry }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h4 className="text-md font-semibold">{meal.name}</h4>
            <div className="flex flex-wrap gap-x-4 mt-2">
              <div className="text-sm">
                <span className="text-fitness-primary">{meal.calories}</span>{" "}
                <span className="text-muted-foreground">kcal</span>
              </div>
              <div className="text-sm">
                <span className="text-fitness-success">{meal.protein}</span>{" "}
                <span className="text-muted-foreground">g Protein</span>
              </div>
              <div className="text-sm">
                <span className="text-fitness-warning">{meal.carbs}</span>{" "}
                <span className="text-muted-foreground">g Kohlenhydrate</span>
              </div>
              <div className="text-sm">
                <span className="text-fitness-accent">{meal.fat}</span>{" "}
                <span className="text-muted-foreground">g Fett</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionPlanDisplay;
