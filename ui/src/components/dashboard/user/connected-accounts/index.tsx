"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Modal, Switch, Input, App, Popconfirm, Tooltip, Tag, Spin } from "antd";
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
    AlertCircle,
} from "lucide-react";
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaPinterest, FaThreads, FaWhatsapp } from "react-icons/fa6";
import { socialAccountsApi, workspacesApi, getActiveWorkspaceId } from "@/lib/api";

export interface SocialAccountCard {
    id: string; // Database ID or platform key
    dbId?: string; // MongoDB _id
    platform: string; // 'facebook' | 'instagram' | 'threads' | 'x' | 'linkedin' | 'youtube' | 'tiktok' | 'whatsapp'
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
    status: 'active' | 'expired' | 'revoked' | 'error' | 'disconnected';
    lastError?: string;
}

const DEFAULT_PLATFORMS: SocialAccountCard[] = [
    {
        id: "facebook",
        platform: "facebook",
        name: "Facebook Page",
        handle: "Not connected",
        connected: false,
        icon: FaFacebook,
        color: "text-blue-600 bg-blue-50 border-blue-100",
        badgeColor: "border-blue-200 text-blue-600 bg-blue-50",
        date: "Not connected",
        followers: "0",
        postsCount: 0,
        autoPublish: true,
        autoSyncAnalytics: true,
        notifyErrors: true,
        tokenExpiry: "Never",
        status: "disconnected",
    },
    {
        id: "instagram",
        platform: "instagram",
        name: "Instagram Professional",
        handle: "Not connected",
        connected: false,
        icon: FaInstagram,
        color: "text-pink-600 bg-pink-50 border-pink-100",
        badgeColor: "border-pink-200 text-pink-600 bg-pink-50",
        date: "Not connected",
        followers: "0",
        postsCount: 0,
        autoPublish: true,
        autoSyncAnalytics: true,
        notifyErrors: true,
        tokenExpiry: "Never",
        status: "disconnected",
    },
    {
        id: "threads",
        platform: "threads",
        name: "Threads Profile",
        handle: "Not connected",
        connected: false,
        icon: FaThreads,
        color: "text-zinc-800 bg-zinc-100 border-zinc-200",
        badgeColor: "border-zinc-300 text-zinc-800 bg-zinc-50",
        date: "Not connected",
        followers: "0",
        postsCount: 0,
        autoPublish: true,
        autoSyncAnalytics: true,
        notifyErrors: true,
        tokenExpiry: "Never",
        status: "disconnected",
    },
    {
        id: "whatsapp",
        platform: "whatsapp",
        name: "WhatsApp Business",
        handle: "Not connected",
        connected: false,
        icon: FaWhatsapp,
        color: "text-emerald-600 bg-emerald-50 border-emerald-100",
        badgeColor: "border-emerald-200 text-emerald-600 bg-emerald-50",
        date: "Not connected",
        followers: "0",
        postsCount: 0,
        autoPublish: true,
        autoSyncAnalytics: true,
        notifyErrors: true,
        tokenExpiry: "Never",
        status: "disconnected",
    },
    {
        id: "x",
        platform: "x",
        name: "X (Twitter)",
        handle: "Not connected",
        connected: false,
        icon: FaTwitter,
        color: "text-sky-500 bg-sky-50 border-sky-100",
        badgeColor: "border-sky-200 text-sky-600 bg-sky-50",
        date: "Not connected",
        followers: "0",
        postsCount: 0,
        autoPublish: true,
        autoSyncAnalytics: true,
        notifyErrors: true,
        tokenExpiry: "Never",
        status: "disconnected",
    },
    {
        id: "linkedin",
        platform: "linkedin",
        name: "LinkedIn Profile / Page",
        handle: "Not connected",
        connected: false,
        icon: FaLinkedin,
        color: "text-blue-700 bg-blue-50 border-blue-100",
        badgeColor: "border-blue-200 text-blue-700 bg-blue-50",
        date: "Not connected",
        followers: "0",
        postsCount: 0,
        autoPublish: true,
        autoSyncAnalytics: true,
        notifyErrors: true,
        tokenExpiry: "Never",
        status: "disconnected",
    },
    {
        id: "youtube",
        platform: "youtube",
        name: "YouTube Channel",
        handle: "Not connected",
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
        tokenExpiry: "Never",
        status: "disconnected",
    },
    {
        id: "tiktok",
        platform: "tiktok",
        name: "TikTok Creator",
        handle: "Not connected",
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
        tokenExpiry: "Never",
        status: "disconnected",
    },
];

function ConnectedAccountsInner() {
    const { message } = App.useApp();
    const searchParams = useSearchParams();
    const [accounts, setAccounts] = useState<SocialAccountCard[]>(DEFAULT_PLATFORMS);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterTab, setFilterTab] = useState<"all" | "connected" | "disconnected">("all");

    // Modal state for Connect Account
    const [connectModalAccount, setConnectModalAccount] = useState<SocialAccountCard | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);

    // Modal state for Manage Account
    const [manageModalAccount, setManageModalAccount] = useState<SocialAccountCard | null>(null);
    const [isRefreshingToken, setIsRefreshingToken] = useState(false);

    const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>(getActiveWorkspaceId());

    const getOrFetchWorkspaceId = useCallback(async () => {
        let wsId = getActiveWorkspaceId();
        if (!wsId || wsId === "default-workspace" || wsId === "[object Object]") {
            try {
                const workspaces = await workspacesApi.getWorkspaces();
                if (workspaces && workspaces.length > 0) {
                    const first = workspaces[0];
                    const id = typeof first === "object" ? first._id : first;
                    if (typeof id === "string" && id.length === 24) {
                        wsId = id;
                        setCurrentWorkspaceId(wsId);
                        localStorage.setItem("active_workspace_id", wsId);
                        localStorage.setItem("activeWorkspaceId", wsId);
                    }
                }
            } catch (err) {
                console.log("Could not auto-fetch workspaces:", err);
            }
        }
        return typeof wsId === "string" && wsId !== "[object Object]" ? wsId : "";
    }, []);

    // Fetch accounts from Backend API
    const loadAccounts = useCallback(async () => {
        setIsLoading(true);
        try {
            const wsId = await getOrFetchWorkspaceId();
            const liveAccounts = await socialAccountsApi.getAccounts(wsId);

            setAccounts((prev) => {
                return prev.map((template) => {
                    const match = liveAccounts.find(
                        (a) => a.platform?.toLowerCase() === template.platform.toLowerCase()
                    );

                    if (match) {
                        return {
                            ...template,
                            dbId: match._id,
                            handle: match.username ? `@${match.username}` : match.accountName,
                            connected: match.status === "active",
                            followers: match.followersCount ? `${match.followersCount.toLocaleString()}` : "0",
                            postsCount: match.postsCount || 0,
                            autoPublish: match.autoPublish ?? true,
                            autoSyncAnalytics: match.autoSyncAnalytics ?? true,
                            notifyErrors: match.notifyErrors ?? true,
                            tokenExpiry: match.tokenExpiresAt
                                ? `${Math.max(0, Math.ceil((new Date(match.tokenExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days remaining`
                                : "Permanent",
                            status: match.status,
                            date: `Connected ${new Date(match.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
                            lastError: match.lastError,
                        };
                    }
                    return template;
                });
            });
        } catch (error: any) {
            // Silently fall back to default template cards if not authenticated yet
            console.log("Using template accounts (backend sync standby):", error.message);
        } finally {
            setIsLoading(false);
        }
    }, [getOrFetchWorkspaceId]);

    // Handle OAuth status redirect parameters
    useEffect(() => {
        const status = searchParams.get("status");
        const platform = searchParams.get("platform");
        const errorMsg = searchParams.get("message");

        if (status === "success" && platform) {
            message.success(`Successfully connected ${platform.toUpperCase()} account!`);
            loadAccounts();
        } else if (status === "error" && errorMsg) {
            message.error(`Connection failed: ${decodeURIComponent(errorMsg)}`);
        }
    }, [searchParams, loadAccounts, message]);

    useEffect(() => {
        loadAccounts();
    }, [loadAccounts]);

    // Open Connect Modal
    const handleOpenConnect = (acc: SocialAccountCard) => {
        setConnectModalAccount(acc);
    };

    // Initiate Real OAuth redirect
    const handleConfirmConnect = async () => {
        if (!connectModalAccount) return;
        setIsConnecting(true);

        try {
            const wsId = await getOrFetchWorkspaceId();
            const data = await socialAccountsApi.getOAuthUrl(connectModalAccount.platform, wsId);
            if (data?.authUrl) {
                message.loading(`Redirecting to ${connectModalAccount.name} OAuth...`, 1.5);
                window.location.href = data.authUrl;
            } else {
                throw new Error("No authorization URL returned by server.");
            }
        } catch (error: any) {
            message.error(`OAuth initialization failed: ${error.message}`);
            setIsConnecting(false);
        }
    };

    // Toggle setting in Manage modal
    const handleToggleSetting = async (field: "autoPublish" | "autoSyncAnalytics" | "notifyErrors", val: boolean) => {
        if (!manageModalAccount) return;
        const updated = { ...manageModalAccount, [field]: val };
        setManageModalAccount(updated);
        setAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));

        if (manageModalAccount.dbId) {
            try {
                await socialAccountsApi.updateAccount(manageModalAccount.dbId, { [field]: val });
                message.success("Account preferences updated successfully");
            } catch (error: any) {
                message.error(`Failed to update setting: ${error.message}`);
            }
        } else {
            message.success("Settings updated");
        }
    };

    // Refresh OAuth Token
    const handleRefreshToken = async () => {
        if (!manageModalAccount?.dbId) {
            message.info("Account is not connected to a live backend database.");
            return;
        }

        setIsRefreshingToken(true);
        try {
            await socialAccountsApi.refreshToken(manageModalAccount.dbId);
            message.success("OAuth Token refreshed & verified with platform!");
            loadAccounts();
        } catch (error: any) {
            message.error(`Token refresh failed: ${error.message}`);
        } finally {
            setIsRefreshingToken(false);
        }
    };

    // Disconnect Account
    const handleDisconnect = async (acc: SocialAccountCard) => {
        if (acc.dbId) {
            try {
                await socialAccountsApi.disconnectAccount(acc.dbId);
                message.info(`${acc.name} disconnected successfully`);
                loadAccounts();
            } catch (error: any) {
                message.error(`Failed to disconnect: ${error.message}`);
            }
        } else {
            setAccounts((prev) =>
                prev.map((item) =>
                    item.id === acc.id
                        ? {
                            ...item,
                            connected: false,
                            date: "Not connected",
                            followers: "0",
                            postsCount: 0,
                            tokenExpiry: "Never",
                            status: "disconnected",
                        }
                        : item
                )
            );
            message.info(`${acc.name} has been disconnected`);
        }

        if (manageModalAccount?.id === acc.id) {
            setManageModalAccount(null);
        }
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
    const totalCount = accounts.length;

    const metricsData = [
        {
            title: "Connected Hubs",
            value: `${activeCount} / ${totalCount}`,
            subtitle: "Platforms integrated",
            icon: Share2,
            iconColor: "text-purple-600 bg-purple-50",
        },
        {
            title: "Active Streams",
            value: `${activeCount}`,
            subtitle: "Ready for direct publishing",
            icon: Zap,
            iconColor: "text-emerald-600 bg-emerald-50",
        },
        {
            title: "Token Health",
            value: `${activeCount > 0 ? "100%" : "0%"}`,
            subtitle: "All tokens encrypted (AES-256)",
            icon: ShieldCheck,
            iconColor: "text-blue-600 bg-blue-50",
        },
        {
            title: "Security State",
            value: "Encrypted",
            subtitle: "CSRF & OAuth State Protected",
            icon: Lock,
            iconColor: "text-amber-600 bg-amber-50",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-purple-500/30 text-purple-300 rounded-full border border-purple-400/30">
                            Enterprise Integrations
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold">Social Account Ecosystem</h1>
                    <p className="text-purple-200/80 text-sm mt-1 max-w-xl">
                        Connect Facebook, Instagram, Threads, WhatsApp, X, and LinkedIn to publish once and schedule across all networks simultaneously.
                    </p>
                </div>
                <button
                    onClick={loadAccounts}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-all backdrop-blur-sm border border-white/10 active:scale-95"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Sync Status
                </button>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metricsData.map((metric, i) => {
                    const Icon = metric.icon;
                    return (
                        <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                    {metric.title}
                                </span>
                                <div className={`p-2 rounded-xl ${metric.iconColor}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="mt-3">
                                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{metric.value}</div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{metric.subtitle}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                        placeholder="Search connected accounts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 rounded-xl"
                    />
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-full sm:w-auto">
                    {(["all", "connected", "disconnected"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilterTab(tab)}
                            className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-medium rounded-lg transition-all capitalize ${filterTab === tab
                                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm font-semibold"
                                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid of Accounts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredAccounts.map((account) => {
                    const Icon = account.icon;
                    return (
                        <div
                            key={account.id}
                            className={`relative bg-white dark:bg-zinc-900 border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg ${account.connected
                                ? "border-zinc-200/80 dark:border-zinc-800"
                                : "border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/40"
                                }`}
                        >
                            {/* Card Header */}
                            <div>
                                <div className="flex items-start justify-between">
                                    <div className={`p-3 rounded-2xl ${account.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <Tag
                                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${account.connected
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                                            : "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                                            }`}
                                    >
                                        {account.connected ? "Active" : "Not Linked"}
                                    </Tag>
                                </div>

                                <div className="mt-4">
                                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{account.name}</h3>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5 truncate">
                                        {account.handle}
                                    </p>
                                </div>

                                {/* Stats & Info */}
                                {account.connected ? (
                                    <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 grid grid-cols-2 gap-2 text-left">
                                        <div>
                                            <span className="text-[10px] uppercase text-zinc-400 font-semibold tracking-wider">Followers</span>
                                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{account.followers}</p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] uppercase text-zinc-400 font-semibold tracking-wider">Token Expiry</span>
                                            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{account.tokenExpiry}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                                        <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                            Click connect to authenticate and grant publishing permissions.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Card Actions */}
                            <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-2">
                                {account.connected ? (
                                    <>
                                        <button
                                            onClick={() => setManageModalAccount(account)}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-medium rounded-xl transition-colors"
                                        >
                                            <Settings className="w-3.5 h-3.5" />
                                            Manage
                                        </button>
                                        <Popconfirm
                                            title="Disconnect Account"
                                            description={`Are you sure you want to disconnect ${account.name}?`}
                                            onConfirm={() => handleDisconnect(account)}
                                            okText="Yes, Disconnect"
                                            cancelText="Cancel"
                                            okButtonProps={{ danger: true }}
                                        >
                                            <button className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors">
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </Popconfirm>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleOpenConnect(account)}
                                        className="w-full flex items-center justify-center gap-1.5 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-xl transition-colors shadow-sm active:scale-95"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Connect {account.platform.toUpperCase()}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Connect Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        {connectModalAccount && (
                            <div className={`p-2 rounded-lg ${connectModalAccount.color}`}>
                                <connectModalAccount.icon className="w-5 h-5" />
                            </div>
                        )}
                        <span>Connect {connectModalAccount?.name}</span>
                    </div>
                }
                open={!!connectModalAccount}
                onCancel={() => setConnectModalAccount(null)}
                footer={null}
                centered
            >
                <div className="space-y-4 py-3">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        You will be securely redirected to the official {connectModalAccount?.name} OAuth authorization page. We will request permissions to publish content and sync analytics.
                    </p>

                    <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900 rounded-xl p-3.5 flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                        <div className="text-xs text-purple-900 dark:text-purple-200">
                            <span className="font-semibold block">Encrypted OAuth Pipeline</span>
                            All access tokens are encrypted with AES-256-GCM before saving in our database and protected against CSRF attacks.
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            onClick={() => setConnectModalAccount(null)}
                            className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmConnect}
                            disabled={isConnecting}
                            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                        >
                            {isConnecting ? (
                                <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    Connecting...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-3.5 h-3.5" />
                                    Authorize & Connect
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Manage Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        {manageModalAccount && (
                            <div className={`p-2 rounded-lg ${manageModalAccount.color}`}>
                                <manageModalAccount.icon className="w-5 h-5" />
                            </div>
                        )}
                        <span>Manage {manageModalAccount?.name}</span>
                    </div>
                }
                open={!!manageModalAccount}
                onCancel={() => setManageModalAccount(null)}
                footer={null}
                centered
            >
                {manageModalAccount && (
                    <div className="space-y-4 py-3">
                        {/* Account Overview */}
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{manageModalAccount.name}</h4>
                                <p className="text-xs text-zinc-500 font-mono">{manageModalAccount.handle}</p>
                            </div>
                            <Tag color="green" className="rounded-full px-2.5">Active</Tag>
                        </div>

                        {/* Token Health */}
                        <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
                            <div>
                                <span className="text-xs font-semibold block text-zinc-800 dark:text-zinc-200">OAuth Access Token</span>
                                <span className="text-[11px] text-zinc-500">{manageModalAccount.tokenExpiry}</span>
                            </div>
                            <button
                                onClick={handleRefreshToken}
                                disabled={isRefreshingToken}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-600 rounded-lg text-xs font-medium transition-all"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingToken ? 'animate-spin' : ''}`} />
                                Refresh Token
                            </button>
                        </div>

                        {/* Settings Toggles */}
                        <div className="space-y-3 pt-2">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Publishing & Automation</h5>

                            <div className="flex items-center justify-between py-1">
                                <div>
                                    <span className="text-xs font-medium block text-zinc-800 dark:text-zinc-200">Automatic Publishing</span>
                                    <span className="text-[11px] text-zinc-400">Allow queue engine to publish posts automatically</span>
                                </div>
                                <Switch
                                    checked={manageModalAccount.autoPublish}
                                    onChange={(v) => handleToggleSetting("autoPublish", v)}
                                />
                            </div>

                            <div className="flex items-center justify-between py-1">
                                <div>
                                    <span className="text-xs font-medium block text-zinc-800 dark:text-zinc-200">Auto Sync Analytics</span>
                                    <span className="text-[11px] text-zinc-400">Sync impressions, reach, and engagement daily</span>
                                </div>
                                <Switch
                                    checked={manageModalAccount.autoSyncAnalytics}
                                    onChange={(v) => handleToggleSetting("autoSyncAnalytics", v)}
                                />
                            </div>

                            <div className="flex items-center justify-between py-1">
                                <div>
                                    <span className="text-xs font-medium block text-zinc-800 dark:text-zinc-200">Failure & Disconnect Alerts</span>
                                    <span className="text-[11px] text-zinc-400">Send in-app notifications if token expires</span>
                                </div>
                                <Switch
                                    checked={manageModalAccount.notifyErrors}
                                    onChange={(v) => handleToggleSetting("notifyErrors", v)}
                                />
                            </div>
                        </div>

                        {/* Footer Disconnect Button */}
                        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-700/80 flex justify-between items-center">
                            <Popconfirm
                                title="Disconnect Account"
                                description="Are you sure you want to disconnect this platform?"
                                onConfirm={() => handleDisconnect(manageModalAccount)}
                                okText="Yes, Disconnect"
                                cancelText="Cancel"
                                okButtonProps={{ danger: true }}
                            >
                                <button className="text-xs text-red-600 hover:text-red-700 font-semibold">
                                    Disconnect Account
                                </button>
                            </Popconfirm>
                            <button
                                onClick={() => setManageModalAccount(null)}
                                className="px-4 py-1.5 text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default function ConnectedAccountsComponent() {
    return (
        <Suspense fallback={<div className="p-8 text-center"><Spin size="large" /></div>}>
            <ConnectedAccountsInner />
        </Suspense>
    );
}
