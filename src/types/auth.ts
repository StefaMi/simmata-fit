
export type AuthUser = {
  email: string;
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  isVerified?: boolean;
} | null;

export interface AuthContextType {
  user: AuthUser;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, metadata?: {
    first_name?: string;
    last_name?: string;
  }) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<any>;
  isSupabaseReady: boolean;
}
