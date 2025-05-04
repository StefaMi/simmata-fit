
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MusicPlaylist, MusicProvider } from "@/types";
import { getProviderLabel } from "./MusicProviderUtils";

interface AddCustomPlaylistProps {
  activeProvider: MusicProvider;
  onAddPlaylist: (playlist: MusicPlaylist) => void;
}

const AddCustomPlaylist = ({ activeProvider, onAddPlaylist }: AddCustomPlaylistProps) => {
  const [customUrl, setCustomUrl] = useState("");
  
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
        name: `Playlist ${Date.now()}`,
        provider: activeProvider,
        url: customUrl,
        description: "Benutzerdefinierte Playlist"
      };
      
      onAddPlaylist(newPlaylist);
      setCustomUrl("");
    }
  };
  
  return (
    <div className="mt-5">
      <h3 className="text-sm font-medium mb-2">Eigene {getProviderLabel(activeProvider)} Playlist hinzufügen</h3>
      <div className="flex gap-2">
        <div className="flex-grow">
          <Input 
            placeholder={`${getProviderLabel(activeProvider)} URL einfügen`}
            value={customUrl}
            onChange={e => setCustomUrl(e.target.value)}
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          />
        </div>
        <Button onClick={handleAddPlaylist} className="bg-fitness-primary hover:bg-fitness-secondary">Hinzufügen</Button>
      </div>
    </div>
  );
};

export default AddCustomPlaylist;
