import { Title } from "@/components/reuseable/title";

export function ThreeStepSection() {
    const steps = [
        {
            num: "01",
            title: "Unify Assets",
            desc: "Connect your brand ecosystem in minutes. Data ingestion begins instantly across all touchpoints.",
            colorClass: "text-violet-400 bg-violet-500/10 border-violet-500/20"
        },
        {
            num: "02",
            title: "AI Synthesis",
            desc: "Neural engine processes trends and generates optimal engagement pathways specifically for you.",
            colorClass: "text-teal-400 bg-teal-500/10 border-teal-500/20"
        },
        {
            num: "03",
            title: "Automated Scale",
            desc: "Deploy content at scale with machine precision while you focus on high-level creative strategy.",
            colorClass: "text-violet-400 bg-violet-500/10 border-violet-500/20"
        }
    ];

    return (
        <section className="relative w-full py-24 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0a0a0c] via-[#0E0C15] to-[#12101b] border-t border-white/5">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-violet-600/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 flex flex-col items-start lg:px-12">
                <div className="mb-16 max-w-2xl mx-auto">
                    <Title
                        title="Three Steps to Supremacy"
                        description=" Our methodology focuses on deep integration and automated scaling."
                    />
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 tracking-tight drop-shadow-sm">

                    </h2>
                    <p className="text-gray-400 text-sm md:text-base font-medium tracking-wide">

                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="relative bg-[#171520]/80 rounded-[2rem] p-8 lg:p-10 border border-white/[0.04] shadow-xl hover:border-white/10 transition-colors group overflow-hidden flex flex-col h-full"
                        >
                            <span className="absolute right-6 top-8 text-8xl font-black text-white/[0.03] select-none pointer-events-none transition-transform group-hover:scale-110 group-hover:text-white/[0.04] duration-500">
                                {step.num}
                            </span>

                            <div className={`w-fit px-3 py-1.5 rounded-lg border text-xs font-bold font-mono shadow-inner mb-8 ${step.colorClass}`}>
                                {step.num}
                            </div>

                            <div className="mt-auto">
                                <h3 className="text-white text-xl font-bold mb-4">{step.title}</h3>
                                <p className="text-gray-400 text-[13px] lg:text-sm leading-relaxed max-w-[90%]">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}