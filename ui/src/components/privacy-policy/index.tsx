"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/providers/mode-theme";
import {
    ShieldCheck,
    FileText,
    Mail,
    Lock,
    Trash2,
    CheckCircle,
    ArrowUpRight,
    ExternalLink
} from "lucide-react";

export default function PrivacyPolicy() {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const [activeSection, setActiveSection] = useState("overview");

    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll("section[id]");
            const scrollY = window.pageYOffset;

            sections.forEach((current: any) => {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 140;
                const sectionId = current.getAttribute("id");

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    setActiveSection(sectionId);
                }
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { id: "overview", label: "1. Overview & Scope" },
        { id: "information-collected", label: "2. Information We Collect" },
        { id: "how-we-use-data", label: "3. How We Use Information" },
        { id: "meta-social-data", label: "4. Social Platforms & Meta API" },
        { id: "security-encryption", label: "5. Data Security & Storage" },
        { id: "data-retention-deletion", label: "6. Retention & Data Deletion" },
        { id: "user-rights", label: "7. Your Privacy Rights (GDPR & CCPA)" },
        { id: "cookies-tracking", label: "8. Cookies & Tracking" },
        { id: "third-parties", label: "9. Third-Party Services" },
        { id: "policy-changes", label: "10. Policy Changes" },
        { id: "contact-us", label: "11. Contact Information" },
    ];

    return (
        <main
            className={`min-h-screen pt-24 pb-20 transition-colors duration-200 ${
                isLight ? "bg-[#fbfbfd] text-slate-800" : "bg-[#0b0a10] text-slate-300"
            }`}
        >
            {/* Header / Title Area */}
            <div
                className={`border-b ${
                    isLight
                        ? "border-slate-200/80 bg-white"
                        : "border-white/10 bg-[#100e17]"
                }`}
            >
                <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
                    <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck
                            className={`w-5 h-5 ${
                                isLight ? "text-violet-600" : "text-violet-400"
                            }`}
                        />
                        <span
                            className={`text-xs font-semibold uppercase tracking-wider ${
                                isLight ? "text-violet-600" : "text-violet-400"
                            }`}
                        >
                            Legal & Compliance
                        </span>
                    </div>

                    <h1
                        className={`text-3xl md:text-5xl font-bold tracking-tight mb-4 ${
                            isLight ? "text-slate-900" : "text-white"
                        }`}
                    >
                        Privacy Policy
                    </h1>

                    <p
                        className={`text-base md:text-lg leading-relaxed max-w-3xl mb-6 ${
                            isLight ? "text-slate-600" : "text-slate-400"
                        }`}
                    >
                        This Privacy Policy describes how CreatorStack collects, uses, protects,
                        and manages your personal data and social platform tokens when you use our
                        website, applications, and scheduling services.
                    </p>

                    <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-slate-400">
                        <div>
                            <span className="font-semibold">Effective Date:</span> August 20, 2026
                        </div>
                        <div>
                            <span className="font-semibold">Last Updated:</span> August 20, 2026
                        </div>
                        <div>
                            <span className="font-semibold">Version:</span> 2.4.0 (Meta Graph API v21.0 Compliant)
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-5xl mx-auto px-6 pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Sticky Sidebar / Table of Contents */}
                    <aside className="hidden lg:block lg:col-span-4">
                        <div
                            className={`sticky top-28 p-5 rounded-xl border text-sm ${
                                isLight
                                    ? "bg-white border-slate-200 shadow-sm"
                                    : "bg-[#12101b] border-white/10"
                            }`}
                        >
                            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-200 dark:border-white/10 font-semibold text-xs tracking-wider uppercase">
                                <FileText className="w-4 h-4 text-violet-500" />
                                <span className={isLight ? "text-slate-700" : "text-slate-300"}>
                                    Table of Contents
                                </span>
                            </div>

                            <nav className="space-y-1">
                                {navItems.map((item) => {
                                    const isActive = activeSection === item.id;
                                    return (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            className={`block px-3 py-1.5 rounded-md text-xs transition-colors ${
                                                isActive
                                                    ? isLight
                                                        ? "bg-violet-50 text-violet-700 font-semibold"
                                                        : "bg-violet-950/40 text-violet-300 font-semibold"
                                                    : isLight
                                                    ? "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                            }`}
                                        >
                                            {item.label}
                                        </a>
                                    );
                                })}
                            </nav>

                            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 text-xs">
                                <p className="text-slate-500 dark:text-slate-400 mb-2">
                                    Questions regarding our policy?
                                </p>
                                <a
                                    href="mailto:privacy@creatorstack.io"
                                    className="inline-flex items-center gap-1.5 font-medium text-violet-600 dark:text-violet-400 hover:underline"
                                >
                                    <Mail className="w-3.5 h-3.5" />
                                    privacy@creatorstack.io
                                </a>
                            </div>
                        </div>
                    </aside>

                    {/* Right Main Text Content */}
                    <div className="lg:col-span-8 space-y-12 text-sm md:text-base leading-relaxed">
                        {/* 1. Overview */}
                        <section id="overview" className="scroll-mt-28 space-y-4">
                            <h2
                                className={`text-xl md:text-2xl font-bold pb-2 border-b ${
                                    isLight
                                        ? "text-slate-900 border-slate-200"
                                        : "text-white border-white/10"
                                }`}
                            >
                                1. Overview & Scope
                            </h2>
                            <p>
                                CreatorStack (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) provides an omnichannel content
                                publishing, scheduling, and analytics orchestration platform designed for content
                                creators, marketing agencies, and businesses.
                            </p>
                            <p>
                                This Privacy Policy applies to all services, features, websites (including{" "}
                                <span className="font-mono text-xs font-semibold">creatorstack.io</span> and associated
                                subdomains), and APIs provided by CreatorStack. By accessing or using our services, you
                                acknowledge that you have read, understood, and agree to the collection and use of
                                information in accordance with this policy.
                            </p>
                        </section>

                        {/* 2. Information We Collect */}
                        <section id="information-collected" className="scroll-mt-28 space-y-4">
                            <h2
                                className={`text-xl md:text-2xl font-bold pb-2 border-b ${
                                    isLight
                                        ? "text-slate-900 border-slate-200"
                                        : "text-white border-white/10"
                                }`}
                            >
                                2. Information We Collect
                            </h2>
                            <p>
                                We collect information that you directly provide to us, information generated
                                automatically during your use of our platform, and data authorized via social network
                                providers.
                            </p>

                            <div className="space-y-4 pt-2">
                                <div>
                                    <h3
                                        className={`font-semibold text-base mb-1 ${
                                            isLight ? "text-slate-900" : "text-white"
                                        }`}
                                    >
                                        2.1 Account & Registration Information
                                    </h3>
                                    <p>
                                        When you create an account, we collect your full name, email address, password
                                        hash (stored using salted bcrypt hashes; plaintext passwords are never stored),
                                        workspace name, and profile details.
                                    </p>
                                </div>

                                <div>
                                    <h3
                                        className={`font-semibold text-base mb-1 ${
                                            isLight ? "text-slate-900" : "text-white"
                                        }`}
                                    >
                                        2.2 Social Network Account Data (OAuth)
                                    </h3>
                                    <p>
                                        When you link a social media channel (such as Facebook Pages, Instagram
                                        Professional Accounts, Threads, LinkedIn, or X), we receive authentication
                                        tokens, account identifiers, profile pictures, and account names through official
                                        OAuth 2.0 authorization flows.
                                    </p>
                                </div>

                                <div>
                                    <h3
                                        className={`font-semibold text-base mb-1 ${
                                            isLight ? "text-slate-900" : "text-white"
                                        }`}
                                    >
                                        2.3 Content, Media & Scheduling Data
                                    </h3>
                                    <p>
                                        We store post drafts, captions, scheduled publishing timestamps, hashtags, and media
                                        files (images, videos) uploaded to our media storage infrastructure to dispatch
                                        them to your designated channels at your scheduled times.
                                    </p>
                                </div>

                                <div>
                                    <h3
                                        className={`font-semibold text-base mb-1 ${
                                            isLight ? "text-slate-900" : "text-white"
                                        }`}
                                    >
                                        2.4 Performance & Engagement Metrics
                                    </h3>
                                    <p>
                                        We aggregate publicly available engagement metrics returned by official platform
                                        APIs (e.g., impressions, reach, likes, comments, shares, video view counts) to
                                        render your analytics dashboards and performance reports.
                                    </p>
                                </div>

                                <div>
                                    <h3
                                        className={`font-semibold text-base mb-1 ${
                                            isLight ? "text-slate-900" : "text-white"
                                        }`}
                                    >
                                        2.5 Technical & Log Data
                                    </h3>
                                    <p>
                                        Our servers automatically record standard internet log data, including your IP
                                        address, browser type, operating system, referring URLs, timestamps of actions,
                                        and system error events.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 3. How We Use Data */}
                        <section id="how-we-use-data" className="scroll-mt-28 space-y-4">
                            <h2
                                className={`text-xl md:text-2xl font-bold pb-2 border-b ${
                                    isLight
                                        ? "text-slate-900 border-slate-200"
                                        : "text-white border-white/10"
                                }`}
                            >
                                3. How We Use Your Information
                            </h2>
                            <p>
                                We process your personal data strictly for legitimate business and operational purposes:
                            </p>

                            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base">
                                <li>
                                    <strong>Publishing & Orchestration:</strong> To schedule, format, and dispatch your
                                    content payloads to connected third-party social networks according to your
                                    instructions.
                                </li>
                                <li>
                                    <strong>Workspace & Access Management:</strong> To isolate multi-tenant workspace
                                    permissions so only authorized team members can manage connected channels and posts.
                                </li>
                                <li>
                                    <strong>AI Content Generation:</strong> To generate caption ideas, hashtags, and
                                    content suggestions using LLM APIs (e.g., OpenAI or Google Gemini). We only transmit
                                    the specific prompt inputs you explicitly submit. Your data is not used to train
                                    public foundation models.
                                </li>
                                <li>
                                    <strong>Security & Fraud Prevention:</strong> To monitor account authentication,
                                    detect unauthorized access attempts, and verify token validity.
                                </li>
                                <li>
                                    <strong>Transactional Communications:</strong> To send essential system notices,
                                    token expiration alerts, billing receipts, and account security notifications.
                                </li>
                            </ul>
                        </section>

                        {/* 4. Social Platforms & Meta API */}
                        <section id="meta-social-data" className="scroll-mt-28 space-y-4">
                            <h2
                                className={`text-xl md:text-2xl font-bold pb-2 border-b ${
                                    isLight
                                        ? "text-slate-900 border-slate-200"
                                        : "text-white border-white/10"
                                }`}
                            >
                                4. Social Platforms & Meta API Compliance
                            </h2>
                            <p>
                                CreatorStack strictly complies with the Meta Platform Terms, Developer Policies, and
                                API requirements for Facebook, Instagram, and Threads (Graph API v21.0):
                            </p>

                            <div
                                className={`p-4 rounded-lg border text-sm space-y-3 ${
                                    isLight
                                        ? "bg-slate-50 border-slate-200 text-slate-700"
                                        : "bg-[#14121f] border-white/10 text-slate-300"
                                }`}
                            >
                                <div className="font-semibold text-base flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-violet-500" />
                                    <span>Zero Password Access & Granular Permissions</span>
                                </div>
                                <p>
                                    We never ask for, access, or store your passwords for any third-party social
                                    network. Authorization is completed directly on the provider&apos;s verified login
                                    dialogs.
                                </p>
                                <p>
                                    We strictly request the minimum permissions needed to operate the features you
                                    activate (e.g., <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-xs font-mono">pages_show_list</code>,{" "}
                                    <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-xs font-mono">pages_read_engagement</code>, and{" "}
                                    <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-xs font-mono">pages_manage_posts</code>).
                                </p>
                            </div>
                        </section>

                        {/* 5. Data Security & Storage */}
                        <section id="security-encryption" className="scroll-mt-28 space-y-4">
                            <h2
                                className={`text-xl md:text-2xl font-bold pb-2 border-b ${
                                    isLight
                                        ? "text-slate-900 border-slate-200"
                                        : "text-white border-white/10"
                                }`}
                            >
                                5. Data Security & Cryptographic Storage
                            </h2>
                            <p>
                                We employ industry-standard technical and organizational security measures to protect your
                                personal data against unauthorized access, loss, alteration, or disclosure:
                            </p>

                            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base">
                                <li>
                                    <strong>AES-256-GCM Token Encryption:</strong> All social media access tokens, refresh
                                    tokens, and sensitive credentials are encrypted at rest using authenticated
                                    AES-256-GCM with distinct initialization vectors (IVs) and authentication tags before
                                    database insertion. Plaintext tokens are never written to disk.
                                </li>
                                <li>
                                    <strong>Encryption in Transit:</strong> All HTTP traffic and API communications are
                                    strictly encrypted using TLS 1.3.
                                </li>
                                <li>
                                    <strong>CSRF & HMAC Protection:</strong> All OAuth handshakes utilize cryptographically
                                    random state tokens validated via HMAC signatures to prevent cross-site request
                                    forgery.
                                </li>
                                <li>
                                    <strong>Access Control:</strong> Database access is restricted to authenticated internal
                                    services with strict principle-of-least-privilege firewall rules.
                                </li>
                            </ul>
                        </section>

                        {/* 6. Retention & Data Deletion */}
                        <section id="data-retention-deletion" className="scroll-mt-28 space-y-4">
                            <h2
                                className={`text-xl md:text-2xl font-bold pb-2 border-b ${
                                    isLight
                                        ? "text-slate-900 border-slate-200"
                                        : "text-white border-white/10"
                                }`}
                            >
                                6. Data Retention & User Data Deletion Instructions
                            </h2>
                            <p>
                                We retain personal information and social media tokens only for as long as necessary to
                                fulfill the purposes outlined in this policy or until you request deletion.
                            </p>

                            <div
                                className={`p-5 rounded-lg border space-y-4 ${
                                    isLight
                                        ? "bg-slate-50 border-slate-200 text-slate-700"
                                        : "bg-[#14121f] border-white/10 text-slate-300"
                                }`}
                            >
                                <div className="flex items-center gap-2 font-semibold text-base text-red-500 dark:text-red-400">
                                    <Trash2 className="w-4 h-4" />
                                    <span>Instructions for Requesting Data Deletion</span>
                                </div>
                                <p className="text-sm">
                                    In accordance with Meta Platform policies and privacy regulations, you have full
                                    control over removing your connected accounts and personal data. You can delete your
                                    data using any of the following methods:
                                </p>

                                <div className="space-y-3 text-xs md:text-sm">
                                    <div
                                        className={`p-3 rounded-md border ${
                                            isLight
                                                ? "bg-white border-slate-200"
                                                : "bg-[#0f0d18] border-white/10"
                                        }`}
                                    >
                                        <strong className={isLight ? "text-slate-900" : "text-white"}>
                                            Method 1: Disconnect via CreatorStack Dashboard
                                        </strong>
                                        <p className="mt-1 text-slate-600 dark:text-slate-400">
                                            Log in to CreatorStack, navigate to <em>Settings &rarr; Connected Accounts</em>,
                                            select the channel you want to remove, and click <strong>Disconnect Account</strong>.
                                            All associated access tokens and channel caches are immediately purged from our
                                            database.
                                        </p>
                                    </div>

                                    <div
                                        className={`p-3 rounded-md border ${
                                            isLight
                                                ? "bg-white border-slate-200"
                                                : "bg-[#0f0d18] border-white/10"
                                        }`}
                                    >
                                        <strong className={isLight ? "text-slate-900" : "text-white"}>
                                            Method 2: Revoke Access from Platform Settings
                                        </strong>
                                        <p className="mt-1 text-slate-600 dark:text-slate-400">
                                            You can revoke permissions at any time directly through your Facebook account
                                            (<em>Settings & Privacy &rarr; Settings &rarr; Apps and Websites &rarr; CreatorStack &rarr; Remove</em>).
                                        </p>
                                    </div>

                                    <div
                                        className={`p-3 rounded-md border ${
                                            isLight
                                                ? "bg-white border-slate-200"
                                                : "bg-[#0f0d18] border-white/10"
                                        }`}
                                    >
                                        <strong className={isLight ? "text-slate-900" : "text-white"}>
                                            Method 3: Submit a Formal Account & Data Deletion Request
                                        </strong>
                                        <p className="mt-1 text-slate-600 dark:text-slate-400">
                                            Send an email from your registered email address to{" "}
                                            <a
                                                href="mailto:privacy@creatorstack.io"
                                                className="text-violet-600 dark:text-violet-400 underline font-medium"
                                            >
                                                privacy@creatorstack.io
                                            </a>{" "}
                                            with the subject &quot;Data Deletion Request&quot;. Our team will completely remove
                                            your workspace, user account, and stored assets within 48 business hours.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 7. Your Privacy Rights */}
                        <section id="user-rights" className="scroll-mt-28 space-y-4">
                            <h2
                                className={`text-xl md:text-2xl font-bold pb-2 border-b ${
                                    isLight
                                        ? "text-slate-900 border-slate-200"
                                        : "text-white border-white/10"
                                }`}
                            >
                                7. Your Privacy Rights (GDPR & CCPA/CPRA)
                            </h2>
                            <p>
                                Depending on your jurisdiction (such as the European Economic Area, United Kingdom, or
                                California), you have specific statutory rights concerning your personal data:
                            </p>

                            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base">
                                <li>
                                    <strong>Right to Access:</strong> You can request a copy of the personal data we hold
                                    about you.
                                </li>
                                <li>
                                    <strong>Right to Rectification:</strong> You can update or correct inaccurate profile
                                    or workspace information.
                                </li>
                                <li>
                                    <strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> You can request
                                    permanent deletion of your personal records.
                                </li>
                                <li>
                                    <strong>Right to Data Portability:</strong> You can request your content and account data
                                    in a structured, commonly used, machine-readable format.
                                </li>
                                <li>
                                    <strong>Non-Sale of Personal Data:</strong> We do not sell, rent, or trade your personal
                                    data or platform metrics to third-party data brokers or advertisers.
                                </li>
                            </ul>
                        </section>

                        {/* 8. Cookies & Tracking */}
                        <section id="cookies-tracking" className="scroll-mt-28 space-y-4">
                            <h2
                                className={`text-xl md:text-2xl font-bold pb-2 border-b ${
                                    isLight
                                        ? "text-slate-900 border-slate-200"
                                        : "text-white border-white/10"
                                }`}
                            >
                                8. Cookies & Tracking Technologies
                            </h2>
                            <p>
                                We use strictly necessary cookies and local storage tokens to keep you securely logged in,
                                maintain workspace sessions, and remember your theme preferences (Light / Dark mode).
                            </p>
                            <p>
                                You can configure your browser settings to refuse or delete cookies; however, certain
                                authenticated dashboard features may not function properly without essential cookies.
                            </p>
                        </section>

                        {/* 9. Third-Party Services */}
                        <section id="third-parties" className="scroll-mt-28 space-y-4">
                            <h2
                                className={`text-xl md:text-2xl font-bold pb-2 border-b ${
                                    isLight
                                        ? "text-slate-900 border-slate-200"
                                        : "text-white border-white/10"
                                }`}
                            >
                                9. Third-Party Service Providers
                            </h2>
                            <p>
                                We may engage trusted third-party service providers to perform platform infrastructure
                                services under strict confidentiality and data protection agreements:
                            </p>

                            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base">
                                <li>
                                    <strong>Cloud Infrastructure & Database:</strong> Secure cloud hosting and managed
                                    database clusters with encryption at rest.
                                </li>
                                <li>
                                    <strong>Media Storage:</strong> Cloudinary for optimized media storage and delivery.
                                </li>
                                <li>
                                    <strong>AI Processing:</strong> OpenAI and Google Gemini APIs for on-demand user-initiated
                                    prompt generation.
                                </li>
                                <li>
                                    <strong>Email Delivery:</strong> Transactional SMTP providers for OTPs and security
                                    alerts.
                                </li>
                            </ul>
                        </section>

                        {/* 10. Policy Changes */}
                        <section id="policy-changes" className="scroll-mt-28 space-y-4">
                            <h2
                                className={`text-xl md:text-2xl font-bold pb-2 border-b ${
                                    isLight
                                        ? "text-slate-900 border-slate-200"
                                        : "text-white border-white/10"
                                }`}
                            >
                                10. Changes to This Privacy Policy
                            </h2>
                            <p>
                                We may update this Privacy Policy periodically to reflect changes in legal requirements,
                                platform API guidelines, or our feature offerings. When changes are made, we will revise
                                the &quot;Last Updated&quot; date at the top of this document. For material modifications, we will
                                notify you via an in-app banner or an email notification.
                            </p>
                        </section>

                        {/* 11. Contact Information */}
                        <section id="contact-us" className="scroll-mt-28 space-y-4 pt-4">
                            <h2
                                className={`text-xl md:text-2xl font-bold pb-2 border-b ${
                                    isLight
                                        ? "text-slate-900 border-slate-200"
                                        : "text-white border-white/10"
                                }`}
                            >
                                11. Contact Information
                            </h2>
                            <p>
                                If you have any questions, concerns, or requests regarding this Privacy Policy or our data
                                protection practices, please contact our Data Protection Officer:
                            </p>

                            <div
                                className={`p-5 rounded-lg border space-y-2 text-sm ${
                                    isLight
                                        ? "bg-white border-slate-200"
                                        : "bg-[#12101b] border-white/10"
                                }`}
                            >
                                <p className={`font-semibold ${isLight ? "text-slate-900" : "text-white"}`}>
                                    CreatorStack Privacy & Security Office
                                </p>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Email:{" "}
                                    <a
                                        href="mailto:privacy@creatorstack.io"
                                        className="text-violet-600 dark:text-violet-400 underline font-medium"
                                    >
                                        privacy@creatorstack.io
                                    </a>
                                </p>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Support Desk:{" "}
                                    <a
                                        href="mailto:support@creatorstack.io"
                                        className="text-violet-600 dark:text-violet-400 underline font-medium"
                                    >
                                        support@creatorstack.io
                                    </a>
                                </p>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Website:{" "}
                                    <Link
                                        href="/"
                                        className="text-violet-600 dark:text-violet-400 underline font-medium"
                                    >
                                        creatorstack.io
                                    </Link>
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
