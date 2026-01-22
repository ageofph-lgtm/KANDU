import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { createPageUrl } from "@/utils";
import {
  Home,
  Search,
  Plus,
  MessageCircle,
  User,
  FileText,
  Calendar,
  Shield,
  Briefcase,
  Bell
} from "lucide-react";

const defaultNavItems = [
  { id: "home", icon: Home, label: "Home", page: "Dashboard" },
  { id: "search", icon: Search, label: "Buscar", page: "Dashboard" },
  { id: "add", icon: Plus, label: "Add", page: "NewJob", isFab: true },
  { id: "chat", icon: MessageCircle, label: "Chat", page: "Chat" },
  { id: "profile", icon: User, label: "Perfil", page: "Profile" },
];

const workerNavItems = [
  { id: "home", icon: Home, label: "Home", page: "Dashboard" },
  { id: "jobs", icon: Briefcase, label: "Jobs", page: "Applications" },
  { id: "add", icon: Plus, label: "Add", page: "NewJob", isFab: true },
  { id: "chat", icon: MessageCircle, label: "Chat", page: "Chat" },
  { id: "profile", icon: User, label: "Perfil", page: "Profile" },
];

const adminNavItems = [
  { id: "overview", icon: Home, label: "Overview", page: "AdminDashboard" },
  { id: "users", icon: User, label: "Users", page: "AdminDashboard" },
  { id: "add", icon: Plus, label: "Projects", page: "NewJob", isFab: true },
  { id: "alerts", icon: Bell, label: "Alerts", page: "Notifications" },
  { id: "settings", icon: Shield, label: "Settings", page: "AdminDashboard" },
];

export default function BottomNav({ userType = "employer", unreadChat = 0, unreadNotifications = 0 }) {
  const location = useLocation();
  
  const navItems = userType === "admin" 
    ? adminNavItems 
    : userType === "worker" 
      ? workerNavItems 
      : defaultNavItems;

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      {/* Floating Nav Container */}
      <div className="bg-[var(--surface)] rounded-2xl shadow-xl border border-[var(--border)] px-2 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === createPageUrl(item.page);
            const hasNotification = (item.id === "chat" && unreadChat > 0) || 
                                   (item.id === "alerts" && unreadNotifications > 0);

            // FAB (Central Floating Action Button)
            if (item.isFab) {
              return (
                <Link
                  key={item.id}
                  to={createPageUrl(item.page)}
                  className="relative -mt-8"
                >
                  <div 
                    className="w-14 h-14 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
                    style={{ boxShadow: '0 4px 20px rgba(255, 122, 0, 0.5)' }}
                  >
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={item.id}
                to={createPageUrl(item.page)}
                className={cn(
                  "relative flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all",
                  isActive 
                    ? "text-[var(--primary)] bg-[var(--primary)]/10" 
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                )}
              >
                <div className="relative">
                  <item.icon className="w-5 h-5" />
                  
                  {/* Notification Badge */}
                  {hasNotification && (
                    <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 flex items-center justify-center text-[10px] font-bold bg-[var(--error)] text-white rounded-full">
                      {item.id === "chat" ? (unreadChat > 9 ? "9+" : unreadChat) : (unreadNotifications > 9 ? "9+" : unreadNotifications)}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}