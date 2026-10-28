"use client";

import React from "react";
import { LinkedIn, Email } from "./icons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="w-full py-8 border-t border-neutral-200/50 dark:border-neutral-900 bg-white dark:bg-neutral-950 transition-colors">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo / Branding */}
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-cyan-500 text-white font-extrabold text-xs select-none">
            PL
          </span>
          <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
            Parth Lunagaria
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          <a href="#home" onClick={(e) => handleNavClick(e, "home")} className="hover:text-emerald-500 dark:hover:text-cyan-400 transition-colors">Home</a>
          <a href="#experience" onClick={(e) => handleNavClick(e, "experience")} className="hover:text-emerald-500 dark:hover:text-cyan-400 transition-colors">Experience</a>
          <a href="#projects" onClick={(e) => handleNavClick(e, "projects")} className="hover:text-emerald-500 dark:hover:text-cyan-400 transition-colors">Projects</a>
          <a href="#skills" onClick={(e) => handleNavClick(e, "skills")} className="hover:text-emerald-500 dark:hover:text-cyan-400 transition-colors">Skills</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, "contact")} className="hover:text-emerald-500 dark:hover:text-cyan-400 transition-colors">Contact</a>
          <a href="/Parth_Lunagaria_CV.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 dark:hover:text-cyan-400 transition-colors">Resume</a>
        </div>

        {/* Copyright & Socials */}
        <div className="flex items-center gap-4 text-xs font-medium text-neutral-400 dark:text-neutral-500">
          <span>&copy; {currentYear} All rights reserved.</span>
          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />
          <div className="flex gap-3">
            <a
              href="https://www.linkedin.com/in/parth-lunagaria-5081891a8"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-500 dark:hover:text-cyan-400 transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedIn size={16} />
            </a>
            <a
              href="mailto:parthlunagaria11@gmail.com"
              className="hover:text-emerald-500 dark:hover:text-cyan-400 transition-colors"
              aria-label="Email"
            >
              <Email size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
