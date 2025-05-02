
import { AuthError } from "@supabase/supabase-js";
import { supabaseClient } from "@/lib/supabase";

// Helper function for login
export const loginWithEmail = async (email: string, password: string) => {
  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
};

// Helper function for registration
export const registerWithEmail = async (email: string, password: string) => {
  // First check if the email exists already
  const { data: existingUsers, error: checkError } = await supabaseClient
    .from('profiles')
    .select('email')
    .eq('email', email)
    .limit(1);
  
  if (checkError) {
    console.error("Error checking existing user:", checkError);
  }
  
  // If email exists, throw an error
  if (existingUsers && existingUsers.length > 0) {
    throw new Error("Diese Email ist bereits registriert. Bitte melden Sie sich an oder verwenden Sie eine andere Email-Adresse.");
  }
  
  // Proceed with registration
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/verify-email`,
    },
  });
  
  if (error) {
    console.error("Supabase registration error:", error);
    
    // Handle specific Supabase errors with user-friendly messages
    if (error.message.includes("already registered")) {
      throw new Error("Diese Email ist bereits registriert. Bitte melden Sie sich an oder verwenden Sie eine andere Email-Adresse.");
    }
    
    throw error;
  }
  
  // If user is already registered
  if (data?.user?.identities && data.user.identities.length === 0) {
    throw new Error("Diese Email ist bereits registriert. Bitte melden Sie sich an oder verwenden Sie eine andere Email-Adresse.");
  }
  
  return data;
};

// Helper function for logout
export const logoutUser = async () => {
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
};

// Helper function for password reset
export const resetUserPassword = async (email: string) => {
  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
};

// Helper function for email verification
export const verifyUserEmail = async (token: string) => {
  console.log("Email verification token:", token);
  return Promise.resolve();
};
