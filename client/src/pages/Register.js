import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Navbar from "../components/navbar";

const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.35, ease: "easeOut" },
  }),
};

const formShake = {
  idle: { x: 0 },
  shake: {
    x: [0, -8, 8, -6, 6, -4, 4, -2, 2, 0],
    transition: { duration: 0.45, ease: "easeInOut" },
  },
};

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // motion helpers
  const prefersReduced = useReducedMotion();
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

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

  // 3D tilt on the card
  const onMouseMove = (e) => {
    if (prefersReduced) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * 6;   // rotateY
    const rx = (0.5 - py) * 6;   // rotateX
    setTilt({ rx, ry });
  };
  const onMouseLeave = () => setTilt({ rx: 0, ry: 0 });

  // decide if we should shake on error-ish message
  const shouldShake = msg && !/successful/i.test(msg);

  return (
    <div className="min-h-screen bg-[#A56AF0]/20 flex items-center justify-center px-4 py-10">
      <motion.div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ transformStyle: "preserve-3d" }}
        animate={{
          rotateX: prefersReduced ? 0 : tilt.rx,
          rotateY: prefersReduced ? 0 : tilt.ry,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 12, mass: 0.8 }}
        className="relative w-full max-w-6xl rounded-[30px] overflow-hidden shadow-2xl will-change-transform"
      >
        {/* Background halves */}
        <div className="absolute inset-0 md:grid md:grid-cols-12 pointer-events-none">
          <div className="hidden md:block md:col-span-7 bg-[#1c0f52]">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/60 via-indigo-700 to-violet-900" />
              {/* floating blobs */}
              <motion.div
                className="absolute -right-24 top-24 h-96 w-96 rounded-full blur-3xl opacity-60 bg-fuchsia-500"
                animate={prefersReduced ? {} : { y: [0, -15, 0], x: [0, 10, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute right-10 bottom-10 h-80 w-80 rounded-full blur-3xl opacity-60 bg-cyan-400"
                animate={prefersReduced ? {} : { y: [0, 12, 0], x: [0, -12, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute left-10 top-1/3 h-64 w-64 rounded-full blur-3xl opacity-60 bg-purple-400"
                animate={prefersReduced ? {} : { y: [0, -10, 0], scale: [1, 1.06, 1] }}
                transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
          <div className="md:col-span-5 bg-white" />
        </div>

        {/* Content */}
        <div className="relative grid md:grid-cols-12">
          {/* Left white form */}
          <motion.div
            className="order-2 md:order-1 md:col-span-5 bg-white p-8 md:p-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <motion.div
              className="flex items-center gap-2 mb-8"
              variants={fadeInUp}
              initial="hidden"
              animate="show"
            >
              <div className="h-9 w-9 rounded-lg grid place-items-center bg-slate-900 text-white">
                <span className="text-xs font-bold">MP</span>
              </div>
              <div className="font-semibold tracking-tight">MarketPulse360</div>
            </motion.div>

            <div className="mx-auto w-full max-w-sm">
              <motion.h2
                className="text-2xl font-bold text-slate-800 mb-6"
                custom={1}
                variants={fadeInUp}
                initial="hidden"
                animate="show"
              >
                Create account
              </motion.h2>

              {/* Shake the form on error messages */}
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-4"
                variants={formShake}
                animate={shouldShake ? "shake" : "idle"}
              >
                <motion.input
                  custom={2}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="show"
                  whileFocus={{ scale: prefersReduced ? 1 : 1.01 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  name="name"
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3.5 border border-slate-300 rounded-full outline-none focus:border-indigo-500 shadow-sm focus:shadow-md"
                />
                <motion.input
                  custom={3}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="show"
                  whileFocus={{ scale: prefersReduced ? 1 : 1.01 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3.5 border border-slate-300 rounded-full outline-none focus:border-indigo-500 shadow-sm focus:shadow-md"
                />
                <motion.input
                  custom={4}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="show"
                  whileFocus={{ scale: prefersReduced ? 1 : 1.01 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full p-3.5 border border-slate-300 rounded-full outline-none focus:border-indigo-500 shadow-sm focus:shadow-md"
                />

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading || prefersReduced ? 1 : 1.01 }}
                  whileTap={{ scale: loading || prefersReduced ? 1 : 0.99 }}
                  className="relative overflow-hidden w-full rounded-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3.5 shadow transition disabled:opacity-60"
                >
                  {/* loading shimmer */}
                  {loading && !prefersReduced && (
                    <motion.span
                      className="absolute inset-0 pointer-events-none"
                      initial={{ x: "-100%" }}
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)",
                      }}
                    />
                  )}
                  <span className="relative">{loading ? "Registering..." : "Create account"}</span>
                </motion.button>
              </motion.form>

              <AnimatePresence mode="popLayout">
                {msg && (
                  <motion.p
                    key="msg"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className={`mt-4 text-center text-sm ${
                      /successful/i.test(msg) ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {msg}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.p
                className="mt-4 text-sm text-slate-600 text-center"
                custom={5}
                variants={fadeInUp}
                initial="hidden"
                animate="show"
              >
                Already a member?{" "}
                <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                  Login
                </Link>
              </motion.p>
            </div>
          </motion.div>

          {/* Right gradient hero */}
          <motion.div
            className="order-1 md:order-2 md:col-span-7 relative p-6 md:p-10"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
          >
            <Navbar />
            <motion.div
              className="mt-20 md:mt-28 text-white max-w-xl"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
            >
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-sm">
                Welcome<span className="text-white">.</span>
              </h1>
              <p className="mt-4 text-white/85 leading-relaxed">
                Set up your workspace and start managing sales, projects, invoices, and team operations with a powerful business management dashboard.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute -z-10 h-10 w-[80%] max-w-5xl rounded-full bg-black/10 blur-2xl" />
    </div>
  );
}

export default Register;
