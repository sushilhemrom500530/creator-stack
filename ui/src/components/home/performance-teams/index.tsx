export default function PerformanceTeamsSection() {
    const companies = [
        "Airbnb",
        "HubSpot",
        "Google",
        "Microsoft",
        "Walmart",
        "FedEx"
    ];

    // Create 4 copies to ensure smooth continuous scrolling even on very wide screens
    const duplicatedCompanies = [...companies, ...companies, ...companies, ...companies];

    return (
        <section className="w-full bg-[#100e16] py-12 md:py-16 flex flex-col items-center justify-center border-t border-white/5 shadow-inner overflow-hidden">
            <style>
                {`
                    @keyframes marquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-marquee {
                        display: flex;
                        width: max-content;
                        /* Slower animation for 2 copies translated (50% of 4 total copies) */
                        animation: marquee 40s linear infinite;
                    }
                    .animate-marquee:hover {
                        animation-play-state: paused;
                    }
                `}
            </style>

            <div className="max-w-[1200px] w-full mx-auto flex flex-col items-center">
                <p className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] md:tracking-[0.25em] uppercase text-gray-400 mb-10 text-center drop-shadow-sm px-6 lg:px-8">
                    Empowering high-performance teams at
                </p>

                <div
                    className="w-full relative flex items-center overflow-hidden"
                    style={{
                        WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                        maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
                    }}
                >
                    <div className="animate-marquee gap-x-12 md:gap-x-24 opacity-70 px-4">
                        {duplicatedCompanies.map((company, index) => (
                            <div
                                key={index}
                                className="font-serif font-extrabold text-2xl md:text-3xl text-gray-500 hover:text-gray-200 transition-colors cursor-pointer drop-shadow-md tracking-tight whitespace-nowrap"
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