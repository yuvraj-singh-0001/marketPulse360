import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
  ];

  // ✅ handle logo click → always go to login
  const handleLogoClick = () => {
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-r from-blue-900 via-indigo-700 to-purple-700 text-white fixed w-full top-0 left-0 z-50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={handleLogoClick}
          className="text-2xl font-extrabold tracking-wide hover:scale-105 transition transform"
        >
          MarketPulse360
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative font-medium text-lg transition ${
                location.pathname === link.path
                  ? "text-yellow-300"
                  : "text-gray-100"
              } hover:text-yellow-300`}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.span
                  layoutId="underline"
                  className="absolute left-0 -bottom-1 w-full h-[2px] bg-yellow-300 rounded"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="md:hidden bg-indigo-800/95 backdrop-blur-md px-6 py-4 space-y-3"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block font-medium text-lg ${
                location.pathname === link.path
                  ? "text-yellow-300"
                  : "text-gray-100"
              } hover:text-yellow-300 transition`}
            >
              {link.name}
            </Link>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
}

export default Navbar;
