
import { ReactNode } from "react";
import UserMenu from "@/components/auth/UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";

type Props = {
  children: ReactNode;
  hideNav?: boolean;
  showHeader?: boolean;
  title?: string;
  customHeader?: ReactNode;
};

const Layout = ({ 
  children, 
  showHeader = true,
  title,
  customHeader
}: Props) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {showHeader && (
        <header className="sticky top-0 z-10 border-b border-slate-800/50 bg-background backdrop-blur-md">
          <div className="container mx-auto py-4 px-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {customHeader ? customHeader : (
                  <h1 className="text-xl font-semibold">
                    {title ? title : "Rush"}
                  </h1>
                )}
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
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
    </div>
  );
};

export default Layout;
