
import { toggleTheme } from "@/utils/theme";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = useState<string>("");

  useEffect(() => {
    // Initialize state based on document class
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    // Set up a mutation observer to track changes to the HTML class attribute
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const isDarkMode = document.documentElement.classList.contains("dark");
          setTheme(isDarkMode ? "dark" : "light");
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const handleToggle = () => {
    toggleTheme();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="rounded-full w-9 h-9"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-yellow-200" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}
