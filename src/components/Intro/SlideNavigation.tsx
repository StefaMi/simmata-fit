
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SlideNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  onSkip: () => void;
}

const SlideNavigation: React.FC<SlideNavigationProps> = ({
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  onSkip,
}) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={onSkip}>
        Jetzt starten
      </Button>
      
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full border-white/30 backdrop-blur-sm" 
          onClick={onPrev}
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
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
          onClick={onNext}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default SlideNavigation;
