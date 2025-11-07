import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Rocket,
  LineChart,
  ShieldCheck,
  Workflow,
  Users,
  Layers,
  Gauge,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import aboutImg from "../assets/aboutus_image1.png";

// About Us page styled to match the Login/Register visual language:
// - Neon indigo → fuchsia → violet gradients
// - Pink primary CTA (matches Login/Register)
// - Rounded-2xl cards, soft shadows
// - Professional on-scroll animations + subtle parallax accents

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = { show: { transition: { staggerChildren: 0.08 } } };

function ParallaxBlobs() {
  // tiny parallax for decorative blobs
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 600], [0, -40]);
  const y2 = useTransform(scrollY, [0, 600], [0, 30]);
  const y3 = useTransform(scrollY, [0, 600], [0, -25]);
  return (
    <>
      <motion.div style={{ y: y1 }} className="absolute -right-24 top-24 h-96 w-96 rounded-full bg-fuchsia-500/40 blur-3xl" />
      <motion.div style={{ y: y2 }} className="absolute right-10 bottom-10 h-80 w-80 rounded-full bg-cyan-400/40 blur-3xl" />
      <motion.div style={{ y: y3 }} className="absolute left-10 top-1/3 h-72 w-72 rounded-full bg-purple-400/40 blur-3xl" />
    </>
  );
}

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#A56AF0]/20">
      {/* HERO — matches auth pages gradient */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/30 via-indigo-700/30 to-violet-900/30" />
          <ParallaxBlobs />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-16">
          <div className="grid md:grid-cols-2 items-center gap-10">
            {/* Left: copy */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-white max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20 shadow-sm backdrop-blur">
                <Rocket className="h-3.5 w-3.5" /> About MarketPulse360
              </span>

              <p className="mt-4 text-white/90 text-lg leading-relaxed">
                MarketPulse360 is a modern business‑management platform that unifies sales, projects,
                billing, customers, and team operations in one powerful dashboard—so you can work
                smarter, move faster, and grow consistently.
              </p>

              {/* Move the original headline to a supportive tagline position to the copy */}
              <div className="mt-6 text-2xl md:text-3xl font-bold text-white/95">We turn business complexity into clarity.</div>

              {/* CTA cluster uses same color system as Login/Register */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-6 py-3 font-semibold text-white shadow hover:bg-pink-700 transition"
                >
                  Create account <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-full ring-1 ring-white/70 px-6 py-3 font-semibold text-white/95 hover:bg-white/10 transition"
                >
                  Sign in
                </Link>
              </div>
            </motion.div>

            {/* Right: illustration */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex justify-center md:justify-end">
              <img src={aboutImg} alt="Team discussing business on About page" className="w-full max-w-md rounded-2xl shadow-xl border border-white/10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* MISSION / VISION — white cards */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <motion.div variants={fadeUp} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
            <p className="mt-2 text-slate-600">
              To empower every business—from startups to enterprises—with an intelligent, unified
              system that saves time, reduces manual work, and enables confident, data‑driven
              decisions.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-xl font-bold text-slate-900">Our Vision</h3>
            <p className="mt-2 text-slate-600">
              A future where operations run smoothly through technology that is seamless, secure,
              and accessible—so teams stay focused on growth, not busywork.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* WHAT WE OFFER — icon grid */}
      <section className="max-w-7xl mx-auto px-6 pb-6 md:pb-10">
        <div className="mb-6 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">What We Offer</h2>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Everything you need to manage sales, projects, finances, and teams—beautifully integrated
            in one place.
          </p>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-3 gap-6 hover:shadow-xl"
        >
          {[
            { icon: Layers, title: "Unified Dashboard", text: "Sales, tasks, invoices, projects, and customers in one clean interface." },
            { icon: Workflow, title: "Smart Automation", text: "Reminders, follow‑ups, approvals, and updates that handle themselves." },
            { icon: LineChart, title: "Real‑Time Insights", text: "Instant analytics and performance dashboards for better decisions." },
            { icon: Users, title: "Team Collaboration", text: "Assign tasks, set deadlines, track progress, and stay aligned." },
            { icon: Gauge, title: "Financial Tracking", text: "Monitor payments, expenses, revenue, and invoices with ease." },
            { icon: ShieldCheck, title: "Enterprise‑Grade Security", text: "Your data is protected with strict security, privacy, and encryption." },
          ].map(({ icon: Icon, title, text }) => (
            <motion.div key={title} variants={fadeUp} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <span className="inline-grid place-items-center h-10 w-10 rounded-lg bg-indigo-600 text-white shadow-sm">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* AUTH LOOK & FEEL SECTION — visually combines Login/Register vibe */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-fuchsia-600 to-violet-800 opacity-95" />
          <div className="absolute -right-24 top-6 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-24 bottom-6 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Copy */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-white">
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">Same polished look across every page.</h3>
              <p className="mt-4 text-white/90">
                This section mirrors the Login/Register color palette—neon gradients, rounded cards,
                and bold, legible typography—so your brand feels consistent from first impression to
                everyday use.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link to="/register" className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-6 py-3 font-semibold text-white shadow hover:bg-pink-700 transition">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/70 px-6 py-3 font-semibold text-white hover:bg-white/15 transition">
                  Sign in
                </Link>
              </div>
            </motion.div>

            {/* Visual card mockup to echo auth UI */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="rounded-[24px] bg-white/95 p-6 shadow-2xl ring-1 ring-white/60 backdrop-blur"
            >
              <div className="rounded-2xl border border-slate-200 p-5 bg-white">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg grid place-items-center bg-slate-900 text-white">
                    <span className="text-xs font-bold">MP</span>
                  </div>
                  <div className="font-semibold tracking-tight text-slate-800">TEMPLATE DSGN</div>
                </div>
                <div className="mt-5 grid gap-3">
                  <div className="h-11 rounded-full border border-slate-300/90 bg-white" />
                  <div className="h-11 rounded-full border border-slate-300/90 bg-white" />
                  <div className="mt-1 h-10 w-40 rounded-full bg-pink-600/90" />
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                  <span>●</span><span>●</span><span>●</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE + STATS */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-6 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">Why Businesses Choose Us</h2>
          <p className="mt-2 text-slate-600 max-w-2xl">Designed for modern teams—focused on speed, clarity, and measurable outcomes.</p>
        </div>
        <motion.ul variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid md:grid-cols-2 gap-4 shadow:xl transition-all">
          {[
            "Modern, intuitive design",
            "Faster workflows and reduced workload",
            "Real‑time performance tracking",
            "Collaboration made simple",
            "Saves time and increases productivity",
            "Reliable performance, built to scale",
          ].map((line) => (
            <motion.li key={line} variants={fadeUp} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
              <span className="text-slate-700">{line}</span>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-8 grid sm:grid-cols-3 gap-6">
          {[
            { label: "Faster Approvals", value: "3x" },
            { label: "Manual Work Reduced", value: "-45%" },
            { label: "Avg. Setup Time", value: "< 10 min" },
          ].map((s) => (
            <motion.div key={s.label} variants={fadeUp} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="text-3xl font-extrabold text-slate-900">{s.value}</div>
              <div className="mt-1 text-sm text-slate-600">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FINAL CTA — mirrors auth buttons */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-fuchsia-600 to-violet-800 opacity-95" />
          <div className="absolute -right-24 top-6 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-24 bottom-6 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-14 text-center">
          <motion.h3 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-3xl md:text-4xl font-extrabold text-white">
            Ready to manage everything in one place?
          </motion.h3>
          <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-3 text-white/90 max-w-2xl mx-auto">
            Create your workspace, invite your team, and start automating routine work today.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-6 flex items-center justify-center gap-3">
            <Link to="/register" className="rounded-full bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 shadow transition">
              Create account
            </Link>
            <Link to="/login" className="rounded-full ring-1 ring-white/80 text-white font-semibold px-6 py-3 hover:bg-white/10 transition">
              Sign in
            </Link>
          </motion.div>
        </div>
      </section>

      {/* PROFESSIONAL FOOTER */}
      <footer className="relative bg-slate-900 text-slate-300 pt-14 pb-10 mt-10 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg grid place-items-center bg-white text-slate-900 font-bold text-xs">MP</div>
              <span className="text-lg font-semibold text-white tracking-tight">MarketPulse360</span>
            </div>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-xs">
              A modern business‑management platform designed to bring clarity, automation, and
              efficiency to your entire workflow.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/aboutus" className="hover:text-white transition">About Us</Link></li>
              <li><a href="#features" className="hover:text-white transition">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#download" className="hover:text-white transition">Download</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#help" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#faq" className="hover:text-white transition">FAQs</a></li>
              <li><a href="#contact" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="#docs" className="hover:text-white transition">Documentation</a></li>
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Get Started</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Create Account</Link></li>
              <li><a href="#demo" className="hover:text-white transition">Book a Demo</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} MarketPulse360 — All rights reserved.
        </div>
      </footer>
    </div>
  );
}
