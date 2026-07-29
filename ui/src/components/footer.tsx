"use client";

import { useTheme } from '@/providers/mode-theme';
import Link from 'next/link';

export default function Footer() {
    const { theme } = useTheme();
    const isLight = theme === "light";

    return (
        <footer className={`relative w-full pt-20 pb-8 overflow-hidden z-0 transition-colors duration-300 border-t ${isLight ? "dark-footer-bg-pattern border-slate-200" : "footer-bg-pattern border-white/5"
            }`}>
            {/* Background Glow Shapes (Green and Purple) */}
            <div className={`absolute top-[-20%] left-[-10%] w-[500px] h-[500px] blur-[150px] rounded-full pointer-events-none -z-10 ${isLight ? "bg-violet-500/10" : "bg-violet-600/10"
                }`} />
            <div className={`absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] blur-[150px] rounded-full pointer-events-none -z-10 ${isLight ? "bg-purple-500/10" : "bg-purple-600/10"
                }`} />

            <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-20">
                    {/* Brand Info */}
                    <div className="col-span-1 md:col-span-1 pr-4">
                        <span className={`text-2xl font-bold tracking-tight font-serif ${isLight ? "text-slate-900" : "text-white"}`}>
                            Creator <span className="text-violet-600 dark:text-violet-400 group-hover:text-violet-500 transition-colors">Stack</span>
                        </span>
                        <p className={`text-[13px] leading-relaxed pr-8 mt-3 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                            Precision social engineering for teams that demand excellence. Built by market leaders for future icons.
                        </p>
                    </div>

                    {/* Platform Links */}
                    <div className="col-span-1">
                        <h4 className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-8 ${isLight ? "text-slate-900" : "text-white"}`}>
                            Platform
                        </h4>
                        <ul className="flex flex-col gap-4">
                            {['Neural Scheduler', 'Omni-Channel Sync', 'Growth Analytics', 'API Solutions'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className={`text-[13px] transition-colors ${isLight ? "text-slate-600 hover:text-violet-700" : "text-slate-400 hover:text-white"}`}>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Organization Links */}
                    <div className="col-span-1">
                        <h4 className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-8 ${isLight ? "text-slate-900" : "text-white"}`}>
                            Organization
                        </h4>
                        <ul className="flex flex-col gap-4">
                            {['Strategic Insights', 'Performance Team', 'Client Success', 'Privacy Core'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className={`text-[13px] transition-colors ${isLight ? "text-slate-600 hover:text-violet-700" : "text-slate-400 hover:text-white"}`}>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Links */}
                    <div className="col-span-1">
                        <h4 className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-8 ${isLight ? "text-slate-900" : "text-white"}`}>
                            Contact
                        </h4>
                        <ul className="flex flex-col gap-4">
                            {['Support Desk', 'Partnerships', 'Media Kit', 'Enterprise Sales'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className={`text-[13px] transition-colors ${isLight ? "text-slate-600 hover:text-violet-700" : "text-slate-400 hover:text-white"}`}>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={`flex flex-col md:flex-row justify-between items-center pt-8 border-t gap-4 ${isLight ? "border-slate-300" : "border-white/5"
                    }`}>
                    <p className={`text-[10px] font-bold tracking-widest uppercase ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                        © 2024 CREATOR STACK. ENGINEERING SOCIAL SUCCESS.
                    </p>
                    <div className="flex gap-8">
                        <Link href="#" className={`text-[10px] font-bold tracking-widest uppercase transition-colors ${isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-500 hover:text-slate-300"}`}>
                            System Status
                        </Link>
                        <Link href="#" className={`text-[10px] font-bold tracking-widest uppercase transition-colors ${isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-500 hover:text-slate-300"}`}>
                            Privacy Architecture
                        </Link>
                        <Link href="#" className={`text-[10px] font-bold tracking-widest uppercase transition-colors ${isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-500 hover:text-slate-300"}`}>
                            Security Specs
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
