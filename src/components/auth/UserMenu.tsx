
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { LogIn, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const UserMenu = () => {
  const { user, logout, isLoading } = useAuth();
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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="w-36 h-8 rounded-md" />
      </div>
    );
  }

  // If user is not logged in, show login button
  if (!user) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate("/login")}
        className="flex items-center gap-2"
      >
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:inline">Anmelden</span>
      </Button>
    );
  }

  // Get display name prioritizing firstName and lastName, falling back to other options
  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.firstName || user.lastName || user.name || user.email;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-primary/10 p-1">
          <User className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm font-medium hidden md:inline-block">
          {`Hallo, ${displayName}!`}
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
