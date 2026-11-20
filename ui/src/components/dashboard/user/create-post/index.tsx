"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { App, Spin } from "antd";
import {
    PenSquare,
    Image as ImageIcon,
    Sparkles,
    Send,
    Clock,
    CheckCircle2,
    Globe,
    X,
    AlertTriangle,
    ExternalLink,
    RefreshCw,
    Save,
    Plus,
    Film,
} from "lucide-react";
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram, FaThreads } from "react-icons/fa6";
import {
    socialAccountsApi,
    postsApi,
    publishingApi,
    uploadsApi,
    aiApi,
    ensureActiveWorkspaceId,
} from "@/lib/api";

interface ConnectedAccount {
    _id: string;
    platform: string;
    accountName: string;
    username?: string;
    profilePictureUrl?: string;
    status: string;
}

interface MediaItem {
    url: string;
    type: "image" | "video";
    name: string;
}

interface PublishTargetResult {
    accountId: string;
    platform: string;
    accountName: string;
    status: string;
    externalPostUrl?: string;
    errorMessage?: string;
}

const PLATFORM_META: Record<string, { label: string; icon: any; color: string; maxChars: number }> = {
    facebook: { label: "Facebook", icon: FaFacebook, color: "bg-blue-600", maxChars: 63206 },
    instagram: { label: "Instagram", icon: FaInstagram, color: "bg-pink-600", maxChars: 2200 },
    threads: { label: "Threads", icon: FaThreads, color: "bg-zinc-900", maxChars: 500 },
    x: { label: "X / Twitter", icon: FaTwitter, color: "bg-sky-500", maxChars: 280 },
    linkedin: { label: "LinkedIn", icon: FaLinkedin, color: "bg-blue-700", maxChars: 3000 },
};

const BLOCKED_STATUSES = new Set(["needs_reauth", "revoked", "expired"]);
const FACEBOOK_MAX_PHOTOS = 10;
const VIDEO_URL = /\.(mp4|mov|m4v|avi|wmv|webm|mkv|3gp)(\?|#|$)/i;

function isVideo(file: File) {
    return file.type.startsWith("video/");
}

function toLocalInputMin() {
    const d = new Date(Date.now() + 5 * 60 * 1000);
    d.setSeconds(0, 0);
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().slice(0, 16);
}

export default function CreatePostComponent() {
    const { message } = App.useApp();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [workspaceId, setWorkspaceId] = useState("");
    const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
    const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
    const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);

    const [content, setContent] = useState("");
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [showLink, setShowLink] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");

    const [isGenerating, setIsGenerating] = useState(false);
    const [submitting, setSubmitting] = useState<null | "publish" | "schedule" | "draft">(null);
    const [result, setResult] = useState<{ postId: string; status: string; targets: PublishTargetResult[] } | null>(null);
    const [retrying, setRetrying] = useState<string | null>(null);

    const loadAccounts = useCallback(async () => {
        setIsLoadingAccounts(true);
        try {
            const wsId = await ensureActiveWorkspaceId();
            setWorkspaceId(wsId);
            const list = await socialAccountsApi.getAccounts(wsId);
            const supported = (list || []).filter((a: ConnectedAccount) => PLATFORM_META[a.platform]);
            setAccounts(supported);
            // Pre-select healthy Facebook Pages so the most common flow is one click.
            setSelectedAccountIds((prev) =>
                prev.length > 0
                    ? prev
                    : supported
                        .filter((a: ConnectedAccount) => a.platform === "facebook" && a.status === "active")
                        .map((a: ConnectedAccount) => a._id),
            );
        } catch (error: any) {
            message.error(`Could not load your connected accounts: ${error.message}`);
        } finally {
            setIsLoadingAccounts(false);
        }
    }, [message]);

    useEffect(() => {
        loadAccounts();
    }, [loadAccounts]);

    const selectedAccounts = useMemo(
        () => accounts.filter((a) => selectedAccountIds.includes(a._id)),
        [accounts, selectedAccountIds],
    );
    const hasFacebook = selectedAccounts.some((a) => a.platform === "facebook");
    const charLimit = selectedAccounts.length
        ? Math.min(...selectedAccounts.map((a) => PLATFORM_META[a.platform]?.maxChars || 63206))
        : 63206;
    const limitingPlatform = selectedAccounts.find((a) => PLATFORM_META[a.platform]?.maxChars === charLimit);
    const overLimit = content.length > charLimit;
    const previewAccount = selectedAccounts.find((a) => a.platform === "facebook") || selectedAccounts[0];

    const toggleAccount = (account: ConnectedAccount) => {
        if (BLOCKED_STATUSES.has(account.status)) {
            message.warning(`${account.accountName} needs to be reconnected before you can post to it.`);
            return;
        }
        setSelectedAccountIds((prev) =>
            prev.includes(account._id) ? prev.filter((id) => id !== account._id) : [...prev, account._id],
        );
    };

    /** Mirrors backend rules so the user sees problems before submitting. */
    const validationError = useMemo(() => {
        if (selectedAccounts.length === 0) return "Select at least one account to post to.";
        if (!content.trim() && media.length === 0 && !linkUrl.trim()) return "Write something, add media or a link.";
        if (!content.trim()) return "Post text is required.";
        if (overLimit) return `Text is too long for ${PLATFORM_META[limitingPlatform?.platform || "facebook"].label} (${content.length}/${charLimit}).`;
        if (linkUrl.trim()) {
            try {
                const u = new URL(linkUrl.trim());
                if (!/^https?:$/.test(u.protocol)) throw new Error();
            } catch {
                return "The link must be a valid http(s) URL.";
            }
        }
        if (hasFacebook) {
            const videos = media.filter((m) => m.type === "video");
            if (videos.length > 0 && media.length > 1) return "Facebook posts can have one video or up to 10 photos, not both.";
            if (media.length > FACEBOOK_MAX_PHOTOS) return `Facebook posts support up to ${FACEBOOK_MAX_PHOTOS} photos.`;
        }
        if (selectedAccounts.some((a) => a.platform === "instagram") && media.length === 0) {
            return "Instagram needs at least one photo or video.";
        }
        return null;
    }, [selectedAccounts, content, media, linkUrl, overLimit, charLimit, limitingPlatform, hasFacebook]);

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        if (!workspaceId) {
            message.error("No workspace found. Please reload the page.");
            return;
        }
        const list = Array.from(files);
        // Matches the server-side upload limit.
        const tooBig = list.find((f) => f.size > 100 * 1024 * 1024);
        if (tooBig) {
            message.error(`${tooBig.name} is too large (max 100 MB).`);
            return;
        }

        setIsUploading(true);
        try {
            const uploaded: MediaItem[] = [];
            for (const file of list) {
                const res = await uploadsApi.uploadCloudinary(file, workspaceId);
                const url = res?.url || res?.secureUrl || res?.secure_url;
                if (!url) throw new Error(`Upload of ${file.name} did not return a URL.`);
                uploaded.push({ url, type: isVideo(file) || VIDEO_URL.test(url) ? "video" : "image", name: file.name });
            }
            setMedia((prev) => [...prev, ...uploaded]);
            message.success(`${uploaded.length} file${uploaded.length > 1 ? "s" : ""} uploaded`);
        } catch (error: any) {
            message.error(`Upload failed: ${error.message}`);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleAiGenerate = async () => {
        if (!workspaceId) return;
        const topic = content.trim() || "an update for our audience";
        setIsGenerating(true);
        try {
            const res = await aiApi.generateCaption({
                workspaceId,
                topic,
                platform: previewAccount?.platform || "facebook",
                includeEmojis: true,
                includeHashtags: true,
            });
            if (res?.caption) setContent(res.caption);
        } catch (error: any) {
            message.error(`AI generation failed: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const buildPayload = (extra: Record<string, any>) => ({
        workspaceId,
        baseContent: content.trim(),
        mediaUrls: media.map((m) => m.url),
        targets: selectedAccounts.map((a) => ({
            accountId: a._id,
            platform: a.platform,
            options: {
                ...(linkUrl.trim() && a.platform === "facebook" ? { linkUrl: linkUrl.trim() } : {}),
                ...(a.platform === "facebook" && media.some((m) => m.type === "video") ? { isVideo: true } : {}),
            },
        })),
        ...extra,
    });

    const toResult = (post: any): { postId: string; status: string; targets: PublishTargetResult[] } => ({
        postId: post?._id,
        status: post?.status,
        targets: (post?.targets || []).map((t: any) => {
            const id = typeof t.accountId === "object" ? t.accountId?._id : t.accountId;
            const acc = accounts.find((a) => a._id === id);
            return {
                accountId: id,
                platform: t.platform,
                accountName: acc?.accountName || (typeof t.accountId === "object" ? t.accountId?.accountName : "") || t.platform,
                status: t.status,
                externalPostUrl: t.externalPostUrl,
                errorMessage: t.errorMessage,
            };
        }),
    });

    const resetComposer = () => {
        setContent("");
        setMedia([]);
        setLinkUrl("");
        setShowLink(false);
        setScheduledTime("");
    };

    const handlePublishNow = async () => {
        if (validationError) return message.warning(validationError);
        setSubmitting("publish");
        setResult(null);
        try {
            // Create first, then publish synchronously so the user gets the real outcome from Facebook.
            const created = await postsApi.createPost(buildPayload({}));
            const published = await publishingApi.publishNow(created._id);
            const outcome = toResult(published);
            setResult(outcome);

            if (outcome.status === "published") {
                message.success("Your post is live! 🎉");
                resetComposer();
            } else if (outcome.status === "partially_published") {
                message.warning("Published to some accounts. Check the details below.");
            } else {
                message.error("Publishing failed. See details below.");
            }
        } catch (error: any) {
            message.error(error.message || "Publishing failed.");
        } finally {
            setSubmitting(null);
        }
    };

    const handleSchedule = async () => {
        if (validationError) return message.warning(validationError);
        if (!scheduledTime) return message.warning("Pick a date and time to schedule the post.");
        const when = new Date(scheduledTime);
        if (when.getTime() <= Date.now() + 60 * 1000) return message.warning("Choose a time at least a minute in the future.");

        setSubmitting("schedule");
        try {
            await postsApi.createPost(buildPayload({ scheduledAt: when.toISOString() }));
            message.success(`Scheduled for ${when.toLocaleString()}`);
            resetComposer();
        } catch (error: any) {
            message.error(error.message || "Scheduling failed.");
        } finally {
            setSubmitting(null);
        }
    };

    const handleSaveDraft = async () => {
        if (selectedAccounts.length === 0) return message.warning("Select at least one account.");
        if (!content.trim()) return message.warning("Write something before saving a draft.");
        setSubmitting("draft");
        try {
            await postsApi.createPost(buildPayload({ status: "draft" }));
            message.success("Draft saved");
            resetComposer();
        } catch (error: any) {
            message.error(error.message || "Could not save draft.");
        } finally {
            setSubmitting(null);
        }
    };

    const handleRetry = async (accountId: string) => {
        if (!result?.postId) return;
        setRetrying(accountId);
        try {
            const updated = await publishingApi.retryTarget(result.postId, accountId);
            const outcome = toResult(updated);
            setResult(outcome);
            const target = outcome.targets.find((t) => t.accountId === accountId);
            if (target?.status === "published") message.success(`Published to ${target.accountName}`);
            else message.error(target?.errorMessage || "Retry failed.");
        } catch (error: any) {
            message.error(error.message || "Retry failed.");
        } finally {
            setRetrying(null);
        }
    };

    const busy = submitting !== null || isUploading;

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 card p-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <PenSquare className="w-7 h-7 text-primary" /> Create New Post
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Draft, schedule, and publish content across all your social channels</p>
                </div>
                <button
                    onClick={handleAiGenerate}
                    disabled={isGenerating || !workspaceId}
                    className="btn flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium text-sm shadow-md hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
                >
                    <Sparkles className="w-4 h-4" />
                    {isGenerating ? "Generating..." : "Generate with AI"}
                </button>
            </div>

            {/* Publish outcome */}
            {result && (
                <div className="card p-5 space-y-3" role="status" aria-live="polite">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-slate-700">Publishing result</h2>
                        <button onClick={() => setResult(null)} className="btn p-1 rounded-lg text-slate-400 hover:bg-slate-100" aria-label="Dismiss">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    {result.targets.map((t) => {
                        const Meta = PLATFORM_META[t.platform];
                        const Icon = Meta?.icon || Globe;
                        const ok = t.status === "published";
                        return (
                            <div
                                key={t.accountId}
                                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border ${ok ? "border-emerald-200 bg-emerald-50/60" : "border-rose-200 bg-rose-50/60"}`}
                            >
                                <div className="flex items-start gap-3 min-w-0">
                                    <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${ok ? "text-emerald-600" : "text-rose-600"}`} />
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 truncate">
                                            {t.accountName} · {ok ? "Published" : "Failed"}
                                        </p>
                                        {!ok && t.errorMessage && <p className="text-xs text-rose-700 mt-0.5 break-words">{t.errorMessage}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {ok && t.externalPostUrl && (
                                        <a
                                            href={t.externalPostUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-50"
                                        >
                                            View on {Meta?.label || t.platform} <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    )}
                                    {!ok && /reconnect/i.test(t.errorMessage || "") && (
                                        <Link
                                            href="/user/connected-accounts"
                                            className="btn px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-50"
                                        >
                                            Reconnect
                                        </Link>
                                    )}
                                    {!ok && (
                                        <button
                                            onClick={() => handleRetry(t.accountId)}
                                            disabled={retrying === t.accountId}
                                            className="btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 disabled:opacity-60"
                                        >
                                            <RefreshCw className={`w-3.5 h-3.5 ${retrying === t.accountId ? "animate-spin" : ""}`} />
                                            Retry
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Account Selector */}
                    <div className="p-6 card space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-slate-700 block">Post to</label>
                            <Link href="/user/connected-accounts" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                                <Plus className="w-3.5 h-3.5" /> Connect account
                            </Link>
                        </div>

                        {isLoadingAccounts ? (
                            <div className="py-4 flex justify-center"><Spin /></div>
                        ) : accounts.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-300 p-5 text-center space-y-2">
                                <FaFacebook className="w-7 h-7 mx-auto text-blue-600" />
                                <p className="text-sm font-semibold text-slate-700">No connected accounts yet</p>
                                <p className="text-xs text-slate-500">Connect your Facebook Page to start publishing.</p>
                                <Link
                                    href="/user/connected-accounts"
                                    className="btn inline-flex items-center gap-1.5 mt-1 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold"
                                >
                                    Connect Facebook
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-3">
                                {accounts.map((a) => {
                                    const meta = PLATFORM_META[a.platform];
                                    const Icon = meta.icon;
                                    const isSelected = selectedAccountIds.includes(a._id);
                                    const blocked = BLOCKED_STATUSES.has(a.status);
                                    return (
                                        <button
                                            key={a._id}
                                            type="button"
                                            onClick={() => toggleAccount(a)}
                                            aria-pressed={isSelected}
                                            title={blocked ? "Reconnect this account to post" : a.accountName}
                                            className={"btn " + (`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${blocked
                                                ? "bg-amber-50 text-amber-700 border border-amber-200 cursor-not-allowed"
                                                : isSelected
                                                    ? `${meta.color} text-white shadow-sm ring-2 ring-offset-1 ring-slate-300`
                                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                }`)}
                                        >
                                            {blocked ? <AlertTriangle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                                            <span className="max-w-[160px] truncate">{a.accountName}</span>
                                            {isSelected && !blocked && <CheckCircle2 className="w-3.5 h-3.5" />}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                        {accounts.some((a) => BLOCKED_STATUSES.has(a.status)) && (
                            <p className="text-xs text-amber-700 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Some accounts need to be reconnected.{" "}
                                <Link href="/user/connected-accounts" className="font-semibold underline">Fix now</Link>
                            </p>
                        )}
                    </div>

                    {/* Content Input */}
                    <div className="card p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <label htmlFor="post-content" className="text-sm font-semibold text-slate-700">Post Content</label>
                            <span className={`text-xs ${overLimit ? "text-rose-600 font-semibold" : "text-slate-400"}`}>
                                {content.length.toLocaleString()} / {charLimit.toLocaleString()}
                                {limitingPlatform && selectedAccounts.length > 1 ? ` (${PLATFORM_META[limitingPlatform.platform].label} limit)` : ""}
                            </span>
                        </div>
                        <textarea
                            id="post-content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What would you like to share today?"
                            rows={6}
                            className={`w-full p-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 text-sm placeholder:text-slate-400 resize-y ${overLimit ? "border-rose-300" : "border-slate-200 focus:border-primary"}`}
                        />

                        {/* Media previews */}
                        {media.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                {media.map((m, i) => (
                                    <div key={m.url} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group">
                                        {m.type === "video" ? (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-1">
                                                <Film className="w-6 h-6" />
                                                <span className="text-[10px] px-1 truncate max-w-full">{m.name}</span>
                                            </div>
                                        ) : (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setMedia((prev) => prev.filter((_, idx) => idx !== i))}
                                            className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-90 hover:opacity-100"
                                            aria-label={`Remove ${m.name}`}
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {showLink && (
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                                <input
                                    type="url"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="https://your-link.com (shown as a link preview on Facebook)"
                                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-primary"
                                />
                                <button
                                    type="button"
                                    onClick={() => { setShowLink(false); setLinkUrl(""); }}
                                    className="btn p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
                                    aria-label="Remove link"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,video/*"
                                    multiple
                                    hidden
                                    onChange={(e) => handleFiles(e.target.files)}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading || !workspaceId}
                                    className="btn flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-medium transition cursor-pointer disabled:opacity-60"
                                >
                                    {isUploading ? <Spin size="small" /> : <ImageIcon className="w-4 h-4 text-slate-500" />}
                                    {isUploading ? "Uploading..." : "Add Media"}
                                </button>
                                {!showLink && (
                                    <button
                                        type="button"
                                        onClick={() => setShowLink(true)}
                                        className="btn flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-medium transition cursor-pointer"
                                    >
                                        <Globe className="w-4 h-4 text-slate-500" />
                                        Add Link
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <input
                                    type="datetime-local"
                                    value={scheduledTime}
                                    min={toLocalInputMin()}
                                    onChange={(e) => setScheduledTime(e.target.value)}
                                    aria-label="Schedule date and time"
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {validationError && (selectedAccounts.length > 0 || content.length > 0) && (
                        <p className="text-xs text-amber-700 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" /> {validationError}
                        </p>
                    )}

                    {/* Submit Actions */}
                    <div className="flex flex-wrap items-center justify-end gap-3">
                        <button
                            onClick={handleSaveDraft}
                            disabled={busy}
                            className="btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-600 font-medium text-sm hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {submitting === "draft" ? "Saving..." : "Save Draft"}
                        </button>
                        <button
                            onClick={handleSchedule}
                            disabled={busy || !scheduledTime}
                            title={!scheduledTime ? "Pick a date and time first" : undefined}
                            className="btn flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium text-sm hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
                        >
                            <Clock className="w-4 h-4 text-slate-500" />
                            {submitting === "schedule" ? "Scheduling..." : "Schedule"}
                        </button>
                        <button
                            onClick={handlePublishNow}
                            disabled={busy || !!validationError}
                            className="btn flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition cursor-pointer disabled:opacity-50"
                        >
                            {submitting === "publish" ? <Spin size="small" /> : <Send className="w-4 h-4" />}
                            {submitting === "publish" ? "Publishing..." : "Publish Now"}
                        </button>
                    </div>
                </div>

                {/* Live Preview */}
                <div className="space-y-6">
                    <div className="space-y-6 sticky top-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4">
                            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Live Preview
                                {previewAccount && (
                                    <span className="text-xs font-normal text-slate-400">· {PLATFORM_META[previewAccount.platform].label}</span>
                                )}
                            </h2>

                            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                                <div className="flex items-center gap-3">
                                    {previewAccount?.profilePictureUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={previewAccount.profilePictureUrl} alt="" className="w-9 h-9 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                                            {(previewAccount?.accountName || "Y").charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">{previewAccount?.accountName || "Your Page"}</h4>
                                        <p className="text-xs text-slate-400">{scheduledTime ? new Date(scheduledTime).toLocaleString() : "Just now"} · 🌐</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed min-h-[60px] break-words">
                                    {content || "Your post content preview will appear here..."}
                                </p>
                                {media.length > 0 && media[0].type === "image" && (
                                    <div className={`grid gap-1 ${media.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                                        {media.slice(0, 4).map((m) => (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img key={m.url} src={m.url} alt="" className="w-full aspect-video object-cover rounded-md" />
                                        ))}
                                    </div>
                                )}
                                {media.length > 0 && media[0].type === "video" && (
                                    <div className="aspect-video rounded-md bg-slate-200 flex items-center justify-center text-slate-500">
                                        <Film className="w-8 h-8" />
                                    </div>
                                )}
                                {linkUrl && media.length === 0 && (
                                    <div className="rounded-md border border-slate-200 bg-white p-2 text-xs text-slate-500 truncate">
                                        🔗 {linkUrl}
                                    </div>
                                )}
                            </div>
                        </div>

                        {hasFacebook && (
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs text-blue-900 space-y-1.5">
                                <p className="font-semibold flex items-center gap-1.5"><FaFacebook className="w-4 h-4" /> Facebook tips</p>
                                <p>• Up to 10 photos, or one video per post.</p>
                                <p>• Links show a preview card when no media is attached.</p>
                                <p>• Media must be publicly reachable — uploads here are handled for you.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
