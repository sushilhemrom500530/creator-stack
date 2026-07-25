"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
    Table,
    Tag,
    Button,
    Input,
    Select,
    Avatar,
    Modal,
    message,
    Tooltip,
    Badge,
} from "antd";
import {
    ShieldCheck,
    AlertTriangle,
    Filter,
    Download,
    Search,
    Sparkles,
    Eye,
    Folder,
    Shield,
    Lock,
    UserPlus,
    Key,
    Activity,
    Bot,
    UserCheck,
    RotateCw,
    Terminal,
    Globe,
    CheckCircle2,
    ShieldAlert,
} from "lucide-react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export interface AuditLogItem {
    id: string;
    adminName: string;
    adminRole: string;
    adminAvatar: string;
    adminInitials: string;
    adminBg: string;
    actionTaken: string;
    actionColor: "rose" | "teal" | "purple" | "emerald" | "amber";
    targetResource: string;
    targetIconType: "folder" | "shield" | "vault" | "user" | "key";
    timestamp: string;
    ipAddress: string;
    isAlert?: boolean;
    detailsPayload?: {
        userAgent: string;
        location: string;
        diff: string;
    };
}

const INITIAL_LOGS: AuditLogItem[] = [
    {
        id: "1",
        adminName: "Elena Kostic",
        adminRole: "System Admin",
        adminAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=elena",
        adminInitials: "EK",
        adminBg: "bg-purple-600",
        actionTaken: "resource.delete",
        actionColor: "purple",
        targetResource: "Campaign_Q4_Final",
        targetIconType: "folder",
        timestamp: "Oct 24, 2023 - 14:22:01",
        ipAddress: "192.168.1.142",
        isAlert: false,
        detailsPayload: {
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
            location: "San Francisco, USA (Internal VPN)",
            diff: "DELETED object id: camp_884912 from bucket s3-prod-assets",
        },
    },
    {
        id: "2",
        adminName: "Marcus Jensen",
        adminRole: "Security Lead",
        adminAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
        adminInitials: "MJ",
        adminBg: "bg-teal-600",
        actionTaken: "policy.update",
        actionColor: "teal",
        targetResource: "Global_Auth_Policy",
        targetIconType: "shield",
        timestamp: "Oct 24, 2023 - 13:05:45",
        ipAddress: "45.23.11.202",
        isAlert: false,
        detailsPayload: {
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            location: "Stockholm, Sweden",
            diff: "SET mfa_required = TRUE for group 'SuperAdmins'",
        },
    },
    {
        id: "3",
        adminName: "System Bot",
        adminRole: "Automated Agent",
        adminAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=systembot",
        adminInitials: "AI",
        adminBg: "bg-rose-500",
        actionTaken: "ACCESS.DENIED",
        actionColor: "rose",
        targetResource: "Root_Access_Vault",
        targetIconType: "vault",
        timestamp: "Oct 24, 2023 - 12:59:12",
        ipAddress: "88.102.4.55",
        isAlert: true,
        detailsPayload: {
            userAgent: "Python/3.11 requests/2.31.0",
            location: "Frankfurt, Germany (Blocked Subnet)",
            diff: "REJECTED 5 invalid token attempts for root credential store.",
        },
    },
    {
        id: "4",
        adminName: "Sarah Ahmed",
        adminRole: "Manager",
        adminAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
        adminInitials: "SA",
        adminBg: "bg-emerald-600",
        actionTaken: "user.invite",
        actionColor: "emerald",
        targetResource: "new_editor@client.com",
        targetIconType: "user",
        timestamp: "Oct 24, 2023 - 11:40:10",
        ipAddress: "192.168.1.15",
        isAlert: false,
        detailsPayload: {
            userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)",
            location: "London, UK",
            diff: "INVITED user new_editor@client.com with role 'Editor'",
        },
    },
    {
        id: "5",
        adminName: "John Doe",
        adminRole: "Architect",
        adminAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe",
        adminInitials: "JD",
        adminBg: "bg-indigo-600",
        actionTaken: "api.key_rotated",
        actionColor: "purple",
        targetResource: "Production_API_v2",
        targetIconType: "key",
        timestamp: "Oct 24, 2023 - 09:15:33",
        ipAddress: "10.0.0.42",
        isAlert: false,
        detailsPayload: {
            userAgent: "Terraform/1.6.0 (+https://www.terraform.io)",
            location: "US-East-1 AWS VPC",
            diff: "ROTATED key_id: secret_live_9941a. Expiration set to 90 days.",
        },
    },
];

export default function AuditLogs() {
    const [logs] = useState<AuditLogItem[]>(INITIAL_LOGS);
    const [searchText, setSearchText] = useState<string>("");
    const [selectedWorkspace, setSelectedWorkspace] = useState<string>("all");
    const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
    const [isScanning, setIsScanning] = useState<boolean>(false);

    // Filter Logic
    const filteredLogs = logs.filter((log) => {
        return (
            log.adminName.toLowerCase().includes(searchText.toLowerCase()) ||
            log.actionTaken.toLowerCase().includes(searchText.toLowerCase()) ||
            log.targetResource.toLowerCase().includes(searchText.toLowerCase()) ||
            log.ipAddress.includes(searchText)
        );
    });

    const handleRunScan = () => {
        setIsScanning(true);
        message.loading({ content: "Running Global Security Audit Scan...", key: "scan" });
        setTimeout(() => {
            setIsScanning(false);
            message.success({ content: "Global scan complete. 0 critical vulnerabilities found.", key: "scan" });
        }, 1500);
    };

    const handleExportCSV = () => {
        message.loading({ content: "Exporting System Compliance Logs...", key: "audit_csv" });
        setTimeout(() => {
            message.success({ content: "Export downloaded (audit_logs_compliance_2023.csv)", key: "audit_csv" });
        }, 1000);
    };

    // Action Distribution Bar Chart Options
    const distributionChartOptions: ApexCharts.ApexOptions = {
        chart: {
            type: "bar",
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                columnWidth: "45%",
                borderRadius: 8,
                distributed: true,
            },
        },
        dataLabels: { enabled: false },
        legend: { show: false },
        colors: ["#6366F1", "#10B981", "#8B5CF6", "#F43F5E", "#0EA5E9"],
        xaxis: {
            categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            labels: { style: { colors: "#64748B", fontSize: "11px", fontWeight: 700 } },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: { style: { colors: "#64748B", fontSize: "11px", fontWeight: 700 } },
        },
        grid: {
            borderColor: "#F1F5F9",
            strokeDashArray: 4,
        },
    };

    const distributionSeries = [
        {
            name: "Mutations",
            data: [120, 310, 180, 420, 290, 150, 210],
        },
    ];

    const getResourceIcon = (type: AuditLogItem["targetIconType"]) => {
        switch (type) {
            case "folder":
                return <Folder className="w-4 h-4 text-purple-500" />;
            case "shield":
                return <Shield className="w-4 h-4 text-teal-500" />;
            case "vault":
                return <Lock className="w-4 h-4 text-rose-500" />;
            case "user":
                return <UserPlus className="w-4 h-4 text-emerald-500" />;
            case "key":
                return <Key className="w-4 h-4 text-indigo-500" />;
            default:
                return <Folder className="w-4 h-4 text-slate-400" />;
        }
    };

    const getActionBadge = (action: string, color: AuditLogItem["actionColor"]) => {
        const colorClasses = {
            rose: "bg-rose-50 border-rose-200 text-rose-700",
            teal: "bg-teal-50 border-teal-200 text-teal-700",
            purple: "bg-purple-50 border-purple-200 text-purple-700",
            emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
            amber: "bg-amber-50 border-amber-200 text-amber-700",
        };

        return (
            <span className={`inline-block px-2.5 py-1 text-[11px] font-mono font-extrabold rounded-lg border ${colorClasses[color]}`}>
                {action}
            </span>
        );
    };

    return (
        <div className="min-h-screen font-sans p-6">
            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pb-4 border-b border-slate-200/60">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Compliance</h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">
                        Real-time oversight of administrative activity and resource mutations.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        icon={<Filter className="w-4 h-4 text-slate-600" />}
                        className="bg-white border-slate-200 hover:border-slate-300 font-bold rounded-xl h-10 text-slate-700 shadow-2xs flex items-center gap-2"
                        onClick={() => message.info("Advanced filter modal opened")}
                    >
                        Advanced Filters
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
                {/* 1. Total Actions */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block mb-2">TOTAL ACTIONS (24H)</span>
                    <div className="flex items-baseline gap-3 mb-1">
                        <span className="text-3xl font-extrabold text-slate-900">1,284</span>
                        <span className="inline-flex items-center gap-0.5 text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            +12%
                        </span>
                    </div>
                </div>

                {/* 2. Security Flags */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block mb-2">SECURITY FLAGS</span>
                    <div className="flex items-baseline gap-3 mb-1">
                        <span className="text-3xl font-extrabold text-rose-600">03</span>
                        <span className="text-xs font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                            High Risk
                        </span>
                    </div>
                </div>

                {/* 3. Unique Admins */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block mb-2">UNIQUE ADMINS</span>
                    <div className="flex items-baseline gap-3 mb-1">
                        <span className="text-3xl font-extrabold text-slate-900">24</span>
                        <span className="text-xs font-extrabold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                            Active
                        </span>
                    </div>
                </div>

                {/* 4. AI Monitoring */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition relative overflow-hidden flex flex-col justify-between">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">AI MONITORING</span>
                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-extrabold text-emerald-600">Active</span>
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                    <Bot className="w-12 h-12 text-slate-100 absolute right-3 bottom-1 -z-0 pointer-events-none" />
                </div>
            </div>

            {/* --- Main Table Container --- */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs mb-8">
                {/* Sub-header Context Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2 overflow-hidden">
                            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-white">
                                JD
                            </div>
                            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-white">
                                AS
                            </div>
                            <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-white">
                                ML
                            </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-500">
                            Recent admin activity filtered by{" "}
                            <span className="font-extrabold text-slate-900">All Workspaces</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> ANOMALY DETECTION ON
                        </span>

                        <Input
                            placeholder="Filter by admin, action, IP..."
                            prefix={<Search className="w-3.5 h-3.5 text-slate-400 mr-1" />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-48 sm:w-56 rounded-xl border-slate-200 bg-slate-50 hover:border-slate-300 focus:bg-white text-xs"
                        />
                    </div>
                </div>

                {/* Audit Logs Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                                <th className="py-3.5 px-4">Admin Name</th>
                                <th className="py-3.5 px-4">Action Taken</th>
                                <th className="py-3.5 px-4">Target Resource</th>
                                <th className="py-3.5 px-4">Timestamp</th>
                                <th className="py-3.5 px-4">IP Address</th>
                                <th className="py-3.5 px-4 text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                            {filteredLogs.map((row) => (
                                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                                    {/* Admin Name */}
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-9 h-9 rounded-xl ${row.adminBg} text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-2xs`}
                                            >
                                                {row.adminInitials}
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-extrabold text-slate-900">{row.adminName}</h4>
                                                <span className="text-[10px] text-slate-400 font-medium">{row.adminRole}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Action Taken */}
                                    <td className="py-4 px-4">
                                        {getActionBadge(row.actionTaken, row.actionColor)}
                                    </td>

                                    {/* Target Resource */}
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2.5 text-slate-800 font-mono font-bold">
                                            {getResourceIcon(row.targetIconType)}
                                            <span>{row.targetResource}</span>
                                        </div>
                                    </td>

                                    {/* Timestamp */}
                                    <td className="py-4 px-4 text-slate-500 font-medium whitespace-nowrap">
                                        {row.timestamp}
                                    </td>

                                    {/* IP Address */}
                                    <td className="py-4 px-4 font-mono text-slate-600">
                                        {row.ipAddress}
                                    </td>

                                    {/* Details */}
                                    <td className="py-4 px-4 text-right">
                                        <Tooltip title="View Event Payload">
                                            <Button
                                                type="text"
                                                size="small"
                                                icon={
                                                    row.isAlert ? (
                                                        <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
                                                    ) : (
                                                        <Eye className="w-4 h-4 text-slate-500" />
                                                    )
                                                }
                                                onClick={() => {
                                                    setSelectedLog(row);
                                                    setIsDetailModalOpen(true);
                                                }}
                                                className="hover:bg-slate-100 rounded-lg"
                                            />
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-100 mt-6 text-xs text-slate-500 font-medium">
                    <span>Showing 1-5 of 24,310 entries</span>
                    <div className="flex items-center gap-1.5">
                        <Button size="small" className="rounded-lg text-xs font-bold border-slate-200">&lt;</Button>
                        <Button size="small" type="primary" className="rounded-lg text-xs font-bold bg-indigo-600">1</Button>
                        <Button size="small" className="rounded-lg text-xs font-bold border-slate-200">2</Button>
                        <Button size="small" className="rounded-lg text-xs font-bold border-slate-200">3</Button>
                        <span className="text-slate-400 px-1">...</span>
                        <Button size="small" className="rounded-lg text-xs font-bold border-slate-200">486</Button>
                        <Button size="small" className="rounded-lg text-xs font-bold border-slate-200">&gt;</Button>
                    </div>
                </div>
            </div>

            {/* --- Bottom Row (2 Columns) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Card: Action Distribution (2 Spans) */}
                <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-extrabold text-slate-900">Action Distribution</h2>
                            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Weekly Overview</span>
                        </div>

                        <div className="h-44 w-full">
                            <ReactApexChart options={distributionChartOptions} series={distributionSeries} type="bar" height="100%" width="100%" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 mt-4 text-xs font-bold">
                        <div>
                            <span className="text-[10px] text-slate-400 uppercase block font-extrabold">CREATED</span>
                            <span className="text-xl font-extrabold text-indigo-600">422</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 uppercase block font-extrabold">UPDATED</span>
                            <span className="text-xl font-extrabold text-emerald-600">812</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 uppercase block font-extrabold">DELETED</span>
                            <span className="text-xl font-extrabold text-purple-600">50</span>
                        </div>
                    </div>
                </div>

                {/* Right Card: Security Audit (1 Span) */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-emerald-600 mb-3">
                            <ShieldCheck className="w-5 h-5" />
                            <h2 className="text-lg font-extrabold text-slate-900">Security Audit</h2>
                        </div>

                        <p className="text-xs font-medium text-slate-500 leading-relaxed mb-4">
                            AI-driven pattern recognition has flagged <span className="font-extrabold text-rose-600">2 anomalies</span> in the last 6 hours originating from outside known VPN subnets.
                        </p>

                        {/* Alert Box */}
                        <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-xs font-mono font-extrabold text-rose-950 uppercase tracking-wider mb-0.5">BRUTE_FORCE_DETECTED</h4>
                                    <p className="text-[10px] font-mono text-rose-700">Source: 203.0.113.1</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-slate-100 mb-6">
                            <span className="text-slate-400 uppercase text-[10px] font-extrabold">FULL REPORT STATUS</span>
                            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[10px]">
                                CLEAN
                            </span>
                        </div>
                    </div>

                    <Button
                        block
                        icon={<RotateCw className={`w-4 h-4 ${isScanning ? "animate-spin" : ""}`} />}
                        onClick={handleRunScan}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl h-11 border-none shadow-sm"
                    >
                        Run Global Scan
                    </Button>
                </div>
            </div>

            {/* --- LOG DETAILS MODAL --- */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-indigo-600" />
                        <span className="font-extrabold text-slate-900">Audit Log Payload Event #{selectedLog?.id}</span>
                    </div>
                }
                open={isDetailModalOpen}
                onCancel={() => setIsDetailModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsDetailModalOpen(false)} className="rounded-xl font-bold">
                        Close
                    </Button>,
                ]}
            >
                {selectedLog && (
                    <div className="space-y-4 py-2 text-xs">
                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                            <div>
                                <span className="text-slate-400 font-bold uppercase block text-[10px]">Admin Actor</span>
                                <span className="font-extrabold text-slate-900 text-sm">{selectedLog.adminName}</span>
                                <span className="text-slate-400 block text-[10px]">{selectedLog.adminRole}</span>
                            </div>
                            {getActionBadge(selectedLog.actionTaken, selectedLog.actionColor)}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                                <span className="text-slate-400 font-bold uppercase block text-[10px]">IP Geolocation</span>
                                <span className="font-mono font-extrabold text-slate-900 block">{selectedLog.ipAddress}</span>
                                <span className="text-slate-500 text-[10px]">{selectedLog.detailsPayload?.location}</span>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                                <span className="text-slate-400 font-bold uppercase block text-[10px]">Timestamp</span>
                                <span className="font-extrabold text-slate-900 block">{selectedLog.timestamp}</span>
                            </div>
                        </div>

                        <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-[11px] leading-relaxed overflow-x-auto">
                            <span className="text-emerald-400 block mb-1"># Action Diff Log</span>
                            <span>{selectedLog.detailsPayload?.diff}</span>
                            <span className="text-slate-500 block mt-2 border-t border-slate-800 pt-2 text-[10px]">
                                User-Agent: {selectedLog.detailsPayload?.userAgent}
                            </span>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
