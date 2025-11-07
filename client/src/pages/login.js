import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, CheckCircle2, AlertCircle, User2 } from "lucide-react";
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

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();
  const cardRef = useRef(null);

  const emailError = useMemo(() => {
    if (!touched.email) return "";
    if (!form.email) return "Email is required.";
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    return ok ? "" : "Enter a valid email address.";
  }, [form.email, touched.email]);

  const passwordError = useMemo(() => {
    if (!touched.password) return "";
    if (!form.password) return "Password is required.";
    if (form.password.length < 6) return "Minimum 6 characters.";
    return "";
  }, [form.password, touched.password]);

  const formInvalid = !!emailError || !!passwordError || !form.email || !form.password;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));
  const handleKeyUp = (e) => setCapsLock(Boolean(e.getModifierState && e.getModifierState("CapsLock")));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (formInvalid) return;

    setLoading(true);
    setBanner({ type: "", text: "" });

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        setBanner({ type: "success", text: "Login successful! Redirecting…" });
        setTimeout(() => navigate("/dashboard"), 800);
      } else {
        setBanner({ type: "error", text: data.message || "Invalid email or password." });
      }
    } catch (err) {
      setBanner({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (banner.text) setBanner({ type: "", text: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.email, form.password]);

  // Card tilt (parallax) — reduced if prefersReducedMotion
  const onMouseMove = (e) => {
    if (prefersReduced) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;  // 0..1
    const py = (e.clientY - rect.top) / rect.height;  // 0..1
    const ry = (px - 0.5) * 6; // rotateY
    const rx = (0.5 - py) * 6; // rotateX
    setTilt({ rx, ry });
  };
  const onMouseLeave = () => setTilt({ rx: 0, ry: 0 });

  return (
    <div className="min-h-screen bg-[#A56AF0]/20 flex items-center justify-center px-4 py-10">
      {/* Outer rounded container */}
      <motion.div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateX: prefersReduced ? 0 : tilt.rx,
          rotateY: prefersReduced ? 0 : tilt.ry,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 12, mass: 0.8 }}
        className="relative w-full max-w-6xl rounded-[30px] overflow-hidden shadow-2xl will-change-transform"
      >
        {/* Right gradient half (background layer) */}
        <div className="absolute inset-0 md:grid md:grid-cols-12 pointer-events-none">
          <div className="hidden md:block md:col-span-7 bg-[#1c0f52]">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/60 via-indigo-700 to-violet-900" />
              {/* Floating blobs */}
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

        {/* Content grid */}
        <div className="relative grid md:grid-cols-12">
          {/* Left white auth panel */}
          <motion.div
            className="order-2 md:order-1 md:col-span-5 bg-white p-8 md:p-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {/* Mini logo */}
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
              <motion.div
                className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full border-2 border-slate-200"
                custom={1}
                variants={fadeInUp}
                initial="hidden"
                animate="show"
              >
                <User2 className="h-9 w-9 text-slate-400" />
              </motion.div>

              {/* Animated banner */}
              <AnimatePresence mode="popLayout">
                {banner.text && (
                  <motion.div
                    key="banner"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className={`mb-4 flex items-start gap-2 rounded-md border px-3 py-2 text-sm ${
                      banner.type === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-rose-200 bg-rose-50 text-rose-700"
                    }`}
                  >
                    {banner.type === "success" ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4" />
                    ) : (
                      <AlertCircle className="mt-0.5 h-4 w-4" />
                    )}
                    <span>{banner.text}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Shake form on error */}
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-4"
                noValidate
                variants={formShake}
                animate={banner.type === "error" ? "shake" : "idle"}
              >
                {/* Email */}
                <motion.div custom={2} variants={fadeInUp} initial="hidden" animate="show">
                  <div
                    className={`relative rounded-full border ${
                      emailError ? "border-rose-300" : "border-slate-300"
                    } bg-white transition shadow-sm focus-within:shadow-md`}
                  >
                    <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <motion.input
                      whileFocus={{ scale: prefersReduced ? 1 : 1.01 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18 }}
                      name="email"
                      type="email"
                      placeholder="Username"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full rounded-full bg-transparent pl-11 pr-4 py-3.5 text-slate-800 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {emailError && <p className="mt-1 text-xs text-rose-600">{emailError}</p>}
                </motion.div>

                {/* Password */}
                <motion.div custom={3} variants={fadeInUp} initial="hidden" animate="show">
                  <div
                    className={`relative rounded-full border ${
                      passwordError ? "border-rose-300" : "border-slate-300"
                    } bg-white transition shadow-sm focus-within:shadow-md`}
                  >
                    <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <motion.input
                      whileFocus={{ scale: prefersReduced ? 1 : 1.01 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18 }}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={form.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyUp={handleKeyUp}
                      className="w-full rounded-full bg-transparent pl-11 pr-12 py-3.5 text-slate-800 outline-none placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-400 hover:text-slate-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordError && <p className="mt-1 text-xs text-rose-600">{passwordError}</p>}
                  {capsLock && !passwordError && <p className="mt-1 text-xs text-amber-600">Caps Lock is ON.</p>}
                </motion.div>

                <motion.div
                  custom={4}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="show"
                  className="flex items-center justify-between text-xs text-slate-600 px-1"
                >
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" className="accent-fuchsia-600" />
                    Remember me
                  </label>
                  <Link to="/forgot-password" className="hover:underline">
                    Forgot your password?
                  </Link>
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={loading || formInvalid}
                  whileHover={{ scale: loading || formInvalid || prefersReduced ? 1 : 1.01 }}
                  whileTap={{ scale: loading || formInvalid || prefersReduced ? 1 : 0.99 }}
                  className="relative overflow-hidden w-full rounded-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3.5 shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {/* Loading shimmer */}
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
                  <span className="relative">{loading ? "Signing in…" : "Login"}</span>
                </motion.button>
              </motion.form>
            </div>
          </motion.div>

          {/* Right gradient / hero */}
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
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-sm">
                Welcome Back <span className="text-white">.</span>
              </h1>
              <p className="mt-4 text-white/85 leading-relaxed">
                Manage your business smarter. Access your dashboard to track sales, projects, payments, and team performance — all in one place.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

   
      <div className="absolute -z-10 h-10 w-[80%] max-w-5xl rounded-full bg-black/10 blur-2xl" />
    </div>
  );
}

export default Login;
