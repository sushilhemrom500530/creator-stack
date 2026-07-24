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
    FileText,
    Paperclip,
    Mic,
    ArrowUp,
    Zap,
    Plus,
    RotateCcw
} from "lucide-react";

interface ChatMessage {
    id: string;
    sender: "user" | "ai";
    text: string;
    categoryTitle?: string;
    cards?: Array<{ number: string; title: string; desc: string }>;
    actionPills?: string[];
    timestamp: string;
}

export default function AiAssistantComponent() {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [selectedPreviewMessage, setSelectedPreviewMessage] = useState<ChatMessage | null>(null);

    // Initial messages state (empty by default so header + templates show; when a message is sent, templates hide)
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const templates = [
        { label: "Viral Hook Line", icon: Lightbulb, query: "Give me 5 catchy viral hook lines for a post about web development tools." },
        { label: "Hashtag Optimizer", icon: Hash, query: "Suggest 10 high-performing hashtags for a SaaS launch." },
        { label: "Twitter Thread", icon: MessageSquare, query: "Draft a 4-tweet thread explaining how AI boosts creator productivity." },
        { label: "Blog Outline", icon: FileText, query: "Create a structured blog post outline about digital creator monetization." },
    ];

    const handleSendMessage = (customText?: string) => {
        const query = customText || prompt;
        if (!query.trim()) return;

        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            sender: "user",
            text: query,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setPrompt("");
        setLoading(true);

        setTimeout(() => {
            const aiMsg: ChatMessage = {
                id: `ai-${Date.now()}`,
                sender: "ai",
                text: `Here is a preliminary Content Strategy framework built for "${query}":`,
                categoryTitle: "STRATEGY BRAINSTORMING",
                cards: [
                    {
                        number: "01",
                        title: "The 'Raw-Real' Series",
                        desc: "Focus on BTS of the sustainable materials. No filters, high-frame rate movements."
                    },
                    {
                        number: "02",
                        title: "Micro-Drop Hype",
                        desc: "15-second visual teasers using localized urban architecture backgrounds."
                    }
                ],
                actionPills: ["# Generate Hashtags", "Translate", "Content Strategy"],
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, aiMsg]);
            setSelectedPreviewMessage(aiMsg);
            setLoading(false);
        }, 1100);
    };

    const handleCopy = (id: string, textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleNewChat = () => {
        setMessages([]);
        setSelectedPreviewMessage(null);
        setPrompt("");
    };

    const activePreview = selectedPreviewMessage || messages.filter(m => m.sender === "ai").slice(-1)[0];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">

            {/* 1. TOP HEADER SECTION (Hidden when active chat session starts) */}
            {messages.length === 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Bot className="w-7 h-7 text-primary" /> Creator AI Assistant
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Generate viral captions, post ideas, hashtags, and threads with AI</p>
                    </div>
                </div>
            )}

            {/* 2. QUICK TEMPLATE CARDS (Hidden when active chat session starts) */}
            {messages.length === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {templates.map((tmpl, idx) => {
                        const Icon = tmpl.icon;
                        return (
                            <button
                                key={idx}
                                onClick={() => handleSendMessage(tmpl.query)}
                                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 hover:border-primary hover:shadow-md transition text-left space-y-2 group cursor-pointer"
                            >
                                <div className="p-2 bg-primary/10 rounded-xl text-primary w-fit group-hover:bg-primary group-hover:text-white transition">
                                    <Icon className="w-4 h-4" />
                                </div>
                                <h4 className="text-sm font-semibold text-slate-800">{tmpl.label}</h4>
                                <p className="text-xs text-slate-400 line-clamp-1">{tmpl.query}</p>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* 3. MAIN SPLIT LAYOUT: Light Theme Chat Stream & Right Output Preview Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Left Column: Light Theme Chat Stream (7 Cols) */}
                <div className="lg:col-span-7 space-y-4 bg-white text-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col justify-between min-h-[580px]">

                    {/* Header bar when chat is active */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">SocialFlow AI Assistant</h3>
                                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Online
                                </span>
                            </div>
                        </div>

                        {messages.length > 0 && (
                            <button
                                onClick={handleNewChat}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" /> New Chat
                            </button>
                        )}
                    </div>

                    {/* Initial Welcome Banner inside Chat (Shows when empty) */}
                    {messages.length === 0 && (
                        <div className="text-center py-10 space-y-3 bg-purple-50/60 border border-purple-100 rounded-2xl p-6">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-purple-200 text-purple-600 flex items-center justify-center mx-auto shadow-xs">
                                <Sparkles className="w-6 h-6 animate-pulse text-purple-600" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                                How can I help your social flow today?
                            </h2>
                            <p className="text-xs text-slate-500 max-w-md mx-auto">
                                Ask me to generate copy, analyze trends, or create a full month of content strategy.
                            </p>
                        </div>
                    )}

                    {/* Messages Stream */}
                    <div className="space-y-5 flex-1 overflow-y-auto max-h-[460px] pr-1">
                        {messages.map((msg) => {
                            const isUser = msg.sender === "user";

                            if (isUser) {
                                return (
                                    <div key={msg.id} className="flex justify-end">
                                        <div className="max-w-md bg-slate-900 text-white p-4 rounded-2xl rounded-tr-xs text-xs sm:text-sm leading-relaxed shadow-sm">
                                            {msg.text}
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={msg.id} className="space-y-3 cursor-pointer" onClick={() => setSelectedPreviewMessage(msg)}>
                                    {/* AI Message Container Light Theme */}
                                    <div className="bg-slate-50/90 border border-slate-200/90 p-5 rounded-2xl space-y-4 shadow-xs hover:border-purple-300 transition">
                                        {/* Category Tag Header */}
                                        {msg.categoryTitle && (
                                            <div className="flex items-center gap-1.5 text-purple-700 font-mono text-[11px] font-bold tracking-widest uppercase">
                                                <Zap className="w-3.5 h-3.5 text-purple-600" />
                                                {msg.categoryTitle}
                                            </div>
                                        )}

                                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                                            {msg.text}
                                        </p>

                                        {/* Cards Grid */}
                                        {msg.cards && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                                {msg.cards.map((card, cIdx) => (
                                                    <div key={cIdx} className="bg-white border border-slate-200/90 p-3.5 rounded-xl space-y-1 shadow-xs hover:border-slate-300 transition">
                                                        <span className="text-[11px] font-bold text-purple-600 block font-mono">
                                                            {card.number}. {card.title}
                                                        </span>
                                                        <p className="text-xs text-slate-600 leading-normal">
                                                            {card.desc}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Action Pills */}
                                        {msg.actionPills && (
                                            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/60">
                                                {msg.actionPills.map((pill, pIdx) => (
                                                    <button
                                                        key={pIdx}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSendMessage(`Run: ${pill}`);
                                                        }}
                                                        className="px-3 py-1.5 rounded-full bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 text-xs font-semibold transition cursor-pointer shadow-xs"
                                                    >
                                                        {pill}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {loading && (
                            <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl w-fit border border-slate-200">
                                <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
                                SocialFlow AI is crafting your output...
                            </div>
                        )}
                    </div>

                    {/* Bottom Floating Chat Input Bar */}
                    <div className="relative pt-2">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 flex items-center justify-between gap-3 shadow-xs focus-within:border-primary transition">
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                placeholder="Message SocialFlow Assistant..."
                                className="bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none w-full px-2"
                            />

                            <div className="flex items-center gap-1.5 shrink-0">
                                <button className="p-2 text-slate-400 hover:text-slate-600 transition cursor-pointer rounded-lg hover:bg-slate-200/60">
                                    <Paperclip className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-slate-600 transition cursor-pointer rounded-lg hover:bg-slate-200/60">
                                    <Mic className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleSendMessage()}
                                    disabled={!prompt.trim() || loading}
                                    className="p-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white transition shadow-sm disabled:opacity-50 cursor-pointer"
                                >
                                    <ArrowUp className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Active Output Preview & Export Panel (5 Cols) */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <h3 className="text-sm font-bold text-slate-800">Generated Output Preview</h3>
                            </div>

                            {activePreview && (
                                <button
                                    onClick={() => handleCopy(activePreview.id, activePreview.text)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                                >
                                    {copiedId === activePreview.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copiedId === activePreview.id ? "Copied!" : "Copy Output"}
                                </button>
                            )}
                        </div>

                        {activePreview ? (
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                                    {activePreview.categoryTitle && (
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                            {activePreview.categoryTitle}
                                        </span>
                                    )}
                                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                                        {activePreview.text}
                                    </p>
                                </div>

                                {activePreview.cards && (
                                    <div className="space-y-2">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Strategy Breakdown</span>
                                        {activePreview.cards.map((c, i) => (
                                            <div key={i} className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                                                <h4 className="text-xs font-bold text-slate-800">{c.number}. {c.title}</h4>
                                                <p className="text-xs text-slate-600 leading-normal">{c.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="pt-2 flex items-center justify-between gap-3">
                                    <button
                                        onClick={() => handleCopy(activePreview.id, activePreview.text)}
                                        className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition shadow-sm cursor-pointer text-center"
                                    >
                                        Use in Post Publisher →
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 text-center text-slate-400 space-y-2">
                                <Bot className="w-10 h-10 mx-auto text-slate-300" />
                                <p className="text-xs">No AI output selected yet. Send a message or click a template to start.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
