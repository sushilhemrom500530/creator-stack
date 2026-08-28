"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/providers/mode-theme";
import {
  ShieldCheck,
  Lock,
  Trash2,
  FileText,
  Mail,
  CheckCircle2,
  ArrowRight,
  KeyRound,
  Share2,
  Server,
  Fingerprint,
  RefreshCw
} from "lucide-react";
import "./index.css";

export default function PrivacyPolicy() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const themeClass = isLight ? "is-light" : "is-dark";

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
    { id: "meta-oauth-data", label: "3. Meta Platform & Social OAuth" },
    { id: "how-we-use-data", label: "4. Data Usage & AI Operations" },
    { id: "security-encryption", label: "5. AES-256-GCM Security" },
    { id: "data-deletion", label: "6. User Data Deletion Instructions" },
    { id: "user-rights", label: "7. GDPR & CCPA Privacy Rights" },
    { id: "contact-us", label: "8. Privacy Office Contact" },
  ];

  return (
    <main className={`privacy-page-main ${themeClass}`}>
      {/* Hero Section */}
      <section className="privacy-hero-section">
        <div className="privacy-glow-blob privacy-glow-left" />
        <div className="privacy-glow-blob privacy-glow-right" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* Badge */}
          <div className={`privacy-badge ${themeClass}`}>
            <ShieldCheck className="w-4 h-4" />
            <span>Trust & Security Core</span>
          </div>

          {/* Heading */}
          <h1 className="privacy-heading">
            Privacy & Data{' '}
            <span className={`privacy-gradient-text ${themeClass}`}>
              Architecture
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-6 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
            At CreatorStack, your privacy and digital asset security are paramount. This policy outlines our commitments to zero plaintext token storage, enterprise AES-256-GCM encryption, and full compliance with Meta Platform Policies.
          </p>

          {/* Meta Verification Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className={`px-3 py-1.5 rounded-full border font-medium ${isLight ? "bg-slate-100 border-slate-200 text-slate-700" : "bg-white/5 border-white/10 text-slate-300"}`}>
              Effective: August 2026
            </span>
            <span className={`px-3 py-1.5 rounded-full border font-medium ${isLight ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"} flex items-center gap-1.5`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Meta Platform Certified (v21.0)
            </span>
            <span className={`px-3 py-1.5 rounded-full border font-medium ${isLight ? "bg-purple-50 border-purple-200 text-purple-700" : "bg-purple-500/10 border-purple-500/20 text-purple-400"}`}>
              GDPR & CCPA Compliant
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Sticky Table of Contents */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className={`sticky top-28 p-6 rounded-2xl border backdrop-blur-md ${isLight ? "bg-slate-50/80 border-slate-200 shadow-sm" : "bg-white/[0.02] border-white/10"}`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                <FileText className="w-4 h-4 text-[#7c3aed]" />
                Contents Navigation
              </h3>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`privacy-nav-link ${themeClass} ${activeSection === item.id ? "active" : ""}`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className={`mt-8 pt-6 border-t ${isLight ? "border-slate-200" : "border-white/10"}`}>
                <p className={`text-xs mb-2 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Questions about data security?</p>
                <Link
                  href="mailto:privacy@creatorstack.io"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#7c3aed] dark:text-[#c4b5fd] hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  privacy@creatorstack.io
                </Link>
              </div>
            </div>
          </aside>

          {/* Policy Detail Sections */}
          <div className="lg:col-span-8 space-y-16 leading-relaxed text-sm md:text-base">

            {/* Section 1: Overview */}
            <section id="overview" className="scroll-mt-28 space-y-4">
              <h2 className={`text-2xl md:text-3xl font-bold font-serif flex items-center gap-3 ${isLight ? "text-slate-900" : "text-white"}`}>
                <span className="w-8 h-8 rounded-lg bg-[#7c3aed]/15 text-[#7c3aed] dark:text-[#c4b5fd] text-sm flex items-center justify-center font-mono font-bold">1</span>
                Overview & Scope
              </h2>
              <p className={isLight ? "text-slate-600" : "text-slate-300"}>
                CreatorStack (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) provides an omnichannel content publishing, scheduling, and analytics orchestration platform designed for content creators, marketing agencies, and global enterprises.
              </p>
              <p className={isLight ? "text-slate-600" : "text-slate-300"}>
                This Privacy Policy describes how we collect, process, encrypt, and safeguard information when you interact with our website, application dashboards, and backend APIs located at <span className="font-mono text-xs text-[#7c3aed] dark:text-[#c4b5fd]">creatorstack.io</span>.
              </p>
            </section>

            {/* Section 2: Information We Collect */}
            <section id="information-collected" className="scroll-mt-28 space-y-6">
              <h2 className={`text-2xl md:text-3xl font-bold font-serif flex items-center gap-3 ${isLight ? "text-slate-900" : "text-white"}`}>
                <span className="w-8 h-8 rounded-lg bg-[#14b8a6]/15 text-[#14b8a6] text-sm flex items-center justify-center font-mono font-bold">2</span>
                Information We Collect
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`privacy-card ${themeClass}`}>
                  <h3 className={`font-semibold mb-2 flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                    <CheckCircle2 className="w-4 h-4 text-[#14b8a6]" />
                    Account & Workspace Data
                  </h3>
                  <p className={`text-xs leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    Name, email address, password hashes (bcrypt), workspace roles, session identifiers, and subscription billing IDs.
                  </p>
                </div>
                <div className={`privacy-card ${themeClass}`}>
                  <h3 className={`font-semibold mb-2 flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                    <CheckCircle2 className="w-4 h-4 text-[#14b8a6]" />
                    Connected Social Channels
                  </h3>
                  <p className={`text-xs leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    Channel handles, platform usernames, profile pictures, and platform identifiers returned through authorized OAuth handshakes.
                  </p>
                </div>
                <div className={`privacy-card ${themeClass}`}>
                  <h3 className={`font-semibold mb-2 flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                    <CheckCircle2 className="w-4 h-4 text-[#14b8a6]" />
                    Content & Scheduling Assets
                  </h3>
                  <p className={`text-xs leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    Post captions, scheduled publication timestamps, media files (stored via secure Cloudinary storage), and execution logs.
                  </p>
                </div>
                <div className={`privacy-card ${themeClass}`}>
                  <h3 className={`font-semibold mb-2 flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                    <CheckCircle2 className="w-4 h-4 text-[#14b8a6]" />
                    Performance & Analytics
                  </h3>
                  <p className={`text-xs leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    Aggregated post metrics (impressions, clicks, engagements, reach) fetched on-demand through official platform APIs.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Meta Platform & Social OAuth */}
            <section id="meta-oauth-data" className="scroll-mt-28 space-y-6">
              <h2 className={`text-2xl md:text-3xl font-bold font-serif flex items-center gap-3 ${isLight ? "text-slate-900" : "text-white"}`}>
                <span className="w-8 h-8 rounded-lg bg-[#FF8A65]/15 text-[#FF8A65] text-sm flex items-center justify-center font-mono font-bold">3</span>
                Meta Platform & Social OAuth Integrations
              </h2>
              <p className={isLight ? "text-slate-600" : "text-slate-300"}>
                When connecting Facebook Pages, Instagram Professional Accounts, Threads, or WhatsApp to CreatorStack, our architecture operates strictly through official Meta Graph API v21.0 protocols:
              </p>

              <div className={`p-6 rounded-2xl border space-y-5 ${isLight ? "bg-slate-50 border-slate-200" : "bg-white/[0.02] border-white/10"}`}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/15 flex-shrink-0 flex items-center justify-center">
                    <KeyRound className="w-5 h-5 text-[#7c3aed]" />
                  </div>
                  <div>
                    <h4 className={`font-semibold text-base ${isLight ? "text-slate-900" : "text-white"}`}>Zero Social Password Exposure</h4>
                    <p className={`text-xs mt-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                      Your account credentials and passwords are entered exclusively on Meta&apos;s secure login dialogs. CreatorStack never receives, views, or intercepts your passwords.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#14b8a6]/15 flex-shrink-0 flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-[#14b8a6]" />
                  </div>
                  <div>
                    <h4 className={`font-semibold text-base ${isLight ? "text-slate-900" : "text-white"}`}>Granular & Minimal Scopes</h4>
                    <p className={`text-xs mt-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                      We request only the minimum scopes required for publishing and analytics (<code className="text-[#7c3aed] font-semibold">pages_show_list</code>, <code className="text-[#7c3aed] font-semibold">pages_read_engagement</code>, <code className="text-[#7c3aed] font-semibold">pages_manage_posts</code>).
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Data Usage */}
            <section id="how-we-use-data" className="scroll-mt-28 space-y-4">
              <h2 className={`text-2xl md:text-3xl font-bold font-serif flex items-center gap-3 ${isLight ? "text-slate-900" : "text-white"}`}>
                <span className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-sm flex items-center justify-center font-mono font-bold">4</span>
                Data Usage & AI Operations
              </h2>
              <ul className={`space-y-3 list-disc list-inside text-sm md:text-base ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                <li><strong className={isLight ? "text-slate-900" : "text-white"}>Omnichannel Post Publishing:</strong> Dispatching your scheduled media files and captions to target networks according to your timetable.</li>
                <li><strong className={isLight ? "text-slate-900" : "text-white"}>Multi-Tenant Isolation:</strong> Securing workspace data so only verified collaborators on your team can view or publish to connected channels.</li>
                <li><strong className={isLight ? "text-slate-900" : "text-white"}>AI Content Generation:</strong> Processing prompts through enterprise OpenAI and Google Gemini APIs to assist in drafting captions (your proprietary data is never used to train public models).</li>
                <li><strong className={isLight ? "text-slate-900" : "text-white"}>Automated Token Health Checks:</strong> Running daily background verification to warn you before tokens expire.</li>
              </ul>
            </section>

            {/* Section 5: Security */}
            <section id="security-encryption" className="scroll-mt-28 space-y-6">
              <h2 className={`text-2xl md:text-3xl font-bold font-serif flex items-center gap-3 ${isLight ? "text-slate-900" : "text-white"}`}>
                <span className="w-8 h-8 rounded-lg bg-[#7c3aed]/15 text-[#7c3aed] text-sm flex items-center justify-center font-mono font-bold">5</span>
                Zero Plaintext Token Architecture (AES-256-GCM)
              </h2>
              <div className={`p-6 rounded-2xl border space-y-4 ${isLight ? "bg-purple-50/60 border-purple-200" : "bg-purple-950/20 border-purple-500/30"}`}>
                <div className={`flex items-center gap-3 font-bold text-base ${isLight ? "text-purple-900" : "text-purple-300"}`}>
                  <Lock className="w-5 h-5 text-[#7c3aed]" />
                  Enterprise AES-256-GCM Cryptographic Standard
                </div>
                <p className={`text-xs leading-relaxed ${isLight ? "text-purple-950/80" : "text-purple-200/80"}`}>
                  Every OAuth access token and refresh token received from Meta, LinkedIn, X, or Threads is immediately encrypted using <strong>AES-256-GCM</strong> (Authenticated Encryption with Associated Data) with unique initialization vectors (IVs) and authentication tags before persistence in MongoDB. Plaintext tokens are never written to database disks or exposed in client responses.
                </p>
                <p className={`text-xs leading-relaxed ${isLight ? "text-purple-950/80" : "text-purple-200/80"}`}>
                  OAuth connection requests utilize HMAC-signed state tokens with strict timestamp validation to prevent CSRF attacks.
                </p>
              </div>
            </section>

            {/* Section 6: User Data Deletion */}
            <section id="data-deletion" className="scroll-mt-28 space-y-6">
              <h2 className={`text-2xl md:text-3xl font-bold font-serif flex items-center gap-3 ${isLight ? "text-slate-900" : "text-white"}`}>
                <span className="w-8 h-8 rounded-lg bg-red-500/15 text-red-500 text-sm flex items-center justify-center font-mono font-bold">6</span>
                User Data Deletion Instructions
              </h2>
              <p className={isLight ? "text-slate-600" : "text-slate-300"}>
                In strict compliance with Meta Platform Terms and global data protection standards (GDPR/CCPA), you have full control to purge your data at any time:
              </p>

              <div className={`p-6 rounded-2xl border space-y-4 ${isLight ? "bg-slate-50 border-slate-200" : "bg-white/[0.02] border-white/10"}`}>
                <h3 className={`text-base font-bold flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                  <Trash2 className="w-5 h-5 text-red-500" />
                  Step-by-Step Data Removal Methods
                </h3>

                <div className="space-y-3 text-xs">
                  <div className={`p-4 rounded-xl border ${isLight ? "bg-white border-slate-200" : "bg-white/5 border-white/5"}`}>
                    <strong className={`block mb-1 font-semibold ${isLight ? "text-slate-900" : "text-white"}`}>Method 1: In-App Instant Disconnection</strong>
                    <p className={isLight ? "text-slate-600" : "text-slate-400"}>
                      Navigate to <Link href="/user/connected-accounts" className="text-[#7c3aed] font-semibold underline">Connected Accounts</Link>, click <em>Manage</em> on the channel, and choose <strong>Disconnect Account</strong>. All stored tokens and synced metadata for that channel will be permanently purged immediately.
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border ${isLight ? "bg-white border-slate-200" : "bg-white/5 border-white/5"}`}>
                    <strong className={`block mb-1 font-semibold ${isLight ? "text-slate-900" : "text-white"}`}>Method 2: Revoke Access on Facebook</strong>
                    <p className={isLight ? "text-slate-600" : "text-slate-400"}>
                      Visit your Facebook account $\to$ <em>Settings & Privacy</em> $\to$ <em>Settings</em> $\to$ <em>Apps and Websites</em>, locate <strong>CreatorStack</strong>, and click <strong>Remove</strong>. Meta will notify our webhook to delete all associated tokens automatically.
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border ${isLight ? "bg-white border-slate-200" : "bg-white/5 border-white/5"}`}>
                    <strong className={`block mb-1 font-semibold ${isLight ? "text-slate-900" : "text-white"}`}>Method 3: Formal Account Purge Request</strong>
                    <p className={isLight ? "text-slate-600" : "text-slate-400"}>
                      Email our Data Protection Officer at <Link href="mailto:privacy@creatorstack.io" className="text-[#7c3aed] font-semibold underline">privacy@creatorstack.io</Link> with subject &quot;Data Deletion Request&quot;. All workspace posts, media, and records will be deleted within 48 hours.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7: User Rights */}
            <section id="user-rights" className="scroll-mt-28 space-y-4">
              <h2 className={`text-2xl md:text-3xl font-bold font-serif flex items-center gap-3 ${isLight ? "text-slate-900" : "text-white"}`}>
                <span className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 text-sm flex items-center justify-center font-mono font-bold">7</span>
                GDPR & CCPA Privacy Rights
              </h2>
              <p className={isLight ? "text-slate-600" : "text-slate-300"}>
                Under international regulations, you retain the rights of access, rectification, data portability, and erasure. CreatorStack does not sell, rent, or trade your personal data with third-party advertisers.
              </p>
            </section>

            {/* Section 8: Contact */}
            <section id="contact-us" className={`scroll-mt-28 space-y-6 border-t pt-10 ${isLight ? "border-slate-200" : "border-white/10"}`}>
              <h2 className={`text-2xl md:text-3xl font-bold font-serif flex items-center gap-3 ${isLight ? "text-slate-900" : "text-white"}`}>
                <span className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-sm flex items-center justify-center font-mono font-bold">8</span>
                Contact Our Privacy Team
              </h2>

              <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${isLight ? "bg-slate-50 border-slate-200" : "bg-white/[0.02] border-white/10"}`}>
                <div>
                  <h4 className={`font-bold text-base ${isLight ? "text-slate-900" : "text-white"}`}>CreatorStack Privacy & Security Office</h4>
                  <p className={`text-xs mt-0.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>Direct Inquiries: privacy@creatorstack.io</p>
                  <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>Developer Support: support@creatorstack.io</p>
                </div>
                <Link
                  href="mailto:privacy@creatorstack.io"
                  className="px-6 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-sm"
                >
                  Contact Privacy Officer
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
