
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Music } from "lucide-react";

// Spotify API endpoints and configuration
const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const SPOTIFY_CLIENT_ID = "your-client-id"; // You should replace this with your actual client ID
const REDIRECT_URI = window.location.origin + "/spotify-callback";
const SCOPES = ["user-read-private", "user-read-email", "playlist-read-private", "user-library-read", "streaming", "user-read-playback-state", "user-modify-playback-state"];

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
  const { toast } = useToast();

  // Check if user is already authenticated with Spotify on mount
  useEffect(() => {
    const spotifyToken = localStorage.getItem("spotify_token");
    const tokenExpiry = localStorage.getItem("spotify_token_expiry");
    
    if (spotifyToken && tokenExpiry) {
      const isExpired = Date.now() > parseInt(tokenExpiry);
      setIsAuthenticated(!isExpired);
      
      // If token is expired, remove it
      if (isExpired) {
        localStorage.removeItem("spotify_token");
        localStorage.removeItem("spotify_token_expiry");
      }
    }

    // Check URL for Spotify auth callback
    const urlParams = new URLSearchParams(window.location.search);
    const spotifyCode = urlParams.get('code');
    
    if (spotifyCode) {
      handleSpotifyCallback(spotifyCode);
      // Remove code from URL to prevent repeated auth attempts
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleLogin = () => {
    const state = generateRandomString(16);
    localStorage.setItem("spotify_auth_state", state);

    const authUrl = new URL(SPOTIFY_AUTH_ENDPOINT);
    authUrl.searchParams.append("client_id", SPOTIFY_CLIENT_ID);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.append("state", state);
    authUrl.searchParams.append("scope", SCOPES.join(" "));
    
    // Redirect to Spotify auth page
    window.location.href = authUrl.toString();
  };

  const handleLogout = () => {
    localStorage.removeItem("spotify_token");
    localStorage.removeItem("spotify_token_expiry");
    setIsAuthenticated(false);
    toast({
      title: "Spotify getrennt",
      description: "Du wurdest erfolgreich von Spotify abgemeldet.",
    });
  };

  const handleSpotifyCallback = async (code: string) => {
    try {
      // In a real application, we'd make a server-side request to exchange the code for a token
      // For demo purposes, we're simulating a successful authentication
      toast({
        title: "Spotify verbunden",
        description: "Du wurdest erfolgreich mit Spotify verbunden.",
      });
      
      // Simulate token storage (in a real app, you'd get this from the server)
      const mockToken = "mock-spotify-token";
      const expiresIn = 3600; // 1 hour
      
      localStorage.setItem("spotify_token", mockToken);
      localStorage.setItem("spotify_token_expiry", (Date.now() + expiresIn * 1000).toString());
      
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error authenticating with Spotify:", error);
      toast({
        title: "Fehler bei der Verbindung",
        description: "Es gab ein Problem bei der Verbindung mit Spotify.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      className={isAuthenticated ? "bg-green-500 hover:bg-green-600" : "bg-black hover:bg-gray-800"} 
      onClick={isAuthenticated ? handleLogout : handleLogin}
    >
      <Music className="mr-2 h-4 w-4" />
      {isAuthenticated ? "Spotify trennen" : "Mit Spotify verbinden"}
    </Button>
  );
};

export default SpotifyAuth;
