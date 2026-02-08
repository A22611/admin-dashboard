import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Squares2X2Icon, 
  ShoppingBagIcon, 
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: Squares2X2Icon },
    { name: "Products", path: "/products", icon: ShoppingBagIcon },
  ];

  return (
    <>
      {/* Mobile Menu Button - Only shows on small screens */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-3 left-4 z-50 p-2 bg-purple-600 rounded-lg text-white shadow-lg"
      >
        {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#111] border-r border-white/5 text-white 
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6">
            <h2 className="text-2xl font-bold tracking-tight text-purple-500">Admin</h2>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Settings Icon */}
          <div className="p-6 border-t border-white/5">
            <button className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
              <Cog6ToothIcon className="h-6 w-6" />
              <span className="text-sm font-medium">Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay - Darkens background when sidebar is open */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
    </>
  );
}