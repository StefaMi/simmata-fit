
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MusicProvider } from "@/types";
import { Music } from "lucide-react";
import { getProviderIcon } from "./music/MusicProviderUtils";
import { useToast } from "@/hooks/use-toast";

const MusicIntegration = () => {
  const [activeProvider, setActiveProvider] = useState<MusicProvider>("spotify");
  const { toast } = useToast();
  
  const handleConnectMusic = (provider: MusicProvider) => {
    toast({
      title: `${provider === "spotify" ? "Spotify" : "Apple Music"} verbinden`,
      description: "Die Verbindung wird vorbereitet...",
    });
    
    // This would normally open the OAuth flow for the selected provider
    setTimeout(() => {
      toast({
        title: "Funktion in Entwicklung",
        description: "Diese Funktion wird derzeit entwickelt und wird bald verfügbar sein.",
      });
    }, 1000);
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
          <TabsList className="w-full mb-6 grid grid-cols-2">
            <TabsTrigger value="spotify" className="flex items-center gap-1">
              <Music className="h-4 w-4 text-green-500" /> Spotify
            </TabsTrigger>
            <TabsTrigger value="apple" className="flex items-center gap-1">
              {getProviderIcon("apple")} Apple Music
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="spotify" className="space-y-4">
            <div className="text-center p-6 space-y-4">
              <div className="p-4 mx-auto bg-green-50 dark:bg-green-900/20 rounded-full w-16 h-16 flex items-center justify-center">
                <Music className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold">Verbinde Spotify</h3>
              <p className="text-sm text-muted-foreground">
                Verbinde dein Spotify-Konto, um während deines Trainings deine Lieblingsplaylists zu hören.
              </p>
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={() => handleConnectMusic("spotify")}
              >
                Spotify verbinden
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="apple" className="space-y-4">
            <div className="text-center p-6 space-y-4">
              <div className="p-4 mx-auto bg-slate-50 dark:bg-slate-900/20 rounded-full w-16 h-16 flex items-center justify-center">
                {/* Fix: Removing the second argument from getProviderIcon call */}
                {getProviderIcon("apple")}
              </div>
              <h3 className="text-lg font-semibold">Verbinde Apple Music</h3>
              <p className="text-sm text-muted-foreground">
                Verbinde dein Apple Music-Konto, um während deines Trainings deine Lieblingsplaylists zu hören.
              </p>
              <Button 
                className="bg-black hover:bg-gray-800 text-white"
                onClick={() => handleConnectMusic("apple")}
              >
                Apple Music verbinden
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MusicIntegration;
