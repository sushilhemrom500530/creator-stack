"use client";

import React, { useState } from "react";
import {
    Table,
    Tag,
    Button,
    Input,
    Select,
    Progress,
    Tabs,
    Badge,
    Avatar,
    Dropdown,
    Modal,
    message,
    Tooltip,
} from "antd";
import {
    ShieldAlert,
    AlertTriangle,
    Mail,
    Megaphone,
    Lock,
    Search,
    Filter,
    Download,
    CheckCircle2,
    Clock,
    Zap,
    Sparkles,
    MoreVertical,
    UserX,
    Eye,
    Check,
    ArrowUpRight,
    Bot,
    Activity,
    Shield,
    RotateCcw,
} from "lucide-react";

export interface ReportItem {
    id: string;
    ticketId: string;
    type: string;
    typeCategory: string;
    severity: "High Severity" | "AI Auto-Flag" | "User Reported" | "Med Severity" | "Low Severity";
    icon: React.ReactNode;
    username: string;
    userId: string;
    userAvatar: string;
    timestamp: string;
    status: "PENDING" | "RESOLVED" | "ESCALATED";
    aiFlagged?: boolean;
    description?: string;
}

const INITIAL_REPORTS: ReportItem[] = [
    {
        id: "1",
        ticketId: "9283-SF",
        type: "Harassment",
        typeCategory: "User Safety",
        severity: "High Severity",
        icon: <AlertTriangle className="w-4 h-4 text-rose-500" />,
        username: "@alex_mod_99",
        userId: "ID: 9283-SF",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
        timestamp: "14 Oct, 2023 14:23 PM",
        status: "PENDING",
        aiFlagged: false,
        description: "Repeated targeted harassment and toxic comments reported across multiple community threads.",
    },
    {
        id: "2",
        ticketId: "1102-AI",
        type: "Spam / Bot",
        typeCategory: "Abuse Prevention",
        severity: "AI Auto-Flag",
        icon: <Mail className="w-4 h-4 text-indigo-500" />,
        username: "@crypto_bot_01",
        userId: "ID: 1102-AI",
        userAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=cryptobot",
        timestamp: "14 Oct, 2023 14:02 PM",
        status: "RESOLVED",
        aiFlagged: true,
        description: "Automated bulk messaging sending phishing crypto links to 120 users in 30 seconds.",
    },
    {
        id: "3",
        ticketId: "4431-AD",
        type: "Misleading Ads",
        typeCategory: "Monetization Policy",
        severity: "User Reported",
        icon: <Megaphone className="w-4 h-4 text-amber-500" />,
        username: "@ad_network_v3",
        userId: "ID: 4431-AD",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=adnetwork",
        timestamp: "14 Oct, 2023 13:45 PM",
        status: "PENDING",
        aiFlagged: false,
        description: "Sponsored banner post containing deceptive redirect URL and fake prize giveaway claims.",
    },
    {
        id: "4",
        ticketId: "8872-SF",
        type: "Privacy Violation",
        typeCategory: "Data Protection",
        severity: "Med Severity",
        icon: <Lock className="w-4 h-4 text-emerald-500" />,
        username: "@user_privacy_check",
        userId: "ID: 8872-SF",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=privacy",
        timestamp: "14 Oct, 2023 12:15 PM",
        status: "RESOLVED",
        aiFlagged: false,
        description: "Sharing personally identifiable information (phone numbers and residential addresses) without consent.",
    },
    {
        id: "5",
        ticketId: "7741-AI",
        type: "Hate Speech",
        typeCategory: "Community Guidelines",
        severity: "High Severity",
        icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
        username: "@troll_account_90",
        userId: "ID: 7741-AI",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=troll",
        timestamp: "14 Oct, 2023 11:50 AM",
        status: "ESCALATED",
        aiFlagged: true,
        description: "Discriminatory slur patterns detected by AI moderation engine v4.2.",
    },
    {
        id: "6",
        ticketId: "6620-SF",
        type: "Copyright Infringement",
        typeCategory: "IP Protection",
        severity: "User Reported",
        icon: <AlertTriangle className="w-4 h-4 text-indigo-500" />,
        username: "@media_reposter_x",
        userId: "ID: 6620-SF",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=media",
        timestamp: "14 Oct, 2023 10:30 AM",
        status: "PENDING",
        aiFlagged: false,
        description: "DMCA takedown notice filed for unauthorized re-upload of premium creator course video.",
    },
];

export default function Reports() {
    const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
    const [activeTab, setActiveTab] = useState<string>("all");
    const [searchText, setSearchText] = useState<string>("");
    const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

    // Filter Logic
    const filteredReports = reports.filter((r) => {
        const matchesSearch =
            r.type.toLowerCase().includes(searchText.toLowerCase()) ||
            r.username.toLowerCase().includes(searchText.toLowerCase()) ||
            r.ticketId.toLowerCase().includes(searchText.toLowerCase());

        if (activeTab === "pending") return matchesSearch && r.status === "PENDING";
        if (activeTab === "ai") return matchesSearch && r.aiFlagged;
        if (activeTab === "resolved") return matchesSearch && r.status === "RESOLVED";
        return matchesSearch;
    });

    const handleResolve = (id: string) => {
        setReports((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status: "RESOLVED" } : item))
        );
        message.success("Report successfully marked as RESOLVED");
        setIsDetailModalOpen(false);
    };

    const handleEscalate = (id: string) => {
        setReports((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status: "ESCALATED" } : item))
        );
        message.warning("Report escalated to Senior Safety Team");
        setIsDetailModalOpen(false);
    };

    const handleExportCSV = () => {
        message.loading({ content: "Preparing CSV export...", key: "csv" });
        setTimeout(() => {
            message.success({ content: "Reports export downloaded (reports_export_2023.csv)", key: "csv" });
        }, 1000);
    };

    const pendingCount = reports.filter((r) => r.status === "PENDING").length;
    const aiCount = reports.filter((r) => r.aiFlagged).length;

    return (
        <div className="min-h-screen font-sans p-6">
            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pb-4 border-b border-slate-200/60">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reports Management</h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">
                        Oversee system-wide user safety, content moderation, and abuse prevention.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        icon={<Filter className="w-4 h-4 text-slate-600" />}
                        className="bg-white border-slate-200 hover:border-slate-300 font-bold rounded-xl h-10 text-slate-700 shadow-2xs flex items-center gap-2"
                        onClick={() => message.info("Filter parameters applied")}
                    >
                        Filters
                    </Button>
                    <Button
                        type="primary"
                        icon={<Download className="w-4 h-4" />}
                        onClick={handleExportCSV}
                        className="bg-indigo-600 hover:bg-indigo-700 font-extrabold rounded-xl h-10 px-5 flex items-center gap-2 shadow-sm border-none"
                    >
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* --- Top Stat Cards Grid (4 Columns) --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {/* Pending Reviews */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Pending Reviews</span>
                        <div className="p-2 rounded-xl bg-rose-50 border border-rose-100 text-rose-600">
                            <Clock className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-extrabold text-slate-900">124</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
                        <Activity className="w-3.5 h-3.5" />
                        <span>+12% from yesterday</span>
                    </div>
                </div>

                {/* Resolved Today */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Resolved Today</span>
                        <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-extrabold text-emerald-600">842</span>
                    </div>
                    <div className="text-xs font-bold text-slate-500">
                        Efficiency: <span className="text-emerald-700 font-extrabold">94.2%</span>
                    </div>
                </div>

                {/* Spam Detected (AI) */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Spam Detected (AI)</span>
                        <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                            <Bot className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-extrabold text-slate-900">5.2k</span>
                    </div>
                    <div className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 text-indigo-500" /> AI Protected
                    </div>
                </div>

                {/* Avg Response Time */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Avg. Response Time</span>
                        <div className="p-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-600">
                            <Zap className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-extrabold text-slate-900">1.4h</span>
                    </div>
                    <div className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        <Check className="w-3 h-3 text-emerald-600" /> Within SLA
                    </div>
                </div>
            </div>

            {/* --- Main 2-Column Section --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* --- LEFT COLUMN: Reports Table Card (2 Spans) --- */}
                <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                    <div>
                        {/* Table Filter Tabs */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => setActiveTab("all")}
                                    className={`pb-2 text-sm font-extrabold transition-all border-b-2 ${
                                        activeTab === "all"
                                            ? "border-indigo-600 text-indigo-600"
                                            : "border-transparent text-slate-400 hover:text-slate-600"
                                    }`}
                                >
                                    All Reports ({reports.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab("pending")}
                                    className={`pb-2 text-sm font-extrabold transition-all border-b-2 flex items-center gap-1.5 ${
                                        activeTab === "pending"
                                            ? "border-indigo-600 text-indigo-600"
                                            : "border-transparent text-slate-400 hover:text-slate-600"
                                    }`}
                                >
                                    Pending ({pendingCount})
                                </button>
                                <button
                                    onClick={() => setActiveTab("ai")}
                                    className={`pb-2 text-sm font-extrabold transition-all border-b-2 flex items-center gap-1.5 ${
                                        activeTab === "ai"
                                            ? "border-indigo-600 text-indigo-600"
                                            : "border-transparent text-slate-400 hover:text-slate-600"
                                    }`}
                                >
                                    Flagged by AI ({aiCount})
                                </button>
                            </div>

                            {/* Search Input */}
                            <Input
                                placeholder="Search report, user..."
                                prefix={<Search className="w-3.5 h-3.5 text-slate-400 mr-1" />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="w-full sm:w-56 rounded-xl border-slate-200 bg-slate-50 hover:border-slate-300 focus:bg-white text-xs"
                            />
                        </div>

                        {/* Reports Data Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                                        <th className="py-3 px-4">Report Type</th>
                                        <th className="py-3 px-4">Source / User</th>
                                        <th className="py-3 px-4">Timestamp</th>
                                        <th className="py-3 px-4 text-center">Status</th>
                                        <th className="py-3 px-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                                    {filteredReports.map((row) => (
                                        <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                                            {/* Report Type */}
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 rounded-2xl bg-slate-100 border border-slate-200 shrink-0 group-hover:bg-white transition-colors">
                                                        {row.icon}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                            {row.type}
                                                        </h4>
                                                        <span className="text-[10px] font-bold text-slate-400">
                                                            {row.severity}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Source / User */}
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2.5">
                                                    <Avatar src={row.userAvatar} size={32} className="bg-slate-200 shrink-0 border border-slate-200" />
                                                    <div>
                                                        <h5 className="text-xs font-extrabold text-slate-900">{row.username}</h5>
                                                        <span className="text-[10px] font-mono text-slate-400">{row.userId}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Timestamp */}
                                            <td className="py-4 px-4 text-slate-500 font-medium whitespace-nowrap">
                                                {row.timestamp}
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-4 text-center">
                                                {row.status === "PENDING" && (
                                                    <span className="inline-block px-3 py-1 text-[10px] font-extrabold text-rose-700 bg-rose-100 border border-rose-200 rounded-full">
                                                        PENDING
                                                    </span>
                                                )}
                                                {row.status === "RESOLVED" && (
                                                    <span className="inline-block px-3 py-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-full">
                                                        RESOLVED
                                                    </span>
                                                )}
                                                {row.status === "ESCALATED" && (
                                                    <span className="inline-block px-3 py-1 text-[10px] font-extrabold text-purple-700 bg-purple-100 border border-purple-200 rounded-full">
                                                        ESCALATED
                                                    </span>
                                                )}
                                            </td>

                                            {/* Action */}
                                            <td className="py-4 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Tooltip title="View Details">
                                                        <Button
                                                            type="text"
                                                            size="small"
                                                            icon={<Eye className="w-4 h-4 text-slate-500" />}
                                                            onClick={() => {
                                                                setSelectedReport(row);
                                                                setIsDetailModalOpen(true);
                                                            }}
                                                            className="hover:bg-slate-100 rounded-lg"
                                                        />
                                                    </Tooltip>
                                                    {row.status === "PENDING" && (
                                                        <Tooltip title="Mark Resolved">
                                                            <Button
                                                                type="text"
                                                                size="small"
                                                                icon={<Check className="w-4 h-4 text-emerald-600" />}
                                                                onClick={() => handleResolve(row.id)}
                                                                className="hover:bg-emerald-50 rounded-lg"
                                                            />
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination Footer */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-100 mt-6 text-xs text-slate-500 font-medium">
                        <span>Showing {filteredReports.length} of 124 reports</span>
                        <div className="flex items-center gap-1.5">
                            <Button size="small" className="rounded-lg text-xs font-bold border-slate-200">&lt;</Button>
                            <Button size="small" type="primary" className="rounded-lg text-xs font-bold bg-indigo-600">1</Button>
                            <Button size="small" className="rounded-lg text-xs font-bold border-slate-200">2</Button>
                            <Button size="small" className="rounded-lg text-xs font-bold border-slate-200">3</Button>
                            <Button size="small" className="rounded-lg text-xs font-bold border-slate-200">&gt;</Button>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN (1 Span) --- */}
                <div className="flex flex-col gap-6">
                    
                    {/* 1. System Resolution Health */}
                    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
                        <h2 className="text-lg font-extrabold text-slate-900 mb-5">System Resolution Health</h2>
                        
                        <div className="space-y-4">
                            {/* Resolved */}
                            <div>
                                <div className="flex justify-between items-center text-xs font-extrabold mb-1">
                                    <span className="text-slate-700">Resolved</span>
                                    <span className="text-emerald-600">86%</span>
                                </div>
                                <Progress percent={86} showInfo={false} strokeColor="#10B981" railColor="#F1F5F9" size="small" />
                            </div>

                            {/* Pending */}
                            <div>
                                <div className="flex justify-between items-center text-xs font-extrabold mb-1">
                                    <span className="text-slate-700">Pending</span>
                                    <span className="text-indigo-600">12%</span>
                                </div>
                                <Progress percent={12} showInfo={false} strokeColor="#6366F1" railColor="#F1F5F9" size="small" />
                            </div>

                            {/* Escalated */}
                            <div>
                                <div className="flex justify-between items-center text-xs font-extrabold mb-1">
                                    <span className="text-slate-700">Escalated</span>
                                    <span className="text-rose-500">2%</span>
                                </div>
                                <Progress percent={2} showInfo={false} strokeColor="#F43F5E" railColor="#F1F5F9" size="small" />
                            </div>
                        </div>
                    </div>

                    {/* 2. AI Insights */}
                    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
                        <div className="flex items-center gap-2 text-indigo-600 mb-3">
                            <Sparkles className="w-5 h-5 text-indigo-500" />
                            <h2 className="text-lg font-extrabold text-slate-900">AI Insights</h2>
                        </div>

                        {/* Quote Box */}
                        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-5 text-xs text-slate-600 font-medium italic leading-relaxed">
                            "System detected a 40% surge in bot-like behavior from IP range 192.x.x.x. Automatic rate-limiting has been applied to 42 accounts."
                        </div>

                        <div className="space-y-3 pt-1 border-t border-slate-100">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-500 flex items-center gap-1.5">
                                    <Shield className="w-4 h-4 text-emerald-500" /> Accuracy Rate
                                </span>
                                <span className="font-extrabold text-slate-900">99.2%</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-500 flex items-center gap-1.5">
                                    <Zap className="w-4 h-4 text-amber-500" /> AI Mitigation Time
                                </span>
                                <span className="font-extrabold text-emerald-600">&lt; 1s</span>
                            </div>
                        </div>
                    </div>

                    {/* 3. Recent Moderator Actions */}
                    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex-1 flex flex-col justify-between">
                        <div>
                            <h2 className="text-lg font-extrabold text-slate-900 mb-4">Recent Moderator Actions</h2>
                            
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 text-xs">
                                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0"></div>
                                    <div>
                                        <h4 className="font-extrabold text-slate-900">Sarah Jenkins resolved #8210</h4>
                                        <p className="text-[11px] text-slate-400 font-medium">Decision: Permanent Ban</p>
                                        <span className="text-[10px] text-slate-400">2 mins ago</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 text-xs">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                                    <div>
                                        <h4 className="font-extrabold text-slate-900">AI Agent flagged @bot_4421</h4>
                                        <p className="text-[11px] text-slate-400 font-medium">Pattern: Bulk Messaging</p>
                                        <span className="text-[10px] text-slate-400">15 mins ago</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 text-xs">
                                    <div className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0"></div>
                                    <div>
                                        <h4 className="font-extrabold text-slate-900">Marco Rossi reviewed #7712</h4>
                                        <p className="text-[11px] text-slate-400 font-medium">Decision: Warning Sent</p>
                                        <span className="text-[10px] text-slate-400">1 hour ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 mt-4 text-center">
                            <button
                                onClick={() => message.info("Opening full system audit logs...")}
                                className="text-xs font-extrabold text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-1 w-full"
                            >
                                View Audit Logs <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                </div>

            </div>

            {/* --- REPORT DETAILS MODAL --- */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-indigo-600" />
                        <span className="font-extrabold text-slate-900">Report Ticket #{selectedReport?.ticketId}</span>
                    </div>
                }
                open={isDetailModalOpen}
                onCancel={() => setIsDetailModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsDetailModalOpen(false)} className="rounded-xl font-bold">
                        Close
                    </Button>,
                    <Button
                        key="escalate"
                        onClick={() => selectedReport && handleEscalate(selectedReport.id)}
                        className="rounded-xl font-bold border-rose-200 text-rose-600 hover:bg-rose-50"
                    >
                        Escalate
                    </Button>,
                    <Button
                        key="resolve"
                        type="primary"
                        onClick={() => selectedReport && handleResolve(selectedReport.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl border-none"
                    >
                        Mark as Resolved
                    </Button>,
                ]}
            >
                {selectedReport && (
                    <div className="space-y-4 py-2 text-xs">
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-200">
                            <div>
                                <span className="text-slate-400 font-bold uppercase block text-[10px]">Report Type</span>
                                <span className="font-extrabold text-slate-900 text-sm">{selectedReport.type}</span>
                            </div>
                            <span className="px-3 py-1 text-[10px] font-extrabold bg-rose-100 text-rose-700 rounded-full border border-rose-200">
                                {selectedReport.severity}
                            </span>
                        </div>

                        <div>
                            <span className="text-slate-400 font-bold uppercase block text-[10px] mb-1">Target Account</span>
                            <div className="flex items-center gap-2">
                                <Avatar src={selectedReport.userAvatar} />
                                <div>
                                    <span className="font-extrabold text-slate-900 block">{selectedReport.username}</span>
                                    <span className="text-slate-400 font-mono text-[10px]">{selectedReport.userId}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <span className="text-slate-400 font-bold uppercase block text-[10px] mb-1">Incident Summary</span>
                            <p className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-slate-700 font-medium leading-relaxed">
                                {selectedReport.description || "System flag triggered by telemetry engine."}
                            </p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
