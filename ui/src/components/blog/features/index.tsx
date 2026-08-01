"use client";

import Image from 'next/image';
import { useTheme } from "@/providers/mode-theme";

export default function BlogFeatures() {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    return (
        <div className="w-full">
            <div className={`blog-feature-card group ${themeClass}`}>
                {/* Left: Image */}
                <div className={`blog-feature-img-wrap relative ${themeClass}`}>
                    <Image
                        src="https://images.unsplash.com/photo-1696422329618-9c1626acc2b0?q=80&w=1200&auto=format&fit=crop"
                        alt="Neural Network"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 delay-75"
                    />
                    <div className={`blog-feature-overlay ${themeClass}`} />
                </div>

                {/* Right: Content */}
                <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-6">
                        <span className={`blog-feature-badge ${themeClass}`}>
                            FEATURED
                        </span>
                        <span className={`blog-feature-date ${themeClass}`}>
                            March 14, 2024
                        </span>
                    </div>

                    <h2 className={`blog-feature-title ${themeClass}`}>
                        The Autonomy Epoch: How AI is Redefining Brand Authority
                    </h2>

                    <p className={`blog-feature-desc ${themeClass}`}>
                        In an era of synthetic media, true authority is built through algorithmic precision and human nuance. We dive deep into the strategies used by top-tier firms to scale without losing their soul.
                    </p>

                    <div className="flex justify-between items-end mt-auto">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-400 overflow-hidden shadow-inner relative">
                                <Image
                                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
                                    alt="Dr. Helena Vance"
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className={`blog-feature-author-name ${themeClass}`}>Dr. Helena Vance</span>
                                <span className={`blog-feature-author-role ${themeClass}`}>Head of AI Research</span>
                            </div>
                        </div>

                        <button className={`blog-feature-btn ${themeClass}`}>
                            READ MORE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}