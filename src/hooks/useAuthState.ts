
import { useState, useEffect } from "react";
import { supabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { AuthUser } from "@/types/auth";
import { useToast } from "@/components/ui/use-toast";

export function useAuthState() {
  const [user, setUser] = useState<AuthUser>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isSupabaseReady = isSupabaseConfigured();
  const { toast } = useToast();

  // Show warning toast if Supabase is not configured
  useEffect(() => {
    if (!isSupabaseReady) {
      console.log("Supabase is not configured. Continuing without authentication.");
      setIsLoading(false);
      toast({
        title: "Demo-Modus aktiv",
        description: "Die App läuft im Demo-Modus ohne Authentifizierung",
      });
    }
  }, [isSupabaseReady, toast]);

  // Update user state when auth state changes
  useEffect(() => {
    // If Supabase is not configured, don't listen for auth changes
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
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [isSupabaseReady, toast]);

  return {
    user, 
    setUser,
    isLoading,
    setIsLoading,
    isSupabaseReady
  };
}
