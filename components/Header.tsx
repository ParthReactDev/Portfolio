"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Menu, X } from "./icons";

export default function Header() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  // Initialize theme from localStorage or system preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Monitor scroll to update active nav link
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "experience", "projects", "skills", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 backdrop-blur-md border-b bg-white/70 dark:bg-neutral-950/70 border-neutral-200/50 dark:border-neutral-800/50">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6 sm:px-8">
        {/* Logo */}
        <a 
          href="#home" 
          onClick={(e) => handleNavClick(e, "home")}
          className="flex items-center gap-2 font-bold text-xl tracking-tight bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent group"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 text-white font-extrabold text-sm tracking-normal shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-200">
            PL
          </span>
          Parth Lunagaria
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-neutral-600 dark:text-neutral-300">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className={`relative py-2 transition-colors hover:text-emerald-500 dark:hover:text-cyan-400 ${
                activeSection === link.id
                  ? "text-emerald-600 dark:text-cyan-400 font-semibold"
                  : ""
              }`}
            >
              {link.label}
              {activeSection === link.id && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" />
              )}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Resume Link */}
          <a
            href="/Parth_Lunagaria_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-neutral-800 dark:text-neutral-100 hover:text-emerald-600 dark:hover:text-cyan-400 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500/40 dark:hover:border-cyan-500/40 transition-all duration-200"
          >
            Resume
          </a>

          <button
            onClick={toggleTheme}
            className="flex items-center justify-center p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors focus:outline-none"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-6 py-6 shadow-xl flex flex-col gap-4 animate-fade-in-down">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className={`py-2 px-3 rounded-lg text-base transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-emerald-500 dark:hover:text-cyan-400 ${
                activeSection === link.id
                  ? "bg-emerald-50/50 dark:bg-cyan-950/20 text-emerald-600 dark:text-cyan-400 font-semibold"
                  : "text-neutral-600 dark:text-neutral-300"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/Parth_Lunagaria_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-lg text-base font-semibold text-emerald-600 dark:text-cyan-400 border border-emerald-200/60 dark:border-cyan-800/40 bg-emerald-50/50 dark:bg-cyan-950/20 text-center transition-colors mt-1"
          >
            View Resume (PDF)
          </a>
        </div>
      )}
    </header>
  );
}
