
import { supabaseClient } from "@/lib/supabase";
import { loginWithEmail, registerWithEmail, logoutUser, resetUserPassword, verifyUserEmail } from "@/utils/authUtils";

export const authService = {
  login: async (email: string, password: string) => {
    return loginWithEmail(email, password);
  },

  register: async (email: string, password: string, metadata?: {
    first_name?: string;
    last_name?: string;
  }) => {
    // Log the registration attempt for debugging
    console.log("Attempting to register user with email:", email);
    
    const data = await registerWithEmail(email, password, metadata);
    console.log("Registration response:", data);
    
    return data;
  },

  logout: async () => {
    return logoutUser();
  },

  resetPassword: async (email: string) => {
    return resetUserPassword(email);
  },

  verifyEmail: async (token: string) => {
    return verifyUserEmail(token);
  }
};
