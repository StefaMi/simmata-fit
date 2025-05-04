
import { MusicProvider } from "@/types";
import { Music, Headphones, Youtube, Apple } from "lucide-react";

export const getProviderIcon = (provider: MusicProvider) => {
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

export const getProviderLabel = (provider: MusicProvider) => {
  switch(provider) {
    case "spotify": return "Spotify";
    case "apple": return "Apple Music";
    case "youtube": return "YouTube Music";
    case "amazon": return "Amazon Music";
    default: return provider;
  }
};
