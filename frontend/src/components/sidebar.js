import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Home, 
  Package, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

function Sidebar({ activeTab, setActiveTab }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'delivery', label: 'Delivery', icon: <Package size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={`bg-gradient-to-b from-gray-800 to-gray-900 text-white h-screen fixed left-0 top-0 ${
        isCollapsed ? 'w-16' : 'w-64'
      } transition-all duration-300 z-50`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-white"
            >
              MarketPulse360
            </motion.h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-700 transition"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center p-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="ml-3 font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <div className="border-t border-gray-700 pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition"
          >
            <LogOut size={20} />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ml-3 font-medium"
              >
                Logout
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default Sidebar;