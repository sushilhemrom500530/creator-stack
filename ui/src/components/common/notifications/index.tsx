"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Bell,
    CheckCheck,
    Clock,
    Share2,
    Sparkles,
    ShieldAlert,
    Trash2,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    Info,
    ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { notificationsApi } from "@/lib/api";

interface NotificationItem {
    _id: string;
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
    category: "publishing" | "token_expiry" | "ai" | "security" | "billing" | "system";
    link?: string;
    read: boolean;
    createdAt: string;
}

export default function NotificationsComponent() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

    const loadNotifications = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await notificationsApi.getNotifications({ limit: 50 });
            if (res && res.data) {
                setNotifications(res.data);
                setUnreadCount(res.meta?.unreadCount || 0);
            }
        } catch (error: any) {
            console.log("Error loading notifications:", error.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    const markAllRead = async () => {
        try {
            await notificationsApi.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error: any) {
            console.log("Failed to mark all as read:", error.message);
        }
    };

    const markSingleRead = async (id: string) => {
        try {
            await notificationsApi.markAsRead(id);
            setNotifications(prev => prev.map(n => (n._id === id ? { ...n, read: true } : n)));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error: any) {
            console.log("Failed to mark notification as read:", error.message);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await notificationsApi.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch (error: any) {
            console.log("Failed to delete notification:", error.message);
        }
    };

    const filteredNotifications = notifications.filter((n) => {
        if (categoryFilter === "unread") return !n.read;
        if (categoryFilter === "all") return true;
        return n.category === categoryFilter;
    });

    const getNotificationVisuals = (item: NotificationItem) => {
        if (item.type === "error" || item.category === "token_expiry") {
            return {
                icon: ShieldAlert,
                color: "text-rose-600 bg-rose-50 border-rose-100",
            };
        }
        if (item.type === "success" || item.category === "publishing") {
            return {
                icon: CheckCircle2,
                color: "text-emerald-600 bg-emerald-50 border-emerald-100",
            };
        }
        if (item.category === "ai") {
            return {
                icon: Sparkles,
                color: "text-purple-600 bg-purple-50 border-purple-100",
            };
        }
        return {
            icon: Info,
            color: "text-blue-600 bg-blue-50 border-blue-100",
        };
    };

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 card p-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Bell className="w-7 h-7 text-purple-600" /> Notifications & Alerts Center
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Track delivery status, token health warnings, and system alerts
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadNotifications}
                        disabled={isLoading}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                        title="Refresh"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold text-xs transition cursor-pointer"
                        >
                            <CheckCheck className="w-4 h-4" />
                            Mark All Read ({unreadCount})
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
                {[
                    { id: "all", label: "All Alerts" },
                    { id: "unread", label: `Unread (${unreadCount})` },
                    { id: "publishing", label: "Publishing" },
                    { id: "token_expiry", label: "Security & Tokens" },
                    { id: "ai", label: "AI Studio" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setCategoryFilter(tab.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${categoryFilter === tab.id
                            ? "bg-purple-600 text-white shadow-xs"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Notification List */}
            <div className="card divide-y divide-slate-100 overflow-hidden shadow-xs">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((item) => {
                        const { icon: Icon, color } = getNotificationVisuals(item);
                        return (
                            <div
                                key={item._id}
                                onClick={() => !item.read && markSingleRead(item._id)}
                                className={`p-5 flex items-start justify-between gap-4 transition cursor-pointer ${item.read ? "bg-white hover:bg-slate-50/70" : "bg-purple-50/40 hover:bg-purple-50/70"
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-2xl border ${color} shrink-0`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                                            {!item.read && (
                                                <span className="w-2 h-2 rounded-full bg-purple-600 inline-block animate-pulse" />
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{item.message}</p>
                                        <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                                            <span className="flex items-center gap-1 font-mono">
                                                <Clock className="w-3 h-3" />
                                                {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                            {item.link && (
                                                <Link
                                                    href={item.link}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="text-purple-600 hover:underline flex items-center gap-1 font-semibold"
                                                >
                                                    View Details <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNotification(item._id);
                                    }}
                                    title="Delete"
                                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-16 text-center text-slate-400 space-y-2">
                        <Bell className="w-10 h-10 mx-auto text-slate-300" />
                        <p className="text-sm font-semibold text-slate-600">No notifications in this category.</p>
                        <p className="text-xs text-slate-400">You are all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
