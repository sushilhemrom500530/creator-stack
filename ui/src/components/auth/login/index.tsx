"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input, Button, Checkbox, Modal, message } from "antd";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    ShieldCheck,
    Zap,
    Share2,
    BarChart3,
} from "lucide-react";
import { FaGoogle, FaFacebook } from "react-icons/fa6";
import Logo from "@/components/reuseable/logo";
import { authApi } from "@/lib/api";

export default function LoginContent() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Forgot Password State
    const [forgotModalVisible, setForgotModalVisible] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotStep, setForgotStep] = useState<"email" | "otp" | "reset">("email");
    const [resetToken, setResetToken] = useState("");
    const [verifiedToken, setVerifiedToken] = useState("");
    const [forgotOtp, setForgotOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isForgotLoading, setIsForgotLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !password) {
            message.warning("Please enter your email and password.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await authApi.login({
                email: email.trim().toLowerCase(),
                password,
            });

            if (res?.accessToken) {
                localStorage.setItem("token", res.accessToken);
                localStorage.setItem("accessToken", res.accessToken);
                if (res.user) {
                    localStorage.setItem("user", JSON.stringify(res.user));
                }

                // Set cookie for Next.js middleware
                document.cookie = `accessToken=${res.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

                message.success(`Welcome back, ${res.user?.name || "Creator"}! 🚀`);

                const isAdmin = res.user?.roles?.includes("admin") || res.user?.roles?.includes("super_admin");
                if (isAdmin) {
                    router.push("/admin/dashboard");
                } else {
                    router.push("/user/dashboard");
                }
            }
        } catch (err: any) {
            message.error(err.message || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Forgot Password Flow Handlers
    const handleSendForgotOtp = async () => {
        if (!forgotEmail.trim()) {
            message.warning("Please enter your email address.");
            return;
        }
        setIsForgotLoading(true);
        try {
            const res = await authApi.forgotPassword({ email: forgotEmail.trim().toLowerCase() });
            setResetToken(res.resetToken);
            setForgotStep("otp");
            message.success("6-digit verification code sent to your email!");
        } catch (err: any) {
            message.error(err.message || "Failed to send reset code.");
        } finally {
            setIsForgotLoading(false);
        }
    };

    const handleVerifyForgotOtp = async () => {
        if (forgotOtp.length !== 6) {
            message.warning("Please enter the 6-digit OTP code.");
            return;
        }
        setIsForgotLoading(true);
        try {
            const res = await authApi.verifyForgotOtp({ resetToken, otp: forgotOtp });
            setVerifiedToken(res.verifiedToken);
            setForgotStep("reset");
            message.success("Code verified! Enter your new password.");
        } catch (err: any) {
            message.error(err.message || "Invalid or expired OTP code.");
        } finally {
            setIsForgotLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (newPassword.length < 6) {
            message.warning("Password must be at least 6 characters long.");
            return;
        }
        setIsForgotLoading(true);
        try {
            await authApi.resetPassword({ verifiedToken, newPassword });
            message.success("Password reset successfully! You can now log in.");
            setForgotModalVisible(false);
            setForgotStep("email");
            setForgotEmail("");
            setForgotOtp("");
            setNewPassword("");
        } catch (err: any) {
            message.error(err.message || "Failed to reset password.");
        } finally {
            setIsForgotLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-[#F8FAFC] font-primary">
            {/* Left Side: Brand Visuals & Value Highlights */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0B0F19] text-white p-12 flex-col justify-between relative overflow-hidden">
                {/* Background Glows */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

                {/* Brand Header */}
                <div className="relative z-10">
                    <Link href="/" className="inline-block">
                        <Logo className="h-10 w-auto" />
                    </Link>
                </div>

                {/* Hero Showcase Center */}
                <div className="relative z-10 space-y-8 my-auto max-w-lg">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI-Powered Social Operating System
                    </div>

                    <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
                        Scale Your Content Across All Social Platforms in Seconds.
                    </h1>

                    <p className="text-slate-400 text-base leading-relaxed">
                        Connect Facebook, Instagram, Threads, and WhatsApp. Compose once, adapt with AI, schedule with precision, and measure viral growth.
                    </p>

                    {/* Feature Cards Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md space-y-2">
                            <Share2 className="w-5 h-5 text-purple-400" />
                            <h4 className="text-sm font-bold text-white">Omnichannel Dispatch</h4>
                            <p className="text-xs text-slate-400">Publish to Meta, Threads, and X in one unified click.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md space-y-2">
                            <Zap className="w-5 h-5 text-blue-400" />
                            <h4 className="text-sm font-bold text-white">AI Copywriting Studio</h4>
                            <p className="text-xs text-slate-400">Viral hooks, optimized captions & hashtag matrices.</p>
                        </div>
                    </div>
                </div>

                {/* Trust Footer */}
                <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/10 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Enterprise AES-256 Security</span>
                    </div>
                    <span>Trusted by 10,000+ Creators</span>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    {/* Header */}
                    <div className="space-y-2 text-center sm:text-left">
                        <div className="lg:hidden flex justify-center mb-6">
                            <Logo className="h-10 w-auto" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Welcome back
                        </h2>
                        <p className="text-sm text-slate-500">
                            Enter your credentials to access your CreatorStack dashboard.
                        </p>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => message.info("Google OAuth login initialized")}
                            className="flex items-center justify-center gap-2.5 px-4 py-2.5 border border-slate-200 hover:border-slate-300 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition shadow-sm cursor-pointer"
                        >
                            <FaGoogle className="w-4 h-4 text-red-500" />
                            <span>Google</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => message.info("Facebook OAuth login initialized")}
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
                            Or continue with email
                        </span>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                Email Address
                            </label>
                            <div className="relative">
                                <Input
                                    size="large"
                                    type="email"
                                    placeholder="name@example.com"
                                    prefix={<Mail className="w-4 h-4 text-slate-400 mr-2" />}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="rounded-xl py-2.5 text-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setForgotEmail(email);
                                        setForgotStep("email");
                                        setForgotModalVisible(true);
                                    }}
                                    className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition cursor-pointer"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <Input
                                    size="large"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••••••"
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
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between text-sm">
                            <Checkbox
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="text-slate-600 text-xs font-medium"
                            >
                                Keep me signed in for 7 days
                            </Checkbox>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                            {isLoading ? (
                                <span>Signing in...</span>
                            ) : (
                                <>
                                    <span>Sign in to Dashboard</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-sm text-slate-500">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/register" className="font-bold text-purple-600 hover:text-purple-700 transition">
                            Create a free account
                        </Link>
                    </p>
                </div>
            </div>

            {/* Forgot Password Modal */}
            <Modal
                title={null}
                open={forgotModalVisible}
                onCancel={() => setForgotModalVisible(false)}
                footer={null}
                centered
                className="rounded-3xl overflow-hidden"
            >
                <div className="p-6 space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">
                            {forgotStep === "email" && "Reset your password"}
                            {forgotStep === "otp" && "Enter verification code"}
                            {forgotStep === "reset" && "Set new password"}
                        </h3>
                        <p className="text-xs text-slate-500">
                            {forgotStep === "email" && "Enter your email address and we'll send you a 6-digit reset code."}
                            {forgotStep === "otp" && `We sent a 6-digit code to ${forgotEmail}.`}
                            {forgotStep === "reset" && "Enter your new strong password below."}
                        </p>
                    </div>

                    {forgotStep === "email" && (
                        <div className="space-y-4">
                            <Input
                                size="large"
                                type="email"
                                placeholder="name@example.com"
                                prefix={<Mail className="w-4 h-4 text-slate-400 mr-2" />}
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                className="rounded-xl py-2.5"
                            />
                            <Button
                                type="primary"
                                size="large"
                                block
                                loading={isForgotLoading}
                                onClick={handleSendForgotOtp}
                                className="rounded-xl bg-purple-600 hover:bg-purple-700 font-bold"
                            >
                                Send Reset Code
                            </Button>
                        </div>
                    )}

                    {forgotStep === "otp" && (
                        <div className="space-y-4">
                            <Input
                                size="large"
                                maxLength={6}
                                placeholder="6-digit OTP code"
                                value={forgotOtp}
                                onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ""))}
                                className="rounded-xl py-2.5 text-center text-lg tracking-widest font-mono"
                            />
                            <Button
                                type="primary"
                                size="large"
                                block
                                loading={isForgotLoading}
                                onClick={handleVerifyForgotOtp}
                                className="rounded-xl bg-purple-600 hover:bg-purple-700 font-bold"
                            >
                                Verify Code
                            </Button>
                        </div>
                    )}

                    {forgotStep === "reset" && (
                        <div className="space-y-4">
                            <Input.Password
                                size="large"
                                placeholder="New password (min 6 chars)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="rounded-xl py-2.5"
                            />
                            <Button
                                type="primary"
                                size="large"
                                block
                                loading={isForgotLoading}
                                onClick={handleResetPassword}
                                className="rounded-xl bg-purple-600 hover:bg-purple-700 font-bold"
                            >
                                Set New Password
                            </Button>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}