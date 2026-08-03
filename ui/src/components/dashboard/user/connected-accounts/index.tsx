"use client";

import { useState } from "react";
import { Modal, Switch, Input, App, Popconfirm, Tooltip, Tag } from "antd";
import {
    Share2,
    CheckCircle2,
    XCircle,
    Plus,
    RefreshCw,
    Settings,
    ShieldCheck,
    Search,
    Zap,
    Users,
    Lock,
    Check,
} from "lucide-react";
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaPinterest } from "react-icons/fa6";

export interface SocialAccount {
    id: string;
    name: string;
    handle: string;
    connected: boolean;
    icon: any;
    color: string;
    badgeColor: string;
    date: string;
    followers: string;
    postsCount: number;
    autoPublish: boolean;
    autoSyncAnalytics: boolean;
    notifyErrors: boolean;
    tokenExpiry: string;
}

export default function ConnectedAccountsComponent() {
    const { message } = App.useApp();
    const [accounts, setAccounts] = useState<SocialAccount[]>([
        {
            id: "twitter",
            name: "Twitter / X",
            handle: "@sushilhemrom",
            connected: true,
            icon: FaTwitter,
            color: "text-sky-500 bg-sky-50 border-sky-100",
            badgeColor: "border-sky-200 text-sky-600 bg-sky-50",
            date: "Connected Jun 2026",
            followers: "18.4K",
            postsCount: 142,
            autoPublish: true,
            autoSyncAnalytics: true,
            notifyErrors: true,
            tokenExpiry: "89 days remaining"
        },
        {
            id: "linkedin",
            name: "LinkedIn Profile",
            handle: "Sushil Hemrom",
            connected: true,
            icon: FaLinkedin,
            color: "text-blue-600 bg-blue-50 border-blue-100",
            badgeColor: "border-blue-200 text-blue-600 bg-blue-50",
            date: "Connected May 2026",
            followers: "24.1K",
            postsCount: 98,
            autoPublish: true,
            autoSyncAnalytics: true,
            notifyErrors: false,
            tokenExpiry: "120 days remaining"
        },
        {
            id: "instagram",
            name: "Instagram Business",
            handle: "@creatorstack.ui",
            connected: true,
            icon: FaInstagram,
            color: "text-pink-600 bg-pink-50 border-pink-100",
            badgeColor: "border-pink-200 text-pink-600 bg-pink-50",
            date: "Connected Jul 2026",
            followers: "42.0K",
            postsCount: 215,
            autoPublish: true,
            autoSyncAnalytics: true,
            notifyErrors: true,
            tokenExpiry: "60 days remaining"
        },
        {
            id: "facebook",
            name: "Facebook Page",
            handle: "Creator Stack Official",
            connected: false,
            icon: FaFacebook,
            color: "text-blue-500 bg-blue-50 border-blue-100",
            badgeColor: "border-blue-200 text-blue-600 bg-blue-50",
            date: "Not connected",
            followers: "0",
            postsCount: 0,
            autoPublish: false,
            autoSyncAnalytics: false,
            notifyErrors: false,
            tokenExpiry: "Expired"
        },
        {
            id: "youtube",
            name: "YouTube Channel",
            handle: "Creator Stack Tech",
            connected: false,
            icon: FaYoutube,
            color: "text-red-600 bg-red-50 border-red-100",
            badgeColor: "border-red-200 text-red-600 bg-red-50",
            date: "Not connected",
            followers: "0",
            postsCount: 0,
            autoPublish: false,
            autoSyncAnalytics: false,
            notifyErrors: false,
            tokenExpiry: "Expired"
        },
        {
            id: "tiktok",
            name: "TikTok Creator",
            handle: "@creatorstack_tok",
            connected: false,
            icon: FaTiktok,
            color: "text-slate-800 bg-slate-100 border-slate-200",
            badgeColor: "border-slate-200 text-slate-700 bg-slate-50",
            date: "Not connected",
            followers: "0",
            postsCount: 0,
            autoPublish: false,
            autoSyncAnalytics: false,
            notifyErrors: false,
            tokenExpiry: "Expired"
        }
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterTab, setFilterTab] = useState<"all" | "connected" | "disconnected">("all");

    // Modal state for Connect Account
    const [connectModalAccount, setConnectModalAccount] = useState<SocialAccount | null>(null);
    const [inputHandle, setInputHandle] = useState("");
    const [isConnecting, setIsConnecting] = useState(false);

    // Modal state for Manage Account
    const [manageModalAccount, setManageModalAccount] = useState<SocialAccount | null>(null);
    const [isRefreshingToken, setIsRefreshingToken] = useState(false);

    // Open Connect Modal
    const handleOpenConnect = (acc: SocialAccount) => {
        setConnectModalAccount(acc);
        setInputHandle(acc.handle !== "Not connected" ? acc.handle : "");
    };

    // Confirm Connect Account OAuth process
    const handleConfirmConnect = () => {
        if (!connectModalAccount) return;
        setIsConnecting(true);

        setTimeout(() => {
            setAccounts((prev) =>
                prev.map((item) =>
                    item.id === connectModalAccount.id
                        ? {
                            ...item,
                            connected: true,
                            handle: inputHandle || `@${item.id}_user`,
                            date: "Just connected",
                            followers: "1.2K",
                            postsCount: 1,
                            autoPublish: true,
                            autoSyncAnalytics: true,
                            tokenExpiry: "90 days remaining"
                        }
                        : item
                )
            );
            setIsConnecting(false);
            message.success(`${connectModalAccount.name} connected successfully!`);
            setConnectModalAccount(null);
        }, 1200);
    };

    // Toggle setting in Manage modal
    const handleToggleSetting = (field: "autoPublish" | "autoSyncAnalytics" | "notifyErrors", val: boolean) => {
        if (!manageModalAccount) return;
        const updated = { ...manageModalAccount, [field]: val };
        setManageModalAccount(updated);
        setAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        message.success("Settings updated");
    };

    // Refresh OAuth Token
    const handleRefreshToken = () => {
        setIsRefreshingToken(true);
        setTimeout(() => {
            setIsRefreshingToken(false);
            if (manageModalAccount) {
                const updated = { ...manageModalAccount, tokenExpiry: "90 days remaining" };
                setManageModalAccount(updated);
                setAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
            }
            message.success("OAuth Token refreshed & verified!");
        }, 1000);
    };

    // Disconnect Account
    const handleDisconnect = (id: string, name: string) => {
        setAccounts((prev) =>
            prev.map((acc) =>
                acc.id === id
                    ? {
                        ...acc,
                        connected: false,
                        date: "Not connected",
                        followers: "0",
                        postsCount: 0,
                        autoPublish: false,
                        autoSyncAnalytics: false,
                        tokenExpiry: "Expired"
                    }
                    : acc
            )
        );
        if (manageModalAccount?.id === id) {
            setManageModalAccount(null);
        }
        message.info(`${name} has been disconnected`);
    };

    // Filtered list
    const filteredAccounts = accounts.filter((acc) => {
        const matchesSearch =
            acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            acc.handle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab =
            filterTab === "all" ||
            (filterTab === "connected" && acc.connected) ||
            (filterTab === "disconnected" && !acc.connected);
        return matchesSearch && matchesTab;
    });

    const activeCount = accounts.filter((a) => a.connected).length;

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Share2 className="w-7 h-7 text-primary" /> Connected Social Accounts
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Manage platform integrations, auto-sync analytics, and cross-posting tokens
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            const disconnected = accounts.find((a) => !a.connected);
                            if (disconnected) handleOpenConnect(disconnected);
                            else message.info("All available channels are already connected!");
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition shadow-md cursor-pointer"
                    >
                        <Plus className="w-4 h-4" /> Add Integration
                    </button>
                </div>
            </div>

            {/* Quick Metrics Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Connected Hubs</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">
                            {activeCount} <span className="text-sm font-normal text-slate-400">/ {accounts.length}</span>
                        </h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                        <Share2 className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sync Health</p>
                        <h3 className="text-2xl font-bold text-emerald-600 mt-1">100%</h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Audience</p>
                        <h3 className="text-2xl font-bold text-blue-600 mt-1">84.5K</h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <Users className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Auto Cross-Post</p>
                        <h3 className="text-2xl font-bold text-purple-600 mt-1">Active</h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                        <Zap className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Search */}
                <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search integration or handle..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary"
                    />
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                    {(
                        [
                            { id: "all", label: "All Platforms" },
                            { id: "connected", label: `Connected (${activeCount})` },
                            { id: "disconnected", label: `Disconnected (${accounts.length - activeCount})` },
                        ] as const
                    ).map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setFilterTab(t.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${filterTab === t.id
                                ? "bg-primary text-white shadow-xs"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Accounts Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredAccounts.map((acc) => {
                    const Icon = acc.icon;
                    return (
                        <div
                            key={acc.id}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-5 flex flex-col justify-between hover:shadow-md transition"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className={`p-3.5 rounded-2xl border ${acc.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span
                                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${acc.connected
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                            : "bg-slate-100 text-slate-500 border-slate-200"
                                            }`}
                                    >
                                        {acc.connected ? (
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        ) : (
                                            <XCircle className="w-3.5 h-3.5 text-slate-400" />
                                        )}
                                        {acc.connected ? "Active Sync" : "Disconnected"}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                        {acc.name}
                                    </h3>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">{acc.handle}</p>
                                </div>

                                {acc.connected && (
                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                                            <span className="text-[10px] text-slate-400 block">Followers</span>
                                            <span className="font-bold text-slate-800 mt-0.5 block">{acc.followers}</span>
                                        </div>
                                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                                            <span className="text-[10px] text-slate-400 block">Synced Posts</span>
                                            <span className="font-bold text-slate-800 mt-0.5 block">{acc.postsCount}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Card Actions Footer */}
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                                <span className="text-[11px] text-slate-400 font-medium">{acc.date}</span>

                                <div className="flex items-center gap-2">
                                    {acc.connected ? (
                                        <>
                                            <button
                                                onClick={() => setManageModalAccount(acc)}
                                                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1 cursor-pointer"
                                            >
                                                <Settings className="w-3.5 h-3.5 text-slate-500" /> Manage
                                            </button>

                                            <Popconfirm
                                                title="Disconnect integration?"
                                                description={`Are you sure you want to disconnect ${acc.name}?`}
                                                onConfirm={() => handleDisconnect(acc.id, acc.name)}
                                                okText="Disconnect"
                                                cancelText="Cancel"
                                                okButtonProps={{ danger: true }}
                                            >
                                                <button className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer">
                                                    Disconnect
                                                </button>
                                            </Popconfirm>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleOpenConnect(acc)}
                                            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary/90 shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <Plus className="w-3.5 h-3.5" /> Connect Account
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ============================================================ */}
            {/* 1. CONNECT ACCOUNT MODAL (OAUTH SIMULATION) */}
            {/* ============================================================ */}
            <Modal
                open={!!connectModalAccount}
                onCancel={() => setConnectModalAccount(null)}
                footer={null}
                centered
                className="custom-connect-modal"
            >
                {connectModalAccount && (
                    <div className="p-4 space-y-6 text-slate-800">
                        <div className="text-center space-y-3 border-b border-slate-100 pb-4">
                            <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center border ${connectModalAccount.color} shadow-sm`}>
                                <connectModalAccount.icon className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Connect {connectModalAccount.name}</h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Authorize Creator Stack to schedule posts and sync analytics
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">Account Username / Handle</label>
                                <Input
                                    placeholder="@yourhandle or Channel URL"
                                    value={inputHandle}
                                    onChange={(e) => setInputHandle(e.target.value)}
                                    className="h-10 rounded-xl"
                                />
                            </div>

                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                                <span className="font-bold text-slate-700 block">Requested OAuth Permissions:</span>
                                <div className="space-y-1.5 text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Publish social posts & media automatically</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Fetch post engagement, reach, and performance stats</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Sync comments & audience reactions in real-time</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                            <button
                                onClick={() => setConnectModalAccount(null)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmConnect}
                                disabled={isConnecting}
                                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {isConnecting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                                {isConnecting ? "Authenticating..." : "Authorize Integration"}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* ============================================================ */}
            {/* 2. MANAGE ACCOUNT MODAL */}
            {/* ============================================================ */}
            <Modal
                open={!!manageModalAccount}
                onCancel={() => setManageModalAccount(null)}
                footer={null}
                centered
                width={540}
            >
                {manageModalAccount && (
                    <div className="p-4 space-y-6 text-slate-800 font-sans">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-2xl border ${manageModalAccount.color}`}>
                                    <manageModalAccount.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-800">{manageModalAccount.name}</h3>
                                    <p className="text-xs text-slate-400 font-medium">{manageModalAccount.handle}</p>
                                </div>
                            </div>
                            <Tag color="green" className="rounded-full px-3 py-0.5 text-xs font-semibold">
                                Connected
                            </Tag>
                        </div>

                        {/* Integration Settings */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Integration Preferences</h4>

                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="font-bold text-slate-800 block">Auto Cross-Publishing</span>
                                        <span className="text-slate-500 text-[11px]">Automatically post scheduled content to this channel</span>
                                    </div>
                                    <Switch
                                        checked={manageModalAccount.autoPublish}
                                        onChange={(val) => handleToggleSetting("autoPublish", val)}
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
                                    <div>
                                        <span className="font-bold text-slate-800 block">Auto-Sync Analytics</span>
                                        <span className="text-slate-500 text-[11px]">Fetch impressions and engagement stats hourly</span>
                                    </div>
                                    <Switch
                                        checked={manageModalAccount.autoSyncAnalytics}
                                        onChange={(val) => handleToggleSetting("autoSyncAnalytics", val)}
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
                                    <div>
                                        <span className="font-bold text-slate-800 block">Publish Error Notifications</span>
                                        <span className="text-slate-500 text-[11px]">Get alerted if token expires or post fails</span>
                                    </div>
                                    <Switch
                                        checked={manageModalAccount.notifyErrors}
                                        onChange={(val) => handleToggleSetting("notifyErrors", val)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* OAuth Token & Security Status */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">OAuth Security & Access Token</h4>

                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
                                <div>
                                    <span className="font-bold text-emerald-600 block flex items-center gap-1.5">
                                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> Active OAuth Token
                                    </span>
                                    <span className="text-slate-500 text-[11px] mt-0.5 block">
                                        Expiry: {manageModalAccount.tokenExpiry}
                                    </span>
                                </div>

                                <button
                                    onClick={handleRefreshToken}
                                    disabled={isRefreshingToken}
                                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshingToken ? "animate-spin" : ""}`} />
                                    {isRefreshingToken ? "Refreshing..." : "Refresh Token"}
                                </button>
                            </div>
                        </div>

                        {/* Revoke / Disconnect */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <button
                                onClick={() => setManageModalAccount(null)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                            >
                                Done
                            </button>

                            <Popconfirm
                                title="Disconnect integration?"
                                description={`Are you sure you want to disconnect ${manageModalAccount.name}?`}
                                onConfirm={() => handleDisconnect(manageModalAccount.id, manageModalAccount.name)}
                                okText="Disconnect"
                                cancelText="Cancel"
                                okButtonProps={{ danger: true }}
                            >
                                <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer">
                                    Revoke Integration
                                </button>
                            </Popconfirm>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
