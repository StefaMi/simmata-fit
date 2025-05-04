
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MusicPlaylist, MusicProvider } from "@/types";
import { Music, ExternalLink, Headphones, Youtube, Apple } from "lucide-react";

// Beispiel-Playlists
const samplePlaylists: MusicPlaylist[] = [
  {
    id: "pl1",
    name: "Workout Motivation",
    provider: "spotify",
    url: "https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP",
    imageUrl: "https://i.scdn.co/image/ab67706f00000003bfc13c78760c8fd7752f547d",
    description: "Motivierende Tracks für dein Training"
  },
  {
    id: "pl2",
    name: "Cardio Boost",
    provider: "spotify",
    url: "https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC",
    imageUrl: "https://i.scdn.co/image/ab67706f00000003033194083f7b5f867cc8f4c4",
    description: "Schnelle Beats für dein Cardio-Training"
  },
  {
    id: "pl3",
    name: "Workout Essentials",
    provider: "apple",
    url: "https://music.apple.com/us/playlist/pure-workout/pl.580d40f91a0a44ac916227d3434e7fd9",
    imageUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/a5/4d/4d/a54d4d5e-8b8b-501e-9141-c0151498b2d9/source/600x600bb.jpg",
    description: "Die besten Tracks für jedes Training"
  },
  {
    id: "pl4",
    name: "Power Workout",
    provider: "youtube",
    url: "https://www.youtube.com/playlist?list=PLChOO_ZAB22WuyDODJ3kjJiTwL7cwXd9j",
    imageUrl: "https://i.ytimg.com/vi/tAGnKpE4NCI/maxresdefault.jpg",
    description: "Energiegeladene Musik für intensives Training"
  },
  {
    id: "pl5",
    name: "Running Mix",
    provider: "amazon",
    url: "#",
    description: "Perfekt für Laufen und Joggen"
  }
];

const MusicIntegration = () => {
  const [customUrl, setCustomUrl] = useState("");
  const [activeProvider, setActiveProvider] = useState<MusicProvider>("spotify");
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>(samplePlaylists);
  
  const handleAddPlaylist = () => {
    if (!customUrl) return;
    
    let isValid = false;
    if (activeProvider === "spotify" && customUrl.includes("spotify.com")) {
      isValid = true;
    } else if (activeProvider === "apple" && customUrl.includes("apple.com")) {
      isValid = true;
    } else if (activeProvider === "youtube" && (customUrl.includes("youtube.com") || customUrl.includes("youtu.be"))) {
      isValid = true;
    } else if (activeProvider === "amazon" && customUrl.includes("amazon")) {
      isValid = true;
    }
    
    if (isValid) {
      const newPlaylist: MusicPlaylist = {
        id: `pl-${Date.now()}`,
        name: `Playlist ${playlists.length + 1}`,
        provider: activeProvider,
        url: customUrl,
        description: "Benutzerdefinierte Playlist"
      };
      
      setPlaylists([...playlists, newPlaylist]);
      setCustomUrl("");
    }
  };
  
  const openPlaylist = (url: string) => {
    window.open(url, "_blank");
  };
  
  const getProviderIcon = (provider: MusicProvider) => {
    switch(provider) {
      case "spotify":
        return <Music className="h-5 w-5 text-green-500" />; // Using Music icon for Spotify
      case "apple":
        return <Apple className="h-5 w-5" />;
      case "youtube":
        return <Youtube className="h-5 w-5" />;
      case "amazon":
        return <Headphones className="h-5 w-5" />;
      default:
        return <Music className="h-5 w-5" />;
    }
  };

  const getProviderLabel = (provider: MusicProvider) => {
    switch(provider) {
      case "spotify": return "Spotify";
      case "apple": return "Apple Music";
      case "youtube": return "YouTube Music";
      case "amazon": return "Amazon Music";
      default: return provider;
    }
  };
  
  return (
    <Card className="backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xl">
      <CardHeader className="border-b border-slate-100 dark:border-slate-700">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Music className="h-5 w-5 text-fitness-primary" />
          Musik für dein Training
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <Tabs defaultValue="spotify" onValueChange={(value) => setActiveProvider(value as MusicProvider)}>
          <TabsList className="w-full mb-6 grid grid-cols-4">
            <TabsTrigger value="spotify" className="flex items-center gap-1">
              <Music className="h-4 w-4 text-green-500" /> Spotify
            </TabsTrigger>
            <TabsTrigger value="apple" className="flex items-center gap-1">
              <Apple className="h-4 w-4" /> Apple
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex items-center gap-1">
              <Youtube className="h-4 w-4" /> YouTube
            </TabsTrigger>
            <TabsTrigger value="amazon" className="flex items-center gap-1">
              <Headphones className="h-4 w-4" /> Amazon
            </TabsTrigger>
          </TabsList>
          
          {["spotify", "apple", "youtube", "amazon"].map((provider) => (
            <TabsContent key={provider} value={provider}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {playlists
                  .filter(playlist => playlist.provider === provider)
                  .map(playlist => (
                    <Card key={playlist.id} className="overflow-hidden transition-all hover:shadow-md dark:bg-slate-700/50">
                      <div className="flex">
                        {playlist.imageUrl ? (
                          <div className="w-20 h-20 flex-shrink-0">
                            <img src={playlist.imageUrl} alt={playlist.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-fitness-primary to-fitness-accent flex items-center justify-center text-white">
                            {getProviderIcon(provider as MusicProvider)}
                          </div>
                        )}
                        <CardContent className="p-3 flex flex-col justify-between flex-grow">
                          <div>
                            <h4 className="font-medium text-sm">{playlist.name}</h4>
                            <p className="text-xs text-muted-foreground">{playlist.description}</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2 flex items-center gap-1 text-xs"
                            onClick={() => openPlaylist(playlist.url)}
                          >
                            <ExternalLink className="h-3 w-3" />
                            In {getProviderLabel(provider as MusicProvider)} öffnen
                          </Button>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
              </div>

              {playlists.filter(playlist => playlist.provider === provider).length === 0 && (
                <div className="text-center py-10 px-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
                    {getProviderIcon(provider as MusicProvider)}
                  </div>
                  <h3 className="text-lg font-medium mb-2">Keine Playlists gefunden</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Füge eine {getProviderLabel(provider as MusicProvider)} Playlist hinzu, um dein Training zu begleiten
                  </p>
                </div>
              )}

              <div className="mt-5">
                <h3 className="text-sm font-medium mb-2">Eigene {getProviderLabel(provider as MusicProvider)} Playlist hinzufügen</h3>
                <div className="flex gap-2">
                  <div className="flex-grow">
                    <Input 
                      placeholder={`${getProviderLabel(provider as MusicProvider)} URL einfügen`}
                      value={customUrl}
                      onChange={e => setCustomUrl(e.target.value)}
                      className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <Button onClick={handleAddPlaylist} className="bg-fitness-primary hover:bg-fitness-secondary">Hinzufügen</Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MusicIntegration;
