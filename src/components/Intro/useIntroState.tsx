
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TOTAL_SLIDESHOW_DURATION } from "./slideData";

export const useIntroState = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasShownIntro, setHasShownIntro] = useState(false);
  const navigate = useNavigate();
  const slideshowTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if intro has been shown before and handle redirects
  useEffect(() => {
    // Check localStorage first
    const shown = localStorage.getItem("introShown");
    
    if (shown) {
      setHasShownIntro(true);
      // Immediately redirect to login if intro has been shown before
      navigate("/login");
      return; // Exit early to prevent timer setup
    } else {
      // Set flag in localStorage so intro is only shown once
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

  const handleSkip = () => {
    // Clear overall slideshow timer
    if (slideshowTimerRef.current) {
      clearTimeout(slideshowTimerRef.current);
    }
    
    setIsPlaying(false);
    navigate("/login");
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

  const handleNext = (totalSlides: number) => {
    // Clear overall slideshow timer
    if (slideshowTimerRef.current) {
      clearTimeout(slideshowTimerRef.current);
    }
    
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleSkip();
    }
  };

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  return {
    currentSlide,
    setCurrentSlide,
    isPlaying,
    hasShownIntro,
    handleSkip,
    handlePrev,
    handleNext,
    toggleAudio,
    slideshowTimerRef
  };
};
