import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Dumbbell, Heart, User, ArrowUp, Activity, Scale, Wind, Music, TrendingUp } from "lucide-react";
import Layout from "@/components/Layout";
import DailyQuote from "@/components/DailyQuote";
import { useAuth } from "@/hooks/useAuth";
import { MusicPlaylist, MusicProvider } from "@/types";
import ProviderTabContent from "@/components/music/ProviderTabContent";

const DashboardPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<MusicProvider>("spotify");
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);

  // Sample playlists for demonstration
  useEffect(() => {
    // In a real app, these would come from an API or database
    setPlaylists([
      {
        id: "1",
        name: "Workout Hits",
        description: "Top tracks for your workout session",
        imageUrl: "https://i.scdn.co/image/ab67706f00000002e8e28219724c2423afa4d320",
        provider: "spotify",
        url: "https://open.spotify.com/playlist/37i9dQZF1DX76t638V6CA8"
      },
      {
        id: "2",
        name: "Beast Mode",
        description: "Energy tracks to get you going",
        imageUrl: "https://i.scdn.co/image/ab67706f000000029249b35f23fb596b6f006a15",
        provider: "spotify",
        url: "https://open.spotify.com/playlist/37i9dQZF1DX9qNs32fujYe"
      }
    ]);
  }, []);

  const handleAddPlaylist = (playlist: MusicPlaylist) => {
    setPlaylists([...playlists, playlist]);
    toast({
      title: "Playlist hinzugefügt",
      description: `${playlist.name} wurde zu deinen Playlists hinzugefügt.`,
    });
  };

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
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero-Sektion mit Begrüßung */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            {user ? `Hallo, ${user.firstName || user.name?.split(' ')[0] || 'Fitness-Fan'}!` : 'Dein persönlicher Fitness- und Ernährungsplan'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Erreiche deine Gesundheits- und Fitnessziele mit maßgeschneiderten Trainings- und Ernährungsplänen.
          </p>
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

        {/* Music Integration */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Music className="h-6 w-6 text-fitness-primary" />
              <CardTitle>Musik für dein Training</CardTitle>
            </div>
            <CardDescription>
              Verbinde deine Musik-Playlists für ein optimales Trainingserlebnis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="spotify" value={activeTab} onValueChange={(value) => setActiveTab(value as MusicProvider)}>
              <TabsList className="mb-4">
                <TabsTrigger value="spotify">Spotify</TabsTrigger>
                <TabsTrigger value="apple">Apple Music</TabsTrigger>
                <TabsTrigger value="youtube">YouTube</TabsTrigger>
              </TabsList>
              
              <ProviderTabContent 
                provider="spotify" 
                playlists={playlists} 
                onAddPlaylist={handleAddPlaylist} 
              />
              
              <ProviderTabContent 
                provider="apple" 
                playlists={playlists} 
                onAddPlaylist={handleAddPlaylist} 
              />
              
              <ProviderTabContent 
                provider="youtube" 
                playlists={playlists} 
                onAddPlaylist={handleAddPlaylist} 
              />
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardPage;
