import React from 'react';

export default function ResourcesPage() {
    return (
        <main className="bg-[#0a0614] min-h-screen text-white">
            {/* Banner Section */}
            <section className="relative w-full min-h-[50vh] flex flex-col items-center justify-center pt-32 pb-24 px-4 overflow-hidden text-center border-b border-white/5">
                <div className="relative z-10 w-full">
                    {/* Ambient Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
                        {/* Tagline */}
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-[#DDB9FF]/20 bg-[#DDB9FF]/5 backdrop-blur-sm mb-6">
                            <span className="text-xs font-bold tracking-widest text-[#B3A1C9] uppercase">
                                Knowledge Center
                            </span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 font-serif">
                            Resource Hub
                        </h1>

                        {/* Description */}
                        <p className="text-[#a19bb0] text-lg md:text-xl max-w-[90%] mx-auto mb-12 leading-relaxed">
                            Unlock the full potential of SocialFlow AI. Master AI-driven social strategy with our comprehensive guides, technical documentation, and real-world success stories.
                        </p>

                        {/* Search Input */}
                        <div className="w-full max-w-xl relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#DDB9FF]/10 to-[#9747FF]/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <input
                                type="text"
                                placeholder="Search resources..."
                                className="relative w-full bg-[#1A1625]/60 border border-white/10 rounded-full py-4 px-6 text-[#a19bb0] placeholder:text-[#a19bb0]/50 outline-none focus:border-[#B983FF]/50 focus:bg-[#1A1625] transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* User Guides */}
            <section className="relative w-full max-w-7xl mx-auto py-24 px-6 md:px-12 border-b border-white/5">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold font-serif mb-4">User Guides</h2>
                        <p className="text-[#a19bb0] text-lg">
                            Step by step instructions to help you navigate our platform and optimize your social media presence with AI-generated insights.
                        </p>
                    </div>
                    <button className="text-[#4DE1C1] font-semibold hover:text-[#7aebe0] transition-colors shrink-0 text-sm tracking-wide">
                        View All Guides &rarr;
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-[#1A1625]/40 border border-white/10 rounded-2xl p-5 overflow-hidden group hover:bg-[#1A1625]/60 hover:border-white/20 transition-all duration-300">
                        <div className="w-full aspect-[16/10] rounded-xl bg-purple-900/20 mb-6 overflow-hidden relative border border-white/5">
                            <img src="https://images.unsplash.com/photo-1639322537231-2f206e06af84?auto=format&fit=crop&w=600&q=80" alt="Guide 1" className="w-full h-full object-cover opacity-60 mix-blend-screen group-hover:opacity-80 transition-opacity duration-500 group-hover:scale-105" />
                        </div>
                        <span className="text-[10px] font-bold tracking-widest text-[#B3A1C9] uppercase mb-2 block">Getting Started</span>
                        <h3 className="text-xl font-bold mb-3 font-serif">Onboarding Workshop</h3>
                        <p className="text-[#a19bb0] text-sm mb-6 leading-relaxed line-clamp-2">Learn how to connect your accounts and configure your first AI-driven content calendar in under 10 minutes.</p>
                        <button className="text-white text-sm font-medium hover:text-[#DDB9FF] transition-colors underline decoration-white/20 underline-offset-4">Read Guide</button>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-[#1A1625]/40 border border-white/10 rounded-2xl p-5 overflow-hidden group hover:bg-[#1A1625]/60 hover:border-white/20 transition-all duration-300">
                        <div className="w-full aspect-[16/10] rounded-xl bg-blue-900/20 mb-6 overflow-hidden relative border border-white/5">
                            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80" alt="Guide 2" className="w-full h-full object-cover opacity-60 mix-blend-screen group-hover:opacity-80 transition-opacity duration-500 group-hover:scale-105" />
                        </div>
                        <span className="text-[10px] font-bold tracking-widest text-[#B3A1C9] uppercase mb-2 block">Methodology</span>
                        <h3 className="text-xl font-bold mb-3 font-serif">Audience Analysis</h3>
                        <p className="text-[#a19bb0] text-sm mb-6 leading-relaxed line-clamp-2">Deep dive into the neural networks behind our audience sentiment analysis and how to leverage it for viral reach.</p>
                        <button className="text-white text-sm font-medium hover:text-[#DDB9FF] transition-colors underline decoration-white/20 underline-offset-4">Read Guide</button>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-[#1A1625]/40 border border-white/10 rounded-2xl p-5 overflow-hidden group hover:bg-[#1A1625]/60 hover:border-white/20 transition-all duration-300">
                        <div className="w-full aspect-[16/10] rounded-xl bg-cyan-900/20 mb-6 overflow-hidden relative border border-white/5">
                            <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80" alt="Guide 3" className="w-full h-full object-cover opacity-60 mix-blend-screen group-hover:opacity-80 transition-opacity duration-500 group-hover:scale-105" />
                        </div>
                        <span className="text-[10px] font-bold tracking-widest text-[#B3A1C9] uppercase mb-2 block">Strategy</span>
                        <h3 className="text-xl font-bold mb-3 font-serif">Multi-Channel Sync</h3>
                        <p className="text-[#a19bb0] text-sm mb-6 leading-relaxed line-clamp-2">Master the art of cross-platform narrative consistency using SocialFlow's automated tone adjustment algorithms.</p>
                        <button className="text-white text-sm font-medium hover:text-[#DDB9FF] transition-colors underline decoration-white/20 underline-offset-4">Read Guide</button>
                    </div>
                </div>
            </section>

            {/* API Documentation */}
            <section className="relative w-full max-w-7xl mx-auto py-24 px-6 md:px-12 border-b border-white/5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center px-3 py-1 rounded-full border border-[#4DE1C1]/20 bg-[#4DE1C1]/5 mb-6">
                            <span className="text-[10px] font-bold tracking-widest text-[#4DE1C1] uppercase">Developer Hub</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6">API Documentation</h2>
                        <p className="text-[#a19bb0] text-lg leading-relaxed mb-10 max-w-lg">
                            Integrate the world's most advanced social intelligence into your own stack. Our RESTful API provides granular access to analytics, generation, and scheduling engines.
                        </p>

                        <div className="flex flex-col gap-4 mb-10 max-w-md">
                            <div className="flex items-center gap-4 bg-[#1A1625]/60 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors cursor-pointer">
                                <span className="bg-[#B983FF]/20 text-[#DDB9FF] text-xs font-bold px-3 py-1 rounded font-mono">GET</span>
                                <div>
                                    <div className="font-bold text-sm text-white mb-0.5">Authentication Terminals</div>
                                    <div className="text-[#a19bb0] text-xs">OAuth 2.0 implementation guide</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-[#1A1625]/60 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors cursor-pointer">
                                <span className="bg-[#4DE1C1]/20 text-[#4DE1C1] text-xs font-bold px-3 py-1 rounded font-mono">POST</span>
                                <div>
                                    <div className="font-bold text-sm text-white mb-0.5">Webhooks & Real-time Events</div>
                                    <div className="text-[#a19bb0] text-xs">Listen for mentions and engagement</div>
                                </div>
                            </div>
                        </div>

                        <button className="px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 text-white font-semibold text-sm transition-all duration-300">
                            Explore API Specs
                        </button>
                    </div>

                    {/* Code window mock */}
                    <div className="bg-[#0f0b1a] border border-white/10 rounded-2xl p-6 overflow-hidden relative shadow-2xl">
                        {/* Traffic lights */}
                        <div className="flex gap-2 mb-6">
                            <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                        </div>
                        <pre className="font-mono text-xs md:text-sm whitespace-pre-wrap leading-relaxed">
                            <span className="text-[#FF7B72]">const</span> <span className="text-[#79C0FF]">SocialFlow</span> <span className="text-[#FF7B72]">=</span> <span className="text-[#D2A8FF]">require</span>(<span className="text-[#A5D6FF]">"@socialflow/sdk"</span>);

                            <span className="text-[#FF7B72]">async</span> <span className="text-[#FF7B72]">function</span> <span className="text-[#D2A8FF]">analyzeEngagement</span>() {'{'}
                            <span className="text-[#FF7B72]">const</span> <span className="text-[#79C0FF]">client</span> <span className="text-[#FF7B72]">=</span> <span className="text-[#FF7B72]">new</span> <span className="text-[#79C0FF]">SocialFlow</span>({'{'}
                            <span className="text-[#C9D1D9]">apiKey</span><span className="text-[#FF7B72]">:-</span> <span className="text-[#79C0FF]">process</span>.<span className="text-[#79C0FF]">env</span>.<span className="text-[#79C0FF]">API_KEY</span>
                            {'}'});

                            <span className="text-[#FF7B72]">const</span> <span className="text-[#79C0FF]">stats</span> <span className="text-[#FF7B72]">=</span> <span className="text-[#FF7B72]">await</span> <span className="text-[#79C0FF]">client</span>.<span className="text-[#79C0FF]">analytics</span>.<span className="text-[#D2A8FF]">getMetrics</span>({'{'}
                            <span className="text-[#C9D1D9]">period</span><span className="text-[#FF7B72]">:</span> <span className="text-[#A5D6FF]">"last_30d"</span>,
                            <span className="text-[#C9D1D9]">platform</span><span className="text-[#FF7B72]">:</span> <span className="text-[#A5D6FF]">"global"</span>
                            {'}'});

                            <span className="text-[#79C0FF]">console</span>.<span className="text-[#D2A8FF]">log</span>(<span className="text-[#A5D6FF]">`Active ROI: ${'{'}</span><span className="text-[#79C0FF]">stats</span>.<span className="text-[#79C0FF]">roi</span><span className="text-[#A5D6FF]">{'}'}`</span>);
                            {'}'}
                        </pre>
                    </div>
                </div>
            </section>

            {/* Case Studies */}
            <section className="relative w-full max-w-7xl mx-auto py-24 px-6 md:px-12 border-b border-white/5">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">Case Studies</h2>
                    <p className="text-[#a19bb0] text-lg max-w-2xl mx-auto">
                        See how industry leaders are leveraging SocialFlow AI to transform their digital presence and drive measurable growth.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Case 1 */}
                    <div className="relative h-[450px] md:h-[550px] rounded-3xl overflow-hidden group border border-white/10">
                        <img
                            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
                            alt="City building"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0614] via-[#0a0614]/60 to-transparent"></div>

                        <div className="absolute bottom-0 w-full p-8 md:p-12 flex flex-col justify-end h-full">
                            <span className="text-[10px] font-bold tracking-widest text-[#4DE1C1] uppercase mb-4">Enterprise</span>
                            <h3 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-white">Lumina Global</h3>
                            <p className="text-[#a19bb0] text-sm md:text-base leading-relaxed mb-10 max-w-md">
                                How an e-commerce giant scaled their social content by 400% while reducing overhead by 40% using our AI core.
                            </p>

                            <div className="flex gap-10">
                                <div>
                                    <div className="text-4xl md:text-5xl font-bold font-mono text-white mb-2">400%</div>
                                    <div className="text-[10px] text-[#a19bb0] tracking-widest uppercase">Growth</div>
                                </div>
                                <div>
                                    <div className="text-4xl md:text-5xl font-bold font-mono text-white mb-2">12M+</div>
                                    <div className="text-[10px] text-[#a19bb0] tracking-widest uppercase">Impressions</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Case 2 */}
                    <div className="relative h-[450px] md:h-[550px] rounded-3xl overflow-hidden group border border-white/10">
                        <img
                            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80"
                            alt="Office space"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0614] via-[#0a0614]/70 to-transparent"></div>

                        <div className="absolute bottom-0 w-full p-8 md:p-12 flex flex-col justify-end h-full">
                            <span className="text-[10px] font-bold tracking-widest text-[#B983FF] uppercase mb-4">Agency</span>
                            <h3 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-white">Vivid Media</h3>
                            <p className="text-[#a19bb0] text-sm md:text-base leading-relaxed mb-10 max-w-md">
                                Transforming boutique agency workflows with predictive engagement modeling and automated client reporting.
                            </p>

                            <div className="flex gap-10">
                                <div>
                                    <div className="text-4xl md:text-5xl font-bold font-mono text-white mb-2">3.5x</div>
                                    <div className="text-[10px] text-[#a19bb0] tracking-widest uppercase">ROI Bounce</div>
                                </div>
                                <div>
                                    <div className="text-4xl md:text-5xl font-bold font-mono text-white mb-2">98%</div>
                                    <div className="text-[10px] text-[#a19bb0] tracking-widest uppercase">Accuracy</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stay Informed Newsletter */}
            <section className="relative w-full max-w-5xl mx-auto py-24 px-6 md:px-12">
                <div className="bg-[#15111F]/80 backdrop-blur-md border border-white/10 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
                    {/* Background glows */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]"></div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6 text-white">Stay Informed</h2>
                        <p className="text-[#a19bb0] text-lg mb-10">
                            Receive weekly insights on AI trends, social strategy, and platform updates delivered straight to your inbox.
                        </p>

                        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-6">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="flex-1 bg-[#0a0614] border border-white/10 rounded-xl py-4 px-5 text-white placeholder:text-[#a19bb0]/50 focus:outline-none focus:border-[#DDB9FF]/50 transition-colors shadow-inner"
                                required
                            />
                            <button className="px-8 py-4 rounded-xl bg-[#DDB9FF] hover:bg-[#E9D5FF] text-[#2D164E] font-bold text-sm tracking-wide transition-all duration-300 whitespace-nowrap">
                                Subscribe
                            </button>
                        </form>

                        <p className="text-[11px] text-[#a19bb0]/50 uppercase tracking-widest">
                            Join 20,000+ professionals. No spam, ever.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}