import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function BlogsPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0c] pt-32 pb-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-[1200px] w-full mx-auto flex flex-col items-center">

                {/* Header Subtext & Title */}
                <div className="text-center mb-20 max-w-2xl">
                    <span className="text-teal-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-4 block">
                        Perspective
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 tracking-tight">
                        Intelligence Weekly
                    </h1>
                    <p className="text-gray-400 text-[14px] md:text-[15px] leading-relaxed">
                        Exploring the frontier of generative AI, automated engagement, and the future of digital presence for the world's most innovative brands.
                    </p>
                </div>

                {/* Featured Post Card */}
                <div className="w-full bg-[#111018] rounded-[2rem] border border-white/5 overflow-hidden flex flex-col md:flex-row shadow-2xl mb-24 group hover:border-white/10 transition-colors">
                    {/* Left: Image */}
                    <div className="w-full md:w-1/2 h-[300px] md:h-auto relative overflow-hidden bg-[#181622]">
                        <img
                            src="https://images.unsplash.com/photo-1696422329618-9c1626acc2b0?q=80&w=1200&auto=format&fit=crop"
                            alt="Neural Network"
                            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 delay-75"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111018]/90 md:to-[#111018]" />
                    </div>

                    {/* Right: Content */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                                FEATURED
                            </span>
                            <span className="text-gray-500 text-[12px] font-mono">
                                March 14, 2024
                            </span>
                        </div>

                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
                            The Autonomy Epoch: How AI is Redefining Brand Authority
                        </h2>

                        <p className="text-gray-400 text-[14px] leading-relaxed mb-10">
                            In an era of synthetic media, true authority is built through algorithmic precision and human nuance. We dive deep into the strategies used by top-tier firms to scale without losing their soul.
                        </p>

                        <div className="flex justify-between items-end mt-auto">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-400 overflow-hidden shadow-inner">
                                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" alt="Dr. Helena Vance" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white text-[13px] font-bold">Dr. Helena Vance</span>
                                    <span className="text-gray-500 text-[11px] font-mono italic">Head of AI Research</span>
                                </div>
                            </div>

                            <button className="text-gray-400 hover:text-white text-[10px] font-bold tracking-widest uppercase transition-colors">
                                READ MORE
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Insights header */}
                <div className="w-full flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-6">
                    <h2 className="text-2xl font-bold text-white">Recent Insights</h2>
                    <div className="flex gap-2">
                        <button className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full transition-colors border border-white/5">
                            ALL POSTS
                        </button>
                        <button className="bg-transparent hover:bg-white/5 text-gray-400 hover:text-white text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full transition-colors">
                            STRATEGY
                        </button>
                        <button className="bg-transparent hover:bg-white/5 text-gray-400 hover:text-white text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full transition-colors">
                            TECH STACK
                        </button>
                    </div>
                </div>

                {/* 3-Column Grid Layout */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

                    {/* Card 1 */}
                    <div className="col-span-1 bg-[#111018] rounded-3xl border border-white/5 flex flex-col overflow-hidden group hover:border-white/10 transition-colors shadow-xl">
                        <div className="w-full h-[200px] overflow-hidden bg-[#1a1825]">
                            <img src="https://images.unsplash.com/photo-1620825937374-87fc7d62828e?q=80&w=800&auto=format&fit=crop" alt="Abstract Glass" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="p-6 lg:p-8 flex flex-col flex-1">
                            <span className="text-violet-400 text-[9px] font-bold tracking-[0.2em] uppercase mb-4">ALGORITHMIC TRENDS</span>
                            <h3 className="text-white text-[17px] font-bold mb-4 leading-snug">
                                Mastering the Attention Economy in 2024
                            </h3>
                            <p className="text-gray-400 text-[13px] leading-relaxed mb-8">
                                How SocialFlow AI leverages predictive analytics to capture high-intent engagement windows before they trend.
                            </p>
                            <div className="mt-auto flex justify-between items-center border-t border-white/5 pt-4">
                                <span className="text-gray-500 text-[11px] font-mono">5 min read</span>
                                <button className="text-gray-400 hover:text-white text-[10px] font-bold tracking-widest uppercase transition-colors flex items-center gap-1 group/btn">
                                    ARTICLE <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="col-span-1 bg-[#111018] rounded-3xl border border-white/5 flex flex-col overflow-hidden group hover:border-white/10 transition-colors shadow-xl">
                        <div className="w-full h-[200px] overflow-hidden bg-[#151918]">
                            <img src="https://images.unsplash.com/photo-1682687982501-1e5898cb89c4?q=80&w=800&auto=format&fit=crop" alt="Nature Chip" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="p-6 lg:p-8 flex flex-col flex-1">
                            <span className="text-teal-400 text-[9px] font-bold tracking-[0.2em] uppercase mb-4">PRODUCT UPDATES</span>
                            <h3 className="text-white text-[17px] font-bold mb-4 leading-snug">
                                Introducing Aetheris-2: The New Logic Engine
                            </h3>
                            <p className="text-gray-400 text-[13px] leading-relaxed mb-8">
                                A deep dive into our latest model upgrade that reduces hallucination by 84% in social contexts.
                            </p>
                            <div className="mt-auto flex justify-between items-center border-t border-white/5 pt-4">
                                <span className="text-gray-500 text-[11px] font-mono">8 min read</span>
                                <button className="text-gray-400 hover:text-white text-[10px] font-bold tracking-widest uppercase transition-colors flex items-center gap-1 group/btn">
                                    ARTICLE <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="col-span-1 bg-[#111018] rounded-3xl border border-white/5 flex flex-col overflow-hidden group hover:border-white/10 transition-colors shadow-xl">
                        <div className="w-full h-[200px] overflow-hidden bg-[#161a25]">
                            <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop" alt="Stairs" className="w-full h-full object-cover opacity-80 grayscale group-hover:scale-110 group-hover:grayscale-0 transition-all duration-700" />
                        </div>
                        <div className="p-6 lg:p-8 flex flex-col flex-1">
                            <span className="text-indigo-400 text-[9px] font-bold tracking-[0.2em] uppercase mb-4">ENTERPRISE SCALE</span>
                            <h3 className="text-white text-[17px] font-bold mb-4 leading-snug">
                                Governing AI Across Global Teams
                            </h3>
                            <p className="text-gray-400 text-[13px] leading-relaxed mb-8">
                                Best practices for maintaining brand consistency while deploying autonomous agents across continents.
                            </p>
                            <div className="mt-auto flex justify-between items-center border-t border-white/5 pt-4">
                                <span className="text-gray-500 text-[11px] font-mono">12 min read</span>
                                <button className="text-gray-400 hover:text-white text-[10px] font-bold tracking-widest uppercase transition-colors flex items-center gap-1 group/btn">
                                    ARTICLE <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="col-span-1 bg-[#111018] rounded-3xl border border-white/5 flex flex-col overflow-hidden group hover:border-white/10 transition-colors shadow-xl">
                        <div className="w-full h-[200px] overflow-hidden bg-[#171520]">
                            <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop" alt="AI Human Frame" className="w-full h-full object-cover opacity-80 mix-blend-screen group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="p-6 lg:p-8 flex flex-col flex-1">
                            <span className="text-pink-400 text-[9px] font-bold tracking-[0.2em] uppercase mb-4">ETHICS & FUTURE</span>
                            <h3 className="text-white text-[17px] font-bold mb-4 leading-snug">
                                The Trust Protocol: AI Transparency
                            </h3>
                            <p className="text-gray-400 text-[13px] leading-relaxed mb-8">
                                How we are building a more transparent social ecosystem through verifiable AI signatures.
                            </p>
                            <div className="mt-auto flex justify-between items-center border-t border-white/5 pt-4">
                                <span className="text-gray-500 text-[11px] font-mono">6 min read</span>
                                <button className="text-gray-400 hover:text-white text-[10px] font-bold tracking-widest uppercase transition-colors flex items-center gap-1 group/btn">
                                    ARTICLE <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Block (Spans 2 columns on lg) */}
                    <div className="col-span-1 lg:col-span-2 bg-gradient-to-tr from-[#161225] to-[#1e1531] rounded-3xl border border-violet-500/20 flex flex-col justify-center p-8 lg:p-12 xl:p-16 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <h3 className="text-white text-2xl lg:text-3xl font-bold mb-4 relative z-10">
                            Stay Ahead of the Curve
                        </h3>
                        <p className="text-violet-200/70 text-[13px] lg:text-[14px] leading-relaxed mb-8 max-w-md relative z-10">
                            Get our bi-weekly whitepapers and tactical AI guides delivered strictly to your inbox. No spam.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md relative z-10">
                            <input
                                type="email"
                                placeholder="work@company.com"
                                className="flex-1 bg-black/40 border border-violet-500/20 rounded-xl px-5 py-4 text-white text-[13px] placeholder:text-violet-200/30 focus:outline-none focus:border-violet-500/60 transition-colors"
                            />
                            <button className="bg-violet-300 hover:bg-violet-200 text-violet-900 text-[11px] font-bold tracking-widest uppercase px-8 py-4 rounded-xl transition-colors shadow-[0_0_20px_rgba(167,139,250,0.4)] hover:shadow-[0_0_30px_rgba(167,139,250,0.6)]">
                                SUBSCRIBE
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}