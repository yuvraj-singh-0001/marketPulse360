import React from "react";
import { motion } from "framer-motion";
import { BarChart3, Users, TrendingUp, DollarSign } from "lucide-react";

function Dashboard() {
  const stats = [
    { title: "Users", value: "1,245", icon: <Users size={28} />, color: "from-blue-500 to-indigo-600" },
    { title: "Revenue", value: "$24,560", icon: <DollarSign size={28} />, color: "from-green-500 to-emerald-600" },
    { title: "Growth", value: "+12.5%", icon: <TrendingUp size={28} />, color: "from-pink-500 to-rose-600" },
    { title: "Reports", value: "320", icon: <BarChart3 size={28} />, color: "from-purple-500 to-indigo-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white pt-20 px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto text-center mb-10"
      >
        <h1 className="text-4xl font-extrabold">Welcome Back 👋</h1>
        <p className="mt-2 text-gray-300 text-lg">
          Here’s an overview of your MarketPulse360 dashboard
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
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
    </div>
  );
}

export default Dashboard;
