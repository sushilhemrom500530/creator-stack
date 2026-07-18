import { CheckCircle2 } from 'lucide-react';

export default function PricingSection() {
    return (
        <section className="bg-[#09090b] text-white py-24 px-6 md:px-12 lg:px-24 flex flex-col items-center">
            <div className="text-center mb-16 max-w-2xl">
                <h2 className="text-sm font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-blue-200 tracking-wide" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>
                    Elite Access Plans
                </h2>
                <p className="text-gray-300 text-sm font-medium">
                    Simple, transparent, and built to scale with your ambition.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-8 w-full max-w-5xl items-center">
                {/* Starter Plan */}
                <div className="bg-[#111113] rounded-[2rem] p-8 lg:p-10 border border-white/5 flex flex-col h-[500px] hover:border-white/10 transition-colors">
                    <div className="mb-8">
                        <h3 className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">Starter</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-serif font-semibold">$49</span>
                            <span className="text-gray-500 text-xs">/mo</span>
                        </div>
                    </div>

                    <ul className="flex flex-col gap-6 mb-12 flex-1">
                        {[
                            '10 Accounts',
                            'AI Content Drafts',
                            'Core Analytics'
                        ].map((feature, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <button className="w-full py-4 rounded-xl bg-[#1c1c1f] hover:bg-[#252529] text-white text-sm font-semibold transition-colors mt-auto border border-white/5">
                        Get Started
                    </button>
                </div>

                {/* Business Plan (Recommended) */}
                <div className="relative bg-black rounded-[2.5rem] p-8 lg:p-10 border border-purple-500/30 flex flex-col h-[540px] transform md:-translate-y-2 shadow-[0_0_80px_-20px_rgba(168,85,247,0.2)]">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="bg-white text-purple-900 text-[9px] font-bold tracking-widest uppercase py-2 px-5 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                            Recommended
                        </span>
                    </div>

                    <div className="mb-8 mt-2">
                        <h3 className="text-gray-200 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">Business</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-serif font-semibold">$149</span>
                            <span className="text-gray-500 text-xs">/mo</span>
                        </div>
                    </div>

                    <ul className="flex flex-col gap-6 mb-12 flex-1">
                        {[
                            'Unlimited Accounts',
                            'Full Agentic Co-Pilot',
                            'White-label Reports',
                            'Priority AI Server'
                        ].map((feature, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
                                <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <button className="w-full py-4 rounded-xl bg-gradient-to-r from-[#9462FF] to-[#D5AFFF] hover:from-[#814FFF] hover:to-[#C49BFF] text-white text-sm font-semibold transition-colors mt-auto shadow-[0_4px_30px_-5px_rgba(168,85,247,0.6)]">
                        Scale Now
                    </button>
                </div>

                {/* Enterprise Plan */}
                <div className="bg-[#111113] rounded-[2rem] p-8 lg:p-10 border border-white/5 flex flex-col h-[500px] hover:border-white/10 transition-colors">
                    <div className="mb-4">
                        <h3 className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">Enterprise</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-serif font-semibold tracking-tight">Custom</span>
                        </div>
                        <p className="text-gray-400 text-xs mt-6 leading-relaxed max-w-[200px]">
                            Bespoke solutions for global marketing departments and agencies.
                        </p>
                    </div>

                    <ul className="flex flex-col gap-6 mb-12 flex-1 mt-6">
                        {[
                            'Dedicated Account Manager',
                            'Custom AI Training',
                            'API Access'
                        ].map((feature, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <button className="w-full py-4 rounded-xl bg-[#1c1c1f] hover:bg-[#252529] text-white text-sm font-semibold transition-colors mt-auto border border-white/5">
                        Contact Sales
                    </button>
                </div>
            </div>
        </section>
    );
}