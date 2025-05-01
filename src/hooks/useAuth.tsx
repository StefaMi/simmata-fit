
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { AuthError, Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

type AuthUser = {
  email: string;
  id: string;
  name?: string;
  isVerified?: boolean;
} | null;

type AuthContextType = {
  user: AuthUser;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  isSupabaseReady: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isSupabaseReady = isSupabaseConfigured();
  const { toast } = useToast();
  
  // Show warning toast if Supabase is not configured
  useEffect(() => {
    if (!isSupabaseReady) {
      toast({
        title: "Supabase not configured",
        description: "Authentication features won't work without Supabase credentials",
        variant: "destructive",
      });
    }
  }, [isSupabaseReady, toast]);

  // Update user state when auth state changes
  useEffect(() => {
    if (!isSupabaseReady) {
      setIsLoading(false);
      return;
    }

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoading(true);
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            isVerified: session.user.email_confirmed_at ? true : false,
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            isVerified: session.user.email_confirmed_at ? true : false,
          });
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [isSupabaseReady, toast]);

  const login = async (email: string, password: string) => {
    if (!isSupabaseReady) {
      throw new Error("Supabase is not configured");
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    if (!isSupabaseReady) {
      throw new Error("Supabase is not configured");
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    if (!isSupabaseReady) {
      throw new Error("Supabase is not configured");
    }
    
    // With Supabase, email verification is handled automatically
    // This function remains for API consistency but won't do anything
    console.log("Email verification token:", token);
    return Promise.resolve();
  };

  const logout = async () => {
    if (!isSupabaseReady) {
      throw new Error("Supabase is not configured");
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseReady) {
      throw new Error("Supabase is not configured");
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
