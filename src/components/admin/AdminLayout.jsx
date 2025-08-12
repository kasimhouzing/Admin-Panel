import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast"; // Import useToast
import {
  Home,
  Users,
  Building2,
  UserCog,
  ClipboardList,
  Menu,
  X,
  LogOut,
  Tent,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
//import { machine } from "os";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Login Management", href: "/admin/logins", icon: UserCog },
  { name: "Contractor Management", href: "/admin/contractors", icon: Building2 },
  { name: "Labor Management", href: "/admin/laborers", icon: Users },
  { name: "Camp Management", href: "/admin/Campmanagement", icon: Tent },
  { name: "Attendance Report", href: "/admin/attendance", icon: ClipboardList },
  // Added the icon property
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast(); // Initialize useToast hook

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    // Add toast notification for successful logout
    toast({
      title: "Logout Successful",
      description: "You have been logged out.",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-admin-bg">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 flex z-40 md:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-admin-sidebar">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <SidebarContent />
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-admin-sidebar">
          <SidebarContent />
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top header */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-admin-header shadow-sm border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden ml-4"
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex-1 px-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-foreground">
              Lodha Stella - Camp Management
            </h1>

            <div className="flex items-center space-x-4">
              {/* <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button> */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent() {
  const location = useLocation();

  return (
    <>
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-admin-sidebar">
        <Building2 className="h-8 w-8 text-white" />
        <span className="ml-3 text-white font-bold text-lg">Admin Panel</span>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-white hover:bg-admin-sidebar-hover"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive ? "text-primary-foreground" : "text-white"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}