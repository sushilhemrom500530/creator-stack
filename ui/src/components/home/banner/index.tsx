import { Play } from "lucide-react";

export default function BannerSection() {
  return (
    <section className="relative w-full min-h-screen bg-[#100e16] flex items-center pt-28 pb-16 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[10%] left-0 w-[600px] h-[600px] bg-violet-600/30 blur-[140px] rounded-full pointer-events-none -translate-x-1/2" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#14b8a6]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">

        {/* Left Content */}
        <div className="flex flex-col items-start gap-7">
          {/* Badge */}
          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#14b8a6] animate-pulse" />
            <span className="text-[11px] font-bold text-[#14b8a6] tracking-wider">V3.0 IS NOW LIVE</span>
          </div>

          {/* Headline */}
          <h1 className="text-[2.75rem] leading-[1.1] sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-2">
            Manage Every Social<br className="hidden lg:block" /> Platform From <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-violet-100 italic font-serif tracking-normal">One</span><br />
            <span className="text-[#e2d4f9]">Intelligent Dashboard</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
            Connect accounts, create content once, publish everywhere, and schedule automatically with the world's most precise AI social engine.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <button className="px-8 py-3.5 rounded-xl bg-[#c4b5fd] text-violet-950 font-bold text-[15px] hover:bg-[#ddd6fe] transition-all transform hover:scale-105 cursor-pointer shadow-[0_0_20px_rgba(196,181,253,0.3)]">
              Start Free
            </button>
            <button className="flex items-center gap-3 px-6 py-3.5 rounded-xl border border-white/10 text-white font-semibold text-[15px] hover:bg-white/5 transition-all cursor-pointer group">
              <span className="w-8 h-8 rounded-full bg-[#14b8a6]/10 flex items-center justify-center border border-[#14b8a6]/20 group-hover:bg-[#14b8a6]/20 transition-colors">
                <Play size={14} className="text-[#14b8a6] fill-[#14b8a6] ml-0.5" />
              </span>
              Watch Demo
            </button>
          </div>
        </div>

        {/* Right Mockup */}
        <div className="relative w-full aspect-square md:aspect-[4/3] flex items-center justify-center">

          {/* Floating Icons */}
          <div className="absolute top-[15%] right-[-2%] w-14 h-14 rounded-2xl bg-[#14121c] border border-white/5 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-[bounce_4s_infinite] z-20">
            <div className="w-7 h-7 bg-[#1877F2] rounded-full flex items-center justify-center text-white font-bold text-sm">f</div>
          </div>

          <div className="absolute left-[2%] bottom-[25%] w-14 h-14 rounded-2xl bg-[#14121c] border border-white/5 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20 animate-[bounce_5s_infinite_1s]">
            <div className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-700 flex flex-col items-center justify-center gap-[3px] p-1.5">
              <div className="w-full h-1.5 rounded-[1px] bg-gradient-to-r from-pink-500 to-orange-400"></div>
              <div className="w-full flex-1 rounded-[1px] bg-gradient-to-r from-purple-500 to-indigo-500"></div>
            </div>
          </div>

          {/* Main Glass Panel */}
          <div className="relative w-full max-w-[550px] mx-auto aspect-[4/3] rounded-3xl bg-[#23212d]/40 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col p-6 isolate">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
            {/* Browser Dots */}
            <div className="flex items-center gap-2.5 mb-6 opacity-80">
              <span className="w-3.5 h-3.5 rounded-full bg-[#ef4444]" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#eab308]" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#a855f7]" />
              <div className="ml-auto w-24 h-4 bg-white/5 rounded-full" />
              <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center" />
            </div>

            {/* Content Area */}
            <div className="flex-1 rounded-2xl bg-[#1a1825]/80 border border-white/5 relative p-4 flex items-end overflow-hidden shadow-inner">
              {/* Faux graph line */}
              <div className="absolute bottom-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              <span className="text-[9px] sm:text-[11px] font-mono text-gray-400 uppercase tracking-widest font-semibold drop-shadow-md">Monthly Engagement Gain: <span className="text-white">+24.8%</span></span>
            </div>

            {/* Bottom Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="rounded-xl bg-[#2a2835]/50 border border-white/5 p-4 sm:p-5 flex flex-col items-center justify-center gap-1.5 backdrop-blur-sm">
                <div className="p-1 rounded bg-[#14b8a6]/10 mb-1">
                  <svg className="w-4 h-4 text-[#14b8a6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">12.4k</h3>
                <p className="text-[9px] uppercase font-bold tracking-widest text-gray-400 mt-1">New Followers</p>
              </div>
              <div className="rounded-xl bg-[#2a2835]/50 border border-white/5 p-4 sm:p-5 flex flex-col items-center justify-center gap-1.5 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#a855f7]/20 blur-2xl rounded-full" />
                <div className="p-1 rounded bg-[#a855f7]/10 mb-1">
                  <svg className="w-4 h-4 text-[#c4b5fd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm z-10">94%</h3>
                <p className="text-[9px] uppercase font-bold tracking-widest text-gray-400 mt-1 z-10">AI Match Rate</p>
              </div>
            </div>
          </div>
          {/* Bottom floating icon */}
          <div className="absolute right-[8%] -bottom-[5%] w-16 h-16 rounded-2xl bg-[#14121c] border border-white/5 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20">
            <div className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-700 flex flex-col items-center justify-center gap-0.5 p-1">
              <div className="w-full h-1 rounded-[1px] bg-blue-500"></div>
              <div className="w-full h-1 rounded-[1px] bg-purple-500"></div>
              <div className="w-full h-1 rounded-[1px] bg-[#14b8a6]"></div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
