"use client";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import { RiMenu3Fill } from "react-icons/ri";
import Image from "next/image";
import { IMenuItem } from "@/data";



const navLinks: IMenuItem[] = [
    { label: "About Us", href: "/about-us" },
    { label: "Orbit Export", href: "/orbit-export" },
    { label: "Orbit Import", href: "/orbit-import" },
    {
        label: "Business Connect",
        submenu: [
            { label: "Connect to Partners", href: "/business-connect/partners" },
            { label: "KIMVUKA", href: "/business-connect/kimvuka" },
        ],
    },
    { label: "Contact Us", href: "/contact-us" },
];

function NavbarContent() {
    const pathname = usePathname();

    const [menuOpen, setMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [lang, setLang] = useState<"EN" | "FR">("EN");
    // Tracks which dropdown is open on mobile (desktop uses hover)
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    // Contact Now modal
    const [contactOpen, setContactOpen] = useState(false);

    const toggleMenu = () => setMenuOpen((prev) => !prev);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!menuOpen && !contactOpen) return;
        const html = document.documentElement;
        const previous = html.style.overflow;
        html.style.overflow = "hidden";
        return () => {
            html.style.overflow = previous;
        };
    }, [menuOpen, contactOpen]);

    const isActive = (href?: string) => !!href && pathname === href;

    const navContainerClass = `sticky inset-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? "bg-primary/90 backdrop-blur-md shadow-md py-3"
        : "bg-primary py-4"
        }`;

    return (
        <>
            <nav className={navContainerClass}>
                <div className="container mx-auto flex items-center justify-between px-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center select-none shrink-0">
                        Logo
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((item) =>
                            item.submenu ? (
                                <div key={item.label} className="relative group">
                                    <button className="flex items-center gap-1 text-sm font-medium text-white/90 hover:text-light-primary transition-colors cursor-pointer">
                                        {item.label}
                                        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                                    </button>

                                    {/* Dropdown (opens on hover) */}
                                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
                                        <div className="min-w-[220px] rounded-xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden py-1">
                                            {item.submenu.map((sub) => (
                                                <Link
                                                    key={sub.label}
                                                    href={sub.href}
                                                    className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : item.label === "Contact Us" ? (
                                <button
                                    key={item.label}
                                    onClick={() => setContactOpen(true)}
                                    className="text-sm font-medium text-white/90 hover:text-light-primary transition-colors cursor-pointer"
                                >
                                    {item.label}
                                </button>
                            ) : (
                                <Link
                                    key={item.label}
                                    href={item.href!}
                                    className={`text-sm font-medium transition-colors ${isActive(item.href)
                                        ? "text-light-primary"
                                        : "text-white/90 hover:text-light-primary"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ),
                        )}
                    </div>

                    {/* Right side: Language toggle + Sign In */}
                    <div className="flex items-center gap-4">
                        {/* EN | FR toggle */}
                        <div className="hidden sm:flex items-center rounded-full border border-[#E2E8F0] overflow-hidden text-xs font-semibold">
                            {(["EN", "FR"] as const).map((l) => (
                                <button
                                    key={l}
                                    onClick={() => setLang(l)}
                                    className={`px-3 py-1.5 transition-colors cursor-pointer ${lang === l
                                        ? "text-light-primary"
                                        : "text-white/80 hover:text-white"
                                        }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>

                        {/* Sign In */}
                        <Link href="/auth/login">
                            <button className="font-semibold text-sm px-6 py-2 rounded-full bg-light-primary hover:bg-light-secondary text-white transition-colors cursor-pointer">
                                Sign In
                            </button>
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden text-white cursor-pointer flex items-center justify-center"
                            onClick={toggleMenu}
                            aria-label="Open menu"
                        >
                            <RiMenu3Fill size={24} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Overlay */}
            {menuOpen && (
                <div
                    className="fixed inset-0 w-full h-screen bg-black/60 z-40 lg:hidden"
                    onClick={toggleMenu}
                />
            )}

            {/* Mobile Sidebar — the fixed, full-viewport wrapper clips the panel
          so it can't add horizontal scroll when slid off-screen */}
            <div className="fixed inset-0 z-[999] overflow-x-hidden pointer-events-none lg:hidden">
                <aside
                    className={`pointer-events-auto absolute top-0 right-0 w-72 h-full bg-primary text-white shadow-xl transform transition-transform duration-300 ease-in-out
            ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center py-4 px-5 border-b border-white/10">
                        Logo
                        <button
                            onClick={toggleMenu}
                            className="cursor-pointer text-white/70 hover:text-white transition-colors"
                            aria-label="Close menu"
                        >
                            <X
                                size={20}
                                className="border border-white/20 rounded-full w-8 h-8 p-[6px]"
                            />
                        </button>
                    </div>

                    <div className="flex flex-col p-5 gap-2">
                        {navLinks.map((item) =>
                            item.submenu ? (
                                <div key={item.label}>
                                    <button
                                        onClick={() =>
                                            setOpenSubmenu((prev) =>
                                                prev === item.label ? null : item.label,
                                            )
                                        }
                                        className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/90 hover:bg-white/5 transition-colors"
                                    >
                                        {item.label}
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform ${openSubmenu === item.label ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>
                                    {openSubmenu === item.label && (
                                        <div className="ml-3 mt-1 flex flex-col border-l border-white/10">
                                            {item.submenu.map((sub) => (
                                                <Link
                                                    key={sub.label}
                                                    href={sub.href}
                                                    onClick={() => setMenuOpen(false)}
                                                    className="px-4 py-2 text-sm text-white/70 hover:text-light-primary transition-colors"
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : item.label === "Contact Us" ? (
                                <button
                                    key={item.label}
                                    onClick={() => {
                                        setMenuOpen(false);
                                        setContactOpen(true);
                                    }}
                                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-left text-white/90 hover:bg-white/5 transition-colors"
                                >
                                    {item.label}
                                </button>
                            ) : (
                                <Link
                                    key={item.label}
                                    href={item.href!}
                                    onClick={() => setMenuOpen(false)}
                                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
                                        ? "text-light-primary bg-white/5"
                                        : "text-white/90 hover:bg-white/5"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ),
                        )}

                    </div>
                </aside>
            </div>

            {/* Placeholder during hydration to keep layout stable */}
            {!mounted && <span className="hidden" />}
        </>
    );
}

export default function Navbar() {
    return (
        <Suspense
            fallback={<div className="h-[72px] w-full bg-primary fixed top-0 z-50" />}
        >
            <NavbarContent />
        </Suspense>
    );
}