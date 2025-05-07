import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Play, Pause, Loader, AlertCircle, Plus, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SpotifyAuth from "./SpotifyAuth";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useAuth } from "@/hooks/useAuth";
import { Slider } from "@/components/ui/slider";

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

interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  duration: number;
  image?: string;
}

const MOCK_TRACKS = [
  { id: "t1", name: "Eye of the Tiger", artist: "Survivor", duration: 243, image: "https://i.scdn.co/image/ab67616d00001e02cf9d52e4bc5d55f5d97343d8" },
  { id: "t2", name: "Lose Yourself", artist: "Eminem", duration: 326, image: "https://i.scdn.co/image/ab67616d00001e023303e9624bfcb02a95e0e4e0" },
  { id: "t3", name: "Can't Hold Us", artist: "Macklemore & Ryan Lewis", duration: 258, image: "https://i.scdn.co/image/ab67616d00001e026ef2e52bb6f75a1d78aa1c79" },
];

const SpotifyPlaylists = () => {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [volume, setVolume] = useState<number>(70);
  const [currentView, setCurrentView] = useState<'playlists' | 'tracks'>('playlists');
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if user is authenticated with Spotify
  useEffect(() => {
    const checkSpotifyAuth = async () => {
      if (!user) return;
      
      try {
        // Using localStorage as a temporary solution until Supabase table is created
        const spotifyToken = localStorage.getItem(`spotify_token_${user.id}`);
        const tokenExpiry = localStorage.getItem(`spotify_expiry_${user.id}`);
        
        // Check if token is valid and not expired
        const isValid = spotifyToken && tokenExpiry && new Date(tokenExpiry) > new Date();
        setIsAuthenticated(isValid);
        
        if (isValid) {
          fetchPlaylists();
        }
      } catch (error) {
        console.log("No Spotify connection found");
        setIsAuthenticated(false);
      }
    };
    
    checkSpotifyAuth();
  }, [user]);

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

  const fetchTracks = async (playlistId: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, we'd fetch from Spotify API
      // For demo, use mock data with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setTracks(MOCK_TRACKS);
      setCurrentPlaylist(playlistId);
      setCurrentView('tracks');
    } catch (error) {
      console.error("Error fetching tracks:", error);
      toast({
        title: "Fehler beim Laden",
        description: "Die Tracks konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playTrack = (track: SpotifyTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    
    toast({
      title: "Track wird abgespielt",
      description: `${track.name} von ${track.artist}`,
    });
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const goBack = () => {
    setCurrentView('playlists');
    setCurrentPlaylist(null);
  };

  const previousTrack = () => {
    if (!currentTrack) return;
    
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(tracks[currentIndex - 1]);
    } else {
      // Loop to the last track if at the beginning
      playTrack(tracks[tracks.length - 1]);
    }
  };

  const nextTrack = () => {
    if (!currentTrack) return;
    
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex < tracks.length - 1) {
      playTrack(tracks[currentIndex + 1]);
    } else {
      // Loop to the first track if at the end
      playTrack(tracks[0]);
    }
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

  if (isLoading && playlists.length === 0) {
    return (
      <Card className="backdrop-blur-md bg-background/80 border border-slate-200 dark:border-slate-800">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Loader className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-sm text-muted-foreground">Lade Playlists...</p>
        </CardContent>
      </Card>
    );
  }

  if (playlists.length === 0 && !isLoading) {
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
    <>
      <Card className="backdrop-blur-md bg-background/80 border border-slate-200 dark:border-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center">
            {currentView === 'tracks' ? (
              <div className="flex items-center">
                <Button variant="ghost" size="sm" className="mr-2" onClick={goBack}>
                  <SkipBack className="h-4 w-4" />
                </Button>
                <CardTitle>
                  {playlists.find(p => p.id === currentPlaylist)?.name || "Playlist"}
                </CardTitle>
              </div>
            ) : (
              <CardTitle className="flex items-center space-x-2">
                <Music className="h-5 w-5 text-primary" />
                <span>Deine Spotify Playlists</span>
              </CardTitle>
            )}
            <SpotifyAuth />
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {currentView === 'playlists' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {playlists.map((playlist) => (
                <div 
                  key={playlist.id} 
                  className="flex items-center space-x-4 p-3 rounded-lg transition-colors border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  onClick={() => fetchTracks(playlist.id)}
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
                  >
                    <Play className="h-5 w-5" />
                  </Button>
                </div>
              ))}

              <div className="flex items-center space-x-4 p-3 rounded-lg transition-colors border border-dashed border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">Eigene Playlist erstellen</h4>
                  <p className="text-xs text-muted-foreground">Neue Training-Playlist</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                tracks.map((track) => (
                  <div 
                    key={track.id} 
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all cursor-pointer ${
                      currentTrack?.id === track.id 
                        ? 'bg-primary/10 border border-primary/30' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                    }`}
                    onClick={() => playTrack(track)}
                  >
                    <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                      {track.image ? (
                        <img 
                          src={track.image} 
                          alt={track.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                          <Music className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{track.name}</h4>
                      <p className="text-xs text-muted-foreground">{track.artist}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(track.duration)}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="flex-shrink-0"
                    >
                      {currentTrack?.id === track.id && isPlaying ? (
                        <Pause className="h-4 w-4 text-primary" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Player Bar - Only show when a track is selected */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 z-50">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-12 h-12 rounded overflow-hidden">
                {currentTrack.image ? (
                  <img 
                    src={currentTrack.image} 
                    alt={currentTrack.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <Music className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                  </div>
                )}
              </div>
              <div className="max-w-[150px] sm:max-w-none">
                <h4 className="font-medium text-sm truncate">{currentTrack.name}</h4>
                <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
              </div>
            </div>
            
            <div className="flex space-x-1 sm:space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full" 
                onClick={previousTrack}
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button 
                variant="default" 
                size="icon" 
                className="rounded-full"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full" 
                onClick={nextTrack}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="hidden sm:flex items-center space-x-2 flex-1 justify-end">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider 
                className="w-24" 
                defaultValue={[volume]} 
                max={100} 
                step={1}
                onValueChange={(values) => setVolume(values[0])} 
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SpotifyPlaylists;
