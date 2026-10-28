"use client";

import React, { useState } from "react";
import { Download, ArrowRight, LinkedIn, Email, Sparkles } from "./icons";

export default function Hero() {
  const [imgError, setImgError] = useState<boolean>(false);

  const stats = [
    { value: "5.8+", label: "Years of Experience" },
    { value: "10+", label: "Mobile Apps Built" },
    { value: "2+", label: "Leading Platforms" },
    { value: "5+", label: "AI Tools Integrated" },
  ];

  return (
    <section id="home" className="relative overflow-hidden py-20 lg:py-32 bg-white dark:bg-neutral-950">
      {/* Decorative Blur Shapes */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 dark:bg-cyan-500/5 rounded-full filter blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-500/10 dark:bg-emerald-500/5 rounded-full filter blur-3xl -z-10" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Main Info */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-cyan-950/30 border border-emerald-200/50 dark:border-cyan-800/30 text-emerald-700 dark:text-cyan-400 text-xs font-semibold mb-6 animate-bounce">
              <Sparkles size={14} className="text-emerald-500 dark:text-cyan-400" />
              Available for Freelance & Full-time Roles
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Parth Lunagaria
              </span>
            </h1>

            {/* Designation */}
            <div className="mt-3 text-xl sm:text-2xl font-semibold text-neutral-600 dark:text-neutral-300">
              Senior Software Engineer
            </div>

            <p className="mt-6 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
              A results-driven <span className="font-semibold text-neutral-900 dark:text-white">Senior Software Engineer</span> with <span className="font-semibold text-neutral-900 dark:text-white">5 years 8 months of experience</span> building high-performance iOS and Android applications with React Native. I specialise in the{" "}
              <a
                href="#skills"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="font-semibold text-emerald-600 dark:text-cyan-400 underline decoration-emerald-500/40 dark:decoration-cyan-400/40 underline-offset-4 hover:decoration-emerald-500 dark:hover:decoration-cyan-400 transition-colors"
              >
                React Native New Architecture
              </a>{" "}
              and{" "}
              <a
                href="#skills"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="font-semibold text-emerald-600 dark:text-cyan-400 underline decoration-emerald-500/40 dark:decoration-cyan-400/40 underline-offset-4 hover:decoration-emerald-500 dark:hover:decoration-cyan-400 transition-colors"
              >
                native module bridging
              </a>{" "}
              in Kotlin and Swift — and I lead monorepo architectures that put whole app portfolios on one release path.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href="/Parth_Lunagaria_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold text-sm shadow-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Download size={16} />
                View & Download Resume
              </a>

              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 text-neutral-700 dark:text-neutral-300 font-semibold text-sm hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Let&apos;s Connect
                <ArrowRight size={16} />
              </a>
            </div>

            {/* Social quick links */}
            <div className="mt-8 flex gap-4 text-neutral-400 dark:text-neutral-500">
              <a
                href="https://www.linkedin.com/in/parth-lunagaria-5081891a8"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-500 dark:hover:text-cyan-400 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedIn size={20} />
              </a>
              <a
                href="mailto:parthlunagaria11@gmail.com"
                className="hover:text-emerald-500 dark:hover:text-cyan-400 transition-colors"
                aria-label="Email"
              >
                <Email size={20} />
              </a>
            </div>
          </div>

          {/* Portrait/Visual Element */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-3xl p-1.5 bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-2xl shadow-emerald-500/20 group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
              
              <div className="w-full h-full bg-white dark:bg-neutral-900 rounded-[22px] overflow-hidden flex items-center justify-center relative">
                {!imgError ? (
                  <img
                    src="/Parth%20lunagaria%20130kb.jpg.png"
                    alt="Parth Lunagaria - Senior Software Engineer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  // Sleek vector developer fallback avatar
                  <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 p-6 text-center select-none">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-emerald-500/20 mb-4">
                      PL
                    </div>
                    <span className="font-bold text-lg text-neutral-800 dark:text-neutral-200">Parth Lunagaria</span>
                    <span className="text-xs text-emerald-600 dark:text-cyan-400 font-semibold mt-1">Senior Software Engineer</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-20 border-t border-neutral-100 dark:border-neutral-900 pt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-850 hover:border-emerald-500/30 dark:hover:border-cyan-500/30 transition-all duration-300 text-center"
              >
                <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
