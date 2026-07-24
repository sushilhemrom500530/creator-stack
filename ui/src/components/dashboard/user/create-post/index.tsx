"use client";

import { useState } from "react";
import {
    PenSquare,
    Image as ImageIcon,
    Calendar,
    Sparkles,
    Send,
    Clock,
    CheckCircle2,
    Globe
} from "lucide-react";
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa6";

export default function CreatePostComponent() {
    const [content, setContent] = useState("");
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["twitter", "linkedin"]);
    const [scheduledTime, setScheduledTime] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const togglePlatform = (id: string) => {
        if (selectedPlatforms.includes(id)) {
            setSelectedPlatforms(selectedPlatforms.filter((p) => p !== id));
        } else {
            setSelectedPlatforms([...selectedPlatforms, id]);
        }
    };

    const handleAiGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setContent("🚀 Exciting news! We are launching our latest Creator Stack tools today. Automate your post workflow, track real-time analytics, and boost engagement effortless! #CreatorEconomy #TechInnovation");
            setIsGenerating(false);
        }, 800);
    };

    const handleApplyOptimization = () => {
        const hashtag = " #GenerativeAI";
        if (!content.includes("#GenerativeAI")) {
            setContent((prev) => (prev ? prev + hashtag : "🚀 Exciting updates coming up!" + hashtag));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <PenSquare className="w-7 h-7 text-primary" /> Create New Post
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Draft, schedule, and publish content across all your social channels</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleAiGenerate}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium text-sm shadow-md hover:opacity-90 transition disabled:opacity-50"
                    >
                        <Sparkles className="w-4 h-4" />
                        {isGenerating ? "Generating..." : "Generate with AI"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Platform Selector */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-3">
                        <label className="text-sm font-semibold text-slate-700 block">Select Target Channels</label>
                        <div className="flex flex-wrap gap-3">
                            {[
                                { id: "twitter", name: "Twitter / X", icon: FaTwitter, color: "bg-sky-500" },
                                { id: "linkedin", name: "LinkedIn", icon: FaLinkedin, color: "bg-blue-600" },
                                { id: "facebook", name: "Facebook", icon: FaFacebook, color: "bg-blue-500" },
                                { id: "instagram", name: "Instagram", icon: FaInstagram, color: "bg-pink-600" }
                            ].map((p) => {
                                const Icon = p.icon;
                                const isSelected = selectedPlatforms.includes(p.id);
                                return (
                                    <button
                                        key={p.id}
                                        onClick={() => togglePlatform(p.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isSelected
                                            ? `${p.color} text-white shadow-sm ring-2 ring-offset-1 ring-slate-300`
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {p.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content Input */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-slate-700">Post Content</label>
                            <span className="text-xs text-slate-400">{content.length} / 280 characters</span>
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What would you like to share today?"
                            rows={6}
                            className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 text-sm placeholder:text-slate-400 resize-none"
                        ></textarea>

                        {/* Attachments & Schedule */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-medium transition">
                                    <ImageIcon className="w-4 h-4 text-slate-500" />
                                    Add Media
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-medium transition">
                                    <Globe className="w-4 h-4 text-slate-500" />
                                    Add Link
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="datetime-local"
                                    value={scheduledTime}
                                    onChange={(e) => setScheduledTime(e.target.value)}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium text-sm hover:bg-slate-50 transition shadow-sm">
                            <Clock className="w-4 h-4 text-slate-500" />
                            Schedule for Later
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition shadow-md">
                            <Send className="w-4 h-4" />
                            Publish Now
                        </button>
                    </div>
                </div>

                {/* Live Preview & AI Recommendation Column */}
                <div className="space-y-6">
                    <div className="space-y-6 sticky top-6">
                        {/* Live Content Preview */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-4">
                            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Live Content Preview
                            </h2>

                            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                                        SH
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">Sushil Hemrom</h4>
                                        <p className="text-xs text-slate-400">@sushilhemrom • Just now</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed min-h-[60px]">
                                    {content || "Your post content preview will appear here..."}
                                </p>
                            </div>
                        </div>

                        {/* AI Recommendation Card */}
                        <div className="bg-[#151629] p-5 rounded-2xl border border-purple-500/20 text-white space-y-4 shadow-lg">
                            <div className="flex items-center gap-2.5">
                                <Sparkles className="w-4 h-4 text-purple-400" />
                                <span className="text-purple-300 font-semibold text-sm">AI Recommendation</span>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                &ldquo;Based on your recent engagement, adding 3 specific hashtags related to{" "}
                                <span className="font-bold text-white">#GenerativeAI</span> could increase reach by{" "}
                                <span className="text-emerald-400 font-bold">14.2%</span>.&rdquo;
                            </p>
                            <button
                                onClick={handleApplyOptimization}
                                className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold transition-all hover:border-purple-500/40 hover:text-white cursor-pointer"
                            >
                                Apply Optimization
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
