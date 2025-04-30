
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Dumbbell, Heart, User, ArrowUp, Activity, Scale, Wind, Music, TrendingUp } from "lucide-react";
import Layout from "@/components/Layout";
import DailyQuote from "@/components/DailyQuote";

const Index = () => {
  const { toast } = useToast();

  const features = [
    {
      title: "Persönliches Profil",
      description: "Erfasse deine persönlichen Daten für einen maßgeschneiderten Fitness- und Ernährungsplan.",
      icon: <User className="h-6 w-6 text-fitness-primary" />,
      link: "/profile",
      buttonText: "Zum Profil",
    },
    {
      title: "Trainingsplan",
      description: "Erstelle deinen individuellen Trainingsplan basierend auf deinen Zielen und zu trainierenden Körperteilen.",
      icon: <Dumbbell className="h-6 w-6 text-fitness-primary" />,
      link: "/workout",
      buttonText: "Zum Training",
    },
    {
      title: "Ernährungsplan",
      description: "Bekomme einen auf dich abgestimmten Ernährungsplan und erfasse deine tägliche Nahrungsaufnahme.",
      icon: <Heart className="h-6 w-6 text-fitness-primary" />,
      link: "/nutrition",
      buttonText: "Zur Ernährung",
    },
    {
      title: "Atem & Fokus",
      description: "Verbessere deine geistige Fitness mit Nesma-inspirierten Atem- und Konzentrationsübungen.",
      icon: <Wind className="h-6 w-6 text-fitness-primary" />,
      link: "/focus",
      buttonText: "Zu den Übungen",
    },
    {
      title: "Fortschritt",
      description: "Verfolge deinen Fortschritt und dokumentiere deine Erfolge auf dem Weg zu deinen Zielen.",
      icon: <TrendingUp className="h-6 w-6 text-fitness-primary" />,
      link: "/progress",
      buttonText: "Zum Fortschritt",
    },
  ];

  const stats = [
    {
      title: "Kalorienaufnahme",
      value: "1,850",
      unit: "kcal",
      icon: <Activity className="h-6 w-6 text-fitness-primary" />,
      change: "+2%",
      changeDirection: "up" as const,
    },
    {
      title: "Aktuelle Trainingseinheiten",
      value: "4",
      unit: "pro Woche",
      icon: <Dumbbell className="h-6 w-6 text-fitness-primary" />,
      change: "+1",
      changeDirection: "up" as const,
    },
    {
      title: "Gewichtsreduktion",
      value: "2.5",
      unit: "kg",
      icon: <Scale className="h-6 w-6 text-fitness-primary" />,
      change: "-0.5",
      changeDirection: "down" as const,
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero-Sektion */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            Dein persönlicher Fitness- und Ernährungsplan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Erreiche deine Gesundheits- und Fitnessziele mit maßgeschneiderten Trainings- und Ernährungsplänen, die auf deine individuellen Bedürfnisse abgestimmt sind.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button className="fitness-gradient" asChild>
              <Link to="/profile">Profil erstellen</Link>
            </Button>
            <Button variant="outline" className="border-fitness-primary text-fitness-primary" asChild>
              <Link to="/workout">Zum Training</Link>
            </Button>
          </div>
        </div>
        
        {/* Daily Quote */}
        <DailyQuote />

        {/* Statistiken */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="bg-fitness-primary bg-opacity-10 p-3 rounded-lg">
                    {stat.icon}
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${
                      stat.changeDirection === "up" ? "text-fitness-success" : "text-fitness-error"
                    }`}>
                      {stat.change}
                    </span>
                    <ArrowUp
                      className={`h-4 w-4 ml-1 ${
                        stat.changeDirection === "up"
                          ? "text-fitness-success"
                          : "text-fitness-error rotate-180"
                      }`}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">
                    {stat.value} <span className="text-sm font-normal text-muted-foreground">{stat.unit}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="flex flex-col h-full">
              <CardHeader>
                <div className="bg-fitness-primary bg-opacity-10 p-3 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end pt-4">
                <Button 
                  variant="outline" 
                  className="border-fitness-primary text-fitness-primary hover:bg-fitness-primary hover:text-white"
                  asChild
                >
                  <Link to={feature.link}>{feature.buttonText}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Music Integration Teaser */}
        <Card className="bg-gradient-to-r from-fitness-primary to-fitness-secondary text-white">
          <CardContent className="p-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Music className="h-6 w-6" />
                <h3 className="text-2xl font-bold">Musik für dein Training</h3>
              </div>
              <p className="text-white/80">
                Verbinde deine Apple Music oder Spotify-Playlists für ein optimales Trainingserlebnis.
              </p>
            </div>
            <Button 
              className="mt-4 md:mt-0 bg-white text-fitness-primary hover:bg-slate-100" 
              size="lg"
              asChild
            >
              <Link to="/workout">Jetzt starten</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
