
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Music, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// Spotify API endpoints and configuration
const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const SPOTIFY_CLIENT_ID = "1a2b3c4d5e6f7g8h9i0j"; // Replace with actual client ID in production
const REDIRECT_URI = window.location.origin + "/spotify-callback";
const SCOPES = [
  "user-read-private", 
  "user-read-email", 
  "playlist-read-private", 
  "user-library-read", 
  "streaming", 
  "user-read-playback-state", 
  "user-modify-playback-state"
];

const generateRandomString = (length: number) => {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const SpotifyAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if user is already authenticated with Spotify on mount
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
      } catch (error) {
        console.log("No Spotify connection found");
        setIsAuthenticated(false);
      }
    };
    
    checkSpotifyAuth();

    // Check URL for Spotify auth callback
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const storedState = localStorage.getItem("spotify_auth_state");
    
    if (code && state && storedState === state) {
      handleSpotifyCallback(code);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user]);

  const handleLogin = () => {
    setIsLoading(true);
    
    try {
      const state = generateRandomString(16);
      localStorage.setItem("spotify_auth_state", state);

      const authParams = new URLSearchParams({
        client_id: SPOTIFY_CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        state: state,
        scope: SCOPES.join(" ")
      });
      
      // Redirect to Spotify auth page
      window.location.href = `${SPOTIFY_AUTH_ENDPOINT}?${authParams.toString()}`;
    } catch (error) {
      console.error("Error initiating Spotify auth:", error);
      toast({
        title: "Fehler bei der Spotify-Authentifizierung",
        description: "Bitte versuche es erneut.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      if (!user) throw new Error("User not logged in");
      
      // Remove Spotify data from localStorage
      localStorage.removeItem(`spotify_token_${user.id}`);
      localStorage.removeItem(`spotify_expiry_${user.id}`);
      localStorage.removeItem("spotify_auth_state");
      
      setIsAuthenticated(false);
      toast({
        title: "Spotify getrennt",
        description: "Du wurdest erfolgreich von Spotify abgemeldet.",
      });
    } catch (error) {
      console.error("Error disconnecting Spotify:", error);
      toast({
        title: "Fehler beim Trennen",
        description: "Bitte versuche es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpotifyCallback = async (code: string) => {
    setIsLoading(true);
    
    try {
      if (!user) throw new Error("User not logged in");
      
      // In a real app, we would exchange the code for access token via a secure backend
      // For demo purposes, we'll simulate a successful authentication
      
      // Store Spotify token in localStorage temporarily
      const mockToken = 'mock-token-' + Date.now();
      const expiryTime = new Date(Date.now() + 3600 * 1000); // 1 hour expiry
      
      localStorage.setItem(`spotify_token_${user.id}`, mockToken);
      localStorage.setItem(`spotify_expiry_${user.id}`, expiryTime.toISOString());
      
      setIsAuthenticated(true);
      toast({
        title: "Spotify verbunden",
        description: "Du wurdest erfolgreich mit Spotify verbunden.",
      });
    } catch (error) {
      console.error("Error handling Spotify callback:", error);
      toast({
        title: "Fehler bei der Verbindung",
        description: "Es gab ein Problem bei der Verbindung mit Spotify.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      className={isAuthenticated ? "bg-green-500 hover:bg-green-600" : "bg-black hover:bg-gray-800"} 
      onClick={isAuthenticated ? handleLogout : handleLogin}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Music className="h-4 w-4 mr-2" />
      )}
      {isAuthenticated ? "Spotify trennen" : "Mit Spotify verbinden"}
    </Button>
  );
};

export default SpotifyAuth;
