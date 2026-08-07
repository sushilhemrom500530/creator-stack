"use client";

import { useState, useMemo } from "react";
import {
    Table,
    Tag,
    Dropdown,
    Button,
    Input,
    Select,
    Avatar,
    Modal,
    Drawer,
    Tooltip,
    ConfigProvider,
    Form,
    Progress,
    App,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    Search,
    Plus,
    MoreVertical,
    Eye,
    Edit3,
    Users,
    AlertCircle,
    Sparkles,
    X,
    DollarSign,
    TrendingUp,
    Download,
    RefreshCw,
    Pause,
    Play,
    Zap,
    Building2,
    FileText,
    ArrowUpRight,
} from "lucide-react";
import { StatsGrid, StatItem } from "@/components/common/stats-card";

// Subscriber Data Structure
export interface InvoiceItem {
    id: string;
    date: string;
    amount: number;
    status: "Paid" | "Failed" | "Pending";
    pdfUrl?: string;
}

export interface SubscriberType {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    company?: string;
    country?: string;
    plan: "Enterprise Pro" | "Creator Plus" | "Starter Free" | "Agency Custom";
    status: "Active" | "Trialing" | "Past Due" | "Cancelled" | "Paused";
    billingCycle: "Monthly" | "Annual";
    mrr: number;
    totalSpent: number;
    autoRenew: boolean;
    startDate: string;
    nextBillingDate: string;
    paymentMethod: {
        brand: "Visa" | "Mastercard" | "Amex" | "PayPal";
        last4?: string;
        expiry?: string;
    };
    channelsUsed: number;
    channelsLimit: number;
    aiPostsUsed: number;
    aiPostsLimit: number;
    invoices: InvoiceItem[];
}

// Initial Mock Subscribers Data
const INITIAL_SUBSCRIBERS: SubscriberType[] = [
    {
        id: "SUB-8001",
        name: "Elena Vance",
        email: "elena.vance@apexmedia.io",
        company: "Apex Media Labs",
        country: "United States",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        plan: "Enterprise Pro",
        status: "Active",
        billingCycle: "Annual",
        mrr: 199,
        totalSpent: 2388,
        autoRenew: true,
        startDate: "Jan 15, 2024",
        nextBillingDate: "Jan 15, 2027",
        paymentMethod: { brand: "Visa", last4: "4242", expiry: "12/28" },
        channelsUsed: 14,
        channelsLimit: 25,
        aiPostsUsed: 3840,
        aiPostsLimit: 5000,
        invoices: [
            { id: "INV-2026-001", date: "Jan 15, 2026", amount: 1990, status: "Paid" },
            { id: "INV-2025-001", date: "Jan 15, 2025", amount: 1990, status: "Paid" },
            { id: "INV-2024-001", date: "Jan 15, 2024", amount: 1990, status: "Paid" },
        ],
    },
    {
        id: "SUB-8002",
        name: "Marcus Chen",
        email: "marcus.c@techviral.io",
        company: "TechViral Digital",
        country: "Canada",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        plan: "Creator Plus",
        status: "Active",
        billingCycle: "Monthly",
        mrr: 29,
        totalSpent: 348,
        autoRenew: true,
        startDate: "Mar 10, 2025",
        nextBillingDate: "Aug 10, 2026",
        paymentMethod: { brand: "Mastercard", last4: "8819", expiry: "09/27" },
        channelsUsed: 7,
        channelsLimit: 10,
        aiPostsUsed: 412,
        aiPostsLimit: 500,
        invoices: [
            { id: "INV-2026-089", date: "Jul 10, 2026", amount: 29, status: "Paid" },
            { id: "INV-2026-064", date: "Jun 10, 2026", amount: 29, status: "Paid" },
            { id: "INV-2026-041", date: "May 10, 2026", amount: 29, status: "Paid" },
        ],
    },
    {
        id: "SUB-8003",
        name: "Sophia Rodriguez",
        email: "sophia@designstudio.co",
        company: "Vivid Design Studio",
        country: "Spain",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        plan: "Agency Custom",
        status: "Active",
        billingCycle: "Annual",
        mrr: 499,
        totalSpent: 5988,
        autoRenew: true,
        startDate: "Nov 01, 2024",
        nextBillingDate: "Nov 01, 2026",
        paymentMethod: { brand: "Amex", last4: "1004", expiry: "11/29" },
        channelsUsed: 38,
        channelsLimit: 50,
        aiPostsUsed: 18450,
        aiPostsLimit: 25000,
        invoices: [
            { id: "INV-2025-412", date: "Nov 01, 2025", amount: 4990, status: "Paid" },
            { id: "INV-2024-388", date: "Nov 01, 2024", amount: 4990, status: "Paid" },
        ],
    },
    {
        id: "SUB-8004",
        name: "Alexander Wright",
        email: "alex@wrightmedia.co",
        company: "Wright Media Group",
        country: "United Kingdom",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        plan: "Creator Plus",
        status: "Past Due",
        billingCycle: "Monthly",
        mrr: 29,
        totalSpent: 174,
        autoRenew: false,
        startDate: "Feb 14, 2026",
        nextBillingDate: "Jul 14, 2026",
        paymentMethod: { brand: "Visa", last4: "9021", expiry: "05/26" },
        channelsUsed: 9,
        channelsLimit: 10,
        aiPostsUsed: 498,
        aiPostsLimit: 500,
        invoices: [
            { id: "INV-2026-104", date: "Jul 14, 2026", amount: 29, status: "Failed" },
            { id: "INV-2026-081", date: "Jun 14, 2026", amount: 29, status: "Paid" },
        ],
    },
    {
        id: "SUB-8005",
        name: "Isabella Thorne",
        email: "isabella@fashionpulse.net",
        company: "Fashion Pulse Network",
        country: "France",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        plan: "Enterprise Pro",
        status: "Trialing",
        billingCycle: "Monthly",
        mrr: 199,
        totalSpent: 0,
        autoRenew: true,
        startDate: "Jul 20, 2026",
        nextBillingDate: "Aug 03, 2026",
        paymentMethod: { brand: "PayPal" },
        channelsUsed: 3,
        channelsLimit: 25,
        aiPostsUsed: 120,
        aiPostsLimit: 5000,
        invoices: [],
    },
    {
        id: "SUB-8006",
        name: "David Miller",
        email: "david@millernews.com",
        company: "Miller News Tech",
        country: "Australia",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        plan: "Starter Free",
        status: "Active",
        billingCycle: "Monthly",
        mrr: 0,
        totalSpent: 0,
        autoRenew: false,
        startDate: "Apr 05, 2026",
        nextBillingDate: "N/A",
        paymentMethod: { brand: "Visa", last4: "1122", expiry: "08/28" },
        channelsUsed: 2,
        channelsLimit: 3,
        aiPostsUsed: 35,
        aiPostsLimit: 50,
        invoices: [],
    },
    {
        id: "SUB-8007",
        name: "Amara Okezie",
        email: "amara@afrotech.io",
        company: "AfroTech Insights",
        country: "Nigeria",
        avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80",
        plan: "Creator Plus",
        status: "Paused",
        billingCycle: "Monthly",
        mrr: 29,
        totalSpent: 261,
        autoRenew: false,
        startDate: "Oct 12, 2025",
        nextBillingDate: "Sep 01, 2026",
        paymentMethod: { brand: "Mastercard", last4: "5541", expiry: "02/28" },
        channelsUsed: 5,
        channelsLimit: 10,
        aiPostsUsed: 0,
        aiPostsLimit: 500,
        invoices: [
            { id: "INV-2026-042", date: "May 12, 2026", amount: 29, status: "Paid" },
        ],
    },
    {
        id: "SUB-8008",
        name: "Liam O'Connor",
        email: "liam@dublincreatives.ie",
        company: "Dublin Creative Agency",
        country: "Ireland",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
        plan: "Enterprise Pro",
        status: "Cancelled",
        billingCycle: "Annual",
        mrr: 199,
        totalSpent: 1990,
        autoRenew: false,
        startDate: "May 10, 2024",
        nextBillingDate: "May 10, 2026",
        paymentMethod: { brand: "Visa", last4: "3391", expiry: "01/27" },
        channelsUsed: 0,
        channelsLimit: 25,
        aiPostsUsed: 0,
        aiPostsLimit: 5000,
        invoices: [
            { id: "INV-2025-092", date: "May 10, 2025", amount: 1990, status: "Paid" },
        ],
    },
];


export default function Subscribers() {
    const { message } = App.useApp();
    // State Management
    const [subscribers, setSubscribers] = useState<SubscriberType[]>(INITIAL_SUBSCRIBERS);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPlan, setSelectedPlan] = useState<string>("All");
    const [selectedStatus, setSelectedStatus] = useState<string>("All");
    const [selectedCycle, setSelectedCycle] = useState<string>("All");

    // Drawer & Modals State
    const [selectedSubscriber, setSelectedSubscriber] = useState<SubscriberType | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [subscriberToUpgrade, setSubscriberToUpgrade] = useState<SubscriberType | null>(null);

    // Form instances
    const [addForm] = Form.useForm();
    const [upgradeForm] = Form.useForm();

    // Filter Logic
    const filteredSubscribers = useMemo(() => {
        return subscribers.filter((sub) => {
            const matchesSearch =
                sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sub.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (sub.company && sub.company.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesPlan = selectedPlan === "All" || sub.plan === selectedPlan;
            const matchesStatus = selectedStatus === "All" || sub.status === selectedStatus;
            const matchesCycle = selectedCycle === "All" || sub.billingCycle === selectedCycle;

            return matchesSearch && matchesPlan && matchesStatus && matchesCycle;
        });
    }, [subscribers, searchQuery, selectedPlan, selectedStatus, selectedCycle]);

    // KPI Metrics calculation
    const metrics = useMemo(() => {
        const total = subscribers.length;
        const activeCount = subscribers.filter((s) => s.status === "Active").length;
        const trialingCount = subscribers.filter((s) => s.status === "Trialing").length;
        const pastDueCount = subscribers.filter((s) => s.status === "Past Due").length;
        const totalMRR = subscribers
            .filter((s) => s.status === "Active" || s.status === "Trialing")
            .reduce((acc, curr) => acc + curr.mrr, 0);

        const arr = totalMRR * 12;
        const atRiskMRR = subscribers
            .filter((s) => s.status === "Past Due")
            .reduce((acc, curr) => acc + curr.mrr, 0);

        return {
            total,
            activeCount,
            trialingCount,
            pastDueCount,
            totalMRR,
            arr,
            atRiskMRR,
        };
    }, [subscribers]);

    // KPI Metrics summary stats array for StatsGrid
    const kpiStatsData: StatItem[] = useMemo(
        () => [
            {
                id: "mrr",
                title: "MONTHLY RECURRING REVENUE (MRR)",
                value: `$${metrics.totalMRR.toLocaleString()}`,
                icon: DollarSign,
                iconBgClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
                subtext: `ARR: $${metrics.arr.toLocaleString()} / yr`,
                subIcon: ArrowUpRight,
                subTextColorClass: "text-emerald-600 dark:text-emerald-400",
            },
            {
                id: "active-members",
                title: "ACTIVE PAYING MEMBERS",
                value: (
                    <>
                        {metrics.activeCount}{" "}
                        <span className="text-sm font-semibold text-muted-foreground">
                            / {metrics.total}
                        </span>
                    </>
                ),
                icon: Users,
                iconBgClass: "bg-cyan-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400",
                subtext: `${Math.round((metrics.activeCount / (metrics.total || 1)) * 100)}% active subscription rate`,
                subTextColorClass: "text-muted-foreground",
            },
            {
                id: "trialing-accounts",
                title: "TRIALING ACCOUNTS",
                value: `${metrics.trialingCount} Users`,
                icon: Sparkles,
                iconBgClass: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
                subtext: "Onboarding & active evaluations",
                subTextColorClass: "text-muted-foreground",
            },
            {
                id: "past-due",
                title: "PAST DUE / AT RISK MRR",
                value: `$${metrics.atRiskMRR}`,
                valueColorClass: "text-amber-600 dark:text-amber-400",
                icon: AlertCircle,
                iconBgClass: "bg-amber-500/10 border-amber-500/20 text-amber-500",
                subtext: `${metrics.pastDueCount} accounts require payment retry`,
                subTextColorClass: "text-muted-foreground",
            },
        ],
        [metrics]
    );

    // Handler to Reset Filters
    const handleResetFilters = () => {
        setSearchQuery("");
        setSelectedPlan("All");
        setSelectedStatus("All");
        setSelectedCycle("All");
    };

    // Handler to toggle Pause / Resume
    const handleTogglePause = (subId: string) => {
        const sub = subscribers.find((s) => s.id === subId);
        if (!sub) return;

        const newStatus = sub.status === "Paused" ? "Active" : "Paused";
        setSubscribers((prev) =>
            prev.map((s) => (s.id === subId ? { ...s, status: newStatus } : s))
        );
        if (selectedSubscriber?.id === subId) {
            setSelectedSubscriber((prev) =>
                prev ? { ...prev, status: newStatus } : null
            );
        }
        message.success(
            `Subscription for ${sub.name} has been ${newStatus === "Active" ? "resumed" : "paused"}`
        );
    };

    // Handler to toggle Auto-Renew
    const handleToggleAutoRenew = (subId: string) => {
        const sub = subscribers.find((s) => s.id === subId);
        if (!sub) return;

        const nextVal = !sub.autoRenew;
        setSubscribers((prev) =>
            prev.map((s) => (s.id === subId ? { ...s, autoRenew: nextVal } : s))
        );
        if (selectedSubscriber?.id === subId) {
            setSelectedSubscriber((prev) => (prev ? { ...prev, autoRenew: nextVal } : null));
        }
        message.info(`Auto-renew ${nextVal ? "enabled" : "disabled"} for ${sub.name}`);
    };

    // Handler to Cancel Subscription
    const handleCancelSubscription = (subId: string) => {
        setSubscribers((prev) =>
            prev.map((s) => (s.id === subId ? { ...s, status: "Cancelled", autoRenew: false } : s))
        );
        message.warning("Subscription cancelled successfully");
        if (selectedSubscriber?.id === subId) {
            setSelectedSubscriber((prev) =>
                prev ? { ...prev, status: "Cancelled", autoRenew: false } : null
            );
        }
    };

    // Open Drawer
    const handleViewDetails = (sub: SubscriberType) => {
        setSelectedSubscriber(sub);
        setIsDrawerOpen(true);
    };

    // Open Upgrade Plan Modal
    const handleOpenUpgrade = (sub: SubscriberType) => {
        setSubscriberToUpgrade(sub);
        upgradeForm.setFieldsValue({
            plan: sub.plan,
            billingCycle: sub.billingCycle,
        });
        setIsUpgradeModalOpen(true);
    };

    // Handle Upgrade Submit
    const handleUpgradeSubmit = (values: any) => {
        if (!subscriberToUpgrade) return;

        let newMRR = 0;
        if (values.plan === "Enterprise Pro") newMRR = 199;
        else if (values.plan === "Creator Plus") newMRR = 29;
        else if (values.plan === "Agency Custom") newMRR = 499;
        else if (values.plan === "Starter Free") newMRR = 0;

        setSubscribers((prev) =>
            prev.map((s) => {
                if (s.id === subscriberToUpgrade.id) {
                    return {
                        ...s,
                        plan: values.plan,
                        billingCycle: values.billingCycle,
                        mrr: newMRR,
                        status: "Active",
                    };
                }
                return s;
            })
        );

        message.success(`Subscriber ${subscriberToUpgrade.name} updated to ${values.plan}!`);
        setIsUpgradeModalOpen(false);
        setSubscriberToUpgrade(null);
    };

    // Handle Add New Subscriber
    const handleAddSubscriberSubmit = (values: any) => {
        let mrrVal = 29;
        let cLimit = 10;
        let aiLimit = 500;

        if (values.plan === "Enterprise Pro") {
            mrrVal = 199;
            cLimit = 25;
            aiLimit = 5000;
        } else if (values.plan === "Agency Custom") {
            mrrVal = 499;
            cLimit = 50;
            aiLimit = 25000;
        } else if (values.plan === "Starter Free") {
            mrrVal = 0;
            cLimit = 3;
            aiLimit = 50;
        }

        const newSub: SubscriberType = {
            id: `SUB-${Math.floor(8000 + Math.random() * 1000)}`,
            name: values.name,
            email: values.email,
            company: values.company || "Independent",
            country: values.country || "United States",
            plan: values.plan,
            status: values.status || "Active",
            billingCycle: values.billingCycle || "Monthly",
            mrr: mrrVal,
            totalSpent: mrrVal * (values.billingCycle === "Annual" ? 12 : 1),
            autoRenew: true,
            startDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            nextBillingDate: "Aug 26, 2026",
            paymentMethod: { brand: "Visa", last4: "4401", expiry: "10/28" },
            channelsUsed: 1,
            channelsLimit: cLimit,
            aiPostsUsed: 12,
            aiPostsLimit: aiLimit,
            invoices: [
                {
                    id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
                    date: "Today",
                    amount: mrrVal * (values.billingCycle === "Annual" ? 10 : 1),
                    status: "Paid",
                },
            ],
        };

        setSubscribers([newSub, ...subscribers]);
        message.success(`New subscriber ${newSub.name} created!`);
        setIsAddModalOpen(false);
        addForm.resetFields();
    };

    // Export CSV Simulation
    const handleExportCSV = () => {
        const headers = ["Subscriber ID", "Name", "Email", "Company", "Plan", "Status", "MRR", "Cycle", "Next Billing"];
        const rows = filteredSubscribers.map((s) => [
            s.id,
            `"${s.name}"`,
            s.email,
            `"${s.company || ""}"`,
            s.plan,
            s.status,
            `$${s.mrr}`,
            s.billingCycle,
            s.nextBillingDate,
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `subscribers_export_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        message.success(`Exported ${filteredSubscribers.length} subscriber records to CSV`);
    };

    // Plan Tag Render Helper
    const renderPlanTag = (plan: SubscriberType["plan"]) => {
        switch (plan) {
            case "Enterprise Pro":
                return (
                    <Tag className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 w-fit">
                        <Zap className="w-3 h-3" />
                        <span>Enterprise Pro</span>
                    </Tag>
                );
            case "Agency Custom":
                return (
                    <Tag className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 w-fit">
                        <Sparkles className="w-3 h-3" />
                        <span>Agency Custom</span>
                    </Tag>
                );
            case "Creator Plus":
                return (
                    <Tag className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 w-fit">
                        <TrendingUp className="w-3 h-3" />
                        <span>Creator Plus</span>
                    </Tag>
                );
            case "Starter Free":
            default:
                return (
                    <Tag className="bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20 font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 w-fit">
                        <span>Starter Free</span>
                    </Tag>
                );
        }
    };

    // Status Tag Render Helper
    const renderStatusTag = (status: SubscriberType["status"]) => {
        switch (status) {
            case "Active":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active
                    </span>
                );
            case "Trialing":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        Trialing
                    </span>
                );
            case "Past Due":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <AlertCircle className="w-3 h-3 text-amber-500" />
                        Past Due
                    </span>
                );
            case "Paused":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        <Pause className="w-3 h-3" />
                        Paused
                    </span>
                );
            case "Cancelled":
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        <X className="w-3 h-3" />
                        Cancelled
                    </span>
                );
        }
    };

    // Table Columns Configuration
    const columns: ColumnsType<SubscriberType> = [
        {
            title: "Subscriber Details",
            dataIndex: "name",
            key: "name",
            width: 260,
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        src={record.avatar}
                        size={42}
                        className="border border-gray-200 dark:border-zinc-700 shrink-0 font-bold bg-primary/10 text-primary"
                    >
                        {record.name.charAt(0)}
                    </Avatar>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-extrabold text-foreground text-sm truncate hover:text-primary transition-colors cursor-pointer" onClick={() => handleViewDetails(record)}>
                                {record.name}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-gray-200 dark:border-zinc-800">
                                {record.id}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{record.email}</p>
                        {record.company && (
                            <p className="text-[11px] text-muted-foreground/80 flex items-center gap-1 truncate">
                                <Building2 className="w-3 h-3 shrink-0" />
                                <span>{record.company}</span>
                            </p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: "Plan Tier",
            dataIndex: "plan",
            key: "plan",
            width: 180,
            render: (plan: SubscriberType["plan"], record) => (
                <div className="space-y-1">
                    {renderPlanTag(plan)}
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <span className="uppercase text-[10px] tracking-wider font-extrabold bg-muted px-1.5 rounded">
                            {record.billingCycle}
                        </span>
                        <span>• ${record.mrr}/mo</span>
                    </div>
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 130,
            render: (status: SubscriberType["status"]) => renderStatusTag(status),
        },
        {
            title: "MRR & Lifetime",
            dataIndex: "mrr",
            key: "mrr",
            width: 160,
            render: (mrr, record) => (
                <div>
                    <span className="text-sm font-black text-foreground block">
                        ${mrr} <span className="text-[11px] font-normal text-muted-foreground">/mo</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground font-semibold">
                        LTV: ${record.totalSpent.toLocaleString()}
                    </span>
                </div>
            ),
        },
        {
            title: "Quotas Usage",
            key: "quotas",
            width: 190,
            render: (_, record) => {
                const channelPercent = Math.min(100, Math.round((record.channelsUsed / record.channelsLimit) * 100));
                const aiPercent = Math.min(100, Math.round((record.aiPostsUsed / record.aiPostsLimit) * 100));

                return (
                    <div className="space-y-1.5 w-full max-w-[170px]">
                        <div>
                            <div className="flex justify-between text-[11px] font-semibold text-muted-foreground mb-0.5">
                                <span>Channels ({record.channelsUsed}/{record.channelsLimit})</span>
                                <span>{channelPercent}%</span>
                            </div>
                            <Progress percent={channelPercent} showInfo={false} size="small" strokeColor="#7C3AED" />
                        </div>
                        <div>
                            <div className="flex justify-between text-[11px] font-semibold text-muted-foreground mb-0.5">
                                <span>AI Posts ({record.aiPostsUsed}/{record.aiPostsLimit})</span>
                                <span>{aiPercent}%</span>
                            </div>
                            <Progress percent={aiPercent} showInfo={false} size="small" strokeColor="#06B6D4" />
                        </div>
                    </div>
                );
            },
        },
        {
            title: "Next Billing",
            dataIndex: "nextBillingDate",
            key: "nextBillingDate",
            width: 160,
            render: (date, record) => (
                <div className="space-y-0.5">
                    <span className="text-xs font-extrabold text-foreground block">{date}</span>
                    <span className={`text-[11px] font-semibold flex items-center gap-1 ${record.autoRenew ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                        <RefreshCw className={`w-3 h-3 ${record.autoRenew ? "animate-spin-slow" : ""}`} />
                        {record.autoRenew ? "Auto-renew On" : "Auto-renew Off"}
                    </span>
                </div>
            ),
        },
        {
            title: "Payment Method",
            key: "payment",
            width: 150,
            render: (_, record) => (
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <div className="w-8 h-5 rounded bg-muted/80 border border-gray-200 dark:border-zinc-800 flex items-center justify-center text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                        {record.paymentMethod.brand}
                    </div>
                    {record.paymentMethod.last4 ? (
                        <span>•••• {record.paymentMethod.last4}</span>
                    ) : (
                        <span className="text-muted-foreground font-normal">Connected</span>
                    )}
                </div>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 110,
            fixed: "right",
            render: (_, record) => {
                const actionItems = [
                    {
                        key: "view",
                        label: "View Full Profile",
                        icon: <Eye className="w-4 h-4 text-primary" />,
                        onClick: () => handleViewDetails(record),
                    },
                    {
                        key: "upgrade",
                        label: "Change Subscription Plan",
                        icon: <Edit3 className="w-4 h-4 text-cyan-500" />,
                        onClick: () => handleOpenUpgrade(record),
                    },
                    {
                        key: "renew",
                        label: record.autoRenew ? "Disable Auto-Renew" : "Enable Auto-Renew",
                        icon: <RefreshCw className="w-4 h-4 text-amber-500" />,
                        onClick: () => handleToggleAutoRenew(record.id),
                    },
                    {
                        key: "pause",
                        label: record.status === "Paused" ? "Resume Subscription" : "Pause Subscription",
                        icon: record.status === "Paused" ? <Play className="w-4 h-4 text-emerald-500" /> : <Pause className="w-4 h-4 text-purple-500" />,
                        onClick: () => handleTogglePause(record.id),
                    },
                    {
                        type: "divider" as const,
                    },
                    {
                        key: "cancel",
                        label: "Cancel Subscription",
                        icon: <X className="w-4 h-4 text-rose-500" />,
                        danger: true,
                        onClick: () => handleCancelSubscription(record.id),
                    },
                ];

                return (
                    <div className="flex items-center gap-1 justify-end">
                        <Tooltip title="View Customer Details">
                            <Button
                                type="text"
                                size="small"
                                icon={<Eye className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />}
                                onClick={() => handleViewDetails(record)}
                                className="cursor-pointer hover:bg-muted/80 rounded-lg"
                            />
                        </Tooltip>

                        <Dropdown menu={{ items: actionItems }} trigger={["click"]} placement="bottomRight">
                            <Button
                                type="text"
                                size="small"
                                icon={<MoreVertical className="w-4 h-4 text-muted-foreground" />}
                                className="cursor-pointer hover:bg-muted/80 rounded-lg"
                            />
                        </Dropdown>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="p-6 space-y-8">
            {/* Header Title Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-4 dark:border-zinc-800">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                            Subscribers & Memberships
                        </h1>
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold text-xs">
                            {metrics.total} Active Accounts
                        </span>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium">
                        Monitor subscriber users, manage recurring memberships, handle upgrades, and track customer churn.
                    </p>
                </div>

                {/* Top Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <Button
                        icon={<Download className="w-4 h-4" />}
                        onClick={handleExportCSV}
                        className="cursor-pointer border-gray-200 dark:border-zinc-800 font-semibold h-10 px-4 rounded-xl text-foreground hover:bg-muted text-xs sm:text-sm"
                    >
                        Export CSV
                    </Button>

                    <Button
                        type="primary"
                        icon={<Plus className="w-4 h-4" />}
                        onClick={() => setIsAddModalOpen(true)}
                        className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground border-none font-semibold h-10 px-4 sm:px-5 rounded-xl flex items-center gap-2 text-xs sm:text-sm"
                    >
                        Add New Subscriber
                    </Button>
                </div>
            </div>

            {/* KPI Metric Summary Overview */}
            <StatsGrid
                stats={kpiStatsData}
                gridColsClass="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
            />

            <div className="card p-5">
                {/* Filter and Search Controls */}
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by subscriber name, email, company or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-10 rounded-xl border-gray-200 dark:border-zinc-800 bg-background text-xs sm:text-sm"
                                allowClear
                            />
                        </div>

                        {/* Filter Select Dropdowns */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            {/* Plan Tier Filter */}
                            <Select
                                value={selectedPlan}
                                onChange={(val) => setSelectedPlan(val)}
                                className="w-[140px] sm:w-[160px] h-10 custom-select"
                                options={[
                                    { label: "All Plans", value: "All" },
                                    { label: "Enterprise Pro", value: "Enterprise Pro" },
                                    { label: "Agency Custom", value: "Agency Custom" },
                                    { label: "Creator Plus", value: "Creator Plus" },
                                    { label: "Starter Free", value: "Starter Free" },
                                ]}
                            />

                            {/* Status Filter */}
                            <Select
                                value={selectedStatus}
                                onChange={(val) => setSelectedStatus(val)}
                                className="w-[130px] sm:w-[150px] h-10 custom-select"
                                options={[
                                    { label: "All Statuses", value: "All" },
                                    { label: "Active", value: "Active" },
                                    { label: "Trialing", value: "Trialing" },
                                    { label: "Past Due", value: "Past Due" },
                                    { label: "Paused", value: "Paused" },
                                    { label: "Cancelled", value: "Cancelled" },
                                ]}
                            />

                            {/* Billing Cycle Filter */}
                            <Select
                                value={selectedCycle}
                                onChange={(val) => setSelectedCycle(val)}
                                className="w-[130px] sm:w-[140px] h-10 custom-select"
                                options={[
                                    { label: "All Cycles", value: "All" },
                                    { label: "Monthly", value: "Monthly" },
                                    { label: "Annual", value: "Annual" },
                                ]}
                            />

                            {/* Reset Filters */}
                            {(searchQuery || selectedPlan !== "All" || selectedStatus !== "All" || selectedCycle !== "All") && (
                                <Button
                                    onClick={handleResetFilters}
                                    icon={<X className="w-3.5 h-3.5" />}
                                    className="cursor-pointer border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-semibold h-10 text-muted-foreground hover:text-foreground"
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Filter summary status bar */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-gray-100 dark:border-zinc-800">
                        <span>
                            Showing <strong className="text-foreground">{filteredSubscribers.length}</strong> of{" "}
                            <strong className="text-foreground">{subscribers.length}</strong> subscribers
                        </span>

                        <span className="hidden sm:inline-block font-medium">
                            Click subscriber name or actions menu to manage billing & limits
                        </span>
                    </div>
                </div>

                {/* Main Subscribers Ant Design Table */}
                <div className="overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={filteredSubscribers}
                        rowKey="id"
                        pagination={{
                            pageSize: 8,
                            showSizeChanger: true,
                            pageSizeOptions: ["8", "15", "30", "50"],
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} subscribers`,
                            className: "px-4 pt-4 text-xs font-medium",
                        }}
                        scroll={{ x: 1200 }}
                        className="custom-table"
                    />
                </div>
            </div>

            {/* Subscriber Detail Drawer */}
            <Drawer
                title={
                    selectedSubscriber ? (
                        <div className="flex items-center gap-3">
                            <Avatar src={selectedSubscriber.avatar} size={40} className="bg-primary/10 text-primary font-bold">
                                {selectedSubscriber.name.charAt(0)}
                            </Avatar>
                            <div>
                                <h3 className="text-base font-extrabold text-foreground m-0">{selectedSubscriber.name}</h3>
                                <p className="text-xs text-muted-foreground m-0">{selectedSubscriber.email}</p>
                            </div>
                        </div>
                    ) : (
                        "Subscriber Profile"
                    )
                }
                placement="right"
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
                size={540}
                className="custom-drawer"
            >
                {selectedSubscriber && (
                    <div className="space-y-6 text-foreground">
                        {/* Quick Action Top Controls */}
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-gray-200 dark:border-zinc-800">
                            <div>
                                <p className="text-[11px] font-extrabold uppercase text-muted-foreground">Current Plan</p>
                                <div className="mt-1 flex items-center gap-2">
                                    {renderPlanTag(selectedSubscriber.plan)}
                                    {renderStatusTag(selectedSubscriber.status)}
                                </div>
                            </div>
                            <Button
                                type="primary"
                                size="small"
                                icon={<Edit3 className="w-3.5 h-3.5" />}
                                onClick={() => {
                                    setIsDrawerOpen(false);
                                    handleOpenUpgrade(selectedSubscriber);
                                }}
                                className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground border-none rounded-xl text-xs font-semibold px-3"
                            >
                                Upgrade Tier
                            </Button>
                        </div>

                        {/* Customer Information Grid */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-extrabold text-foreground flex items-center gap-2 border-b border-gray-200 dark:border-zinc-800 pb-2">
                                <Building2 className="w-4 h-4 text-primary" />
                                Customer Overview
                            </h4>

                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div className="p-3 rounded-xl bg-background border border-gray-200 dark:border-zinc-800">
                                    <span className="text-muted-foreground font-semibold block">Subscriber ID:</span>
                                    <span className="font-extrabold text-foreground">{selectedSubscriber.id}</span>
                                </div>

                                <div className="p-3 rounded-xl bg-background border border-gray-200 dark:border-zinc-800">
                                    <span className="text-muted-foreground font-semibold block">Company Name:</span>
                                    <span className="font-extrabold text-foreground">{selectedSubscriber.company || "N/A"}</span>
                                </div>

                                <div className="p-3 rounded-xl bg-background border border-gray-200 dark:border-zinc-800">
                                    <span className="text-muted-foreground font-semibold block">Country:</span>
                                    <span className="font-extrabold text-foreground">{selectedSubscriber.country || "United States"}</span>
                                </div>

                                <div className="p-3 rounded-xl bg-background border border-gray-200 dark:border-zinc-800">
                                    <span className="text-muted-foreground font-semibold block">Member Since:</span>
                                    <span className="font-extrabold text-foreground">{selectedSubscriber.startDate}</span>
                                </div>
                            </div>
                        </div>

                        {/* Financial & Subscription Telemetry */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-extrabold text-foreground flex items-center gap-2 border-b border-gray-200 dark:border-zinc-800 pb-2">
                                <DollarSign className="w-4 h-4 text-emerald-500" />
                                Billing & MRR Metrics
                            </h4>

                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                                    <span className="text-[11px] font-bold text-muted-foreground uppercase block">MRR</span>
                                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">${selectedSubscriber.mrr}</span>
                                </div>

                                <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                                    <span className="text-[11px] font-bold text-muted-foreground uppercase block">LTV Spent</span>
                                    <span className="text-lg font-black text-primary">${selectedSubscriber.totalSpent.toLocaleString()}</span>
                                </div>

                                <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                                    <span className="text-[11px] font-bold text-muted-foreground uppercase block">Cycle</span>
                                    <span className="text-lg font-black text-cyan-600 dark:text-cyan-400">{selectedSubscriber.billingCycle}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quotas & Capacity Usage */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-extrabold text-foreground flex items-center gap-2 border-b border-gray-200 dark:border-zinc-800 pb-2">
                                <Zap className="w-4 h-4 text-cyan-500" />
                                Resource Quotas & Usage
                            </h4>

                            <div className="space-y-3 bg-muted/30 p-4 rounded-2xl border border-gray-200 dark:border-zinc-800">
                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                        <span>Connected Social Channels</span>
                                        <span>{selectedSubscriber.channelsUsed} / {selectedSubscriber.channelsLimit} Limit</span>
                                    </div>
                                    <Progress
                                        percent={Math.round((selectedSubscriber.channelsUsed / selectedSubscriber.channelsLimit) * 100)}
                                        strokeColor="#7C3AED"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                        <span>AI Draft Posts Monthly Quota</span>
                                        <span>{selectedSubscriber.aiPostsUsed.toLocaleString()} / {selectedSubscriber.aiPostsLimit.toLocaleString()}</span>
                                    </div>
                                    <Progress
                                        percent={Math.round((selectedSubscriber.aiPostsUsed / selectedSubscriber.aiPostsLimit) * 100)}
                                        strokeColor="#06B6D4"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Billing Invoices History */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-extrabold text-foreground flex items-center gap-2 border-b border-gray-200 dark:border-zinc-800 pb-2">
                                <FileText className="w-4 h-4 text-primary" />
                                Payment & Invoice History
                            </h4>

                            <div className="space-y-2">
                                {selectedSubscriber.invoices.length > 0 ? (
                                    selectedSubscriber.invoices.map((inv) => (
                                        <div
                                            key={inv.id}
                                            className="flex items-center justify-between p-3 rounded-xl bg-background border border-gray-200 dark:border-zinc-800 text-xs"
                                        >
                                            <div>
                                                <span className="font-extrabold text-foreground block">{inv.id}</span>
                                                <span className="text-muted-foreground text-[11px]">{inv.date}</span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className="font-black text-foreground">${inv.amount}</span>
                                                <Tag color={inv.status === "Paid" ? "success" : inv.status === "Failed" ? "error" : "warning"}>
                                                    {inv.status}
                                                </Tag>
                                                <button
                                                    onClick={() => message.info(`Downloading PDF receipt for ${inv.id}...`)}
                                                    className="cursor-pointer p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-muted-foreground italic text-center py-2">
                                        No billing receipts generated yet (Trial Account).
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Drawer>

            {/* Modal: Add New Subscriber */}
            <Modal
                title={
                    <div className="flex items-center gap-2 text-base sm:text-lg font-bold text-foreground pb-2 border-b border-gray-200 dark:border-zinc-800">
                        <Plus className="w-5 h-5 text-primary" />
                        <span>Add New Subscriber Account</span>
                    </div>
                }
                open={isAddModalOpen}
                onCancel={() => setIsAddModalOpen(false)}
                footer={null}
                width="92%"
                style={{ maxWidth: 580 }}
                centered
            >
                <Form form={addForm} layout="vertical" onFinish={handleAddSubscriberSubmit} className="mt-4 space-y-4">
                    <Form.Item
                        name="name"
                        label={<span className="font-semibold text-foreground text-xs sm:text-sm">Full Name</span>}
                        rules={[{ required: true, message: "Subscriber name required" }]}
                    >
                        <Input placeholder="e.g. Sarah Jenkins" className="rounded-xl h-10 text-xs sm:text-sm" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label={<span className="font-semibold text-foreground text-xs sm:text-sm">Email Address</span>}
                        rules={[{ required: true, type: "email", message: "Valid email required" }]}
                    >
                        <Input placeholder="sarah@agency.com" className="rounded-xl h-10 text-xs sm:text-sm" />
                    </Form.Item>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <Form.Item
                            name="company"
                            label={<span className="font-semibold text-foreground text-xs sm:text-sm">Company Name</span>}
                        >
                            <Input placeholder="e.g. Jenkins Studio" className="rounded-xl h-10 text-xs sm:text-sm" />
                        </Form.Item>

                        <Form.Item
                            name="country"
                            label={<span className="font-semibold text-foreground text-xs sm:text-sm">Country</span>}
                            initialValue="United States"
                        >
                            <Input placeholder="e.g. United States" className="rounded-xl h-10 text-xs sm:text-sm" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <Form.Item
                            name="plan"
                            label={<span className="font-semibold text-foreground text-xs sm:text-sm">Subscription Plan Tier</span>}
                            initialValue="Creator Plus"
                            rules={[{ required: true }]}
                        >
                            <Select className="h-10 rounded-xl text-xs sm:text-sm">
                                <Select.Option value="Starter Free">Starter Free ($0/mo)</Select.Option>
                                <Select.Option value="Creator Plus">Creator Plus ($29/mo)</Select.Option>
                                <Select.Option value="Enterprise Pro">Enterprise Pro ($199/mo)</Select.Option>
                                <Select.Option value="Agency Custom">Agency Custom ($499/mo)</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="billingCycle"
                            label={<span className="font-semibold text-foreground text-xs sm:text-sm">Billing Cycle</span>}
                            initialValue="Monthly"
                            rules={[{ required: true }]}
                        >
                            <Select className="h-10 rounded-xl text-xs sm:text-sm">
                                <Select.Option value="Monthly">Monthly</Select.Option>
                                <Select.Option value="Annual">Annual (Save 20%)</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
                        <Button onClick={() => setIsAddModalOpen(false)} className="cursor-pointer rounded-xl text-xs sm:text-sm">
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground border-none rounded-xl px-6 font-semibold text-xs sm:text-sm"
                        >
                            Create Account & Activate
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Modal: Change / Upgrade Plan */}
            <Modal
                title={
                    <div className="flex items-center gap-2 text-base sm:text-lg font-bold text-foreground pb-2 border-b border-gray-200 dark:border-zinc-800">
                        <Edit3 className="w-5 h-5 text-primary" />
                        <span>Upgrade / Change Subscription Tier</span>
                    </div>
                }
                open={isUpgradeModalOpen}
                onCancel={() => setIsUpgradeModalOpen(false)}
                footer={null}
                width="92%"
                style={{ maxWidth: 500 }}
                centered
            >
                {subscriberToUpgrade && (
                    <Form form={upgradeForm} layout="vertical" onFinish={handleUpgradeSubmit} className="mt-4 space-y-4">
                        <div className="p-3 rounded-xl bg-muted/40 border border-gray-200 dark:border-zinc-800 text-xs space-y-1">
                            <span className="text-muted-foreground font-semibold">Subscriber:</span>
                            <span className="font-black text-foreground block">{subscriberToUpgrade.name} ({subscriberToUpgrade.email})</span>
                        </div>

                        <Form.Item
                            name="plan"
                            label={<span className="font-semibold text-foreground text-xs sm:text-sm">New Target Plan Tier</span>}
                            rules={[{ required: true }]}
                        >
                            <Select className="h-10 rounded-xl">
                                <Select.Option value="Starter Free">Starter Free ($0/mo)</Select.Option>
                                <Select.Option value="Creator Plus">Creator Plus ($29/mo)</Select.Option>
                                <Select.Option value="Enterprise Pro">Enterprise Pro ($199/mo)</Select.Option>
                                <Select.Option value="Agency Custom">Agency Custom ($499/mo)</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="billingCycle"
                            label={<span className="font-semibold text-foreground text-xs sm:text-sm">Billing Cycle</span>}
                            rules={[{ required: true }]}
                        >
                            <Select className="h-10 rounded-xl">
                                <Select.Option value="Monthly">Monthly Billing</Select.Option>
                                <Select.Option value="Annual">Annual Billing</Select.Option>
                            </Select>
                        </Form.Item>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
                            <Button onClick={() => setIsUpgradeModalOpen(false)} className="cursor-pointer rounded-xl text-xs sm:text-sm">
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground border-none rounded-xl px-6 font-semibold text-xs sm:text-sm"
                            >
                                Apply Subscription Update
                            </Button>
                        </div>
                    </Form>
                )}
            </Modal>
        </div>
    );
}
