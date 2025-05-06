
import { useState, useEffect, memo } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CalendarIcon, Dumbbell, Heart, FootprintsIcon, MapPin, TrendingUp } from "lucide-react";
import Layout from "@/components/Layout";
import ActivityRing from "@/components/ActivityRing";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { de } from "date-fns/locale";

// Memoized stat component for better performance
const StatCard = memo(({ 
  title, 
  value, 
  unit, 
  className, 
  barColor, 
  barValues 
}: { 
  title: string; 
  value: string; 
  unit: string; 
  className?: string; 
  barColor: string;
  barValues: number[]; 
}) => (
  <div className={`fitness-stat-box ${className}`}>
    <p className="text-sm text-muted-foreground">{title}</p>
    <div className="flex items-baseline mt-1 mb-2">
      <span className="text-xl font-bold">{value}</span>
      <span className="ml-1 text-sm text-muted-foreground">{unit}</span>
    </div>
    
    <div className="fit-view w-full">
      <div className="fit-view-grid-line" style={{ bottom: '25%' }}></div>
      <div className="fit-view-grid-line" style={{ bottom: '50%' }}></div>
      <div className="fit-view-grid-line" style={{ bottom: '75%' }}></div>
      
      {barValues.map((height, i) => (
        <div 
          key={i} 
          className="fit-view-bar" 
          style={{ 
            height: `${height}%`, 
            left: `${i * 3.5}%`, 
            backgroundColor: barColor,
            opacity: height > 0 ? 1 : 0.2
          }}
        ></div>
      ))}
    </div>
  </div>
));

// Workout session type
type WorkoutSession = {
  id: string;
  title: string;
  duration: string;
  imageUrl?: string;
  trainer?: string;
  category: string;
};

const Index = () => {
  const { user } = useAuth();
  const [activityProgress, setActivityProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  
  // Current day and date
  const today = new Date();
  const dayName = format(today, 'EEEE', { locale: de }).toUpperCase();
  const dateDisplay = format(today, 'd. MMMM', { locale: de }).toUpperCase();
  
  // Random activity data for the demo
  const generateRandomValues = (count: number, max: number) => {
    return Array.from({ length: count }, () => Math.floor(Math.random() * max));
  };
  
  const stepValues = generateRandomValues(24, 40);
  const distanceValues = generateRandomValues(24, 60);
  
  // Sample workout sessions
  const sampleWorkouts = [
    {
      id: '1',
      title: 'Krafttraining mit Gregg',
      duration: '20 Min',
      imageUrl: '/lovable-uploads/8544a0ed-1e92-42c6-bda4-3976577399cc.png',
      trainer: 'Gregg',
      category: 'Krafttraining'
    },
    {
      id: '2',
      title: 'Florenz, Italien',
      duration: '32 Min',
      imageUrl: '/lovable-uploads/253eff9b-492c-4eb5-974e-424a3d8faac8.png',
      category: 'Laufen'
    },
    {
      id: '3',
      title: 'HIIT mit Jessica',
      duration: '15 Min',
      category: 'HIIT'
    }
  ];
  
  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      setIsLoading(true);
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setWorkouts(sampleWorkouts);
      setActivityProgress(69);
      setIsLoading(false);
    };
    
    loadData();
  }, []);
  
  // Format display name
  const displayName = user?.firstName || 'Fitness';
  
  return (
    <Layout hideNav={false} showHeader={true} title="Übersicht" customHeader={
      <div className="flex flex-col items-start">
        <span className="app-header-date">{`${dayName}, ${dateDisplay}`}</span>
        <h1 className="text-3xl font-bold">Übersicht</h1>
      </div>
    }>
      <div className="space-y-6">
        {/* Activity Ring */}
        <div className="activity-card">
          <div className="flex flex-col items-center justify-center py-6">
            <h3 className="text-lg font-semibold mb-4">Aktivitätsring</h3>
            <ActivityRing 
              progress={activityProgress} 
              size={180} 
              strokeWidth={18} 
              color="#FF375F" 
            />
            
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center text-xl font-semibold">
                <span>171</span>
                <span className="text-sm text-muted-foreground ml-1">/500 KCAL</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Bewegen</p>
            </div>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard 
            title="Schritte" 
            value="4.154" 
            unit="schritte"
            barColor="#A18AFF"
            barValues={stepValues}
          />
          
          <StatCard 
            title="Strecke" 
            value="3,06" 
            unit="km"
            barColor="#5CDDFF"
            barValues={distanceValues}
          />
        </div>
        
        {/* Training Section */}
        <div>
          <h2 className="text-lg font-bold mb-3">Übungen</h2>
          <div className="activity-card p-4 flex flex-col items-center justify-center min-h-32">
            <p className="text-muted-foreground">
              Keine Übungen aufgezeichnet
            </p>
          </div>
        </div>
        
        {/* Training Tips */}
        <div>
          <h2 className="text-lg font-bold mb-3">Trainingstipps</h2>
          <div className="activity-card p-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                Definitiv einen Versuch wert: besser schlafen
              </h3>
              <p className="text-muted-foreground text-sm">
                mit Fitness+
              </p>
            </div>
          </div>
        </div>
        
        {/* Create Plan Button */}
        <div className="pt-4">
          <Button className="w-full fitness-plus-button" asChild>
            <Link to="/workout-builder">
              Eigenen Plan erstellen
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
