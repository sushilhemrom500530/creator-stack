"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input, Button, Checkbox, Select, message } from "antd";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    ShieldCheck,
    Globe,
    Check,
    RotateCcw,
    Zap,
    Users,
} from "lucide-react";
import { FaGoogle, FaFacebook } from "react-icons/fa6";
import Logo from "@/components/reuseable/logo";
import { authApi } from "@/lib/api";

const COUNTRIES = [
    { value: "US", label: "United States" },
    { value: "GB", label: "United Kingdom" },
    { value: "CA", label: "Canada" },
    { value: "AU", label: "Australia" },
    { value: "DE", label: "Germany" },
    { value: "BD", label: "Bangladesh" },
    { value: "IN", label: "India" },
    { value: "SG", label: "Singapore" },
    { value: "AE", label: "United Arab Emirates" },
];

export default function RegisterContent() {
    const router = useRouter();

    // Form Step State: "form" -> "otp"
    const [step, setStep] = useState<"form" | "otp">("form");

    // Form inputs
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [country, setCountry] = useState("US");
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // OTP inputs
    const [verificationToken, setVerificationToken] = useState("");
    const [otp, setOtp] = useState("");
    const [countdown, setCountdown] = useState(180); // 3 minutes
    const [isResending, setIsResending] = useState(false);

    // OTP Timer
    useEffect(() => {
        if (step !== "otp") return;
        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [step]);

    // Handle Initial Registration Submission
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !password) {
            message.warning("Please fill in all required fields.");
            return;
        }

        if (password.length < 6) {
            message.warning("Password must be at least 6 characters long.");
            return;
        }

        if (!agreeTerms) {
            message.warning("Please agree to the Terms of Service & Privacy Policy.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await authApi.register({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password,
                country,
            });

            if (res?.verificationToken) {
                setVerificationToken(res.verificationToken);
                setStep("otp");
                setCountdown(180);
                message.success("6-digit verification code sent to your email!");
            }
        } catch (err: any) {
            message.error(err.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle OTP Verification
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.trim().length !== 6) {
            message.warning("Please enter the complete 6-digit OTP code.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await authApi.verifyOtp({
                verificationToken,
                otp: otp.trim(),
            });

            if (res?.accessToken) {
                localStorage.setItem("token", res.accessToken);
                localStorage.setItem("accessToken", res.accessToken);
                if (res.user) {
                    localStorage.setItem("user", JSON.stringify(res.user));
                }

                // Set cookie for Next.js middleware
                document.cookie = `accessToken=${res.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

                message.success("Account verified successfully! Welcome to CreatorStack! 🎉");
                router.push("/user/dashboard");
            }
        } catch (err: any) {
            message.error(err.message || "Invalid or expired OTP code.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Resend OTP
    const handleResendOtp = async () => {
        if (countdown > 0) return;
        setIsResending(true);
        try {
            const res = await authApi.resendOtp({ email: email.trim().toLowerCase() });
            setVerificationToken(res.verificationToken);
            setCountdown(180);
            message.success("New 6-digit verification code sent!");
        } catch (err: any) {
            message.error(err.message || "Failed to resend code.");
        } finally {
            setIsResending(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    return (
        <div className="min-h-screen w-full flex bg-[#F8FAFC] font-primary">
            {/* Left Side: Brand Visuals & Benefits */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0B0F19] text-white p-12 flex-col justify-between relative overflow-hidden">
                {/* Background Glows */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

                {/* Brand Header */}
                <div className="relative z-10">
                    <Link href="/" className="inline-block">
                        <Logo className="h-10 w-auto" />
                    </Link>
                </div>

                {/* Center Value Proposition */}
                <div className="relative z-10 space-y-8 my-auto max-w-lg">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        14-Day Free Trial • No Credit Card Required
                    </div>

                    <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
                        Join 10,000+ Creators Scaling Their Reach with AI Automation.
                    </h1>

                    <p className="text-slate-400 text-base leading-relaxed">
                        Unify your social publishing workflow. Manage Facebook, Instagram, Threads, and WhatsApp in one intelligent dashboard.
                    </p>

                    {/* Benefit Checklist */}
                    <div className="space-y-3 pt-2">
                        {[
                            "1-Click cross-posting across Meta, Threads & WhatsApp",
                            "AI caption generator, viral hooks & hashtag matrix",
                            "Automated post scheduling with smart timezone detection",
                            "Enterprise AES-256 encrypted credential protection",
                        ].map((benefit, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                                    <Check className="w-3.5 h-3.5" />
                                </div>
                                <span>{benefit}</span>
                            </div>
                        ))}
                    </div>

                    {/* Testimonial Quote */}
                    <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md space-y-3">
                        <p className="text-sm text-slate-300 italic">
                            &ldquo;CreatorStack saved our team 15+ hours every week. The multi-platform posting and AI copy suggestions are game-changing.&rdquo;
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-xs text-white">
                                AP
                            </div>
                            <div>
                                <h5 className="text-xs font-bold text-white">Apurbo Hemrom</h5>
                                <p className="text-[10px] text-slate-400">Head of Growth, CreatorStack</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Footer */}
                <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/10 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>SOC2 & GDPR Compliant</span>
                    </div>
                    <span>Cancel Anytime</span>
                </div>
            </div>

            {/* Right Side: Register & OTP Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    {/* Header */}
                    <div className="space-y-2 text-center sm:text-left">
                        <div className="lg:hidden flex justify-center mb-6">
                            <Logo className="h-10 w-auto" />
                        </div>

                        {step === "form" ? (
                            <>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                    Create your account
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Start managing your omnichannel content with AI in minutes.
                                </p>
                            </>
                        ) : (
                            <>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                    Verify your email
                                </h2>
                                <p className="text-sm text-slate-500">
                                    We sent a 6-digit verification code to <span className="font-semibold text-slate-800">{email}</span>.
                                </p>
                            </>
                        )}
                    </div>

                    {step === "form" ? (
                        <>
                            {/* Social Signup */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => message.info("Google OAuth signup initialized")}
                                    className="flex items-center justify-center gap-2.5 px-4 py-2.5 border border-slate-200 hover:border-slate-300 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition shadow-sm cursor-pointer"
                                >
                                    <FaGoogle className="w-4 h-4 text-red-500" />
                                    <span>Google</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => message.info("Facebook OAuth signup initialized")}
                                    className="flex items-center justify-center gap-2.5 px-4 py-2.5 border border-slate-200 hover:border-slate-300 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition shadow-sm cursor-pointer"
                                >
                                    <FaFacebook className="w-4 h-4 text-blue-600" />
                                    <span>Facebook</span>
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="relative flex items-center justify-center">
                                <div className="w-full border-t border-slate-200" />
                                <span className="bg-white px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider absolute">
                                    Or register with email
                                </span>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleRegister} className="space-y-4">
                                {/* Full Name */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                        Full Name
                                    </label>
                                    <Input
                                        size="large"
                                        placeholder="Sushil Hemrom"
                                        prefix={<User className="w-4 h-4 text-slate-400 mr-2" />}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="rounded-xl py-2.5 text-sm"
                                        required
                                    />
                                </div>

                                {/* Email Address */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                        Email Address
                                    </label>
                                    <Input
                                        size="large"
                                        type="email"
                                        placeholder="sushil@example.com"
                                        prefix={<Mail className="w-4 h-4 text-slate-400 mr-2" />}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="rounded-xl py-2.5 text-sm"
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                        Password
                                    </label>
                                    <Input
                                        size="large"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="At least 6 characters"
                                        prefix={<Lock className="w-4 h-4 text-slate-400 mr-2" />}
                                        suffix={
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-slate-400 hover:text-slate-600 focus:outline-none"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        }
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="rounded-xl py-2.5 text-sm"
                                        required
                                    />
                                </div>

                                {/* Country Selector */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                        Country / Region
                                    </label>
                                    <Select
                                        size="large"
                                        value={country}
                                        onChange={(val) => setCountry(val)}
                                        options={COUNTRIES}
                                        className="w-full rounded-xl"
                                    />
                                </div>

                                {/* Terms & Conditions */}
                                <div className="pt-2">
                                    <Checkbox
                                        checked={agreeTerms}
                                        onChange={(e) => setAgreeTerms(e.target.checked)}
                                        className="text-slate-600 text-xs font-medium"
                                    >
                                        I agree to the{" "}
                                        <Link href="/terms" className="text-purple-600 hover:underline">
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link href="/privacy" className="text-purple-600 hover:underline">
                                            Privacy Policy
                                        </Link>
                                    </Checkbox>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                                >
                                    {isLoading ? (
                                        <span>Sending OTP code...</span>
                                    ) : (
                                        <>
                                            <span>Continue to Verification</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Footer */}
                            <p className="text-center text-sm text-slate-500">
                                Already have an account?{" "}
                                <Link href="/auth/login" className="font-bold text-purple-600 hover:text-purple-700 transition">
                                    Sign in here
                                </Link>
                            </p>
                        </>
                    ) : (
                        /* Step 2: OTP Verification Form */
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block text-center">
                                    Enter 6-Digit Code
                                </label>
                                <Input
                                    size="large"
                                    maxLength={6}
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                    className="rounded-2xl py-3 text-center text-2xl tracking-[0.5em] font-mono font-bold"
                                    autoFocus
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>Expires in: <strong className="text-slate-800">{formatTime(countdown)}</strong></span>
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={countdown > 0 || isResending}
                                    className="font-bold text-purple-600 hover:text-purple-700 disabled:opacity-40 disabled:hover:text-purple-600 transition cursor-pointer"
                                >
                                    {isResending ? "Resending..." : "Resend OTP"}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || otp.length !== 6}
                                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                            >
                                {isLoading ? (
                                    <span>Verifying...</span>
                                ) : (
                                    <>
                                        <span>Verify & Launch Dashboard</span>
                                        <CheckCircle2 className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep("form")}
                                className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-700 transition cursor-pointer"
                            >
                                ← Back to edit details
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}