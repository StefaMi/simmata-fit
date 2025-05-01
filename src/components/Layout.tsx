
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dumbbell, Heart, User, Home } from "lucide-react";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Profil", href: "/profile", icon: User },
    { name: "Training", href: "/workout", icon: Dumbbell },
    { name: "Ernährung", href: "/nutrition", icon: Heart },
  ];

  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-fitness-primary">Simmata Fit</Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto py-8 px-4">{children}</main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 z-50 w-full bg-white border-t border-gray-200 md:hidden">
        <div className="grid h-16 grid-cols-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center font-medium ${
                  isCurrentPath(item.href)
                    ? "text-fitness-primary"
                    : "text-gray-500 hover:text-fitness-primary"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Navigation */}
      <nav className="hidden md:block border-b bg-white shadow-sm">
        <div className="container mx-auto">
          <div className="flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 ${
                    isCurrentPath(item.href)
                      ? "border-fitness-primary text-fitness-primary"
                      : "border-transparent text-gray-500 hover:text-fitness-primary"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
