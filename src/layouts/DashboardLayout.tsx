import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Camera, LayoutDashboard, Calendar, Users, Package, CreditCard, Settings, LogOut, FileText, Menu, X } from "lucide-react";
import { auth } from "../firebase/config";
import { useState } from "react";

export const DashboardLayout = () => {
  const { userProfile } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const links = [
    { name: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Bookings", path: "/admin/bookings", icon: Calendar },
    { name: "Clients", path: "/admin/clients", icon: Users },
    { name: "Packages", path: "/admin/packages", icon: Package },
    { name: "Payments", path: "/admin/payments", icon: CreditCard },
    { name: "Reports", path: "/admin/reports", icon: FileText },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <div className="flex h-screen bg-dark">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-dark-paper border-r border-gray-800 flex flex-col transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="h-20 flex items-center justify-between px-4 border-b border-gray-800">
          <Link to="/" className="flex items-center space-x-3">
            <Camera className="h-8 w-8 text-primary shrink-0" />
            <span className="font-serif text-[15px] font-bold tracking-wider text-light leading-tight">
              Photography<br/>Booking System
            </span>
          </Link>
          <button 
            className="md:hidden text-gray-400 hover:text-light"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 py-6 overflow-y-auto">
          <nav className="space-y-1 px-4">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-gray-400 hover:bg-gray-800 hover:text-light"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 px-4 py-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-primary font-serif text-lg shrink-0">
              {userProfile?.name?.charAt(0) || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-light truncate">{userProfile?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{userProfile?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-dark-paper border-b border-gray-800 flex items-center px-4 shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-400 hover:text-light"
          >
            <Menu size={24} />
          </button>
          <span className="ml-4 font-serif text-primary font-medium">Admin Dashboard</span>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-dark p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};