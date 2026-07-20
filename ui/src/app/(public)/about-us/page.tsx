export default function AboutUsPage() {
    return (
        <main className="bg-[#0a0614] min-h-screen text-white">
            {/* Hero Section */}
            <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center py-24 px-4 overflow-hidden text-center">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[600px] h-[600px] bg-[#9747FF]/10 rounded-full blur-[120px]"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
                        <span className="text-xs font-bold tracking-widest text-[#B3A1C9] uppercase">
                            Our Story
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-8 font-serif">
                        Redefining the{' '}
                        <span className="bg-gradient-to-r from-[#DDB9FF] via-[#B983FF] to-[#9747FF] text-transparent bg-clip-text font-serif">
                            Creator Economy
                        </span>
                    </h1>

                    <p className="text-[#a19bb0] text-lg md:text-xl max-w-[85%] mx-auto mb-10 leading-relaxed">
                        We believe that creators and enterprises deserve intelligent tools that augment their vision rather than complicate it. Our mission is to build the autonomous layer and cognitive infrastructure for the next generation of social engagement.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="relative w-full max-w-7xl mx-auto py-24 px-6 md:px-12 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="relative group p-10 rounded-3xl border border-white/10 bg-white/5 overflow-hidden transition-all hover:bg-white/10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/20 transition-colors duration-700"></div>
                        <h2 className="text-2xl md:text-3xl font-bold font-serif mb-6 text-cyan-400">Our Mission</h2>
                        <p className="text-[#a19bb0] text-lg leading-relaxed">
                            To empower brands and individual creators with intelligent automation that operates at the speed of culture, turning passive audiences into active communities through data-backed orchestration.
                        </p>
                    </div>

                    <div className="relative group p-10 rounded-3xl border border-white/10 bg-white/5 overflow-hidden transition-all hover:bg-white/10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF8A65]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#FF8A65]/20 transition-colors duration-700"></div>
                        <h2 className="text-2xl md:text-3xl font-bold font-serif mb-6 text-[#FF8A65]">Our Vision</h2>
                        <p className="text-[#a19bb0] text-lg leading-relaxed">
                            A future where technology bridges the gap between creativity and scale, allowing genuine human connection to thrive at an unprecedented, global level without compromising authenticity.
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="relative w-full max-w-7xl mx-auto py-24 px-6 md:px-12 flex flex-col gap-16 border-t border-white/5">
                <div className="text-center max-w-3xl mx-auto">
                    <span className="text-sm font-bold tracking-widest text-[#B388FF] uppercase mb-4 block">
                        Our DNA
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6">
                        Core Values
                    </h2>
                    <p className="text-[#a19bb0] text-lg leading-relaxed">
                        These are the principles that guide our product decisions, shape our team culture, and drive everything we do.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: 'Radical Innovation', desc: 'Constantly questioning the status quo to build solutions that redefine industry standards.', color: 'bg-[#B388FF]' },
                        { title: 'Empathetic Design', desc: 'Crafting experiences that prioritize user intuition and respect the creator\'s workflow.', color: 'bg-cyan-400' },
                        { title: 'Relentless Scale', desc: 'Engineering robust systems capable of handling the highest volumes with surgical precision.', color: 'bg-[#FF8A65]' },
                    ].map((val, idx) => (
                        <div key={idx} className="flex flex-col items-start p-8 rounded-2xl border border-white/5 bg-white/5 hover:border-white/10 transition-colors">
                            <div className={`w-12 h-12 rounded-xl ${val.color} bg-opacity-20 flex items-center justify-center mb-6`}>
                                <div className={`w-4 h-4 rounded-full ${val.color}`}></div>
                            </div>
                            <h3 className="text-xl font-bold mb-4">{val.title}</h3>
                            <p className="text-[#a19bb0] leading-relaxed text-sm md:text-base">
                                {val.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team / Story Section */}
            <section className="relative w-full max-w-7xl mx-auto py-24 px-6 md:px-12 flex flex-col gap-12 border-t border-white/5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative w-full aspect-[4/3] rounded-2xl border border-white/10 bg-white/5 overflow-hidden group">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#DDB9FF]/10 rounded-full blur-[80px] group-hover:bg-[#DDB9FF]/20 transition-all duration-700"></div>
                        <img
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                            alt="The Team"
                            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity hover:opacity-50 transition-opacity duration-500"
                        />
                    </div>
                    <div className="flex flex-col items-start text-left">
                        <span className="text-sm font-bold tracking-widest text-[#DDB9FF] uppercase mb-4">
                            Global & Remote
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6">
                            Built by Builders
                        </h2>
                        <p className="text-[#a19bb0] text-lg leading-relaxed mb-6">
                            We are a collective of engineers, designers, and strategists spread across the globe. By embracing a remote-first culture, we bring together diverse perspectives to solve complex problems in social orchestration.
                        </p>
                        <p className="text-[#a19bb0] text-lg leading-relaxed mb-10">
                            Our team previously led initiatives at top tech organizations and creative agencies, giving us the unique intersection of technical depth and creative empathy needed to build Creator Stack.
                        </p>
                        <button className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-sm transition-all duration-300">
                            View Open Positions
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}