"use client";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const baseLink = "text-base font-medium transition-colors";
  const inactive = "text-muted-foreground hover:text-foreground";
  const active = "text-foreground";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                [baseLink, isActive ? active : inactive].join(" ")
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/employee"
              className={({ isActive }) =>
                [baseLink, isActive ? active : inactive].join(" ")
              }
            >
              Employee
            </NavLink>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{user.name || user.email}</span>
                {user.role && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-muted">
                    {user.role}
                  </span>
                )}
              </div>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 active:translate-y-px border border-border hover:bg-muted/60 h-9 px-4 text-sm bg-transparent"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
