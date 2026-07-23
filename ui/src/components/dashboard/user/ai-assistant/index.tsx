"use client";

import { useState } from "react";
import { 
    Sparkles, 
    Bot, 
    Send, 
    Copy, 
    Check, 
    Lightbulb, 
    RefreshCw, 
    Hash, 
    MessageSquare, 
    FileText 
} from "lucide-react";

export default function AiAssistantComponent() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const templates = [
        { label: "Viral Hook Line", icon: Lightbulb, query: "Give me 5 catchy viral hook lines for a post about web development tools." },
        { label: "Hashtag Optimizer", icon: Hash, query: "Suggest 10 high-performing hashtags for a SaaS launch." },
        { label: "Twitter Thread", icon: MessageSquare, query: "Draft a 4-tweet thread explaining how AI boosts creator productivity." },
        { label: "Blog Outline", icon: FileText, query: "Create a structured blog post outline about digital creator monetization." },
    ];

    const handleGenerate = (customQuery?: string) => {
        const queryToUse = customQuery || prompt;
        if (!queryToUse.trim()) return;

        setLoading(true);
        setResponse("");

        setTimeout(() => {
            setResponse(
                `Here are your generated AI ideas for:\n"${queryToUse}"\n\n` +
                `1. 🚀 Stop wasting hours on manual scheduling—here is how top creators automate their workflow.\n` +
                `2. 💡 The secret to consistent 10x growth isn me hard work, it is having the right stack.\n` +
                `3. 🔥 3 tools that will completely transform how you publish content in 2026.\n\n` +
                `#CreatorEconomy #ProductivityTools #ContentStrategy`
            );
            setLoading(false);
        }, 1000);
    };

    const handleCopy = () => {
        if (!response) return;
        navigator.clipboard.writeText(response);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Bot className="w-7 h-7 text-amber-500" /> Creator AI Assistant
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Generate viral captions, post ideas, hashtags, and threads with AI</p>
                </div>
            </div>

            {/* Quick Templates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {templates.map((tmpl, idx) => {
                    const Icon = tmpl.icon;
                    return (
                        <button
                            key={idx}
                            onClick={() => {
                                setPrompt(tmpl.query);
                                handleGenerate(tmpl.query);
                            }}
                            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 hover:border-amber-400 hover:shadow-md transition text-left space-y-2 group"
                        >
                            <div className="p-2 bg-amber-50 rounded-xl text-amber-600 w-fit group-hover:bg-amber-500 group-hover:text-white transition">
                                <Icon className="w-4 h-4" />
                            </div>
                            <h4 className="text-sm font-semibold text-slate-800">{tmpl.label}</h4>
                            <p className="text-xs text-slate-400 line-clamp-1">{tmpl.query}</p>
                        </button>
                    );
                })}
            </div>

            {/* Input & Output */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Prompt Box */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-4">
                    <label className="text-sm font-semibold text-slate-700 block">Prompt / AI Instructions</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe what content you want to generate..."
                        rows={8}
                        className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800 text-sm placeholder:text-slate-400 resize-none"
                    ></textarea>

                    <button
                        onClick={() => handleGenerate()}
                        disabled={loading || !prompt.trim()}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium text-sm hover:opacity-95 transition shadow-md disabled:opacity-50"
                    >
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        {loading ? "Generating Output..." : "Generate AI Content"}
                    </button>
                </div>

                {/* AI Output Result */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-4 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-500" /> Generated Response
                            </span>
                            {response && (
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copied ? "Copied!" : "Copy Text"}
                                </button>
                            )}
                        </div>

                        <div className="pt-4">
                            {response ? (
                                <pre className="font-sans text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    {response}
                                </pre>
                            ) : (
                                <div className="py-16 text-center text-slate-400 space-y-2">
                                    <Bot className="w-10 h-10 mx-auto text-slate-300" />
                                    <p className="text-xs">Select a template above or type a prompt to generate AI content</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
