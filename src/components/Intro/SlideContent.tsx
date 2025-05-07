
import React from "react";

interface Slide {
  title: string;
  description: string;
  image?: string;
  background?: string;
}

interface SlideContentProps {
  slide: Slide;
}

const SlideContent: React.FC<SlideContentProps> = ({ slide }) => {
  return (
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
    </div>
  );
};

export default SlideContent;
