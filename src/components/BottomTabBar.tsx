
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Dumbbell, Users } from "lucide-react";

const BottomTabBar = () => {
  const location = useLocation();
  const path = location.pathname;

  const tabs = [
    {
      name: "Übersicht",
      path: "/",
      icon: Home,
      activeColor: "#b1fc31"
    },
    {
      name: "Rush",
      path: "/workout",
      icon: Dumbbell,
      activeColor: "#b1fc31"
    },
    {
      name: "Teilen",
      path: "/progress",
      icon: Users,
      activeColor: "#b1fc31"
    }
  ];

  return (
    <div className="tab-bar">
      {tabs.map((tab) => {
        const isActive = path === tab.path || (tab.path !== "/" && path.startsWith(tab.path));
        const Icon = tab.icon;
        
        return (
          <Link 
            key={tab.name} 
            to={tab.path}
            className="tab-item"
          >
            <Icon 
              className={`h-6 w-6 ${isActive ? "" : "text-muted-foreground"}`} 
              color={isActive ? tab.activeColor : undefined}
            />
            <span className={`text-xs mt-1 ${isActive ? "" : "text-muted-foreground"}`}
                 style={{ color: isActive ? tab.activeColor : undefined }}>
              {tab.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomTabBar;
