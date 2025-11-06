import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/navbar";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMsg("Registration successful!");
        // auto-login
        const loginRes = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        const loginData = await loginRes.json();

        if (loginRes.ok && loginData.success) {
          localStorage.setItem("user", JSON.stringify(loginData.user));
          setTimeout(() => navigate("/dashboard"), 800);
        } else {
          setMsg("Registered! Please login manually.");
          setTimeout(() => navigate("/login"), 1000);
        }
      } else {
        setMsg(data.message || "Registration failed");
      }
    } catch (e2) {
      setMsg("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#A56AF0]/20 flex items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-6xl rounded-[30px] overflow-hidden shadow-2xl">
        {/* Background halves */}
        <div className="absolute inset-0 md:grid md:grid-cols-12 pointer-events-none">
          <div className="hidden md:block md:col-span-7 bg-[#1c0f52]">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/60 via-indigo-700 to-violet-900" />
              <div className="absolute -right-24 top-24 h-96 w-96 rounded-full blur-3xl opacity-60 bg-fuchsia-500" />
              <div className="absolute right-10 bottom-10 h-80 w-80 rounded-full blur-3xl opacity-60 bg-cyan-400" />
              <div className="absolute left-10 top-1/3 h-64 w-64 rounded-full blur-3xl opacity-60 bg-purple-400" />
            </div>
          </div>
          <div className="md:col-span-5 bg-white" />
        </div>

        {/* Content */}
        <div className="relative grid md:grid-cols-12">
          {/* Left white form */}
          <div className="order-2 md:order-1 md:col-span-5 bg-white p-8 md:p-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="h-9 w-9 rounded-lg grid place-items-center bg-slate-900 text-white">
                <span className="text-xs font-bold">MP</span>
              </div>
              <div className="font-semibold tracking-tight">MarketPulse360</div>
            </div>

            <div className="mx-auto w-full max-w-sm">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Create account</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="name"
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3.5 border border-slate-300 rounded-full outline-none focus:border-indigo-500"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3.5 border border-slate-300 rounded-full outline-none focus:border-indigo-500"
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full p-3.5 border border-slate-300 rounded-full outline-none focus:border-indigo-500"
                />

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full rounded-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3.5 shadow transition disabled:opacity-60"
                >
                  {loading ? "Registering..." : "Create account"}
                </motion.button>
              </form>

              {msg && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center text-sm text-slate-700">
                  {msg}
                </motion.p>
              )}

              <p className="mt-4 text-sm text-slate-600 text-center">
                Already a member?{" "}
                <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </div>

          {/* Right gradient hero */}
          <div className="order-1 md:order-2 md:col-span-7 relative p-6 md:p-10">
            <Navbar />
            <div className="mt-20 md:mt-28 text-white max-w-xl">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-sm">
                Welcome<span className="text-white">.</span>
              </h1>
              <p className="mt-4 text-white/85 leading-relaxed">
Set up your workspace and start managing sales, projects, invoices, and team operations with a powerful business management dashboard.
              </p>

            </div>
          </div>
        </div>
      </div>

      <div className="absolute -z-10 h-10 w-[80%] max-w-5xl rounded-full bg-black/10 blur-2xl" />
    </div>
  );
}

export default Register;
