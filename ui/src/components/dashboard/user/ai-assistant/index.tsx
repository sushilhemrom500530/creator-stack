"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    X,
    FileImage,
    Coins,
    TrendingUp,
} from "lucide-react";
import { aiApi, getActiveWorkspaceId } from "@/lib/api";

interface ChatMessage {
    id: string;
    sender: "user" | "ai";
    text: string;
    attachmentName?: string;
    categoryTitle?: string;
    tokensUsed?: number;
    model?: string;
    cards?: Array<{ number: string; title: string; desc: string }>;
    actionPills?: string[];
    timestamp: string;
}

export default function AiAssistantComponent() {
    const router = useRouter();
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [selectedPreviewMessage, setSelectedPreviewMessage] = useState<ChatMessage | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [usageStats, setUsageStats] = useState({
        usedTokens: 0,
        monthlyLimit: 100000,
        remainingTokens: 100000,
        percentUsed: 0,
        totalGenerations: 0,
        tier: "Pro",
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const workspaceId = getActiveWorkspaceId();

    // Initial messages state
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        if (workspaceId) {
            aiApi.getUsageStats(workspaceId)
                .then((res) => {
                    if (res) setUsageStats(res);
                })
                .catch(() => {});
        }
    }, [workspaceId]);

    const templates = [
        {
            label: "Viral Hook Line",
            icon: Lightbulb,
            action: "hooks",
            query: "Give me 5 catchy viral hook lines for a post about web development tools."
        },
        {
            label: "Hashtag Optimizer",
            icon: Hash,
            action: "hashtags",
            query: "Suggest 10 high-performing hashtags for a SaaS launch."
        },
        {
            label: "Social Thread",
            icon: MessageSquare,
            action: "thread",
            query: "Draft a 4-tweet thread explaining how AI boosts creator productivity."
        },
        {
            label: "Tailored Caption",
            icon: FileText,
            action: "caption",
            query: "Create a high-converting LinkedIn post about scaling a digital business."
        },
    ];

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const removeSelectedFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSendMessage = async (customText?: string, templateType?: string) => {
        const query = customText || prompt;
        if (!query.trim() && !selectedFile) return;

        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            sender: "user",
            text: query || `Uploaded file: ${selectedFile?.name}`,
            attachmentName: selectedFile?.name,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setPrompt("");
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setLoading(true);

        try {
            let aiText = "";
            let category = "CREATOR STRATEGY";
            let tokens = 0;
            let model = "gemini-1.5-flash";

            if (templateType === "hooks" || query.toLowerCase().includes("hook")) {
                const res = await aiApi.generateHooks({ workspaceId, topic: query });
                aiText = res.raw || res.hooks.join("\n\n");
                category = "VIRAL HOOKS";
                tokens = res.tokensUsed || 180;
            } else if (templateType === "hashtags" || query.toLowerCase().includes("hashtag")) {
                const res = await aiApi.generateHashtags({ workspaceId, keyword: query, count: 12 });
                aiText = res.raw || res.hashtags.join(" ");
                category = "HASHTAG OPTIMIZER";
                tokens = res.tokensUsed || 120;
            } else if (templateType === "thread" || query.toLowerCase().includes("thread")) {
                const res = await aiApi.generateThread({ workspaceId, topic: query, tweetsCount: 4 });
                aiText = res.thread;
                category = "SOCIAL THREAD";
                tokens = res.tokensUsed || 450;
            } else if (templateType === "caption" || query.toLowerCase().includes("caption")) {
                const res = await aiApi.generateCaption({ workspaceId, topic: query, platform: "linkedin", tone: "professional" });
                aiText = res.caption;
                category = "TAILORED CAPTION";
                tokens = res.tokensUsed || 250;
            } else {
                const res = await aiApi.chat({ workspaceId, message: query });
                aiText = res.message;
                category = "AI BRAINSTORMING";
                tokens = res.tokensUsed || 300;
                model = res.model || model;
            }

            const aiMsg: ChatMessage = {
                id: `ai-${Date.now()}`,
                sender: "ai",
                text: aiText,
                categoryTitle: category,
                tokensUsed: tokens,
                model,
                actionPills: ["Suggest Hashtags", "Make Shorter", "Tone: More Casual", "Translate to Spanish"],
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, aiMsg]);
            setSelectedPreviewMessage(aiMsg);

            // Refresh token quota stats
            aiApi.getUsageStats(workspaceId).then((res) => { if (res) setUsageStats(res); }).catch(() => {});
        } catch (error: any) {
            const errorMsg: ChatMessage = {
                id: `ai-err-${Date.now()}`,
                sender: "ai",
                text: `Sorry, could not complete generation: ${error.message}. Please verify your workspace API keys.`,
                categoryTitle: "ERROR",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (id: string, textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleUseInComposer = (text: string) => {
        if (typeof window !== "undefined") {
            sessionStorage.setItem("creator_composer_draft", text);
        }
        router.push("/user/create-post");
    };

    const handleNewChat = () => {
        setMessages([]);
        setSelectedPreviewMessage(null);
        setPrompt("");
        setSelectedFile(null);
    };

    const activePreview = selectedPreviewMessage || messages.filter(m => m.sender === "ai").slice(-1)[0];

    return (
        <div className="p-6 w-full space-y-6 max-w-7xl mx-auto">

            {/* Hidden File Input Element */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx"
            />

            {/* Top Header & Quota Monitor Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 card p-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Bot className="w-7 h-7 text-purple-600" /> Creator AI Content Studio
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Generate viral captions, multi-platform threads, hooks, and hashtags on autopilot</p>
                </div>

                {/* Token Quota Progress */}
                <div className="flex items-center gap-4 bg-purple-50/70 border border-purple-200/80 p-3.5 rounded-2xl">
                    <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                        <Coins className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-700">
                            <span>Token Quota ({usageStats.tier})</span>
                            <span className="text-purple-700 font-mono">{usageStats.usedTokens.toLocaleString()} / {usageStats.monthlyLimit.toLocaleString()}</span>
                        </div>
                        <div className="w-48 h-2 bg-purple-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-purple-600 transition-all duration-500"
                                style={{ width: `${Math.min(100, usageStats.percentUsed)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* QUICK TEMPLATE CARDS (Shown initially) */}
            {messages.length === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {templates.map((tmpl, idx) => {
                        const Icon = tmpl.icon;
                        return (
                            <button
                                key={idx}
                                onClick={() => handleSendMessage(tmpl.query, tmpl.action)}
                                className="card p-4 transition-all hover:-translate-y-1 text-left space-y-2 group cursor-pointer border border-slate-100 hover:border-purple-300"
                            >
                                <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600 w-fit group-hover:bg-purple-600 group-hover:text-white transition">
                                    <Icon className="w-4 h-4" />
                                </div>
                                <h4 className="text-sm font-semibold text-slate-800">{tmpl.label}</h4>
                                <p className="text-xs text-slate-400 line-clamp-1">{tmpl.query}</p>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* MAIN SPLIT LAYOUT: Chat Stream & Output Preview Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Left Column: Chat Stream (7 Cols) */}
                <div className="lg:col-span-7 space-y-4 card text-slate-800 p-6 flex flex-col justify-between min-h-[500px]">

                    {/* Header bar */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">CreatorStack AI Assistant</h3>
                                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Multi-Model Engine Active
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

                    {/* Initial Welcome Banner */}
                    {messages.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-8 space-y-3 bg-purple-50/50 border border-purple-100 rounded-2xl p-6 my-2">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-purple-200 text-purple-600 flex items-center justify-center shadow-xs">
                                <Sparkles className="w-6 h-6 animate-pulse text-purple-600" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                                What content shall we create today?
                            </h2>
                            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                                Ask for viral hooks, threads, hashtags, or platform-optimized captions.
                            </p>
                        </div>
                    ) : (
                        /* Messages Stream */
                        <div className="space-y-5 flex-1 overflow-y-auto max-h-[460px] pr-1 my-2">
                            {messages.map((msg) => {
                                const isUser = msg.sender === "user";

                                if (isUser) {
                                    return (
                                        <div key={msg.id} className="flex flex-col items-end gap-1">
                                            <div className="max-w-md bg-slate-900 text-white px-4 py-2.5 rounded-2xl rounded-tr-xs text-xs sm:text-sm leading-relaxed shadow-sm space-y-2">
                                                {msg.attachmentName && (
                                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] text-cyan-300 font-mono">
                                                        <FileImage className="w-3.5 h-3.5" />
                                                        {msg.attachmentName}
                                                    </div>
                                                )}
                                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={msg.id} className="space-y-3 cursor-pointer" onClick={() => setSelectedPreviewMessage(msg)}>
                                        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3 shadow-xs hover:border-purple-300 transition">
                                            <div className="flex items-center justify-between">
                                                {msg.categoryTitle && (
                                                    <div className="flex items-center gap-1.5 text-purple-700 font-mono text-[11px] font-bold tracking-widest uppercase">
                                                        <Zap className="w-3.5 h-3.5 text-purple-600" />
                                                        {msg.categoryTitle}
                                                    </div>
                                                )}
                                                {msg.tokensUsed && (
                                                    <span className="text-[10px] text-slate-400 font-mono">
                                                        {msg.tokensUsed} tokens
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">
                                                {msg.text}
                                            </p>

                                            {/* Action Pills */}
                                            {msg.actionPills && (
                                                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/60">
                                                    {msg.actionPills.map((pill, pIdx) => (
                                                        <button
                                                            key={pIdx}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleSendMessage(`${pill} for above content: "${msg.text.slice(0, 80)}..."`);
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
                                    CreatorStack AI is generating your copy...
                                </div>
                            )}
                        </div>
                    )}

                    {/* Bottom Chat Input Bar */}
                    <div className="relative pt-2 space-y-2">
                        {selectedFile && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-700 font-medium w-fit">
                                <FileImage className="w-3.5 h-3.5 text-purple-600" />
                                <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                                <button onClick={removeSelectedFile} className="p-0.5 hover:bg-purple-200/60 rounded-full text-purple-700 cursor-pointer">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}

                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 flex items-center justify-between gap-3 shadow-xs focus-within:border-purple-600 transition">
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                placeholder="Ask AI to write a post, hooks, thread, or refine copy..."
                                className="bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none w-full px-2"
                            />

                            <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                    type="button"
                                    onClick={handleFileClick}
                                    title="Attach File"
                                    className="p-2 text-slate-400 hover:text-slate-600 transition cursor-pointer rounded-lg hover:bg-slate-200/60"
                                >
                                    <Paperclip className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSendMessage()}
                                    disabled={(!prompt.trim() && !selectedFile) || loading}
                                    className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm disabled:opacity-50 cursor-pointer"
                                >
                                    <ArrowUp className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Output Preview & Composer Export (5 Cols) */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="card p-6 space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-600" />
                                <h3 className="text-sm font-bold text-slate-800">Generated Output</h3>
                            </div>

                            {activePreview && (
                                <button
                                    onClick={() => handleCopy(activePreview.id, activePreview.text)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                                >
                                    {copiedId === activePreview.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copiedId === activePreview.id ? "Copied!" : "Copy"}
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
                                    <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                                        {activePreview.text}
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <button
                                        onClick={() => handleUseInComposer(activePreview.text)}
                                        className="w-full py-2.5 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition shadow-sm cursor-pointer text-center"
                                    >
                                        Use in Post Composer →
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 text-center text-slate-400 space-y-2">
                                <Bot className="w-10 h-10 mx-auto text-slate-300" />
                                <p className="text-xs">No output selected yet. Click a quick template or send a message.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
