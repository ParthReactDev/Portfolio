"use client";

import React, { useState } from "react";
import { Email, Phone, LinkedIn, MapPin, Copy, Check, ExternalLink, ArrowRight, Download } from "./icons";

export default function Contact() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const contactCards = [
    {
      key: "email",
      icon: <Email size={24} className="text-emerald-500 dark:text-cyan-400" />,
      label: "Email Address",
      value: "parthlunagaria11@gmail.com",
      description: "Drop a line anytime for project inquiries, consulting, or full-time roles.",
      primaryAction: {
        label: "Send Email",
        href: "mailto:parthlunagaria11@gmail.com",
        isExternal: false,
      },
      copyText: "parthlunagaria11@gmail.com",
    },
    {
      key: "phone",
      icon: <Phone size={24} className="text-emerald-500 dark:text-cyan-400" />,
      label: "Phone & WhatsApp",
      value: "+91 91069-60267",
      description: "Direct line for quick inquiries, voice calls, or WhatsApp discussions.",
      primaryAction: {
        label: "Call Now",
        href: "tel:+919106960267",
        isExternal: false,
      },
      copyText: "+919106960267",
    },
    {
      key: "linkedin",
      icon: <LinkedIn size={24} className="text-emerald-500 dark:text-cyan-400" />,
      label: "LinkedIn Profile",
      value: "linkedin.com/in/parth-lunagaria",
      description: "Connect professionally, view verified recommendations and updates.",
      primaryAction: {
        label: "View Profile",
        href: "https://www.linkedin.com/in/parth-lunagaria-5081891a8",
        isExternal: true,
      },
      copyText: "https://www.linkedin.com/in/parth-lunagaria-5081891a8",
    },
    {
      key: "location",
      icon: <MapPin size={24} className="text-emerald-500 dark:text-cyan-400" />,
      label: "Current Location",
      value: "Ahmedabad, Gujarat, India",
      description: "Open to remote opportunities worldwide and hybrid roles (IST / UTC +5:30).",
      primaryAction: {
        label: "Timezone: IST",
        href: "https://time.is/Ahmedabad",
        isExternal: true,
      },
      copyText: "Ahmedabad, Gujarat, India",
    },
  ];

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white dark:bg-neutral-950 transition-colors">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-cyan-950/30 border border-emerald-200/50 dark:border-cyan-800/30 text-emerald-700 dark:text-cyan-400 text-xs font-semibold mb-4">
            Contact Information
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Contact Details
          </h2>
          <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
            Reach out directly through any of the channels below. Open to discussing mobile application development, BLE integrations, architecture consulting, or full-time engineering roles.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {contactCards.map((item) => {
            const isCopied = copiedKey === item.key;
            return (
              <div
                key={item.key}
                className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/70 dark:border-neutral-800 hover:border-emerald-500/40 dark:hover:border-cyan-500/40 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 dark:hover:shadow-cyan-500/5"
              >
                <div>
                  {/* Top Bar with Icon and Copy button */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 shadow-md group-hover:scale-105 transition-transform duration-200">
                      {item.icon}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(item.copyText, item.key)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-cyan-400 bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:border-emerald-300 dark:hover:border-cyan-700 transition-all focus:outline-none"
                      title={`Copy ${item.label}`}
                    >
                      {isCopied ? (
                        <>
                          <Check size={14} className="text-emerald-500 dark:text-cyan-400" />
                          <span className="text-emerald-600 dark:text-cyan-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Label & Value */}
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    {item.label}
                  </div>
                  <div className="mt-1 text-lg sm:text-xl font-bold text-neutral-900 dark:text-white break-all group-hover:text-emerald-600 dark:group-hover:text-cyan-400 transition-colors">
                    {item.value}
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Primary Action Button */}
                <div className="mt-6 pt-5 border-t border-neutral-200/60 dark:border-neutral-800/80">
                  <a
                    href={item.primaryAction.href}
                    target={item.primaryAction.isExternal ? "_blank" : undefined}
                    rel={item.primaryAction.isExternal ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-cyan-400 hover:text-emerald-700 dark:hover:text-cyan-300 group-hover:translate-x-0.5 transition-all"
                  >
                    <span>{item.primaryAction.label}</span>
                    {item.primaryAction.isExternal ? (
                      <ExternalLink size={14} />
                    ) : (
                      <ArrowRight size={14} />
                    )}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Connect CTA Bar */}
        <div className="mt-12 max-w-5xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-500/20 dark:border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500/40 shrink-0 shadow-md">
              <img
                src="/Parth%20lunagaria%20130kb.jpg.png"
                alt="Parth Lunagaria"
                className="w-full h-full object-cover object-top"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-950" />
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-900 dark:text-white">
                Available for New Projects & Full-Time Roles
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Fast responses guaranteed within 24 hours.
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/Parth_Lunagaria_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 text-neutral-800 dark:text-neutral-200 font-semibold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all"
            >
              <Download size={16} />
              View Resume
            </a>
            <a
              href="mailto:parthlunagaria11@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-semibold text-xs sm:text-sm hover:bg-neutral-800 dark:hover:bg-neutral-100 hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              <Email size={16} />
              Email Directly
            </a>
            <a
              href="https://www.linkedin.com/in/parth-lunagaria-5081891a8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 text-neutral-800 dark:text-neutral-200 font-semibold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all"
            >
              <LinkedIn size={16} />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
