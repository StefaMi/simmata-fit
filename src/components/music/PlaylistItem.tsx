
import { MusicPlaylist, MusicProvider } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { getProviderIcon, getProviderLabel } from "./MusicProviderUtils";

interface PlaylistItemProps {
  playlist: MusicPlaylist;
  provider: MusicProvider;
}

const PlaylistItem = ({ playlist, provider }: PlaylistItemProps) => {
  const openPlaylist = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <Card key={playlist.id} className="overflow-hidden transition-all hover:shadow-md dark:bg-slate-700/50">
      <div className="flex">
        {playlist.imageUrl ? (
          <div className="w-20 h-20 flex-shrink-0">
            <img src={playlist.imageUrl} alt={playlist.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-fitness-primary to-fitness-accent flex items-center justify-center text-white">
            {getProviderIcon(provider)}
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
            In {getProviderLabel(provider)} öffnen
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};

export default PlaylistItem;
