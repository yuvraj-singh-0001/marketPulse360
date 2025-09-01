import React, { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Users, TrendingUp, DollarSign, Package } from "lucide-react";
import Sidebar from "../components/sidebar";
import DeliveryForm from "../components/DeliveryForm";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  
  const stats = [
    { title: "Users", value: "1,245", icon: <Users size={28} />, color: "from-blue-500 to-indigo-600" },
    { title: "Revenue", value: "$24,560", icon: <DollarSign size={28} />, color: "from-green-500 to-emerald-600" },
    { title: "Growth", value: "+12.5%", icon: <TrendingUp size={28} />, color: "from-pink-500 to-rose-600" },
    { title: "Deliveries", value: "320", icon: <Package size={28} />, color: "from-purple-500 to-indigo-600" },
  ];

  // Calculate main content margin based on sidebar state
  const mainContentMargin = isSidebarCollapsed ? 'ml-16' : 'ml-64';

  const renderContent = () => {
    switch (activeTab) {
      case "delivery":
        return <DeliveryForm />;
      
      case "dashboard":
      default:
        return (
          <>
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
            >
              {stats.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className={`bg-gradient-to-r ${item.color} p-6 rounded-2xl shadow-lg flex items-center justify-between`}
                >
                  <div>
                    <p className="text-gray-200 text-sm">{item.title}</p>
                    <h2 className="text-2xl font-bold">{item.value}</h2>
                  </div>
                  <div className="text-white">{item.icon}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
            >
              <h2 className="text-2xl font-bold mb-4">Welcome to MarketPulse360! 🎉</h2>
              <p className="text-gray-300">
                Manage your deliveries, track analytics, and grow your business from one centralized dashboard.
              </p>
            </motion.div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white flex">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      
      {/* Main Content - Responsive to sidebar */}
      <div className={`flex-1 ${mainContentMargin} transition-all duration-300 `}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bt-6"
        >
         
        </motion.div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
}

export default Dashboard;