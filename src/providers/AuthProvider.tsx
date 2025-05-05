
import { useState, useEffect, ReactNode } from "react";
import { AuthContext } from "@/hooks/useAuth";
import { supabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { loginWithEmail, registerWithEmail, logoutUser, resetUserPassword, verifyUserEmail } from "@/utils/authUtils";

type AuthUser = {
  email: string;
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  isVerified?: boolean;
} | null;

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

    // Set up auth state listener
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (_event, session) => {
        setIsLoading(true);
        if (session?.user) {
          // Get user profile data if available
          let firstName = "";
          let lastName = "";
          
          try {
            const { data: profiles } = await supabaseClient
              .from('user_profiles')
              .select('first_name, last_name')
              .eq('id', session.user.id)
              .single();
              
            if (profiles) {
              firstName = profiles.first_name || "";
              lastName = profiles.last_name || "";
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }

          setUser({
            id: session.user.id,
            email: session.user.email || "",
            isVerified: session.user.email_confirmed_at ? true : false,
            firstName,
            lastName,
            name: firstName ? `${firstName} ${lastName}`.trim() : session.user.email
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
          // Get user profile data if available
          let firstName = "";
          let lastName = "";
          
          try {
            const { data: profiles } = await supabaseClient
              .from('user_profiles')
              .select('first_name, last_name')
              .eq('id', session.user.id)
              .single();
              
            if (profiles) {
              firstName = profiles.first_name || "";
              lastName = profiles.last_name || "";
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }

          setUser({
            id: session.user.id,
            email: session.user.email || "",
            isVerified: session.user.email_confirmed_at ? true : false,
            firstName,
            lastName,
            name: firstName ? `${firstName} ${lastName}`.trim() : session.user.email
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

  // Auth methods
  const login = async (email: string, password: string) => {
    if (!isSupabaseReady) {
      throw new Error("Supabase ist nicht konfiguriert");
    }
    
    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
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
      // Log the registration attempt for debugging
      console.log("Attempting to register user with email:", email);
      
      const data = await registerWithEmail(email, password, metadata);
      console.log("Registration response:", data);
      
      return data;
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
      await logoutUser();
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
      await resetUserPassword(email);
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
    
    return verifyUserEmail(token);
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
