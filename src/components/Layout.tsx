
import { ReactNode } from "react";
import BottomTabBar from "@/components/BottomTabBar";
import { ModeToggle } from "@/components/ModeToggle";
import UserMenu from "@/components/auth/UserMenu";

type Props = {
  children: ReactNode;
  hideNav?: boolean;
  showHeader?: boolean;
  title?: string;
};

const Layout = ({ 
  children, 
  hideNav = false,
  showHeader = true,
  title 
}: Props) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 pb-20">
      {showHeader && (
        <header className="bg-card/80 dark:bg-card/60 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="container mx-auto py-4 px-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {title ? (
                  <h1 className="text-xl font-semibold">{title}</h1>
                ) : (
                  <h1 className="text-xl font-semibold text-gradient">Rush</h1>
                )}
              </div>
              <div className="flex items-center gap-4">
                <ModeToggle />
                <UserMenu />
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Content */}
      <main className="flex-1 container mx-auto py-5 px-4">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      {!hideNav && <BottomTabBar />}
    </div>
  );
};

export default Layout;
