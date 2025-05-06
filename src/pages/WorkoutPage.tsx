
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { ChevronDown, Search } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useNavigate } from "react-router-dom";

// Activity Card Component
const ActivityCard = ({ 
  title, 
  imageUrl, 
  duration, 
  trainer 
}: { 
  title: string; 
  imageUrl?: string; 
  duration: string;
  trainer?: string;
}) => {
  return (
    <div className="workout-card">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={title} 
          className="workout-card-image"
        />
      ) : (
        <div className="workout-card-image bg-slate-800 flex items-center justify-center">
          <p className="text-muted-foreground">Kein Bild verfügbar</p>
        </div>
      )}
      <div className="workout-card-content">
        <h3 className="font-medium">{title}</h3>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-muted-foreground">
            {duration}
            {trainer && ` • ${trainer}`}
          </span>
        </div>
      </div>
    </div>
  );
};

// Category Card Component
const CategoryCard = ({ 
  title, 
  imageUrl 
}: { 
  title: string; 
  imageUrl?: string;
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl aspect-square">
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
    </div>
  );
};

const WorkoutPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCreatePlan = () => {
    navigate("/workout-builder");
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
        <div className="apple-search">
          <Search className="h-5 w-5 text-muted-foreground mr-2" />
          <span className="text-muted-foreground">Für dich</span>
          <ChevronDown className="h-5 w-5 text-muted-foreground ml-auto" />
        </div>
        
        {/* Create Own Plan */}
        <div className="activity-card">
          <div className="p-6 text-center bg-black/30 border-b border-slate-800">
            <span className="text-[#b1fc31] uppercase text-sm font-medium">Eigene Pläne</span>
            <h2 className="text-2xl font-bold mt-1">Eigenen Plan erstellen</h2>
            <p className="text-muted-foreground mt-2 mb-4">
              Wähl deine Aktivitäten und leg Zeiten fest, um Woche für Woche motiviert zu bleiben.
            </p>
            <Button 
              className="fitness-plus-button w-full"
              onClick={handleCreatePlan}
            >
              Plan gestalten
            </Button>
          </div>
        </div>
        
        {/* Recommended Workouts */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Fang am besten hier an</h2>
          <div className="grid grid-cols-2 gap-4">
            <ActivityCard 
              title="Krafttraining mit Gregg" 
              imageUrl="/lovable-uploads/8544a0ed-1e92-42c6-bda4-3976577399cc.png"
              duration="20 Min"
              trainer="Gregg"
            />
            <ActivityCard 
              title="Florenz, Italien" 
              imageUrl="/lovable-uploads/253eff9b-492c-4eb5-974e-424a3d8faac8.png" 
              duration="32 Min"
            />
          </div>
        </div>
        
        {/* Activity Types */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Aktivitätsarten</h2>
          <div className="grid grid-cols-3 gap-4">
            <CategoryCard title="Meditation" />
            <CategoryCard title="Krafttraining" />
            <CategoryCard title="HIIT" />
          </div>
        </div>
        
        {/* Achievements */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Auszeichnungen</h2>
          <div className="activity-card p-6">
            <h3 className="text-lg font-medium">Bleibe am Ball und hole dir neue Auszeichnungen.</h3>
            <div className="mt-4 border border-slate-800 rounded-lg p-4">
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
