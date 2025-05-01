
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple translations for demo purposes
const translations: Record<string, Record<string, string>> = {
  de: {
    welcome: "Willkommen",
    login: "Anmelden",
    register: "Registrieren",
    email: "E-Mail",
    password: "Passwort",
    resetPassword: "Passwort zurücksetzen",
    profile: "Profil",
    workout: "Training",
    nutrition: "Ernährung",
    focus: "Fokus",
    progress: "Fortschritt",
  },
  en: {
    welcome: "Welcome",
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    resetPassword: "Reset Password",
    profile: "Profile",
    workout: "Workout",
    nutrition: "Nutrition",
    focus: "Focus",
    progress: "Progress",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("de");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectLanguage = async () => {
      try {
        // Check for saved language preference first
        const savedLanguage = localStorage.getItem("preferredLanguage");
        
        if (savedLanguage) {
          setLanguage(savedLanguage);
          setIsLoading(false);
          return;
        }
        
        // Try to detect language by IP
        // In a real app, you would use a geolocation API service
        try {
          const response = await fetch("https://ipapi.co/json/");
          const data = await response.json();
          
          // Set language based on country code
          // This is simplified, in a real app you'd have more mappings
          if (data.country_code === "DE" || data.country_code === "AT" || data.country_code === "CH") {
            setLanguage("de");
          } else {
            setLanguage("en");
          }
          
          // Save the detected language
          localStorage.setItem("preferredLanguage", language);
        } catch (error) {
          console.error("Error detecting language:", error);
          // Default to German if detection fails
          setLanguage("de");
        }
      } finally {
        setIsLoading(false);
      }
    };

    detectLanguage();
  }, []);

  // Function to get translation
  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  // Update language and save to localStorage
  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("preferredLanguage", lang);
  };

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t,
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Lädt...</div>;
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
