// Navbar removed — empty stub to satisfy any leftover imports.
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const isActive = (to) => pathname === to;

  return (
    <header className="absolute inset-x-0 top-0 z-20 px-4 md:px-8 pt-4">
      <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white/90 text-slate-800 shadow-sm backdrop-blur md:border-white/10 md:bg-white/5 md:text-white md:shadow-lg">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg grid place-items-center bg-slate-900 text-white">
              <span className="text-[10px] font-bold">MP</span>
            </div>
            <span className="text-sm font-semibold tracking-tight">MarketPulse360</span>
          </div>

          <nav className="flex items-center gap-4 md:gap-6 text-sm">
            <a href="#about" className="transition hover:opacity-80">About</a>
            <a href="#contact" className="transition hover:opacity-80">Contact us</a>
            <Link
              to="/login"
              className={`transition hover:opacity-80 ${isActive("/login") ? "font-semibold underline underline-offset-4" : ""}`}
              aria-current={isActive("/login") ? "page" : undefined}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`transition hover:opacity-80 ${isActive("/register") ? "font-semibold underline underline-offset-4" : ""}`}
              aria-current={isActive("/register") ? "page" : undefined}
            >
              Register
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
