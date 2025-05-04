
import { MusicProvider } from "@/types";
import { getProviderIcon, getProviderLabel } from "./MusicProviderUtils";

interface EmptyPlaylistStateProps {
  provider: MusicProvider;
}

const EmptyPlaylistState = ({ provider }: EmptyPlaylistStateProps) => {
  return (
    <div className="text-center py-10 px-4">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
        {getProviderIcon(provider)}
      </div>
      <h3 className="text-lg font-medium mb-2">Keine Playlists gefunden</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Füge eine {getProviderLabel(provider)} Playlist hinzu, um dein Training zu begleiten
      </p>
    </div>
  );
};

export default EmptyPlaylistState;
