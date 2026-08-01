export default function BlogFeatures() {
    return (
        <div className="">
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
        </div>
    )
}