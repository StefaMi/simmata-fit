
import { useAuthContext } from "@/contexts/AuthContext";

export const useAuth = () => {
  return useAuthContext();
};

export { AuthProvider } from "@/providers/AuthProvider";
export type { AuthContextType } from "@/contexts/AuthContext";
