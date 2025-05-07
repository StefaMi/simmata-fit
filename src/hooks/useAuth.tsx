
import { createContext, useContext } from "react";
import { AuthContextType } from "@/types/auth";

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
