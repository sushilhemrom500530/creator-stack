"use client";

import { useTheme } from "@/providers/mode-theme";

export default function PerformanceTeamsSection() {
    const { theme } = useTheme();
    const isLight = theme === "light";

    const companies = [
        "Airbnb",
        "HubSpot",
        "Google",
        "Microsoft",
        "Walmart",
        "FedEx"
    ];

    const duplicatedCompanies = [...companies, ...companies, ...companies, ...companies];

    return (
        <section className={`w-full py-12 md:py-16 flex flex-col items-center justify-center border-t overflow-hidden transition-colors duration-300 ${isLight ? "bg-slate-100/70 border-slate-200/80" : "bg-[#100e16] border-white/5 shadow-inner"
            }`}>
            <style>
                {`
                    @keyframes marquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-marquee {
                        display: flex;
                        width: max-content;
                        animation: marquee 40s linear infinite;
                    }
                    .animate-marquee:hover {
                        animation-play-state: paused;
                    }
                `}
            </style>

            <div className="max-w-[1200px] w-full mx-auto flex flex-col items-center">
                <p className={`text-[10px] md:text-[11px] font-bold tracking-[0.2em] md:tracking-[0.25em] uppercase mb-10 text-center px-6 lg:px-8 ${isLight ? "text-slate-500" : "text-gray-400 drop-shadow-sm"
                    }`}>
                    Empowering high-performance teams at
                </p>

                <div
                    className="w-full relative flex items-center overflow-hidden"
                    style={{
                        WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                        maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
                    }}
                >
                    <div className="animate-marquee gap-x-12 md:gap-x-24 opacity-75 px-4">
                        {duplicatedCompanies.map((company, index) => (
                            <div
                                key={index}
                                className={`font-serif font-extrabold text-2xl md:text-3xl transition-colors cursor-pointer tracking-tight whitespace-nowrap ${isLight ? "text-slate-400 hover:text-slate-900" : "text-gray-500 hover:text-gray-200 drop-shadow-md"
                                    }`}
                            >
                                {company}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
