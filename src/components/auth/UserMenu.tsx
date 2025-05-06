
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { LogIn, LogOut, Menu, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    return <Skeleton className="h-9 w-9 rounded-full" />;
  }

  // If user is not logged in, show login button
  if (!user) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate("/login")}
        className="flex items-center gap-2 text-white rounded-full p-2"
      >
        <LogIn className="h-5 w-5" />
      </Button>
    );
  }

  // Get display name prioritizing firstName and lastName
  const initials = user.firstName && user.lastName 
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` 
    : user.firstName?.charAt(0) || user.email?.charAt(0) || "U";

  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.firstName || user.name || user.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full bg-slate-600/40 h-10 w-10">
          <div className="text-lg font-medium text-white">{initials}</div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          {`${displayName}`}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>Account</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/workout")}>
          <span>Fitness+</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Abmelden</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
