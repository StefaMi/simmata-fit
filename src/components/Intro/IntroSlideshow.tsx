
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface Slide {
  title: string;
  description: string;
  image?: string;
  background?: string;
}

const slides: Slide[] = [
  {
    title: "Willkommen bei Rush",
    description: "Deine neue persönliche Fitness-App, die dich auf deinem Weg zu einem gesünderen Leben begleitet.",
    background: "bg-gradient-to-br from-blue-600 to-indigo-800",
  },
  {
    title: "Persönlicher Trainingsplan",
    description: "Erstelle deinen individuellen Trainingsplan, angepasst an deine Ziele und deinen Zeitplan.",
    image: "/lovable-uploads/8544a0ed-1e92-42c6-bda4-3976577399cc.png",
  },
  {
    title: "Fokusübungen",
    description: "Verbessere deine Konzentration und Atmung mit speziellen Übungen für Körper und Geist.",
    image: "/lovable-uploads/e395198b-0c17-4067-a3eb-b5f0173ccfc5.png",
  },
  {
    title: "Verbinde dich mit Spotify",
    description: "Höre deine Lieblingsmusik während des Trainings durch die Integration mit Spotify.",
    image: "/lovable-uploads/d27d3ec4-26d7-4e43-b940-bd39a9cceca9.png",
  },
  {
    title: "Fortschritt verfolgen",
    description: "Verfolge deinen Fortschritt und bleibe motiviert mit Auszeichnungen und Statistiken.",
    background: "bg-gradient-to-br from-green-500 to-emerald-700",
  },
];

const TOTAL_SLIDESHOW_DURATION = 8000; // 8 seconds total duration

const IntroSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); // Changed to start muted
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [hasShownIntro, setHasShownIntro] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const slideshowTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio - only load the audio, don't play automatically
  useEffect(() => {
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
  }, []);

  // Check if intro has been shown before
  useEffect(() => {
    const shown = localStorage.getItem("introShown");
    if (shown) {
      setHasShownIntro(true);
      // Immediately redirect to login if intro has been shown before
      navigate("/login");
    } else {
      localStorage.setItem("introShown", "true");
      
      // Start overall slideshow timer (8 seconds total)
      slideshowTimerRef.current = setTimeout(() => {
        handleSkip();
      }, TOTAL_SLIDESHOW_DURATION);
    }
    
    return () => {
      if (slideshowTimerRef.current) {
        clearTimeout(slideshowTimerRef.current);
      }
    };
  }, [navigate]);

  // Auto-advance slides
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // Reset slide timer when manually changing slides
    if (slideshowTimerRef.current) {
      clearTimeout(slideshowTimerRef.current); 
    }
    
    // Auto-advance slides (but not too rapidly)
    timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(currentSlide + 1);
      }
    }, 1600); // Each slide gets some time before auto-advancing
    
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Only try to play when user explicitly clicks the button
      audioRef.current.play().catch(e => {
        toast({
          title: "Audio konnte nicht abgespielt werden",
          description: "Bitte erlaube Audio auf dieser Seite.",
          variant: "destructive",
        });
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    // Clear overall slideshow timer
    if (slideshowTimerRef.current) {
      clearTimeout(slideshowTimerRef.current);
    }
    
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleNext = () => {
    // Clear overall slideshow timer
    if (slideshowTimerRef.current) {
      clearTimeout(slideshowTimerRef.current);
    }
    
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleSkip();
    }
  };

  const handleSkip = () => {
    // Clear overall slideshow timer
    if (slideshowTimerRef.current) {
      clearTimeout(slideshowTimerRef.current);
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    navigate("/login");
  };

  // If intro has been shown before, don't render anything (we redirect in useEffect)
  if (hasShownIntro) {
    return null;
  }

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div 
        className={cn(
          "w-full h-full flex flex-col items-center justify-center transition-all duration-500 ease-in-out",
          slide.background || "bg-gradient-to-br from-slate-900 to-slate-800"
        )}
      >
        {/* Skip button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 z-10 rounded-full bg-background/20 backdrop-blur-sm"
          onClick={handleSkip}
        >
          <X className="h-5 w-5" />
        </Button>
        
        {/* Audio toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          disabled={!audioLoaded}
          className="absolute top-4 left-4 z-10 rounded-full bg-background/20 backdrop-blur-sm"
          onClick={toggleAudio}
        >
          {isPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </Button>
        
        {/* Slide content */}
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-white">
          {slide.image && (
            <div className="max-w-sm mb-8 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <h1 className="text-3xl font-bold mb-4 text-center">{slide.title}</h1>
          <p className="text-center text-lg max-w-md mb-8">{slide.description}</p>
          
          <div className="flex flex-col items-center gap-6">
            {/* Skip button always visible */}
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSkip}>
              Jetzt starten
            </Button>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full border-white/30 backdrop-blur-sm" 
                onClick={handlePrev}
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex space-x-2">
                {slides.map((_, index) => (
                  <div 
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      currentSlide === index ? "bg-white" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full border-white/30 backdrop-blur-sm" 
                onClick={handleNext}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroSlideshow;
