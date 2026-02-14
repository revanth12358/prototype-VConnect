import { useAuth } from "@/contexts/AuthContext";
import { Activity, MessageSquare, Users, Settings, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { icon: Activity, label: "Dashboard", path: "/" },
  { icon: MessageSquare, label: "Chat AI", path: "/chat" },
  { icon: Users, label: "Contacts", path: "/contacts" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Navbar = () => {
  const { signOut } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-xl font-heading font-bold text-foreground">
            Mind<span className="text-primary">Link</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === path
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-muted transition-colors ml-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
