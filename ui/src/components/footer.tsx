"use client";

import { useTheme } from '@/providers/mode-theme';
import Link from 'next/link';
import Logo from './reuseable/logo';

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

            <div className="container mx-auto px-4 lg:px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-20 text-center md:text-left">
                    {/* Brand Info */}
                    <div className="col-span-1 md:col-span-1 flex flex-col items-center md:items-start md:pr-4">
                        <Logo className='!w-32 h-20' />
                        <p className={`text-[13px] w-2/3 mx-auto md:w-auto leading-relaxed mt-3 md:pr-8 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                            Precision social engineering for teams that demand excellence. Built by market leaders for future icons.
                        </p>
                    </div>

                    {/* Platform Links */}
                    <div className="col-span-1 flex flex-col items-center md:items-start">
                        <h4 className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-8 ${isLight ? "text-slate-900" : "text-white"}`}>
                            Platform
                        </h4>
                        <ul className="flex flex-col gap-4 items-center md:items-start">
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
                    <div className="col-span-1 flex flex-col items-center md:items-start">
                        <h4 className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-8 ${isLight ? "text-slate-900" : "text-white"}`}>
                            Organization
                        </h4>
                        <ul className="flex flex-col gap-4 items-center md:items-start">
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
                    <div className="col-span-1 flex flex-col items-center md:items-start">
                        <h4 className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-8 ${isLight ? "text-slate-900" : "text-white"}`}>
                            Contact
                        </h4>
                        <ul className="flex flex-col gap-4 items-center md:items-start">
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
                <div className={`flex flex-col md:flex-row justify-between items-center text-center md:text-left pt-8 border-t gap-4 ${isLight ? "border-slate-300" : "border-white/5"
                    }`}>
                    <p className={`text-[10px] font-bold tracking-widest uppercase ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                        © 2024 CREATOR STACK. ENGINEERING SOCIAL SUCCESS.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-8">
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
