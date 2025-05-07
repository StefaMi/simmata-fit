
import React, { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import SlideContent from "./SlideContent";
import SlideNavigation from "./SlideNavigation";
import AudioControl from "./AudioControl";
import { useIntroState } from "@/hooks/useIntroState";
import { slides } from "./slideData";

const IntroSlideshow: React.FC = () => {
  const {
    currentSlide,
    isPlaying,
    hasShownIntro,
    handleSkip,
    handlePrev,
    handleNext,
    toggleAudio,
    slideshowTimerRef
  } = useIntroState();

  // Memoize the next handler to prevent recreating it on every render
  const memoizedHandleNext = useCallback(() => handleNext(slides.length), [handleNext, slides.length]);

  // Auto-advance slides
  useEffect(() => {
    // Only set up this effect if we're actually showing the intro
    if (hasShownIntro) return;
    
    let timer: NodeJS.Timeout;
    
    // Reset slide timer when manually changing slides
    if (slideshowTimerRef.current) {
      clearTimeout(slideshowTimerRef.current); 
    }
    
    // Auto-advance slides (but not too rapidly)
    timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        memoizedHandleNext();
      } else {
        // On last slide, redirect after a short delay
        setTimeout(() => handleSkip(), 1000);
      }
    }, 1600); // Each slide gets some time before auto-advancing
    
    return () => clearTimeout(timer);
  }, [currentSlide, hasShownIntro, memoizedHandleNext, handleSkip, slideshowTimerRef]);

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
        <AudioControl isPlaying={isPlaying} onToggleAudio={toggleAudio} />
        
        {/* Slide content */}
        <SlideContent slide={slide} />
        
        {/* Navigation */}
        <SlideNavigation 
          currentSlide={currentSlide}
          totalSlides={slides.length}
          onPrev={handlePrev}
          onNext={memoizedHandleNext}
          onSkip={handleSkip}
        />
      </div>
    </div>
  );
};

export default React.memo(IntroSlideshow);
