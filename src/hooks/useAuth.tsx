
import { createContext, useContext, ReactNode } from "react";
import { AuthProvider as AuthProviderComponent } from "@/providers/AuthProvider";

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

// Create a context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export the AuthProvider component from the providers directory
export const AuthProvider = AuthProviderComponent;

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Export the context for use in the provider
export { AuthContext };
