
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { LanguageProvider } from "./hooks/useLanguage";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ProfilePage from "./pages/ProfilePage";
import WorkoutPage from "./pages/WorkoutPage";
import NutritionPage from "./pages/NutritionPage";
import FocusPage from "./pages/FocusPage"; 
import ProgressPage from "./pages/ProgressPage";
import DashboardPage from "./pages/DashboardPage";
import WorkoutBuilderPage from "./pages/WorkoutBuilderPage";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/components/theme-provider";

// Admin mode flag for development - set to true to bypass authentication
const ADMIN_MODE = true;

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-pulse text-fitness-primary dark:text-fitness-accent font-bold">Lädt...</div>
      </div>
    );
  }
  
  // In admin mode, always allow access
  if (ADMIN_MODE || user) {
    return <>{children}</>;
  }
  
  return <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { user } = useAuth();

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
      
      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
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

// Create the QueryClient
function App() {
  // Create a new QueryClient instance inside the component
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <AppRoutes />
              </TooltipProvider>
            </QueryClientProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
