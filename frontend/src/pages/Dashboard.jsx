import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Truck, TrendingUp, DollarSign, Package } from "lucide-react";
import Sidebar from "../components/sidebar";
import DeliveryForm from "../components/DeliveryForm";
import axios from "axios";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [statsData, setStatsData] = useState({
    totalDeliveries: 0,
    pending: 0,
    processing: 0,
    delivered: 0,
    today: 0,
  });

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard/stats");
        setStatsData(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { title: "Manage Delivery", value: statsData.pending, icon: <Truck size={28} />, color: "from-blue-500 to-indigo-600", tab: "delivery" },
    { title: "Revenue", value: "₹25,000", icon: <DollarSign size={28} />, color: "from-green-500 to-emerald-600" },
    { title: "Growth", value: statsData.today, icon: <TrendingUp size={28} />, color: "from-pink-500 to-rose-600" },
    { title: "Deliveries", value: statsData.totalDeliveries, icon: <Package size={28} />, color: "from-purple-500 to-indigo-600" },
  ];

  const mainContentMargin = isSidebarCollapsed ? "ml-16" : "ml-64";

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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10 mx-4 mt-6"
            >
              {stats.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => item.tab && setActiveTab(item.tab)}
                  className={`cursor-pointer bg-gradient-to-r ${item.color} p-6 rounded-2xl shadow-lg flex items-center justify-between`}
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
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      <div className={`flex-1 ${mainContentMargin} transition-all duration-300`}>
        {renderContent()}
      </div>
    </div>
  );
}

export default Dashboard;
