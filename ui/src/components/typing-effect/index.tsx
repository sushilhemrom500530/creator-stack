"use client";
import { useEffect, useState } from "react";

// Typing animation component
export const TypingEffect = () => {
    const [displayedText, setDisplayedText] = useState("");
    const [phase, setPhase] = useState<"loading" | "typing" | "paused">("loading");
    const targetText = "Generating viral hook...";

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (phase === "loading") {
            setDisplayedText("");
            timeout = setTimeout(() => {
                setPhase("typing");
            }, 1500);
        } else if (phase === "typing") {
            if (displayedText.length < targetText.length) {
                timeout = setTimeout(() => {
                    setDisplayedText(targetText.slice(0, displayedText.length + 1));
                }, 50);
            } else {
                timeout = setTimeout(() => {
                    setPhase("paused");
                }, 3000);
            }
        } else if (phase === "paused") {
            timeout = setTimeout(() => {
                setPhase("loading");
            }, 500);
        }

        return () => clearTimeout(timeout);
    }, [phase, displayedText, targetText]);

    return (
        <div className="bg-[#2c2443]/40 border border-[#483a6b] rounded-md px-3 py-2 mt-4 text-xs font-mono text-[#a694d4] flex items-center h-8 relative shadow-inner overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent pointer-events-none" />

            {phase === "loading" ? (
                <div className="flex space-x-1 items-center opacity-80 z-10 w-full">
                    <div className="w-1.5 h-1.5 bg-[#a694d4] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-[#a694d4] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-[#a694d4] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            ) : (
                <span className="z-10 tracking-wide flex items-center whitespace-nowrap">
                    {displayedText}
                    <span className="animate-pulse ml-[1px] font-bold text-violet-300">|</span>
                </span>
            )}
        </div>
    );
};