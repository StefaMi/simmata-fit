
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { LanguageProvider } from "./hooks/useLanguage";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import EmailConfirmedPage from "./pages/EmailConfirmedPage";
import ProfilePage from "./pages/ProfilePage";
import WorkoutPage from "./pages/WorkoutPage";
import NutritionPage from "./pages/NutritionPage";
import FocusPage from "./pages/FocusPage"; 
import ProgressPage from "./pages/ProgressPage";
import WorkoutBuilderPage from "./pages/WorkoutBuilderPage";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/components/theme-provider";
import LoadingSpinner from "./components/ui/loading-spinner";

// Admin mode flag for development - set to false for production
const ADMIN_MODE = false;

// Protected route component with improved loading state
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-background to-card">
        <LoadingSpinner size="lg" text="Wird geladen..." />
      </div>
    );
  }
  
  // In admin mode, always allow access
  if (ADMIN_MODE || user) {
    return <>{children}</>;
  }
  
  return <Navigate to="/login" replace />;
};

// Separate AppRoutes to prevent hook logic issues
const AppRoutes = () => {
  // For mobile adjustments (status bar height, soft keyboard, etc.)
  useEffect(() => {
    document.body.classList.add("mobile-app");
    
    // Hardware back button handling for Android
    const handleBackButton = () => {
      if (window.history.state && window.history.state.idx > 0) {
        window.history.back();
      } else {
        if (window.confirm("Möchtest du die App wirklich verlassen?")) {
          // The app would close here on native devices
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
    <Routes>
      {/* Make login page always accessible */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/email-confirmed" element={<EmailConfirmedPage />} />
      
      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/workout" element={<ProtectedRoute><WorkoutPage /></ProtectedRoute>} />
      <Route path="/workout-builder" element={<ProtectedRoute><WorkoutBuilderPage /></ProtectedRoute>} />
      <Route path="/nutrition" element={<ProtectedRoute><NutritionPage /></ProtectedRoute>} />
      <Route path="/focus" element={<ProtectedRoute><FocusPage /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <AppRoutes />
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
