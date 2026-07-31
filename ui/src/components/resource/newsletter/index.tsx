"use client";

import React from "react";
import { useTheme } from "@/providers/mode-theme";
import "./index.css";

export default function NewsletterSection() {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    return (
        <section className="newsletter-section">
            <div className={`newsletter-card ${themeClass}`}>
                {/* Background glows */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px]"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]"></div>

                <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className={`newsletter-title ${themeClass}`}>Stay Informed</h2>
                    <p className={`newsletter-desc ${themeClass}`}>
                        Receive weekly insights on AI trends, social strategy, and platform updates delivered straight to your inbox.
                    </p>

                    <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-6">
                        <input
                            type="email"
                            placeholder="Email address"
                            className={`newsletter-input ${themeClass}`}
                            required
                        />
                        <button className={`newsletter-btn ${themeClass}`}>
                            Subscribe
                        </button>
                    </form>

                    <p className={`text-[11px] uppercase tracking-widest ${isLight ? "text-slate-400" : "text-[#a19bb0]/50"}`}>
                        Join 20,000+ professionals. No spam, ever.
                    </p>
                </div>
            </div>
        </section>
    );
}
