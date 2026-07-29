"use client";

import { useTheme } from "@/providers/mode-theme";
import { Play } from "lucide-react";
import "./index.css";

export default function BannerSection() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const themeClass = isLight ? "is-light" : "is-dark";

  return (
    <section className={`banner-section ${isLight ? "hero-bg-pattern" : "hero-bg-pattern-dark"}`}>
      {/* Background Glows */}
      <div className={`banner-glow-left ${themeClass}`} />
      <div className={`banner-glow-right ${themeClass}`} />

      <div className="px-4 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-16 lg:gap-12 justify-between items-center container mx-auto">

        {/* Left Content */}
        <div className="flex flex-col items-start gap-7">
          {/* Badge */}
          <div className={`banner-badge ${themeClass}`}>
            <span className="banner-badge-dot" />
            <span className="banner-badge-text">V3.0 IS NOW LIVE</span>
          </div>

          {/* Headline */}
          <h1 className={`banner-headline ${themeClass}`}>
            Manage Every Social<br className="hidden lg:block" /> Platform From{" "}
            <span className={`banner-headline-gradient ${themeClass}`}>
              One
            </span>
            <br />
            <span className={`banner-headline-sub ${themeClass}`}>Intelligent Dashboard</span>
          </h1>

          {/* Subtitle */}
          <p className={`banner-subtitle ${themeClass}`}>
            Connect accounts, create content once, publish everywhere, and schedule automatically with the world's most precise AI social engine.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <button className="banner-btn-start">
              Start Free
            </button>
            <button className={`banner-btn-demo group ${themeClass}`}>
              <span className="banner-play-circle group-hover:bg-[#14b8a6]/20">
                <Play size={14} className="text-[#14b8a6] fill-[#14b8a6] ml-0.5" />
              </span>
              Watch Demo
            </button>
          </div>
        </div>

        {/* Right Mockup */}
        <div className="relative w-full aspect-square md:aspect-[4/3] flex items-center justify-center">

          {/* Floating Icons */}
          <div className={`banner-floating-icon top-[15%] right-[-2%] animate-[bounce_4s_infinite] ${themeClass}`}>
            <div className="w-7 h-7 bg-[#1877F2] rounded-full flex items-center justify-center text-white font-bold text-sm">f</div>
          </div>

          <div className={`banner-floating-icon left-[2%] bottom-[25%] animate-[bounce_5s_infinite_1s] ${themeClass}`}>
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex flex-col items-center justify-center gap-[3px] p-1.5">
              <div className="w-full h-1.5 rounded-[1px] bg-gradient-to-r from-pink-500 to-orange-400"></div>
              <div className="w-full flex-1 rounded-[1px] bg-gradient-to-r from-purple-500 to-indigo-500"></div>
            </div>
          </div>

          {/* Main Glass Panel */}
          <div className={`banner-glass-panel ${themeClass}`}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
            {/* Browser Dots */}
            <div className="flex items-center gap-2.5 mb-6 opacity-80">
              <span className="w-3.5 h-3.5 rounded-full bg-[#ef4444]" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#eab308]" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#a855f7]" />
              <div className={`ml-auto w-24 h-4 rounded-full ${isLight ? "bg-slate-200" : "bg-white/5"}`} />
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isLight ? "bg-slate-200" : "bg-white/5"}`} />
            </div>

            {/* Content Area */}
            <div className={`flex-1 rounded-2xl border relative p-4 flex items-end overflow-hidden shadow-inner ${isLight ? "bg-slate-100/90 border-slate-200" : "bg-[#1a1825]/80 border-white/5"
              }`}>
              {/* Faux graph line */}
              <div className={`absolute bottom-12 left-0 w-full h-px ${isLight ? "bg-gradient-to-r from-transparent via-violet-300 to-transparent" : "bg-gradient-to-r from-transparent via-white/10 to-transparent"
                }`}></div>
              <span className={`text-[9px] sm:text-[11px] font-mono uppercase tracking-widest font-semibold ${isLight ? "text-slate-600" : "text-gray-400"
                }`}>
                Monthly Engagement Gain: <span className={isLight ? "text-violet-700 font-bold" : "text-white"}>+24.8%</span>
              </span>
            </div>

            {/* Bottom Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className={`banner-stat-box ${themeClass}`}>
                <div className="p-1 rounded bg-[#14b8a6]/10 mb-1">
                  <svg className="w-4 h-4 text-[#14b8a6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className={`banner-stat-title ${themeClass}`}>12.4k</h3>
                <p className={`banner-stat-sub ${themeClass}`}>New Followers</p>
              </div>

              <div className={`banner-stat-box ${themeClass}`}>
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#a855f7]/20 blur-2xl rounded-full" />
                <div className="p-1 rounded bg-[#a855f7]/10 mb-1">
                  <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className={`banner-stat-title ${themeClass}`}>94%</h3>
                <p className={`banner-stat-sub ${themeClass}`}>AI Match Rate</p>
              </div>
            </div>
          </div>

          {/* Bottom floating icon */}
          <div className={`banner-floating-icon right-[8%] -bottom-[5%] w-16 h-16 ${themeClass}`}>
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex flex-col items-center justify-center gap-0.5 p-1">
              <div className="w-full h-1 rounded-[1px] bg-blue-500"></div>
              <div className="w-full h-1 rounded-[1px] bg-purple-500"></div>
              <div className="w-full h-1 rounded-[1px] bg-[#14b8a6]"></div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
