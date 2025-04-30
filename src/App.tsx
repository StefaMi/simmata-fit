
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import ProfilePage from "./pages/ProfilePage";
import WorkoutPage from "./pages/WorkoutPage";
import NutritionPage from "./pages/NutritionPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Für mobile Anpassungen (Statusbarhöhe, Soft-Keyboard, etc.)
  useEffect(() => {
    document.body.classList.add("mobile-app");
    
    // Hardware-Zurück-Knopf Handling für Android
    const handleBackButton = () => {
      if (window.history.state && window.history.state.idx > 0) {
        window.history.back();
      } else {
        if (window.confirm("Möchtest du die App wirklich verlassen?")) {
          // Die App würde hier auf nativen Geräten geschlossen
        }
      }
    };

    window.addEventListener("popstate", handleBackButton);
    
    return () => {
      document.body.classList.remove("mobile-app");
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/workout" element={<WorkoutPage />} />
            <Route path="/nutrition" element={<NutritionPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
