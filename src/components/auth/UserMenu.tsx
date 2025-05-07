
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Home, LogIn, LogOut, Share, Dumbbell, User, Settings } from "lucide-react";
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
import { DarkModeToggle } from "@/components/DarkModeToggle";

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
      <div className="flex items-center gap-2">
        <DarkModeToggle />
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-white rounded-full p-2"
        >
          <LogIn className="h-5 w-5" />
        </Button>
      </div>
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
    <div className="flex items-center gap-2">
      <DarkModeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 h-10 w-10 text-white">
            <div className="text-lg font-medium">{initials}</div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 backdrop-blur-md bg-background/80 border border-slate-200 dark:border-slate-800">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/")}>
            <Home className="mr-2 h-4 w-4" />
            <span>Übersicht</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/workout")}>
            <Dumbbell className="mr-2 h-4 w-4" />
            <span>Rush</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/workout-builder")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Trainingsplan</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/share")}>
            <Share className="mr-2 h-4 w-4" />
            <span>Teilen</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Abmelden</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
