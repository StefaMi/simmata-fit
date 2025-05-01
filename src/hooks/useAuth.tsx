
import { useState, useEffect, createContext, useContext, ReactNode } from "react";

type User = {
  email: string;
  id?: string;
  name?: string;
  isVerified?: boolean;
} | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user in localStorage
    const checkAuth = async () => {
      try {
        const authUserJSON = localStorage.getItem("authUser");
        if (authUserJSON) {
          const authUser = JSON.parse(authUserJSON);
          setUser(authUser);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Will be replaced with actual Supabase auth
      // Mock login for now
      const mockUser = { email, isVerified: true };
      localStorage.setItem("authUser", JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Will be replaced with actual Supabase auth
      // Mock registration for now - note we're not setting the user
      // because they need to verify their email first
      
      // In a real implementation with Supabase, this would send a verification email
      console.log("Email verification would be sent to:", email);
      
      // Store in localStorage for demo purposes that this user started registration
      localStorage.setItem("pendingVerification", email);
      
      // We don't set the user here since they need to verify first
      
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    setIsLoading(true);
    try {
      // TODO: Will be replaced with actual Supabase auth
      // Mock email verification for now
      const pendingEmail = localStorage.getItem("pendingVerification");
      
      if (pendingEmail) {
        // In a real implementation, we would verify the token with Supabase
        
        // Create the verified user
        const mockUser = { email: pendingEmail, isVerified: true };
        localStorage.setItem("authUser", JSON.stringify(mockUser));
        localStorage.removeItem("pendingVerification");
        setUser(mockUser);
      }
    } catch (error) {
      console.error("Email verification error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // TODO: Will be replaced with actual Supabase auth
      localStorage.removeItem("authUser");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // TODO: Will be implemented with Supabase
      console.log("Password reset for:", email);
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
    verifyEmail
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
