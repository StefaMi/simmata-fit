
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Dumbbell, BarChart3, Settings } from "lucide-react";

const BottomTabBar = () => {
  const location = useLocation();
  const path = location.pathname;

  const tabs = [
    {
      name: "Übersicht",
      path: "/",
      icon: Home,
    },
    {
      name: "Fitness+",
      path: "/workout",
      icon: Dumbbell,
    },
    {
      name: "Teilen",
      path: "/progress",
      icon: BarChart3,
    },
    {
      name: "Profil",
      path: "/profile",
      icon: Settings,
    },
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
            className={`tab-item ${isActive ? "active" : ""}`}
          >
            <Icon className={`h-6 w-6 ${isActive ? "" : "text-muted-foreground"}`} />
            <span className={`text-xs mt-1 ${isActive ? "" : "text-muted-foreground"}`}>
              {tab.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomTabBar;
