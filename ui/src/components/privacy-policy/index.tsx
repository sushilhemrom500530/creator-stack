"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    ShieldCheck,
    Lock,
    Eye,
    Database,
    Share2,
    Trash2,
    FileText,
    Mail,
    CheckCircle2,
    ArrowRight,
    ExternalLink,
    KeyRound,
    Server
} from "lucide-react";

export default function PrivacyPolicy() {
    const [activeSection, setActiveSection] = useState("overview");

    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll("section[id]");
            const scrollY = window.pageYOffset;

            sections.forEach((current: any) => {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 120;
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
        { id: "meta-oauth-data", label: "3. Meta Platform & Social OAuth" },
        { id: "how-we-use-data", label: "4. How We Use Your Data" },
        { id: "security-encryption", label: "5. AES-256-GCM Security" },
        { id: "data-deletion", label: "6. Data Retention & Deletion" },
        { id: "user-rights", label: "7. Your GDPR & CCPA Rights" },
        { id: "contact-us", label: "8. Contact Information" },
    ];

    return (
        <main className="bg-[#0a0614] min-h-screen text-white selection:bg-[#9747FF]/30 selection:text-white">
            {/* Hero Header */}
            <section className="relative w-full py-20 md:py-28 px-4 overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[600px] h-[600px] bg-[#9747FF]/15 rounded-full blur-[140px]"></div>
                    <div className="w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] -translate-x-40 -translate-y-20"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#9747FF]/30 bg-[#9747FF]/10 backdrop-blur-md mb-6">
                        <ShieldCheck className="w-4 h-4 text-[#DDB9FF]" />
                        <span className="text-xs font-semibold tracking-wider text-[#DDB9FF] uppercase">
                            Trust & Transparency
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 font-serif">
                        Privacy Policy
                    </h1>

                    <p className="text-[#a19bb0] text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-6">
                        At CreatorStack, your privacy and digital asset security are paramount. This policy outlines our commitments to zero plaintext token storage, enterprise encryption, and compliance with Meta Platform Policies.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#8b849c]">
                        <span className="px-3 py-1 rounded-md bg-white/5 border border-white/10">
                            Effective Date: August 20, 2026
                        </span>
                        <span className="px-3 py-1 rounded-md bg-white/5 border border-white/10">
                            Last Updated: August 20, 2026
                        </span>
                        <span className="px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Meta Platform Certified
                        </span>
                    </div>
                </div>
            </section>

            {/* Main Content Layout */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Sticky Table of Contents */}
                    <aside className="hidden lg:block lg:col-span-4">
                        <div className="sticky top-28 p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-[#DDB9FF]" />
                                Contents Navigation
                            </h3>
                            <nav className="space-y-1.5">
                                {navItems.map((item) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className={`block px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${activeSection === item.id
                                            ? "bg-[#9747FF]/20 text-[#DDB9FF] border border-[#9747FF]/30 font-semibold"
                                            : "text-[#a19bb0] hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </nav>

                            <div className="mt-8 pt-6 border-t border-white/10">
                                <p className="text-xs text-[#8b849c] mb-3">Have questions about your data?</p>
                                <Link
                                    href="mailto:privacy@creatorstack.io"
                                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#DDB9FF] hover:underline"
                                >
                                    <Mail className="w-3.5 h-3.5" />
                                    privacy@creatorstack.io
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Policy Detail Sections */}
                    <div className="lg:col-span-8 space-y-16 text-[#c5bed3] leading-relaxed text-sm md:text-base">

                        {/* Section 1: Overview */}
                        <section id="overview" className="scroll-mt-28 space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold font-serif text-white flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-[#9747FF]/20 text-[#DDB9FF] text-sm flex items-center justify-center font-mono">1</span>
                                Overview & Scope
                            </h2>
                            <p>
                                CreatorStack (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) provides an enterprise-grade omnichannel content publishing, scheduling, and analytics orchestration platform designed for content creators, agencies, and businesses.
                            </p>
                            <p>
                                This Privacy Policy describes how we collect, process, encrypt, and safeguard information when you use our website, web applications, and backend APIs located at <span className="text-[#DDB9FF] font-mono text-xs">creatorstack.io</span> and associated subdomains.
                            </p>
                        </section>

                        {/* Section 2: Information We Collect */}
                        <section id="information-collected" className="scroll-mt-28 space-y-6">
                            <h2 className="text-2xl md:text-3xl font-bold font-serif text-white flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm flex items-center justify-center font-mono">2</span>
                                Information We Collect
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                                    <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                                        Account Information
                                    </h3>
                                    <p className="text-xs text-[#a19bb0] leading-relaxed">
                                        Name, email address, hashed credentials, workspace configurations, and billing transaction identifiers.
                                    </p>
                                </div>
                                <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                                    <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                                        Social Media Identity
                                    </h3>
                                    <p className="text-xs text-[#a19bb0] leading-relaxed">
                                        Public profile handles, page names, profile pictures, and platform identifiers returned via OAuth approval.
                                    </p>
                                </div>
                                <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                                    <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                                        Content & Publishing Data
                                    </h3>
                                    <p className="text-xs text-[#a19bb0] leading-relaxed">
                                        Captions, scheduled timestamps, media attachments (images/videos uploaded to Cloudinary), and post status records.
                                    </p>
                                </div>
                                <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                                    <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                                        Analytics & Insights
                                    </h3>
                                    <p className="text-xs text-[#a19bb0] leading-relaxed">
                                        Aggregated engagement metrics, reach, impressions, likes, and comment counts synchronized via official platform APIs.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Meta Platform & Social OAuth */}
                        <section id="meta-oauth-data" className="scroll-mt-28 space-y-6">
                            <h2 className="text-2xl md:text-3xl font-bold font-serif text-white flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-[#FF8A65]/20 text-[#FF8A65] text-sm flex items-center justify-center font-mono">3</span>
                                Meta Platform & Social OAuth Data Usage
                            </h2>
                            <p>
                                When you connect your Facebook Page, Instagram Professional Account, or Threads Account to CreatorStack, we interface exclusively via official Meta Graph API v21.0 endpoints:
                            </p>

                            <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#9747FF]/20 flex-shrink-0 flex items-center justify-center">
                                        <KeyRound className="w-5 h-5 text-[#DDB9FF]" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white text-base">We Never See or Store Your Social Passwords</h4>
                                        <p className="text-xs text-[#a19bb0] mt-1">
                                            Your authentication is processed entirely on Facebook/Meta secure dialogs. We receive temporary authorization codes exchanged server-side for access tokens.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex-shrink-0 flex items-center justify-center">
                                        <Share2 className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white text-base">Strict Scopes & Explicit Approvals</h4>
                                        <p className="text-xs text-[#a19bb0] mt-1">
                                            We strictly request permissions necessary to discover your Pages (<code className="text-[#DDB9FF]">pages_show_list</code>), analyze post metrics (<code className="text-[#DDB9FF]">pages_read_engagement</code>), and dispatch authorized content (<code className="text-[#DDB9FF]">pages_manage_posts</code>).
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 4: How We Use Data */}
                        <section id="how-we-use-data" className="scroll-mt-28 space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold font-serif text-white flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm flex items-center justify-center font-mono">4</span>
                                How We Use Your Data
                            </h2>
                            <ul className="space-y-3 list-disc list-inside text-sm md:text-base text-[#a19bb0]">
                                <li><strong className="text-white">Executing Social Publishing:</strong> Dispatching your scheduled media and caption payloads to your chosen platforms at the exact dates and times you define.</li>
                                <li><strong className="text-white">Workspace Multi-Tenancy:</strong> Isolating access control so only authorized members of your workspace can view or manage connected social channels.</li>
                                <li><strong className="text-white">AI Content Generation:</strong> Leveraging LLMs (OpenAI / Google Gemini) to draft captions and hashtag ideas based strictly on prompts you submit (your data is never used to train third-party public models).</li>
                                <li><strong className="text-white">Notification & Security Alerts:</strong> Sending automated email alerts for expiring tokens, failed post retries, and OTP verification codes.</li>
                            </ul>
                        </section>

                        {/* Section 5: AES-256-GCM Security */}
                        <section id="security-encryption" className="scroll-mt-28 space-y-6">
                            <h2 className="text-2xl md:text-3xl font-bold font-serif text-white flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 text-sm flex items-center justify-center font-mono">5</span>
                                Zero Plaintext Token Architecture (AES-256-GCM)
                            </h2>
                            <p>
                                CreatorStack adheres to a strict <strong>Security-First Architecture</strong>:
                            </p>
                            <div className="p-6 rounded-2xl border border-purple-500/20 bg-purple-950/10 space-y-4">
                                <div className="flex items-center gap-3 text-purple-300 font-semibold text-base">
                                    <Lock className="w-5 h-5" />
                                    Enterprise Encryption at Rest & In Transit
                                </div>
                                <p className="text-xs text-[#b8b0cc] leading-relaxed">
                                    Every OAuth access token and refresh token received from Meta, LinkedIn, Threads, or X is immediately encrypted using <strong>AES-256-GCM</strong> (Authenticated Encryption with Associated Data) with unique initialization vectors (IVs) and authentication tags before being written to MongoDB. Plaintext tokens are never written to database disks or exposed in API payloads.
                                </p>
                                <p className="text-xs text-[#b8b0cc] leading-relaxed">
                                    All OAuth handshakes enforce cryptographic HMAC state verification to completely mitigate cross-site request forgery (CSRF) login vulnerabilities.
                                </p>
                            </div>
                        </section>

                        {/* Section 6: Data Retention & User Data Deletion Instructions */}
                        <section id="data-deletion" className="scroll-mt-28 space-y-6">
                            <h2 className="text-2xl md:text-3xl font-bold font-serif text-white flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 text-sm flex items-center justify-center font-mono">6</span>
                                Data Retention & User Data Deletion Instructions
                            </h2>
                            <p>
                                In compliance with Meta Platform Terms and global privacy regulations (GDPR / CCPA), you maintain full autonomy over your data:
                            </p>

                            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Trash2 className="w-5 h-5 text-red-400" />
                                    How to Request Data Deletion
                                </h3>
                                <p className="text-xs text-[#a19bb0] leading-relaxed">
                                    If you wish to remove your connected social media accounts, encrypted tokens, and post history, you can do so through either of the following methods:
                                </p>

                                <div className="space-y-3 text-xs text-[#c5bed3]">
                                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                                        <strong className="text-white block mb-1">Option A: Disconnect Directly in App</strong>
                                        Navigate to <Link href="/user/connected-accounts" className="text-[#DDB9FF] underline">Connected Accounts</Link> in your dashboard, click <em>Manage</em> on any channel, and select <strong>Disconnect Account</strong>. All associated access tokens will be immediately purged.
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                                        <strong className="text-white block mb-1">Option B: Revoke via Facebook App Settings</strong>
                                        Go to your Facebook Profile $\to$ <em>Settings & Privacy</em> $\to$ <em>Settings</em> $\to$ <em>Apps and Websites</em>, find <strong>CreatorStack</strong>, and click <strong>Remove</strong>.
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                                        <strong className="text-white block mb-1">Option C: Submit a Formal Deletion Request</strong>
                                        Email <Link href="mailto:privacy@creatorstack.io" className="text-[#DDB9FF] underline">privacy@creatorstack.io</Link> with your registered account email. Our data protection team will permanently delete your workspace records within 48 hours.
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 7: User Rights */}
                        <section id="user-rights" className="scroll-mt-28 space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold font-serif text-white flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 text-sm flex items-center justify-center font-mono">7</span>
                                Your GDPR & CCPA Rights
                            </h2>
                            <p>
                                Depending on your geographical region, you have statutory rights concerning your personal data, including the right to access, rectify, port, restrict processing of, or erase your information. We do not sell, rent, or monetize your personal data to third parties.
                            </p>
                        </section>

                        {/* Section 8: Contact */}
                        <section id="contact-us" className="scroll-mt-28 space-y-6 border-t border-white/10 pt-10">
                            <h2 className="text-2xl md:text-3xl font-bold font-serif text-white flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm flex items-center justify-center font-mono">8</span>
                                Contact Information
                            </h2>
                            <p>
                                For questions, concerns, or requests regarding this Privacy Policy or our security practices, contact our Data Protection Officer at:
                            </p>

                            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div>
                                    <h4 className="font-bold text-white text-base">CreatorStack Privacy & Security Office</h4>
                                    <p className="text-xs text-[#a19bb0] mt-0.5">Email: privacy@creatorstack.io</p>
                                    <p className="text-xs text-[#a19bb0]">Support: support@creatorstack.io</p>
                                </div>
                                <Link
                                    href="mailto:privacy@creatorstack.io"
                                    className="px-6 py-2.5 rounded-xl bg-[#9747FF] hover:bg-[#8338ec] text-white font-semibold text-xs transition-all flex items-center gap-2"
                                >
                                    Contact Privacy Team
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </main>
    );
}
