
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Dumbbell, Heart, User, Home } from "lucide-react";
import UserMenu from "@/components/auth/UserMenu";
import { ModeToggle } from "@/components/ModeToggle";

type Props = {
  children: ReactNode;
  hideNav?: boolean;
};

const Layout = ({ children, hideNav = false }: Props) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Profil", href: "/profile", icon: User },
    { name: "Training", href: "/workout", icon: Dumbbell },
    { name: "Ernährung", href: "/nutrition", icon: Heart },
  ];

  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 transition-colors duration-300">
      {/* Header with navigation */}
      <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-10 backdrop-blur-lg bg-white/80 dark:bg-gray-800/80">
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-fitness-primary to-fitness-accent bg-clip-text text-transparent">
              Rush
            </Link>
            <div className="flex items-center gap-4">
              <ModeToggle />
              <UserMenu />
            </div>
          </div>
          
          {/* Navigation - now at the top */}
          {!hideNav && (
            <nav className="mt-4">
              <div className="grid grid-cols-4 gap-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-md transition-colors ${
                        isCurrentPath(item.href)
                          ? "text-fitness-primary dark:text-fitness-accent bg-fitness-primary/10 dark:bg-fitness-accent/20"
                          : "text-gray-500 hover:text-fitness-primary dark:text-gray-300 dark:hover:text-fitness-accent hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs mt-1">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto py-8 px-4 dark:text-white">
        {children}
      </main>
    </div>
  );
};

export default Layout;
