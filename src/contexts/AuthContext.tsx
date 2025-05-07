
// This file is now deprecated
// All AuthContext functionality has been moved to src/hooks/useAuth.tsx and src/types/auth.ts
// This file is kept for backward compatibility but should not be used directly
import { createContext } from "react";
import { AuthContextType } from "@/types/auth";

// Create and export the context with a default empty object
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provide a hook to use the auth context for backward compatibility
export const useAuthContext = () => {
  console.warn(
    "useAuthContext is deprecated. Please use useAuth from @/hooks/useAuth instead."
  );
  const context = createContext<AuthContextType | undefined>(undefined);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
