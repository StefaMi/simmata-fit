
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MusicPlaylist, MusicProvider } from "@/types";
import { Music } from "lucide-react";
import { samplePlaylists } from "./music/samplePlaylists";
import ProviderTabContent from "./music/ProviderTabContent";
import { getProviderIcon } from "./music/MusicProviderUtils";

const MusicIntegration = () => {
  const [activeProvider, setActiveProvider] = useState<MusicProvider>("spotify");
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>(samplePlaylists);
  
  const handleAddPlaylist = (newPlaylist: MusicPlaylist) => {
    setPlaylists([...playlists, newPlaylist]);
  };
  
  return (
    <Card className="backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xl">
      <CardHeader className="border-b border-slate-100 dark:border-slate-700">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Music className="h-5 w-5 text-fitness-primary" />
          Musik für dein Training
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <Tabs defaultValue="spotify" onValueChange={(value) => setActiveProvider(value as MusicProvider)}>
          <TabsList className="w-full mb-6 grid grid-cols-4">
            <TabsTrigger value="spotify" className="flex items-center gap-1">
              <Music className="h-4 w-4 text-green-500" /> Spotify
            </TabsTrigger>
            <TabsTrigger value="apple" className="flex items-center gap-1">
              {getProviderIcon("apple")} Apple
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex items-center gap-1">
              {getProviderIcon("youtube")} YouTube
            </TabsTrigger>
            <TabsTrigger value="amazon" className="flex items-center gap-1">
              {getProviderIcon("amazon")} Amazon
            </TabsTrigger>
          </TabsList>
          
          {["spotify", "apple", "youtube", "amazon"].map((provider) => (
            <ProviderTabContent
              key={provider}
              provider={provider as MusicProvider}
              playlists={playlists}
              onAddPlaylist={handleAddPlaylist}
            />
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MusicIntegration;
