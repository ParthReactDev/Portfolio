"use client";

import React from "react";
import { Briefcase, GraduationCap } from "./icons";

interface ExperienceItem {
  type: "work" | "education";
  role: string;
  company: string;
  location: string;
  duration: string;
  description: string[];
}

export default function Experience() {
  const timelineData: ExperienceItem[] = [
    {
      type: "work",
      role: "Senior Software Engineer",
      company: "OneClick IT Consultancy Pvt Ltd",
      location: "Ahmedabad, India",
      duration: "Oct 2023 - Present",
      description: [
        "Leading React Native mobile application development projects, making key architectural and technical decisions.",
        "Managing projects independently, collaborating directly with clients to refine requirements and deliverables.",
        "Creating Work Breakdown Structures (WBS) and reliable project estimations.",
        "Conducting comprehensive code reviews and mentoring junior team members to maintain high quality code standards.",
        "Developing scalable apps across Travel Booking, Event Management, Social Networking, and BLE applications."
      ]
    },
    {
      type: "work",
      role: "React Native Developer",
      company: "Alpha E Barcode Solutions Pvt Ltd",
      location: "Ahmedabad, India",
      duration: "Jan 2021 - Oct 2023",
      description: [
        "Developed custom mobile applications for enterprise HRMS, ERP, and B2B Retail solutions.",
        "Integrated complex REST/GraphQL APIs and optimized real-time background synchronization.",
        "Enhanced application performance, load times, and touch responsiveness on iOS and Android.",
        "Worked with native modules, native bridges, and integrated hardware peripherals like Bluetooth barcode scanners and receipt printers."
      ]
    },
    {
      type: "education",
      role: "Bachelors in Information Technology",
      company: "Ganapat University",
      location: "Mehsana, India",
      duration: "March 2017 - March 2021",
      description: [
        "Graduated with a strong foundation in Object-Oriented Programming, Data Structures, Software Engineering Principles, and Database Systems."
      ]
    }
  ];

  return (
    <section id="experience" className="py-20 bg-neutral-50 dark:bg-neutral-900/40 border-y border-neutral-100 dark:border-neutral-900">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            My Journey
          </h2>
          <p className="mt-4 text-base text-neutral-500 dark:text-neutral-400">
            A timeline of my professional work experience and academic background in Information Technology.
          </p>
        </div>

        {/* Timeline container */}
        <div className="relative border-l border-neutral-200 dark:border-neutral-800 ml-4 md:ml-32 py-2">
          {timelineData.map((item, index) => (
            <div key={index} className="mb-12 last:mb-0 relative pl-8 md:pl-12">
              {/* Timeline dot / Icon indicator */}
              <span className="absolute -left-[17px] top-1.5 flex items-center justify-center w-8 h-8 rounded-full border-2 border-white dark:border-neutral-950 bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white shadow-md shadow-emerald-500/10">
                {item.type === "work" ? <Briefcase size={14} /> : <GraduationCap size={14} />}
              </span>

              {/* Time Label on left for desktop */}
              <div className="hidden md:block absolute -left-32 top-2.5 w-24 text-right text-xs font-bold text-neutral-450 dark:text-neutral-500 tracking-wide uppercase">
                {item.duration.split(" - ")[0]}
              </div>

              {/* Card content */}
              <div className="group p-6 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-850 hover:border-emerald-500/30 dark:hover:border-cyan-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-neutral-100 dark:hover:shadow-none">
                {/* Meta details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-cyan-400">
                      {item.type === "work" ? "Professional Experience" : "Education"}
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-1 group-hover:text-emerald-500 dark:group-hover:text-cyan-400 transition-colors">
                      {item.role}
                    </h3>
                  </div>
                  <div className="text-left sm:text-right mt-1 sm:mt-0">
                    <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      {item.company}
                    </div>
                    <div className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                      {item.location} | {item.duration}
                    </div>
                  </div>
                </div>

                {/* Description points */}
                <ul className="space-y-2.5 text-sm text-neutral-600 dark:text-neutral-400 list-disc list-inside">
                  {item.description.map((bullet, bulletIdx) => (
                    <li key={bulletIdx} className="leading-relaxed pl-1 text-indent-[-1.5em] marker:text-emerald-500">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
