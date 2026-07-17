"use client";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import { RiMenu3Fill } from "react-icons/ri";
import { IMenuItem, navItems } from "@/data";

function NavbarContent() {
    const pathname = usePathname();

    const [menuOpen, setMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

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
        ? "bg-[#100e16]/80 backdrop-blur-lg border-b border-white/5 py-4"
        : "bg-transparent py-6"
        }`;

    return (
        <>
            <nav className={navContainerClass}>
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-1 group select-none shrink-0">
                        <span className="text-white text-2xl font-bold tracking-tight">
                            SocialFlow <span className="text-[#a78bfa] group-hover:text-[#c4b5fd] transition-colors">AI</span>
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden lg:flex items-center gap-10">
                        {navItems.map((item, index) => {
                            const active = isActive(item.href) || index === 0; // Highlight first element as in mockup
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href!}
                                    className={`relative text-[15px] font-semibold transition-colors ${active ? "text-white" : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    {item.label}
                                    {active && (
                                        <span className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-[#a855f7] rounded-full" />
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Right side: Login + Get Started */}
                    <div className="hidden lg:flex items-center gap-8">
                        <Link href="/auth/login" className="text-[15px] font-semibold text-white/90 hover:text-white transition-colors">
                            Login
                        </Link>
                        <Link href="/auth/register">
                            <button className="text-[15px] font-bold px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all transform hover:scale-105 cursor-pointer">
                                Get Started
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center lg:hidden">
                        <button
                            className="text-white cursor-pointer flex items-center justify-center backdrop-blur-md p-2 rounded-lg bg-white/5 border border-white/10"
                            onClick={toggleMenu}
                            aria-label="Open menu"
                        >
                            <RiMenu3Fill size={22} className={menuOpen ? "text-violet-400" : ""} />
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
                    className={`pointer-events-auto absolute top-0 right-0 w-72 h-full bg-[#100e16] border-l border-white/10 text-white shadow-2xl transform transition-transform duration-300 ease-in-out
                    ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex text-white justify-between items-center py-5 px-6 border-b border-white/10">
                        <span className="text-xl font-bold tracking-tight">SocialFlow AI</span>
                        <button
                            onClick={toggleMenu}
                            className="cursor-pointer text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-colors"
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
                                        ? "text-white bg-violet-600/20 border border-violet-600/30"
                                        : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}

                        <div className="h-px w-full bg-white/10 my-4" />

                        <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="px-4 py-3 text-center text-sm font-semibold text-white">
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