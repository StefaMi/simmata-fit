
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { ChevronDown, Search, ArrowRight, Play } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Activity Card Component
const ActivityCard = ({ 
  title, 
  imageUrl, 
  duration, 
  trainer,
  onClick
}: { 
  title: string; 
  imageUrl?: string; 
  duration: string;
  trainer?: string;
  onClick?: () => void;
}) => {
  return (
    <div 
      className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-card"
      onClick={onClick}
    >
      <AspectRatio ratio={16/9}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <p className="text-muted-foreground">Kein Bild verfügbar</p>
          </div>
        )}
      </AspectRatio>
      <div className="p-4">
        <h3 className="font-medium">{title}</h3>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-muted-foreground">
            {duration}
            {trainer && ` • ${trainer}`}
          </span>
          <Play className="h-4 w-4 text-primary" />
        </div>
      </div>
    </div>
  );
};

// Category Card Component
const CategoryCard = ({ 
  title, 
  imageUrl,
  onClick
}: { 
  title: string; 
  imageUrl?: string;
  onClick?: () => void;
}) => {
  return (
    <div 
      className="relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
      onClick={onClick}
    >
      <AspectRatio ratio={1/1}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <p className="text-lg font-medium">{title}</p>
          </div>
        )}
        <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-white font-medium">{title}</p>
        </div>
      </AspectRatio>
    </div>
  );
};

const WorkoutPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSavedPlan, setHasSavedPlan] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has a saved workout plan
    const checkSavedPlan = () => {
      const savedPlan = localStorage.getItem("workoutPlan");
      setHasSavedPlan(!!savedPlan);
    };
    
    // Simulate data loading
    const timer = setTimeout(() => {
      checkSavedPlan();
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCreatePlan = () => {
    navigate("/workout-builder");
  };
  
  const handleViewPlan = () => {
    navigate("/workout-dashboard");
  };

  const handleActivityClick = (activity: string) => {
    // For now just show an alert, but this could navigate to a detail page
    alert(`Du hast ${activity} ausgewählt. Diese Funktion wird bald verfügbar sein.`);
  };

  if (isLoading) {
    return (
      <Layout hideNav={false} showHeader={true} title="Rush">
        <div className="flex h-[80vh] w-full items-center justify-center">
          <LoadingSpinner size="lg" text="Wird geladen..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideNav={false} showHeader={true} title="Rush">
      <div className="space-y-8">
        {/* Search Bar */}
        <div className="flex items-center bg-card/60 backdrop-blur-md p-3 rounded-full border border-border">
          <Search className="h-5 w-5 text-muted-foreground mr-2" />
          <span className="text-muted-foreground">Für dich</span>
          <ChevronDown className="h-5 w-5 text-muted-foreground ml-auto" />
        </div>
        
        {/* Workout Plan Actions */}
        {hasSavedPlan ? (
          <Card className="backdrop-blur-md bg-background/80 border border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Dein Trainingsplan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Du hast bereits einen personalisierten Trainingsplan erstellt. Setze dein Training fort oder erstelle einen neuen Plan.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1" onClick={handleViewPlan}>
                  Trainingsplan fortsetzen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleCreatePlan}>
                  Neuen Plan erstellen
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="p-6 text-center border-b border-slate-700">
              <span className="text-[#b1fc31] uppercase text-sm font-medium">Eigene Pläne</span>
              <h2 className="text-2xl font-bold mt-1">Eigenen Plan erstellen</h2>
              <p className="text-muted-foreground mt-2 mb-4">
                Wähl deine Aktivitäten und leg Zeiten fest, um Woche für Woche motiviert zu bleiben.
              </p>
              <Button 
                className="bg-[#b1fc31] text-black hover:bg-[#9be619] w-full"
                onClick={handleCreatePlan}
              >
                Plan gestalten
              </Button>
            </div>
          </div>
        )}
        
        {/* Recommended Workouts */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Fang am besten hier an</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ActivityCard 
              title="Krafttraining mit Gregg" 
              imageUrl="/lovable-uploads/8544a0ed-1e92-42c6-bda4-3976577399cc.png"
              duration="20 Min"
              trainer="Gregg"
              onClick={() => handleActivityClick("Krafttraining mit Gregg")}
            />
            <ActivityCard 
              title="Florenz, Italien" 
              imageUrl="/lovable-uploads/253eff9b-492c-4eb5-974e-424a3d8faac8.png" 
              duration="32 Min"
              onClick={() => handleActivityClick("Florenz, Italien")}
            />
          </div>
        </div>
        
        {/* Activity Types */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Aktivitätsarten</h2>
          <div className="grid grid-cols-3 gap-4">
            <CategoryCard 
              title="Meditation" 
              imageUrl="/lovable-uploads/e395198b-0c17-4067-a3eb-b5f0173ccfc5.png"
              onClick={() => handleActivityClick("Meditation")}
            />
            <CategoryCard 
              title="Krafttraining" 
              imageUrl="/lovable-uploads/d27d3ec4-26d7-4e43-b940-bd39a9cceca9.png"
              onClick={() => handleActivityClick("Krafttraining")}
            />
            <CategoryCard 
              title="HIIT" 
              onClick={() => handleActivityClick("HIIT")}
            />
          </div>
        </div>
        
        {/* Achievements */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Auszeichnungen</h2>
          <div className="rounded-xl p-6 bg-card">
            <h3 className="text-lg font-medium">Bleibe am Ball und hole dir neue Auszeichnungen.</h3>
            <div className="mt-4 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
              <h4 className="font-medium">Wöchentliche "Rush"-Trainingsserie</h4>
              <p className="text-muted-foreground text-sm mt-1">Aktuelle Serie • 0 Wochen</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WorkoutPage;
