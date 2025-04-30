
import Layout from "@/components/Layout";
import FocusExercises from "@/components/FocusExercises";
import DailyQuote from "@/components/DailyQuote";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind } from "lucide-react";

const FocusPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Fokus & Achtsamkeit</h1>
        
        {/* Daily Quote */}
        <DailyQuote />
        
        {/* Focus Exercises */}
        <FocusExercises />
        
        {/* Information about Nesma */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-fitness-primary" />
              Über Nesma
            </CardTitle>
            <CardDescription>
              Die traditionellen assyrischen Fokus- und Atemtechniken
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Nesma ist ein traditionelles assyrisches Konzept, das Atemübungen, 
              Meditation und Konzentrationstechniken kombiniert. Diese Praktiken wurden über 
              Generationen weitergegeben, um körperliche und geistige Gesundheit zu fördern.
            </p>
            <p className="text-muted-foreground mt-4">
              Die hier vorgestellten Übungen sind von diesen traditionellen Techniken 
              inspiriert und unterstützen dich dabei, Stress abzubauen, deine Konzentration 
              zu verbessern und eine tiefere Verbindung zwischen Körper und Geist herzustellen.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FocusPage;
