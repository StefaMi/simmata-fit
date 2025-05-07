
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Play, Loader, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SpotifyAuth from "./SpotifyAuth";

// Mock data for demo
const MOCK_PLAYLISTS = [
  { id: "1", name: "Workout Hits", image: "https://i.scdn.co/image/ab67706f00000003ca5a7517156021292e5663a6", tracks: 50 },
  { id: "2", name: "Beast Mode", image: "https://i.scdn.co/image/ab67706f000000035335f6cb79d7bd7e78db4f66", tracks: 65 },
  { id: "3", name: "Power Workout", image: "https://i.scdn.co/image/ab67706f000000030c7e4e7ebfd5ba8dc686b3e5", tracks: 42 },
  { id: "4", name: "Cardio", image: "https://i.scdn.co/image/ab67706f000000034f9429c386949447ec3bcc30", tracks: 38 }
];

interface SpotifyPlaylist {
  id: string;
  name: string;
  image?: string;
  tracks: number;
}

const SpotifyPlaylists = () => {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();

  // Check if user is authenticated with Spotify
  useEffect(() => {
    const spotifyToken = localStorage.getItem("spotify_token");
    const tokenExpiry = localStorage.getItem("spotify_token_expiry");
    
    if (spotifyToken && tokenExpiry) {
      const isExpired = Date.now() > parseInt(tokenExpiry);
      setIsAuthenticated(!isExpired);
      
      if (!isExpired) {
        fetchPlaylists();
      }
    }
  }, []);

  const fetchPlaylists = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, we'd fetch from Spotify API
      // For demo, use mock data with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPlaylists(MOCK_PLAYLISTS);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      toast({
        title: "Fehler beim Laden",
        description: "Deine Playlists konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const playPlaylist = (id: string) => {
    setCurrentPlaylist(id);
    toast({
      title: "Playlist gestartet",
      description: `${playlists.find(p => p.id === id)?.name} wird abgespielt.`,
    });
  };

  if (!isAuthenticated) {
    return (
      <Card className="backdrop-blur-md bg-background/80 border border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Music className="h-5 w-5 text-primary" />
            <span>Spotify-Integration</span>
          </CardTitle>
          <CardDescription>
            Verbinde dein Spotify-Konto, um deine Playlists während des Trainings zu hören.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <SpotifyAuth />
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="backdrop-blur-md bg-background/80 border border-slate-200 dark:border-slate-800">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Loader className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-sm text-muted-foreground">Lade Playlists...</p>
        </CardContent>
      </Card>
    );
  }

  if (playlists.length === 0) {
    return (
      <Card className="backdrop-blur-md bg-background/80 border border-slate-200 dark:border-slate-800">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <AlertCircle className="h-8 w-8 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-4">Keine Playlists gefunden</p>
          <Button onClick={fetchPlaylists}>Erneut laden</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-md bg-background/80 border border-slate-200 dark:border-slate-800">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <Music className="h-5 w-5 text-primary" />
            <span>Deine Spotify Playlists</span>
          </CardTitle>
          <SpotifyAuth />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {playlists.map((playlist) => (
            <div 
              key={playlist.id} 
              className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${
                currentPlaylist === playlist.id 
                  ? 'bg-primary/10 border border-primary/30' 
                  : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                {playlist.image ? (
                  <img 
                    src={playlist.image} 
                    alt={playlist.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <Music className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{playlist.name}</h4>
                <p className="text-xs text-muted-foreground">{playlist.tracks} Songs</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="flex-shrink-0"
                onClick={() => playPlaylist(playlist.id)}
              >
                <Play className={`h-5 w-5 ${currentPlaylist === playlist.id ? 'text-primary' : ''}`} />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpotifyPlaylists;
