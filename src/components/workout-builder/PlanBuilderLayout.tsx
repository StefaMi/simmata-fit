
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PlanBuilderLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  showBackButton?: boolean;
}

const PlanBuilderLayout = ({
  children,
  title,
  subtitle,
  currentStep,
  totalSteps,
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel = "Weiter",
  showBackButton = true
}: PlanBuilderLayoutProps) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (currentStep === 1) {
      navigate("/workout");
    }
  };

  // Calculate progress percentage
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Header with progress */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between">
            {showBackButton && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBack}
                className="rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="text-center flex-1">
              <span className="text-sm text-muted-foreground">
                Schritt {currentStep} von {totalSteps}
              </span>
            </div>
            <div className="w-8"></div> {/* Placeholder for balance */}
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-1 bg-muted/50 rounded-full mt-2">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </header>
      
      {/* Content */}
      <main className="flex-1 container px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        
        <div className="space-y-6">
          {children}
        </div>
      </main>
      
      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/80 dark:bg-card/80 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-700/50 py-4 px-4">
        <div className="container">
          <Button 
            onClick={onNext} 
            disabled={nextDisabled}
            className="w-full py-6 bg-primary hover:bg-primary/90 rounded-xl"
          >
            {nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlanBuilderLayout;
