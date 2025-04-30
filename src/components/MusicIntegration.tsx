
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MusicPlaylist, MusicProvider } from "@/types";
import { Music, ExternalLink } from "lucide-react";

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
  
  const providerLabel = activeProvider === "spotify" ? "Spotify" : "Apple Music";
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5 text-fitness-primary" />
          Musik für dein Training
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="spotify" onValueChange={(value) => setActiveProvider(value as MusicProvider)}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="spotify" className="w-full">Spotify</TabsTrigger>
            <TabsTrigger value="apple" className="w-full">Apple Music</TabsTrigger>
          </TabsList>
          
          <TabsContent value="spotify">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {playlists
                .filter(playlist => playlist.provider === "spotify")
                .map(playlist => (
                  <Card key={playlist.id} className="overflow-hidden">
                    <div className="flex">
                      {playlist.imageUrl && (
                        <div className="w-20 h-20 flex-shrink-0">
                          <img src={playlist.imageUrl} alt={playlist.name} className="w-full h-full object-cover" />
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
                          In Spotify öffnen
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="apple">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {playlists
                .filter(playlist => playlist.provider === "apple")
                .map(playlist => (
                  <Card key={playlist.id} className="overflow-hidden">
                    <div className="flex">
                      {playlist.imageUrl && (
                        <div className="w-20 h-20 flex-shrink-0">
                          <img src={playlist.imageUrl} alt={playlist.name} className="w-full h-full object-cover" />
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
                          In Apple Music öffnen
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-5">
          <h3 className="text-sm font-medium mb-2">Eigene {providerLabel} Playlist hinzufügen</h3>
          <div className="flex gap-2">
            <div className="flex-grow">
              <Input 
                placeholder={`${providerLabel} URL einfügen`}
                value={customUrl}
                onChange={e => setCustomUrl(e.target.value)}
              />
            </div>
            <Button onClick={handleAddPlaylist}>Hinzufügen</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicIntegration;
