
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserMenu = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Erfolgreich abgemeldet",
        description: "Auf Wiedersehen!",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Fehler beim Abmelden",
        description: "Bitte versuche es erneut.",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-primary/10 p-1">
          <User className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm font-medium hidden md:inline-block">
          {user.name ? `Hallo, ${user.firstName || user.name}!` : user.email}
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleLogout}
        title="Abmelden"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default UserMenu;
