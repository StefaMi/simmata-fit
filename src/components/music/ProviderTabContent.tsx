
import { MusicPlaylist, MusicProvider } from "@/types";
import { TabsContent } from "@/components/ui/tabs";
import PlaylistItem from "./PlaylistItem";
import EmptyPlaylistState from "./EmptyPlaylistState";
import AddCustomPlaylist from "./AddCustomPlaylist";

interface ProviderTabContentProps {
  provider: MusicProvider;
  playlists: MusicPlaylist[];
  onAddPlaylist: (playlist: MusicPlaylist) => void;
}

const ProviderTabContent = ({ provider, playlists, onAddPlaylist }: ProviderTabContentProps) => {
  const filteredPlaylists = playlists.filter(playlist => playlist.provider === provider);
  
  return (
    <TabsContent value={provider}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredPlaylists.map(playlist => (
          <PlaylistItem 
            key={playlist.id} 
            playlist={playlist} 
            provider={provider}
          />
        ))}
      </div>

      {filteredPlaylists.length === 0 && (
        <EmptyPlaylistState provider={provider} />
      )}

      <AddCustomPlaylist 
        activeProvider={provider} 
        onAddPlaylist={onAddPlaylist} 
      />
    </TabsContent>
  );
};

export default ProviderTabContent;
