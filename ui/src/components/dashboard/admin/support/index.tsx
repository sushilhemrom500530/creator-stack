"use client";

import React, { useState } from "react";
import {
    Avatar,
    Button,
    Input,
    Tag,
    Badge,
    Tooltip,
    Dropdown,
    App,
} from "antd";
import {
    Search,
    Send,
    Sparkles,
    CheckCircle2,
    Clock,
    AlertCircle,
    User,
    Paperclip,
    Smile,
    MoreVertical,
    ShieldAlert,
    Zap,
    Lock,
    MessageSquare,
    ChevronDown,
    FileText,
    Bot,
    ArrowRight,
} from "lucide-react";

export interface TicketMessage {
    id: string;
    sender: "customer" | "admin" | "system";
    senderName: string;
    senderAvatar: string;
    senderRole?: string;
    timestamp: string;
    text: string;
    attachment?: string;
    isInternalNote?: boolean;
}

export interface TicketItem {
    id: string;
    ticketNumber: string;
    priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
    timeAgo: string;
    title: string;
    preview: string;
    userName: string;
    userEmail: string;
    userAvatar: string;
    userPlan: "Enterprise" | "Pro" | "Creator" | "Free";
    status: "Open" | "Pending" | "Closed";
    assignedAgent: string;
    messages: TicketMessage[];
}

const INITIAL_TICKETS: TicketItem[] = [
    {
        id: "1",
        ticketNumber: "TK-9421",
        priority: "URGENT",
        timeAgo: "2m ago",
        title: "AI Analytics Sync Failure",
        preview: "The dashboard is not reflecting the latest X (formerly Twitter) API data...",
        userName: "Marcus Chen",
        userEmail: "marcus@enterprise.io",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus_chen",
        userPlan: "Enterprise",
        status: "Open",
        assignedAgent: "Sarah Jenkins",
        messages: [
            {
                id: "m1",
                sender: "customer",
                senderName: "Marcus Chen",
                senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus_chen",
                timestamp: "10:14 AM",
                text: "Hi Support Team, our AI analytics metrics for Twitter/X campaigns stopped updating about 2 hours ago. Could you please check if the API connector is experiencing downtime?",
            },
            {
                id: "m2",
                sender: "system",
                senderName: "AI Copilot System",
                senderAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=copilot",
                timestamp: "10:15 AM",
                text: "⚡ Automated Diagnostic Log: API rate limit reached on endpoint /2/tweets/sample/stream. Auto-failover queue activated. Reset expected in 12 mins.",
            },
        ],
    },
    {
        id: "2",
        ticketNumber: "TK-9418",
        priority: "HIGH",
        timeAgo: "15m ago",
        title: "Billing Cycle Invoice Query",
        preview: "We were double billed for the additional 10k AI token usage package this month...",
        userName: "Sophia Rodriguez",
        userEmail: "sophia@creatorstudio.com",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia",
        userPlan: "Pro",
        status: "Open",
        assignedAgent: "Unassigned",
        messages: [
            {
                id: "m1",
                sender: "customer",
                senderName: "Sophia Rodriguez",
                senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia",
                timestamp: "10:01 AM",
                text: "We noticed two charge entries of $49.00 on Oct 24 for token add-ons. Requesting refund for the duplicate transaction.",
            },
        ],
    },
    {
        id: "3",
        ticketNumber: "TK-9405",
        priority: "MEDIUM",
        timeAgo: "1h ago",
        title: "Custom Domain SSL Certificate Error",
        preview: "Our custom CNAME blog.mybrand.com is showing an untrusted SSL warning...",
        userName: "Alex Thorne",
        userEmail: "alex@mybrand.com",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex_thorne",
        userPlan: "Creator",
        status: "Open",
        assignedAgent: "Marco Rossi",
        messages: [
            {
                id: "m1",
                sender: "customer",
                senderName: "Alex Thorne",
                senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex_thorne",
                timestamp: "09:12 AM",
                text: "The Let's Encrypt certificate renewal failed last night. Users are seeing NET::ERR_CERT_COMMON_NAME_INVALID.",
            },
        ],
    },
    {
        id: "4",
        ticketNumber: "TK-9390",
        priority: "LOW",
        timeAgo: "3h ago",
        title: "Dark Mode Theme Settings Feedback",
        preview: "Would love an option to force dark mode strictly for code export widgets...",
        userName: "Emily Watson",
        userEmail: "emily@devlabs.org",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
        userPlan: "Free",
        status: "Pending",
        assignedAgent: "Unassigned",
        messages: [
            {
                id: "m1",
                sender: "customer",
                senderName: "Emily Watson",
                senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
                timestamp: "07:45 AM",
                text: "Feature request: Can we get high contrast theme toggles for embedded iframe widgets?",
            },
            {
                id: "m2",
                sender: "admin",
                senderName: "Sarah Jenkins",
                senderRole: "Admin",
                senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
                timestamp: "07:45 AM",
                text: "⚡ Automated Diagnostic Log: API rate limit reached on endpoint /2/tweets/sample/stream. Auto-failover queue activated. Reset expected in 12 mins.",
            },
            {
                id: "m3",
                sender: "customer",
                senderName: "Emily Watson",
                senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
                timestamp: "07:45 AM",
                text: "⚡ Automated Diagnostic Log: API rate limit reached on endpoint /2/tweets/sample/stream. Auto-failover queue activated. Reset expected in 12 mins.",
            },
            {
                id: "m4",
                sender: "admin",
                senderName: "Sarah Jenkins",
                senderRole: "Admin",
                senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
                timestamp: "07:45 AM",
                text: "⚡ Automated Diagnostic Log: API rate limit reached on endpoint /2/tweets/sample/stream. Auto-failover queue activated. Reset expected in 12 mins.",
            },
        ],
    },
];

export type TicketStatus = "Open" | "Pending" | "Closed";

export interface SupportTabItem {
    id: TicketStatus;
    label: string;
}

const SUPPORT_TABS: SupportTabItem[] = [
    { id: "Open", label: "Open" },
    { id: "Pending", label: "Pending" },
    { id: "Closed", label: "Closed" },
];

export default function Support() {
    const { message } = App.useApp();
    const [tickets, setTickets] = useState<TicketItem[]>(INITIAL_TICKETS);
    const [activeTab, setActiveTab] = useState<"Open" | "Pending" | "Closed">("Open");
    const [selectedTicketId, setSelectedTicketId] = useState<string>("1");
    const [replyText, setReplyText] = useState<string>("");
    const [isInternalNote, setIsInternalNote] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>("");

    const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

    const filteredTickets = tickets.filter((t) => {
        const matchesTab = t.status === activeTab;
        const matchesSearch =
            t.title.toLowerCase().includes(searchText.toLowerCase()) ||
            t.userName.toLowerCase().includes(searchText.toLowerCase()) ||
            t.ticketNumber.toLowerCase().includes(searchText.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleSendReply = () => {
        if (!replyText.trim()) return;

        const newMessage: TicketMessage = {
            id: `m_${Date.now()}`,
            sender: "admin",
            senderName: "Sarah Jenkins",
            senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah_admin",
            senderRole: "Support Lead",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            text: replyText.trim(),
            isInternalNote,
        };

        setTickets((prev) =>
            prev.map((t) =>
                t.id === selectedTicketId
                    ? { ...t, messages: [...t.messages, newMessage] }
                    : t
            )
        );

        setReplyText("");
        message.success(isInternalNote ? "Internal note added to ticket" : "Reply sent to customer");
    };

    const handleMarkResolved = () => {
        setTickets((prev) =>
            prev.map((t) =>
                t.id === selectedTicketId ? { ...t, status: "Closed" } : t
            )
        );
        message.success(`Ticket #${selectedTicket.ticketNumber} marked as RESOLVED`);
    };

    const handleInsertAiDraft = () => {
        setReplyText(
            "Hello Marcus,\n\nWe have verified that the X (Twitter) API stream experienced a temporary rate limit event. Our automated failover proxy has been engaged and data synchronization will resume within 10 minutes.\n\nThank you for your patience!"
        );
        message.info("AI Draft inserted into reply box");
    };

    const getPriorityBadge = (priority: TicketItem["priority"]) => {
        switch (priority) {
            case "URGENT":
                return (
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold text-rose-700 bg-rose-100 border border-rose-200 rounded-md tracking-wider">
                        URGENT
                    </span>
                );
            case "HIGH":
                return (
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold text-teal-700 bg-teal-100 border border-teal-200 rounded-md tracking-wider">
                        HIGH
                    </span>
                );
            case "MEDIUM":
                return (
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold text-amber-700 bg-amber-100 border border-amber-200 rounded-md tracking-wider">
                        MEDIUM
                    </span>
                );
            case "LOW":
                return (
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold text-slate-600 bg-slate-100 border border-slate-200 rounded-md tracking-wider">
                        LOW
                    </span>
                );
        }
    };

    return (
        <div className="p-6 flex flex-col">
            {/* Header Title */}
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-200/60 shrink-0">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Customer Support Console</h1>
                    <p className="text-slate-500 mt-0.5 text-sm font-medium">
                        Real-time ticket queue, AI diagnostics, and customer resolution hub.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold px-3 py-1 rounded-full shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        Live Queue Active (12 Unresolved)
                    </span>
                </div>
            </div>

            {/* Main Split Grid (Sidebar + Console) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* --- LEFT SIDEBAR (Ticket List) - 5 Spans --- */}
                <div className="lg:col-span-5 card p-5 flex flex-col h-[86vh] overflow-hidden">
                    {/* Tabs Bar matching image */}
                    <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center justify-between mb-4 shrink-0">
                        {SUPPORT_TABS.map((tab) => {
                            const count = tickets.filter((t) => t.status === tab.id).length;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${isActive
                                        ? "bg-white text-slate-900"
                                        : "text-slate-500 hover:text-slate-800"
                                        }`}
                                >
                                    {tab.label} ({count})
                                </button>
                            );
                        })}
                    </div>

                    {/* Search Bar */}
                    <div className="mb-4 shrink-0">
                        <Input
                            placeholder="Search tickets, users, IDs..."
                            prefix={<Search className="w-4 h-4 text-slate-400 mr-1" />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="rounded-xl border-slate-200 bg-slate-50 hover:border-slate-300 focus:bg-white text-xs h-10"
                        />
                    </div>

                    {/* Ticket Cards List */}
                    <div className="overflow-y-auto space-y-3 flex-1 min-h-0 pr-1">
                        {filteredTickets.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 font-medium text-xs">
                                No tickets found in this tab.
                            </div>
                        ) : (
                            filteredTickets.map((ticket) => {
                                const isSelected = ticket.id === selectedTicketId;
                                return (
                                    <div
                                        key={ticket.id}
                                        onClick={() => setSelectedTicketId(ticket.id)}
                                        className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${isSelected
                                            ? "bg-slate-50 border-indigo-300 shadow-md ring-1 ring-indigo-200"
                                            : "bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-2xs"
                                            }`}
                                    >
                                        {/* Left Active Selection Bar */}
                                        {isSelected && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600 rounded-l-2xl"></div>
                                        )}

                                        {/* Priority & Timestamp */}
                                        <div className="flex justify-between items-center mb-2.5 pl-1">
                                            {getPriorityBadge(ticket.priority)}
                                            <span className="text-[11px] font-bold text-slate-400">{ticket.timeAgo}</span>
                                        </div>

                                        {/* Title & Preview */}
                                        <h3 className="text-sm font-extrabold text-slate-900 mb-1 pl-1 line-clamp-1">
                                            {ticket.title}
                                        </h3>
                                        <p className="text-xs font-medium text-slate-500 mb-4 pl-1 line-clamp-2 leading-relaxed">
                                            {ticket.preview}
                                        </p>

                                        {/* User Info & Plan Badge */}
                                        <div className="flex justify-between items-center pt-2 border-t border-slate-100 pl-1">
                                            <div className="flex items-center gap-2">
                                                <Avatar src={ticket.userAvatar} size={24} className="bg-slate-200 shrink-0" />
                                                <span className="text-xs font-extrabold text-slate-800">{ticket.userName}</span>
                                            </div>
                                            <span className="text-[11px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                                                {ticket.userPlan}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* --- RIGHT CONSOLE (Active Ticket Chat & Reply) - 7 Spans --- */}
                <div className="lg:col-span-7 card p-6 flex flex-col h-[86vh] overflow-hidden justify-between">

                    {/* 1. Header Bar of Active Ticket */}
                    <div className="shrink-0">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-mono text-xs font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                                        {selectedTicket.ticketNumber}
                                    </span>
                                    <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                                        {selectedTicket.title}
                                    </h2>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                                    <span className="flex items-center gap-1">
                                        <User className="w-3.5 h-3.5 text-slate-400" /> {selectedTicket.userName} ({selectedTicket.userEmail})
                                    </span>
                                    <span>•</span>
                                    <span className="font-bold text-indigo-600">{selectedTicket.userPlan} Plan</span>
                                </div>
                            </div>

                            {/* Header Quick Actions */}
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={handleMarkResolved}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl h-9 px-4 text-xs border-none flex items-center gap-1.5 cursor-pointer"
                                >
                                    <CheckCircle2 className="w-4 h-4" /> Resolve
                                </Button>
                            </div>
                        </div>

                        {/* AI Copilot Suggestion Box */}
                        <div className="bg-indigo-50/80 border border-indigo-100 rounded-2xl p-3.5 mt-4 flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-xs font-extrabold text-indigo-950 mb-0.5">AI Copilot Answer Suggestion</h4>
                                    <p className="text-[11px] text-indigo-700 font-medium leading-relaxed">
                                        X API rate limit incident verified. Recommended fix response ready for dispatch.
                                    </p>
                                </div>
                            </div>
                            <Button
                                size="small"
                                onClick={handleInsertAiDraft}
                                className="bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-extrabold rounded-lg text-[11px] shrink-0"
                            >
                                Insert AI Draft
                            </Button>
                        </div>
                    </div>

                    {/* 2. Message Thread (Chat Area) */}
                    <div className="overflow-y-auto space-y-4 my-4 pr-1 flex-1 min-h-0">
                        {selectedTicket.messages.map((msg) => {
                            if (msg.sender === "system") {
                                return (
                                    <div key={msg.id} className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 text-xs text-amber-900 font-medium flex items-start gap-2">
                                        <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-extrabold block text-[11px] uppercase tracking-wider text-amber-800">
                                                {msg.senderName} • {msg.timestamp}
                                            </span>
                                            <p className="mt-0.5 leading-relaxed font-mono text-[11px]">{msg.text}</p>
                                        </div>
                                    </div>
                                );
                            }

                            const isAdmin = msg.sender === "admin";

                            return (
                                <div
                                    key={msg.id}
                                    className={`flex items-start gap-3 ${isAdmin ? "flex-row-reverse" : ""}`}
                                >
                                    <Avatar src={msg.senderAvatar} size={32} className="bg-slate-200 shrink-0 border border-slate-200" />
                                    <div className={`max-w-[80%] ${isAdmin ? "text-right" : "text-left"}`}>
                                        <div className="flex items-center gap-2 mb-1 justify-start">
                                            <span className="text-xs font-extrabold text-slate-900">{msg.senderName}</span>
                                            {msg.senderRole && (
                                                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                                                    {msg.senderRole}
                                                </span>
                                            )}
                                            <span className="text-[10px] font-medium text-slate-400">{msg.timestamp}</span>
                                        </div>
                                        <div
                                            className={`p-4 rounded-2xl text-xs font-medium leading-relaxed whitespace-pre-wrap ${msg.isInternalNote
                                                ? "bg-amber-50 border border-amber-200 text-amber-950 font-mono"
                                                : isAdmin
                                                    ? "bg-indigo-600 text-white shadow-xs rounded-tr-none"
                                                    : "bg-slate-100 border border-slate-200/80 text-slate-800 rounded-tl-none"
                                                }`}
                                        >
                                            {msg.isInternalNote && (
                                                <span className="text-[10px] font-extrabold uppercase text-amber-700 block mb-1">
                                                    🔒 Internal Note (Staff Only)
                                                </span>
                                            )}
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* 3. Reply Input Box */}
                    <div className="pt-3 border-t border-slate-100 shrink-0">
                        {/* Toggle Mode: Public Reply vs Internal Note */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsInternalNote(false)}
                                    className={`px-3 py-1 rounded-lg text-xs font-extrabold transition cursor-pointer ${!isInternalNote
                                        ? "bg-indigo-600 text-white"
                                        : "bg-slate-100 text-slate-500 hover:text-slate-800"
                                        }`}
                                >
                                    Public Reply
                                </button>
                                <button
                                    onClick={() => setIsInternalNote(true)}
                                    className={`px-3 py-1 rounded-lg text-xs font-extrabold transition flex items-center gap-1 cursor-pointer ${isInternalNote
                                        ? "bg-amber-500 text-white"
                                        : "bg-slate-100 text-slate-500 hover:text-slate-800"
                                        }`}
                                >
                                    <Lock className="w-3 h-3" /> Internal Note
                                </button>
                            </div>

                            {/* Macro Chips */}
                            <div className="hidden sm:flex items-center gap-1.5">
                                <button
                                    onClick={() => setReplyText("Could you please provide the system console logs?")}
                                    className="text-[10px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md transition cursor-pointer"
                                >
                                    + Ask Logs
                                </button>
                                <button
                                    onClick={() => setReplyText("We have deployed a hotfix. Please refresh your browser.")}
                                    className="text-[10px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md transition cursor-pointer"
                                >
                                    + Confirm Fix
                                </button>
                            </div>
                        </div>

                        {/* Textarea Input */}
                        <div className="relative">
                            <Input.TextArea
                                rows={2}
                                placeholder={
                                    isInternalNote
                                        ? "Type internal note visible only to support team..."
                                        : "Type your reply to customer..."
                                }
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className={`rounded-2xl text-xs font-medium p-3.5 ${isInternalNote ? "bg-amber-50/50 border-amber-200 focus:bg-white" : "bg-slate-50 border-slate-200 focus:bg-white"
                                    }`}
                            />

                            <div className="flex justify-between items-center mt-2.5">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <button className="p-1.5 hover:bg-slate-100 rounded-lg transition text-slate-500 cursor-pointer">
                                        <Paperclip className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 hover:bg-slate-100 rounded-lg transition text-slate-500 cursor-pointer">
                                        <Smile className="w-4 h-4" />
                                    </button>
                                </div>

                                <Button
                                    type="primary"
                                    icon={<Send className="w-4 h-4" />}
                                    onClick={handleSendReply}
                                    className={`font-extrabold rounded-xl h-10 px-5 flex items-center gap-2 shadow-xs border-none ${isInternalNote ? "bg-amber-600 hover:bg-amber-700" : "bg-indigo-600 hover:bg-indigo-700"
                                        }`}
                                >
                                    {isInternalNote ? "Add Note" : "Send Reply"}
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
