
import { createContext, useContext } from "react";

type AuthUser = {
  email: string;
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  isVerified?: boolean;
} | null;

export type AuthContextType = {
  user: AuthUser;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, metadata?: { 
    first_name?: string;
    last_name?: string;
  }) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  isSupabaseReady: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
