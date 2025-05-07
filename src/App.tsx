
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, Suspense, lazy, useState } from "react";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { LanguageProvider } from "./hooks/useLanguage";
import LoadingSpinner from "./components/ui/loading-spinner";
import { initializeTheme } from "./utils/theme";
import IntroSlideshow from "./components/Intro/IntroSlideshow";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"));
const EmailConfirmedPage = lazy(() => import("./pages/EmailConfirmedPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const WorkoutPage = lazy(() => import("./pages/WorkoutPage"));
const WorkoutDashboardPage = lazy(() => import("./pages/WorkoutDashboardPage"));
const SharePage = lazy(() => import("./pages/SharePage"));
const NutritionPage = lazy(() => import("./pages/NutritionPage"));
const FocusPage = lazy(() => import("./pages/FocusPage"));
const ProgressPage = lazy(() => import("./pages/ProgressPage"));
const WorkoutBuilderPage = lazy(() => import("./pages/WorkoutBuilderPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin mode flag for development - set to true for demo mode
const ADMIN_MODE = true;

// Protected route component with improved loading state
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isSupabaseReady } = useAuth();
  
  // Only show loading screen if Supabase is configured and still loading
  if (isLoading && isSupabaseReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <LoadingSpinner size="lg" text="Wird geladen..." />
      </div>
    );
  }
  
  // In admin mode or if Supabase is not configured, always allow access
  if (ADMIN_MODE || user || !isSupabaseReady) {
    return <>{children}</>;
  }
  
  return <Navigate to="/login" replace />;
};

// Loading component
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <LoadingSpinner size="lg" text="Wird geladen..." />
  </div>
);

// Separate AppRoutes to prevent hook logic issues
const AppRoutes = () => {
  const [appReady, setAppReady] = useState(false);
  const { isLoading, isSupabaseReady } = useAuth();
  const [showIntro, setShowIntro] = useState<boolean>(true);
  
  // For mobile adjustments (status bar height, soft keyboard, etc.)
  useEffect(() => {
    // Initialize theme
    initializeTheme();
    
    document.body.classList.add("mobile-app");
    
    // Determine whether to show intro based on localStorage
    const introShown = localStorage.getItem("introShown");
    setShowIntro(!introShown);
    
    // Mark the app as ready once loading is complete
    if (!isLoading) {
      const timer = setTimeout(() => {
        setAppReady(true);
      }, 300); // Small delay to ensure everything is loaded
      
      return () => clearTimeout(timer);
    }
    
    return () => {
      document.body.classList.remove("mobile-app");
    };
  }, [isLoading, isSupabaseReady]);

  return (
    <>
      {/* Only show IntroSlideshow when needed */}
      {showIntro && <IntroSlideshow />}
      
      <Suspense fallback={<PageLoader />}>
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
          <Route path="/workout-dashboard" element={<ProtectedRoute><WorkoutDashboardPage /></ProtectedRoute>} />
          <Route path="/share" element={<ProtectedRoute><SharePage /></ProtectedRoute>} />
          <Route path="/workout-builder" element={<ProtectedRoute><WorkoutBuilderPage /></ProtectedRoute>} />
          <Route path="/nutrition" element={<ProtectedRoute><NutritionPage /></ProtectedRoute>} />
          <Route path="/focus" element={<ProtectedRoute><FocusPage /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

function App() {
  return (
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
  );
}

export default App;
