
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Dumbbell, Heart, FootprintsIcon, MapPin, Calendar, TrendingUp } from "lucide-react";
import Layout from "@/components/Layout";
import DailyQuote from "@/components/DailyQuote";
import ActivityRing from "@/components/ActivityRing";
import StatBox from "@/components/StatBox";

const Index = () => {
  const [activityProgress, setActivityProgress] = useState(0);
  
  // Simulate activity progress loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setActivityProgress(72); // Example progress
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Daily stats
  const dailyStats = [
    {
      title: "Schritte",
      value: "4,582",
      icon: <FootprintsIcon className="h-5 w-5 text-primary" />,
      unit: "Schritte",
      change: "+582",
      changeDirection: "up" as const
    },
    {
      title: "Strecke",
      value: "3.2",
      icon: <MapPin className="h-5 w-5 text-primary" />,
      unit: "km",
      change: "+0.8",
      changeDirection: "up" as const
    },
    {
      title: "Kalorien",
      value: "320",
      icon: <Heart className="h-5 w-5 text-primary" />,
      unit: "kcal",
      change: "+75",
      changeDirection: "up" as const
    },
    {
      title: "Trainings",
      value: "1",
      icon: <Dumbbell className="h-5 w-5 text-primary" />,
      unit: "heute",
      change: "0",
      changeDirection: "neutral" as const
    }
  ];

  // Daily tip
  const dailyTip = {
    title: "Tipp des Tages",
    content: "Versuche heute 10 Minuten mehr Cardio zu machen als gestern, um deine Ausdauer zu verbessern."
  };

  // Next scheduled workout
  const nextWorkout = {
    title: "Brust & Trizeps",
    time: "Heute, 18:00 Uhr",
    duration: "45 min"
  };

  return (
    <Layout title="Übersicht">
      <div className="space-y-6">
        {/* Activity Ring Section */}
        <div className="flex flex-col items-center justify-center py-4">
          <ActivityRing progress={activityProgress} size={180} strokeWidth={15} />
          <h2 className="mt-4 text-lg font-semibold">Heutiger Fortschritt</h2>
          <p className="text-sm text-muted-foreground">
            Du bist auf dem richtigen Weg zu deinem Tagesziel!
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {dailyStats.map((stat, i) => (
            <StatBox 
              key={i}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              unit={stat.unit}
              change={stat.change}
              changeDirection={stat.changeDirection}
            />
          ))}
        </div>
        
        {/* Daily Quote */}
        <DailyQuote />
        
        {/* Daily Tip */}
        <div className="activity-card p-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/15 rounded-full p-2">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{dailyTip.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{dailyTip.content}</p>
            </div>
          </div>
        </div>
        
        {/* Next Workout */}
        <div className="activity-card">
          <div className="p-4 border-b border-slate-200/30 dark:border-slate-700/30">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Nächstes Training</h3>
              <Link to="/workout" className="text-sm font-medium text-primary">
                Alle anzeigen
              </Link>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary/15 p-3 rounded-full">
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{nextWorkout.title}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Calendar className="h-4 w-4" />
                  <span>{nextWorkout.time}</span>
                  <span>•</span>
                  <span>{nextWorkout.duration}</span>
                </div>
              </div>
              <Button variant="outline" className="rounded-full" size="sm" asChild>
                <Link to="/workout">Start</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Create Own Plan Button */}
        <div className="pt-2">
          <Button className="w-full py-6 text-lg rounded-xl bg-primary hover:bg-primary/90" asChild>
            <Link to="/workout-builder">
              <Dumbbell className="mr-2 h-5 w-5" />
              Eigenen Plan erstellen
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
