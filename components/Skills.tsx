"use client";

import React from "react";
import { Sparkles, Code } from "./icons";

interface SkillCategory {
  title: string;
  description: string;
  skills: string[];
}

export default function Skills() {
  const skillsCategories: SkillCategory[] = [
    {
      title: "Mobile Core Development",
      description: "Building production-grade cross-platform apps with deep native integrations.",
      skills: [
        "React Native",
        "React Native New Architecture",
        "Native Module Bridging (Kotlin & Swift)",
        "Monorepo Architecture",
        "Background Geolocation",
        "Push Notifications",
        "BLE Devices",
        "Biometrics Integration"
      ]
    },
    {
      title: "Frontend & Web",
      description: "Developing fast, responsive, and robust web user interfaces.",
      skills: [
        "JavaScript (ES6+)",
        "TypeScript",
        "React JS",
        "Redux Toolkit",
        "Context API",
        "HTML5 / Tailwind CSS 4"
      ]
    },
    {
      title: "APIs & Integrations",
      description: "Connecting apps to APIs, databases, and third-party gateways.",
      skills: [
        "GraphQL / Apollo Client",
        "RESTful Web Services",
        "WebSocket Integration",
        "Firebase Services",
        "Razorpay Payments",
        "Google Maps SDK"
      ]
    },
    {
      title: "AI Tools & Dev Environment",
      description: "Utilizing modern developer toolchains and AI agents for rapid development.",
      skills: [
        "Antigravity",
        "Kilo Code",
        "Cline",
        "Gemini AI / Claude AI",
        "Git & GitHub Actions",
        "Agile / Scrum / Sprint Planning"
      ]
    }
  ];

  return (
    <section id="skills" className="py-20 bg-neutral-50 dark:bg-neutral-900/40 border-y border-neutral-100 dark:border-neutral-900">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Skills &amp; Technologies
          </h2>
          <p className="mt-4 text-base text-neutral-500 dark:text-neutral-400">
            A breakdown of my technical toolkit, ranging from core cross-platform mobile systems to AI-powered development tools.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {skillsCategories.map((category, index) => (
            <div
              key={index}
              className="p-8 rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-850 hover:border-emerald-500/30 dark:hover:border-cyan-500/30 hover:shadow-xl hover:shadow-neutral-100/50 dark:hover:shadow-none transition-all duration-350 flex flex-col justify-between group"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 dark:from-emerald-500/5 dark:to-cyan-500/5 text-emerald-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                    {index % 2 === 0 ? <Code size={22} /> : <Sparkles size={22} />}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-cyan-400 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Badges Container */}
                <div className="mt-8 flex flex-wrap gap-2.5">
                  {category.skills.map((skill, skillIdx) => {
                    // Check if it's an AI Tool to highlight
                    const isAiTool = ["Antigravity", "Kilo Code", "Cline", "Gemini AI / Claude AI"].includes(skill);
                    
                    return (
                      <span
                        key={skillIdx}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 hover:scale-105 ${
                          isAiTool
                            ? "bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 dark:from-emerald-500/10 dark:to-cyan-500/10 border border-emerald-500/30 dark:border-cyan-500/30 text-emerald-700 dark:text-cyan-400"
                            : "bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 text-neutral-700 dark:text-neutral-350"
                        }`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
