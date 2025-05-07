
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AudioControlProps {
  isPlaying: boolean;
  onToggleAudio: () => void;
}

const AudioControl: React.FC<AudioControlProps> = ({ isPlaying, onToggleAudio }) => {
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Initialize audio - only load the audio, don't play automatically
  useEffect(() => {
    try {
      const audio = new Audio(new URL('@/assets/audio/intro.mp3', import.meta.url).href);
      audioRef.current = audio;
      audio.volume = 0.3;
      audio.loop = true;

      audio.addEventListener("canplaythrough", () => {
        setAudioLoaded(true);
      });

      return () => {
        audio.pause();
        audio.src = "";
        audioRef.current = null;
      };
    } catch (error) {
      console.error("Failed to load audio:", error);
    }
  }, []);

  // Handles play/pause when the isPlaying prop changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(e => {
        toast({
          title: "Audio konnte nicht abgespielt werden",
          description: "Bitte erlaube Audio auf dieser Seite.",
          variant: "destructive",
        });
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, toast]);

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      disabled={!audioLoaded}
      className="absolute top-4 left-4 z-10 rounded-full bg-background/20 backdrop-blur-sm"
      onClick={onToggleAudio}
    >
      {isPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
    </Button>
  );
};

export default AudioControl;
