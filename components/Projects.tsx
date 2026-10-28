"use client";

import React, { useState } from "react";
import { ExternalLink, Sparkles, Code } from "./icons";

interface Project {
  title: string;
  category: "all" | "b2b-b2c" | "enterprise" | "iot-native";
  platform: string;
  tagline: string;
  description: string;
  features: string[];
  tags: string[];
}

export default function Projects() {
  const [filter, setFilter] = useState<"all" | "b2b-b2c" | "enterprise" | "iot-native">("all");

  const projectsData: Project[] = [
    {
      title: "Travel Terminus",
      category: "b2b-b2c",
      platform: "React Native (B2B & B2C)",
      tagline: "Flight & Hotel Booking Platform",
      description: "A complete booking engine that enables users to book domestic and international flights and hotels with complex supplier API integrations.",
      features: [
        "One-way and roundtrip booking flows with real-time fare breakdowns",
        "Secure payments integration using Razorpay",
        "Loyalty points, automated cancellation, and refund policy management",
        "Highly optimized performance for search and checkout funnels"
      ],
      tags: ["React Native", "Supplier APIs", "Razorpay", "State Optimization"]
    },
    {
      title: "Wrld – Connect In Person",
      category: "b2b-b2c",
      platform: "React Native (US Client)",
      tagline: "College Social Networking Platform",
      description: "A social networking application designed for college students to coordinate meetups, connect in person, and communicate in real time.",
      features: [
        "Map-based discovery for nearby attendees and events",
        "Real-time messaging using WebSockets",
        "User follow systems and dynamic event participation management",
        "Nearby participant tracking with background geolocation"
      ],
      tags: ["React Native", "WebSockets", "Google Maps", "Geofencing"]
    },
    {
      title: "ReqsQ – Emergency Alert",
      category: "iot-native",
      platform: "React Native (US Client)",
      tagline: "BLE Wearable Safety Application",
      description: "A human safety application that integrates with wearable IoT devices to trigger emergency response alerts and track users in real time.",
      features: [
        "Reliable Bluetooth Low Energy (BLE) background connectivity",
        "Automatic crash & fall detection leveraging custom Native Modules",
        "Background location tracking and audio recording during alerts",
        "Instant notification delivery to designated emergency contacts"
      ],
      tags: ["React Native", "BLE Integration", "Native Modules", "Location Tracking"]
    },
    {
      title: "Alpha Payroll",
      category: "enterprise",
      platform: "React Native",
      tagline: "Enterprise HRMS Solution",
      description: "A secure, corporate workforce management application supporting check-ins, payroll scheduling, and real-time field tracking.",
      features: [
        "Biometric authentication (TouchID/FaceID) for secure check-in",
        "Live location tracking and Google Maps integration to map salesman tours",
        "Automated push notifications for tasks and leave approval workflows",
        "Interactive dashboard for monthly attendance statistics"
      ],
      tags: ["React Native", "Biometrics", "Google Maps API", "Push Notifications"]
    },
    {
      title: "Gretail Extreme",
      category: "enterprise",
      platform: "React Native",
      tagline: "B2B Retail ERP System",
      description: "A comprehensive retail management app handling invoicing, inventory tracking, printing, and business intelligence.",
      features: [
        "Bluetooth printing support for Rugtek and Sunmi thermal printers",
        "Dynamic watermarked camera capture using Socket programming",
        "Integrated payment gateways including Razorpay",
        "Visual analytics and business performance dashboards"
      ],
      tags: ["React Native", "Bluetooth Printing", "Sockets", "Razorpay", "Charts"]
    }
  ];

  const filterTabs = [
    { id: "all", label: "All Projects" },
    { id: "b2b-b2c", label: "B2C / B2B Consumer" },
    { id: "enterprise", label: "Enterprise & HRMS" },
    { id: "iot-native", label: "IoT & Native Modules" }
  ] as const;

  const filteredProjects = projectsData.filter(
    (project) => filter === "all" || project.category === filter
  );

  return (
    <section id="projects" className="py-20 bg-white dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Featured Projects
          </h2>
          <p className="mt-4 text-base text-neutral-500 dark:text-neutral-400">
            A showcase of custom mobile apps I have architected, containing heavy hardware/BLE integrations, secure checkouts, and custom native bridges.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 focus:outline-none ${
                filter === tab.id
                  ? "bg-emerald-500 text-white dark:bg-cyan-500 dark:text-neutral-950 shadow-md shadow-emerald-500/10"
                  : "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-350"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={index}
              className="flex flex-col h-full rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-850 hover:border-emerald-500/30 dark:hover:border-cyan-500/30 transition-all duration-350 hover:shadow-xl hover:-translate-y-1.5 group overflow-hidden"
            >
              {/* Header Visual Bar */}
              <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="p-6 flex flex-col flex-1">
                {/* Platform & Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-cyan-400">
                    {project.platform}
                  </span>
                  <Code size={16} className="text-neutral-400 dark:text-neutral-500" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white mt-3 leading-tight group-hover:text-emerald-500 dark:group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                
                {/* Tagline */}
                <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 mt-1">
                  {project.tagline}
                </p>

                {/* Description */}
                <p className="text-sm text-neutral-600 dark:text-neutral-450 mt-4 leading-relaxed flex-1">
                  {project.description}
                </p>

                {/* Bullet Key Features */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-emerald-500 dark:text-cyan-400" />
                    Key Features
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400">
                    {project.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="line-clamp-2 leading-relaxed">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skill Tags */}
                <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-850 flex flex-wrap gap-1.5">
                  {project.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="px-2 py-1 rounded bg-neutral-200/50 hover:bg-neutral-250 dark:bg-neutral-800/40 dark:hover:bg-neutral-800 text-[10px] font-bold text-neutral-600 dark:text-neutral-350 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
