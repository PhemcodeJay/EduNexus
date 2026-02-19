import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  CalendarDays,
  Settings,
  LogOut,
  School
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Students", href: "/students", icon: Users },
    { label: "Teachers", href: "/teachers", icon: GraduationCap },
    { label: "Courses", href: "/courses", icon: BookOpen },
    { label: "Finance", href: "/fees", icon: DollarSign },
    { label: "Events", href: "/events", icon: CalendarDays },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border/50 shadow-xl flex flex-col hidden lg:flex">
      {/* Brand */}
      <div className="h-20 flex items-center px-8 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <School className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight">EduNexus</h1>
            <p className="text-xs text-muted-foreground font-medium">School Manager</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <button
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group font-medium",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                {item.label}
              </button>
            </Link>
          );
        })}
      </nav>

      {/* User / Footer */}
      <div className="p-4 border-t border-border/50 bg-secondary/30">
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
              {user?.firstName?.[0] || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.firstName || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || "admin@school.com"}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button 
            onClick={() => logout()}
            className="flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
