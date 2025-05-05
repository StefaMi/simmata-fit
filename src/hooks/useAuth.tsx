
import { createContext, useContext } from "react";

// Define the type for the AuthContext
type AuthContextType = {
  user: any;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, metadata?: any) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<any>;
  isSupabaseReady: boolean;
};

// Create the AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export AuthProvider from the providers directory
export { AuthProvider } from "@/providers/AuthProvider";

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
