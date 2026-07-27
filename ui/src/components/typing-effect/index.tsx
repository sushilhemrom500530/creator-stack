"use client";
import { useEffect, useState } from "react";
import { useTheme } from "@/providers/mode-theme";

// Typing animation component
export const TypingEffect = () => {
    const { theme } = useTheme();
    const isLight = theme === "light";

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
        <div className={`rounded-md px-3 py-2 mt-4 text-xs font-mono flex items-center h-8 relative shadow-inner overflow-hidden border transition-colors ${
            isLight
                ? "bg-violet-50/90 border-violet-200 text-violet-900 font-semibold"
                : "bg-[#2c2443]/40 border-[#483a6b] text-[#a694d4]"
        }`}>
            <div className={`absolute inset-0 pointer-events-none ${
                isLight ? "bg-gradient-to-r from-violet-200/30 to-transparent" : "bg-gradient-to-r from-violet-500/10 to-transparent"
            }`} />

            {phase === "loading" ? (
                <div className="flex space-x-1 items-center opacity-80 z-10 w-full">
                    <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isLight ? "bg-violet-600" : "bg-[#a694d4]"}`} style={{ animationDelay: '0ms' }} />
                    <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isLight ? "bg-violet-600" : "bg-[#a694d4]"}`} style={{ animationDelay: '150ms' }} />
                    <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isLight ? "bg-violet-600" : "bg-[#a694d4]"}`} style={{ animationDelay: '300ms' }} />
                </div>
            ) : (
                <span className="z-10 tracking-wide flex items-center whitespace-nowrap">
                    {displayedText}
                    <span className={`animate-pulse ml-[1px] font-bold ${isLight ? "text-violet-600" : "text-violet-300"}`}>|</span>
                </span>
            )}
        </div>
    );
};