import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Login successful!");
        setTimeout(() => navigate("/dashboard"), 1500); // redirect after login
      } else {
        setMessage(`❌ ${data.message || "Login failed"}`);
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setMessage("❌ Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-[380px]"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
            name="email"
            type="email"
            placeholder="Email Address "
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border-1 border-gray-300 rounded-lg focus:border-blue-900 focus:ring-2 focus:ring-blue-900 focus:outline-none"
          />

          <motion.input
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 border-1 border-gray-300 rounded-lg focus:border-blue-900 focus:ring-2 focus:ring-blue-900 focus:outline-none"
          />

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mt-4 text-center text-sm font-medium text-gray-700"
          >
            {message}
          </motion.p>
        )}

        <p className="mt-4 text-sm text-gray-600 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
