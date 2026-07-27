"use client";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, X, Sun, Moon } from "lucide-react";
import { RiMenu3Fill } from "react-icons/ri";
import { IMenuItem, navItems } from "@/data";
import { useTheme } from "@/providers/mode-theme";
import Logo from "./reuseable/logo";

function NavbarContent() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const isLight = theme === "light";

    const [menuOpen, setMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const toggleMenu = () => setMenuOpen((prev) => !prev);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!menuOpen) return;
        const html = document.documentElement;
        const previous = html.style.overflow;
        html.style.overflow = "hidden";
        return () => {
            html.style.overflow = previous;
        };
    }, [menuOpen]);

    const isActive = (href?: string) => !!href && pathname === href;

    const navContainerClass = `fixed inset-x-0 top-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? isLight
            ? "bg-white/85 backdrop-blur-lg border-b border-slate-200/80 py-2.5 shadow-sm"
            : "bg-[#100e16]/80 backdrop-blur-lg border-b border-white/25 py-2.5"
        : "bg-transparent py-3.5"
        }`;

    return (
        <>
            <nav className={navContainerClass}>
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8">
                    {/* Logo */}
                    <Link href="/">
                        <Logo />
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden lg:flex items-center gap-10">
                        {navItems.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href!}
                                    className={`relative text-[15px] font-semibold transition-colors ${active
                                        ? isLight
                                            ? "text-slate-900 font-bold"
                                            : "text-white font-bold"
                                        : isLight
                                            ? "text-slate-600 hover:text-slate-900"
                                            : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    {item.label}
                                    {active && (
                                        <span className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-violet-600 rounded-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right side: Theme Toggle + Login + Get Started */}
                    <div className="hidden lg:flex items-center gap-6">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle Light and Dark Mode"
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${isLight
                                ? "bg-slate-100 hover:bg-slate-200 border-slate-300/80 text-slate-800 shadow-sm"
                                : "bg-white/5 hover:bg-white/10 border-white/10 text-violet-300 hover:text-violet-200"
                                }`}
                        >
                            {isLight ? (
                                <Moon size={18} className="text-slate-800 transition-transform duration-300 hover:rotate-12" />
                            ) : (
                                <Sun size={18} className="text-amber-300 transition-transform duration-300 hover:rotate-45" />
                            )}
                        </button>

                        <Link
                            href="/auth/login"
                            className={`text-[15px] font-semibold transition-colors ${isLight ? "text-slate-700 hover:text-slate-900" : "text-white/90 hover:text-white"
                                }`}
                        >
                            Login
                        </Link>
                        <Link href="/auth/register">
                            <button className="text-[15px] font-bold px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all transform hover:scale-105 cursor-pointer">
                                Get Started
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Controls (Theme Toggle + Menu Button) */}
                    <div className="flex items-center gap-3 lg:hidden">
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle Theme"
                            className={`p-2 rounded-lg border transition-colors cursor-pointer flex items-center justify-center ${isLight
                                ? "bg-slate-100 border-slate-300 text-slate-800"
                                : "bg-white/5 border-white/10 text-amber-300"
                                }`}
                        >
                            {isLight ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                        <button
                            className={`cursor-pointer flex items-center justify-center backdrop-blur-md p-2 rounded-lg border ${isLight
                                ? "bg-slate-100 border-slate-200 text-slate-900"
                                : "text-white bg-white/5 border-white/10"
                                }`}
                            onClick={toggleMenu}
                            aria-label="Open menu"
                        >
                            <RiMenu3Fill size={22} className={menuOpen ? "text-violet-500" : ""} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Overlay */}
            {menuOpen && (
                <div
                    className="fixed inset-0 w-full h-screen bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={toggleMenu}
                />
            )}

            {/* Mobile Sidebar */}
            <div className="fixed inset-0 z-[999] overflow-x-hidden pointer-events-none lg:hidden">
                <aside
                    className={`pointer-events-auto absolute top-0 right-0 w-72 h-full border-l shadow-2xl transform transition-transform duration-300 ease-in-out ${isLight ? "bg-white border-slate-200 text-slate-900" : "bg-[#100e16] border-white/10 text-white"
                        } ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={`flex justify-between items-center py-5 px-6 border-b ${isLight ? "border-slate-200 text-slate-900" : "border-white/10 text-white"
                        }`}>
                        <span className="text-xl font-bold tracking-tight font-serif">Creator Stack</span>
                        <button
                            onClick={toggleMenu}
                            className={`cursor-pointer rounded-full p-2 transition-colors ${isLight
                                ? "text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200"
                                : "text-white/70 hover:text-white bg-white/5 hover:bg-white/10"
                                }`}
                            aria-label="Close menu"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="flex flex-col p-6 gap-3">
                        {navItems.map((item, index) => {
                            const active = isActive(item.href) || index === 0;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href!}
                                    onClick={() => setMenuOpen(false)}
                                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active
                                        ? isLight
                                            ? "text-violet-700 bg-violet-50 border border-violet-200"
                                            : "text-white bg-violet-600/20 border border-violet-600/30"
                                        : isLight
                                            ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent"
                                            : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}

                        <div className={`h-px w-full my-4 ${isLight ? "bg-slate-200" : "bg-white/10"}`} />

                        <Link
                            href="/auth/login"
                            onClick={() => setMenuOpen(false)}
                            className={`px-4 py-3 text-center text-sm font-semibold ${isLight ? "text-slate-800" : "text-white"
                                }`}
                        >
                            Login
                        </Link>
                        <Link href="/auth/register" onClick={() => setMenuOpen(false)}>
                            <button className="w-full text-sm font-bold px-4 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer">
                                Get Started
                            </button>
                        </Link>
                    </div>
                </aside>
            </div>

            {!mounted && <span className="hidden" />}
        </>
    );
}

export default function Navbar() {
    return (
        <Suspense fallback={<div className="h-[88px] w-full bg-[#100e16] fixed top-0 z-50 pointer-events-none" />}>
            <NavbarContent />
        </Suspense>
    );
}
