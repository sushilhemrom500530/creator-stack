export default function SolutionsPage() {
    return (
        <main className="bg-[#0a0614] min-h-screen text-white">
            {/* Hero Section */}
            <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center py-24 px-4 overflow-hidden text-center">
                <div className="">
                    {/* Ambient Background Glow */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
                        {/* Tagline */}
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
                            <span className="text-xs font-bold tracking-widest text-[#B3A1C9] uppercase">
                                The Intelligent Social Layer
                            </span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 font-serif">
                            Solutions for the{' '}
                            <span className="bg-gradient-to-r from-[#DDB9FF] via-[#B983FF] to-[#9747FF] text-transparent bg-clip-text font-serif">
                                Modern Enterprise
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-[#a19bb0] text-lg md:text-xl max-w-[85%] mx-auto mb-10 leading-relaxed">
                            Empower your organization with autonomous social orchestration. From high-volume retail to complex B2B ecosystems, SocialFlow AI scales your presence through cognitive content generation and real-time audience resonance.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <button className="px-8 py-3.5 rounded-xl bg-[#D4B5FF] hover:bg-[#E9D5FF] text-[#2D164E] font-semibold text-sm transition-all duration-300">
                                Request Demo
                            </button>
                            <button className="px-8 py-3.5 rounded-xl bg-[#1A1625] hover:bg-[#2A243A] border border-white/5 text-white font-semibold text-sm transition-all duration-300">
                                View Whitepaper
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative w-full max-w-7xl mx-auto py-24 px-6 md:px-12 flex flex-col gap-32 border-t border-white/5">
                {/* Feature 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="flex flex-col items-start text-left">
                        <span className="text-sm font-bold tracking-widest text-cyan-400 uppercase mb-4">
                            Vertical 01 / Retail
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6">
                            E-commerce
                        </h2>
                        <p className="text-[#a19bb0] text-lg leading-relaxed mb-8">
                            Convert social engagement into transactional velocity. Our E-commerce
                            solution autonomously manages thousands of SKUs across social channels,
                            generating dynamic shoppable content that adapts to inventory levels and
                            seasonal trends in real-time.
                        </p>
                        <ul className="flex flex-col gap-4 mb-10">
                            {[
                                'Dynamic Product Catalog Integration',
                                'Conversion-Optimized Ad Copywriting',
                                'Real-time Inventory Response Engine',
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-[#d1cddb]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                                    <span className="text-base font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-2 transition-colors">
                            Explore Retail Solutions <span aria-hidden="true">&rarr;</span>
                        </button>
                    </div>
                    {/* Placeholder for Image */}
                    <div className="relative w-full aspect-[4/3] rounded-2xl border border-white/10 bg-white/5 overflow-hidden group">
                        {/* Mock Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-cyan-500/10 rounded-full blur-[80px] group-hover:bg-cyan-500/20 transition-all duration-700"></div>
                        <img
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                            alt="E-commerce Dashboard"
                            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity hover:opacity-50 transition-opacity duration-500"
                        />
                    </div>
                </div>

                {/* Feature 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Placeholder for Image - Left on desktop */}
                    <div className="relative w-full aspect-[4/3] rounded-2xl border border-white/10 bg-white/5 overflow-hidden group order-2 lg:order-1">
                        {/* Mock Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-orange-500/10 rounded-full blur-[80px] group-hover:bg-orange-500/20 transition-all duration-700"></div>
                        <img
                            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80"
                            alt="Agency Dashboard Monitors"
                            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity hover:opacity-50 transition-opacity duration-500"
                        />
                    </div>
                    <div className="flex flex-col items-start text-left order-1 lg:order-2">
                        <span className="text-sm font-bold tracking-widest text-[#FF8A65] uppercase mb-4">
                            Vertical 02 / Partners
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6">
                            Agencies
                        </h2>
                        <p className="text-[#a19bb0] text-lg leading-relaxed mb-8">
                            Scale your creative throughput without increasing headcount. Our Agency
                            tier provides white-label orchestration tools that allow small teams to
                            manage enterprise-level portfolios with centralized AI-driven content
                            controls and unified reporting.
                        </p>
                        <ul className="flex flex-col gap-4 mb-10">
                            {[
                                'Multi-Tenant Workspace Architecture',
                                'AI Brand Voice Synchronization',
                                'Automated Client Performance Reports',
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-[#d1cddb]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF8A65]"></div>
                                    <span className="text-base font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="text-[#FF8A65] hover:text-[#ff9d7e] font-semibold flex items-center gap-2 transition-colors">
                            View Agency Programs <span aria-hidden="true">&rarr;</span>
                        </button>
                    </div>
                </div>

                {/* Feature 3 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="flex flex-col items-start text-left">
                        <span className="text-sm font-bold tracking-widest text-[#B388FF] uppercase mb-4">
                            Vertical 03 / Enterprise
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6">
                            B2B Tech
                        </h2>
                        <p className="text-[#a19bb0] text-lg leading-relaxed mb-8">
                            Navigate the complexity of B2B social selling with surgical precision. We
                            help technology firms establish thought leadership through data-backed
                            content pillars and automated executive advocacy programs that resonate
                            with high-value decision-makers.
                        </p>
                        <ul className="flex flex-col gap-4 mb-10">
                            {[
                                'Account-Based Social Orchestration',
                                'Technical Content Translation Engine',
                                'Employee Advocacy Automation',
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-[#d1cddb]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#B388FF]"></div>
                                    <span className="text-base font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="text-[#B388FF] hover:text-[#c4a1ff] font-semibold flex items-center gap-2 transition-colors">
                            Enterprise Solutions <span aria-hidden="true">&rarr;</span>
                        </button>
                    </div>
                    {/* Placeholder for Image */}
                    <div className="relative w-full aspect-[4/3] rounded-2xl border border-white/10 bg-white/5 overflow-hidden group">
                        {/* Mock Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#B388FF]/10 rounded-full blur-[80px] group-hover:bg-[#B388FF]/20 transition-all duration-700"></div>
                        <img
                            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
                            alt="Enterprise Tech Network"
                            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity hover:opacity-50 transition-opacity duration-500"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}