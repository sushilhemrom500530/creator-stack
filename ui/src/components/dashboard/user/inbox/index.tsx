"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { App, Spin, Select } from "antd";
import {
    MessageCircle,
    Search,
    RefreshCw,
    Send,
    ArrowLeft,
    AlertTriangle,
    Clock,
    Paperclip,
    CloudDownload,
} from "lucide-react";
import { FaFacebookMessenger } from "react-icons/fa6";
import {
    inboxApi,
    ensureActiveWorkspaceId,
    InboxAccount,
    InboxConversation,
    InboxMessage,
} from "@/lib/api";

const LIST_POLL_MS = 15_000;
const THREAD_POLL_MS = 5_000;
const MAX_LENGTH = 2000;

type UiMessage = InboxMessage & { pending?: boolean };

function timeLabel(iso?: string | null) {
    if (!iso) return "";
    const d = new Date(iso);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const diffDays = (now.getTime() - d.getTime()) / 86_400_000;
    if (diffDays < 7) return d.toLocaleDateString([], { weekday: "short" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function replyWindowLeft(lastInboundAt?: string | null): string | null {
    if (!lastInboundAt) return null;
    const ms = new Date(lastInboundAt).getTime() + 24 * 3_600_000 - Date.now();
    if (ms <= 0) return null;
    const h = Math.floor(ms / 3_600_000);
    return h >= 1 ? `${h}h left to reply` : `${Math.max(1, Math.floor(ms / 60_000))}m left to reply`;
}

function Avatar({ name, url, size = 40 }: { name?: string | null; url?: string | null; size?: number }) {
    if (url) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={url} alt="" style={{ width: size, height: size }} className="rounded-full object-cover shrink-0" />;
    }
    return (
        <div
            style={{ width: size, height: size }}
            className="rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0"
        >
            {(name || "?").charAt(0).toUpperCase()}
        </div>
    );
}

function useVisible() {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        const onChange = () => setVisible(document.visibilityState === "visible");
        document.addEventListener("visibilitychange", onChange);
        return () => document.removeEventListener("visibilitychange", onChange);
    }, []);
    return visible;
}

function InboxInner() {
    const { message } = App.useApp();
    const router = useRouter();
    const searchParams = useSearchParams();
    const visible = useVisible();

    const [workspaceId, setWorkspaceId] = useState("");
    const [accounts, setAccounts] = useState<InboxAccount[]>([]);
    const [accountFilter, setAccountFilter] = useState<string | undefined>(undefined);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [conversations, setConversations] = useState<InboxConversation[]>([]);
    const [listLoading, setListLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    const [activeId, setActiveId] = useState<string | null>(searchParams.get("conversation"));
    const [activeConversation, setActiveConversation] = useState<InboxConversation | null>(null);
    const [messages, setMessages] = useState<UiMessage[]>([]);
    const [hasMore, setHasMore] = useState(false);
    const [threadLoading, setThreadLoading] = useState(false);
    const [loadingOlder, setLoadingOlder] = useState(false);

    const [draft, setDraft] = useState("");
    const [sending, setSending] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const stickToBottom = useRef(true);

    // Follow ?conversation= changes (e.g. clicking a notification while already on this page).
    const urlConversation = searchParams.get("conversation");
    useEffect(() => {
        if (urlConversation && urlConversation !== activeId) setActiveId(urlConversation);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urlConversation]);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
        return () => clearTimeout(t);
    }, [search]);

    // ── Conversation list ──
    const loadConversations = useCallback(
        async (silent = false) => {
            if (!silent) setListLoading(true);
            try {
                const wsId = workspaceId || (await ensureActiveWorkspaceId());
                if (!wsId) return;
                if (!workspaceId) setWorkspaceId(wsId);
                const res = await inboxApi.getConversations({
                    workspaceId: wsId,
                    accountId: accountFilter,
                    search: debouncedSearch || undefined,
                    limit: 50,
                });
                setConversations(res.data || []);
                setAccounts(res.accounts || []);
            } catch (error: any) {
                if (!silent) message.error(`Could not load conversations: ${error.message}`);
            } finally {
                if (!silent) setListLoading(false);
            }
        },
        [workspaceId, accountFilter, debouncedSearch, message],
    );

    useEffect(() => {
        loadConversations();
    }, [loadConversations]);

    useEffect(() => {
        if (!visible) return;
        const id = setInterval(() => loadConversations(true), LIST_POLL_MS);
        return () => clearInterval(id);
    }, [visible, loadConversations]);

    // ── Active thread ──
    const loadThread = useCallback(
        async (conversationId: string, silent = false) => {
            if (!silent) setThreadLoading(true);
            try {
                const res = await inboxApi.getMessages(conversationId, { limit: 50 });
                setActiveConversation(res.conversation);
                setHasMore(res.hasMore);
                setMessages((prev) => {
                    const pending = prev.filter((m) => m.pending && m.conversationId === conversationId);
                    if (!silent) return [...res.data, ...pending];
                    // Keep older pages already loaded; merge the newest page in.
                    const known = new Map(prev.filter((m) => !m.pending).map((m) => [m._id, m]));
                    res.data.forEach((m) => known.set(m._id, m));
                    const merged = Array.from(known.values()).filter((m) => m.conversationId === conversationId);
                    merged.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
                    return [...merged, ...pending];
                });

                if (res.conversation.unreadCount > 0) {
                    await inboxApi.markAsRead(conversationId);
                    setConversations((prev) => prev.map((c) => (c._id === conversationId ? { ...c, unreadCount: 0 } : c)));
                }
            } catch (error: any) {
                if (!silent) message.error(`Could not load messages: ${error.message}`);
            } finally {
                if (!silent) setThreadLoading(false);
            }
        },
        [message],
    );

    useEffect(() => {
        if (!activeId) {
            setActiveConversation(null);
            setMessages([]);
            return;
        }
        stickToBottom.current = true;
        setMessages([]);
        setDraft("");
        loadThread(activeId);
    }, [activeId, loadThread]);

    useEffect(() => {
        if (!activeId || !visible) return;
        const id = setInterval(() => loadThread(activeId, true), THREAD_POLL_MS);
        return () => clearInterval(id);
    }, [activeId, visible, loadThread]);

    // Auto-scroll to newest message unless the user scrolled up to read history.
    useEffect(() => {
        const el = scrollRef.current;
        if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
    }, [messages]);

    const onThreadScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    };

    const loadOlder = async () => {
        if (!activeId || messages.length === 0) return;
        const oldest = messages.find((m) => !m.pending);
        if (!oldest) return;
        setLoadingOlder(true);
        const el = scrollRef.current;
        const prevHeight = el?.scrollHeight || 0;
        try {
            const res = await inboxApi.getMessages(activeId, { before: oldest.sentAt, limit: 50 });
            stickToBottom.current = false;
            setMessages((prev) => [...res.data, ...prev]);
            setHasMore(res.hasMore);
            requestAnimationFrame(() => {
                if (el) el.scrollTop = el.scrollHeight - prevHeight;
            });
        } catch (error: any) {
            message.error(`Could not load older messages: ${error.message}`);
        } finally {
            setLoadingOlder(false);
        }
    };

    const selectConversation = (id: string | null) => {
        setActiveId(id);
        const params = new URLSearchParams(searchParams.toString());
        if (id) params.set("conversation", id);
        else params.delete("conversation");
        router.replace(`/user/inbox${params.toString() ? `?${params}` : ""}`, { scroll: false });
    };

    // ── Sending ──
    const canReply = activeConversation?.canReply ?? false;

    const send = async () => {
        const text = draft.trim();
        if (!activeId || !text || sending) return;
        if (!canReply) {
            message.warning("You can reply once this person messages your Page again (24-hour rule).");
            return;
        }

        const tempId = `pending-${Date.now()}`;
        const optimistic: UiMessage = {
            _id: tempId,
            conversationId: activeId,
            direction: "outbound",
            text,
            attachments: [],
            status: "sent",
            sentAt: new Date().toISOString(),
            pending: true,
        };
        stickToBottom.current = true;
        setMessages((prev) => [...prev, optimistic]);
        setDraft("");
        setSending(true);

        try {
            const saved = await inboxApi.sendMessage(activeId, text);
            setMessages((prev) => {
                const withoutTemp = prev.filter((m) => m._id !== tempId);
                return withoutTemp.some((m) => m._id === saved._id) ? withoutTemp : [...withoutTemp, saved];
            });
            setConversations((prev) =>
                prev.map((c) =>
                    c._id === activeId
                        ? { ...c, lastMessageText: text, lastMessageAt: saved.sentAt, lastMessageDirection: "outbound" }
                        : c,
                ),
            );
        } catch (error: any) {
            setMessages((prev) => prev.filter((m) => m._id !== tempId));
            setDraft(text); // never lose what the user typed
            message.error(error.message || "Message could not be sent.");
            if (/24 hours/i.test(error.message || "")) {
                setActiveConversation((c) => (c ? { ...c, canReply: false } : c));
            }
        } finally {
            setSending(false);
        }
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            send();
        }
    };

    const syncFromFacebook = async () => {
        const targets = accountFilter ? accounts.filter((a) => a._id === accountFilter) : accounts;
        if (targets.length === 0) return;
        setSyncing(true);
        try {
            let imported = 0;
            for (const acc of targets) {
                const res = await inboxApi.syncAccount(acc._id);
                imported += res.messagesImported;
            }
            message.success(imported > 0 ? `Imported ${imported} message${imported > 1 ? "s" : ""} from Facebook` : "Inbox is up to date");
            await loadConversations(true);
            if (activeId) await loadThread(activeId, true);
        } catch (error: any) {
            message.error(error.message || "Sync failed.");
        } finally {
            setSyncing(false);
        }
    };

    const accountIssues = useMemo(() => accounts.filter((a) => !a.messagingEnabled || a.messagingIssue), [accounts]);
    const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
    const windowLeft = replyWindowLeft(activeConversation?.lastInboundAt);

    // ── Render ──
    if (!listLoading && accounts.length === 0) {
        return (
            <div className="card p-10 text-center space-y-3 max-w-xl mx-auto mt-6">
                <FaFacebookMessenger className="w-10 h-10 mx-auto text-blue-600" />
                <h1 className="text-lg font-bold text-slate-800">Connect a Facebook Page to use the Inbox</h1>
                <p className="text-sm text-slate-500">Messages people send to your Page on Messenger will appear here, and you can reply without leaving the dashboard.</p>
                <Link href="/user/connected-accounts" className="btn inline-flex px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold">
                    Connect Facebook Page
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <MessageCircle className="w-6 h-6 text-primary" /> Inbox
                        {totalUnread > 0 && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary text-white">{totalUnread} unread</span>
                        )}
                    </h1>
                    <p className="text-slate-500 text-sm mt-0.5">Facebook Messenger conversations with your Pages</p>
                </div>
                <div className="flex items-center gap-2">
                    {accounts.length > 1 && (
                        <Select
                            allowClear
                            placeholder="All Pages"
                            value={accountFilter}
                            onChange={(v) => setAccountFilter(v)}
                            options={accounts.map((a) => ({ value: a._id, label: a.accountName }))}
                            style={{ minWidth: 180 }}
                        />
                    )}
                    <button
                        onClick={syncFromFacebook}
                        disabled={syncing}
                        title="Import recent conversations from Facebook"
                        className="btn flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold disabled:opacity-60"
                    >
                        {syncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CloudDownload className="w-4 h-4" />}
                        Sync from Facebook
                    </button>
                </div>
            </div>

            {accountIssues.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                        <b>Real-time messages are not active for: {accountIssues.map((a) => a.accountName).join(", ")}.</b>{" "}
                        {accountIssues[0].messagingIssue || "Open Connected Accounts → Manage → Refresh Token to activate."}{" "}
                        <Link href="/user/connected-accounts" className="underline font-semibold">Fix in Connected Accounts</Link>
                    </div>
                </div>
            )}

            <div className="card overflow-hidden grid grid-cols-1 md:grid-cols-[320px_1fr] h-[calc(100vh-280px)] min-h-[480px]">
                {/* Conversation list */}
                <div className={`border-r border-slate-100 flex flex-col min-h-0 ${activeId ? "hidden md:flex" : "flex"}`}>
                    <div className="p-3 border-b border-slate-100">
                        <div className="relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search conversations"
                                aria-label="Search conversations"
                                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {listLoading ? (
                            <div className="p-8 flex justify-center"><Spin /></div>
                        ) : conversations.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 space-y-2">
                                <MessageCircle className="w-8 h-8 mx-auto text-slate-300" />
                                <p className="text-sm font-semibold text-slate-600">{debouncedSearch ? "No matches" : "No conversations yet"}</p>
                                {!debouncedSearch && (
                                    <p className="text-xs">When someone messages your Page, it shows up here. Use “Sync from Facebook” to import existing chats.</p>
                                )}
                            </div>
                        ) : (
                            conversations.map((c) => {
                                const active = c._id === activeId;
                                const unread = c.unreadCount > 0;
                                return (
                                    <button
                                        key={c._id}
                                        onClick={() => selectConversation(c._id)}
                                        className={`w-full text-left px-3 py-3 flex items-start gap-3 border-b border-slate-50 transition ${active ? "bg-primary/10" : "hover:bg-slate-50"}`}
                                    >
                                        <Avatar name={c.participantName} url={c.participantAvatarUrl} />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className={`text-sm truncate ${unread ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}>
                                                    {c.participantName || "Facebook user"}
                                                </span>
                                                <span className="text-[11px] text-slate-400 shrink-0">{timeLabel(c.lastMessageAt)}</span>
                                            </div>
                                            <div className="flex items-center justify-between gap-2 mt-0.5">
                                                <span className={`text-xs truncate ${unread ? "text-slate-800 font-medium" : "text-slate-500"}`}>
                                                    {c.lastMessageDirection === "outbound" ? "You: " : ""}
                                                    {c.lastMessageText || "…"}
                                                </span>
                                                {unread && (
                                                    <span className="text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                                                        {c.unreadCount > 99 ? "99+" : c.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            {accounts.length > 1 && c.account && (
                                                <span className="text-[10px] text-slate-400 truncate block mt-0.5">via {c.account.accountName}</span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Thread */}
                <div className={`flex flex-col min-h-0 ${activeId ? "flex" : "hidden md:flex"}`}>
                    {!activeId ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2 p-8 text-center">
                            <FaFacebookMessenger className="w-10 h-10 text-slate-300" />
                            <p className="text-sm font-semibold text-slate-600">Select a conversation</p>
                            <p className="text-xs">Messages people send to your Facebook Page appear here.</p>
                        </div>
                    ) : (
                        <>
                            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                                <button onClick={() => selectConversation(null)} className="btn md:hidden p-1.5 rounded-lg hover:bg-slate-100" aria-label="Back to conversations">
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                                <Avatar name={activeConversation?.participantName} url={activeConversation?.participantAvatarUrl} size={36} />
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-800 truncate">{activeConversation?.participantName || "Facebook user"}</p>
                                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                        <FaFacebookMessenger className="w-3 h-3" /> Messenger
                                        {windowLeft && <span className="flex items-center gap-1 ml-2"><Clock className="w-3 h-3" />{windowLeft}</span>}
                                    </p>
                                </div>
                            </div>

                            <div ref={scrollRef} onScroll={onThreadScroll} className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-slate-50/50">
                                {threadLoading ? (
                                    <div className="flex justify-center py-10"><Spin /></div>
                                ) : (
                                    <>
                                        {hasMore && (
                                            <div className="flex justify-center pb-2">
                                                <button
                                                    onClick={loadOlder}
                                                    disabled={loadingOlder}
                                                    className="btn text-xs font-semibold text-primary px-3 py-1 rounded-full bg-white border border-slate-200 hover:bg-slate-50"
                                                >
                                                    {loadingOlder ? "Loading…" : "Load older messages"}
                                                </button>
                                            </div>
                                        )}
                                        {messages.length === 0 && (
                                            <p className="text-center text-xs text-slate-400 py-10">No messages in this conversation yet.</p>
                                        )}
                                        {messages.map((m) => {
                                            const out = m.direction === "outbound";
                                            return (
                                                <div key={m._id} className={`flex ${out ? "justify-end" : "justify-start"}`}>
                                                    <div className={`max-w-[75%] ${out ? "items-end" : "items-start"} flex flex-col`}>
                                                        <div
                                                            className={`px-3.5 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words ${out
                                                                ? "bg-primary text-white rounded-br-md"
                                                                : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
                                                                } ${m.pending ? "opacity-60" : ""}`}
                                                        >
                                                            {m.text}
                                                            {m.attachments?.map((a, i) =>
                                                                a.type === "image" || a.type === "sticker" ? (
                                                                    // eslint-disable-next-line @next/next/no-img-element
                                                                    a.url ? <img key={i} src={a.url} alt={a.name || "attachment"} className="mt-1 rounded-lg max-h-60 object-contain" /> : null
                                                                ) : (
                                                                    <a
                                                                        key={i}
                                                                        href={a.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className={`mt-1 flex items-center gap-1 underline text-xs ${out ? "text-white" : "text-primary"}`}
                                                                    >
                                                                        <Paperclip className="w-3 h-3" /> {a.name || a.type}
                                                                    </a>
                                                                )
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] text-slate-400 mt-0.5 px-1">
                                                            {m.pending ? "Sending…" : new Date(m.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </>
                                )}
                            </div>

                            <div className="border-t border-slate-100 p-3 bg-white">
                                {!canReply && !threadLoading ? (
                                    <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start gap-2">
                                        <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>
                                            Facebook only allows Pages to reply within 24 hours of the person&apos;s last message.
                                            You&apos;ll be able to reply as soon as they message again.
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-end gap-2">
                                        <textarea
                                            value={draft}
                                            onChange={(e) => setDraft(e.target.value.slice(0, MAX_LENGTH))}
                                            onKeyDown={onKeyDown}
                                            rows={1}
                                            placeholder="Write a reply… (Enter to send, Shift+Enter for new line)"
                                            aria-label="Reply message"
                                            className="flex-1 resize-none max-h-32 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary"
                                        />
                                        <button
                                            onClick={send}
                                            disabled={!draft.trim() || sending}
                                            aria-label="Send"
                                            className="btn p-3 rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
                                        >
                                            {sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        </button>
                                    </div>
                                )}
                                {draft.length > MAX_LENGTH - 200 && (
                                    <p className="text-[11px] text-slate-400 text-right mt-1">{draft.length}/{MAX_LENGTH}</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function InboxComponent() {
    return (
        <Suspense fallback={<div className="p-8 text-center"><Spin size="large" /></div>}>
            <InboxInner />
        </Suspense>
    );
}
