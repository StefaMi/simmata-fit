
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  
  const handleToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4 text-yellow-500" />
      <Switch 
        id="theme-mode"
        checked={theme === "dark"}
        onCheckedChange={handleToggle}
        aria-label="Toggle theme"
        className="data-[state=checked]:bg-slate-700"
      />
      <Moon className="h-4 w-4 text-slate-700 dark:text-slate-400" />
    </div>
  );
}
