
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Seite nicht gefunden</p>
        <p className="text-muted-foreground mb-8">
          Die angeforderte Seite existiert nicht oder ist nicht verfügbar.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="default" 
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Zur Startseite
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => window.history.back()}
          >
            Zurück zur letzten Seite
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
