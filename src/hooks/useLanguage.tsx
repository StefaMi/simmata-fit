
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
    // Use a safe way to detect the language
    const detectLanguage = () => {
      try {
        // Check for saved language preference first
        const savedLanguage = localStorage.getItem("preferredLanguage");
        
        if (savedLanguage) {
          setLanguage(savedLanguage);
        } else {
          // Default to German if no saved preference
          setLanguage("de");
          localStorage.setItem("preferredLanguage", "de");
        }
      } catch (error) {
        console.error("Error detecting language:", error);
        // Default to German if detection fails
        setLanguage("de");
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
    try {
      localStorage.setItem("preferredLanguage", lang);
    } catch (error) {
      console.error("Error saving language preference:", error);
    }
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
