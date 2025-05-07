
import { ReactNode } from "react";
import { AuthContext } from "@/hooks/useAuth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useAuthState } from "@/hooks/useAuthState";
import { authService } from "@/services/authService";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { 
    user, 
    isLoading, 
    setIsLoading,
    isSupabaseReady 
  } = useAuthState();
  
  // Auth methods
  const login = async (email: string, password: string) => {
    if (!isSupabaseReady) {
      throw new Error("Supabase ist nicht konfiguriert");
    }
    
    setIsLoading(true);
    try {
      await authService.login(email, password);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, metadata?: {
    first_name?: string;
    last_name?: string;
  }) => {
    if (!isSupabaseReady) {
      throw new Error("Supabase ist nicht konfiguriert");
    }
    
    setIsLoading(true);
    try {
      return await authService.register(email, password, metadata);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!isSupabaseReady) {
      throw new Error("Supabase ist nicht konfiguriert");
    }
    
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseReady) {
      throw new Error("Supabase ist nicht konfiguriert");
    }
    
    setIsLoading(true);
    try {
      await authService.resetPassword(email);
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    if (!isSupabaseReady) {
      throw new Error("Supabase ist nicht konfiguriert");
    }
    
    return authService.verifyEmail(token);
  };

  // Create context value object
  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    resetPassword,
    verifyEmail,
    isSupabaseReady
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
