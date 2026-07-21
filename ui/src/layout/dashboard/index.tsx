"use client";
import Header from "@/components/header";
import Sidebar from "@/components/header/sidebar";
import { IDashboardLayoutProps } from "@/types";
import { ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";


export default function DashboardLayout({ children }: IDashboardLayoutProps) {
    const [navOpened, setNavOpened] = useState<boolean>(false);
    const pathname = usePathname();
    const [user, setUser] = useState({
        name: "Sushil Hemrom",
        email: "sushil@gmail.com",
        role: "user",
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const path = window.location.pathname;
            const search = window.location.search;

            // Normalize custom queries where multiple "?" are used:
            // e.g. ?user=sushilhemrom?token=ksjfkjskfjsfkjskfsf
            const cleaned = search.replace(/^\?/, '').replace(/\?/g, '&');
            const params = new URLSearchParams(cleaned);
            const username = params.get('user');

            let role = "user";
            if (path.startsWith("/admin")) {
                role = "admin";
            } else if (path.startsWith("/user")) {
                role = "user";
            }

            let displayName = role === "admin" ? "Apurbo Hemrom" : "Sushil Hemrom";
            let displayEmail = role === "admin" ? "apurbo@gmail.com" : "sushil@gmail.com";

            if (username) {
                // capitalize the user parameter nicely: "sushilhemrom" -> "Sushilhemrom"
                displayName = username.charAt(0).toUpperCase() + username.slice(1);
                displayEmail = `${username}@gmail.com`;
            }

            setUser({
                name: displayName,
                email: displayEmail,
                role: role,
            });
        }
    }, [pathname]);

    return (
        <div className="flex min-h-screen h-full">
            {/* side bar  */}
            <Sidebar navOpened={navOpened} setNavOpened={setNavOpened} user={user} />

            {/* top and children content  */}
            <div
                className={`flex flex-col flex-1 min-w-0 lg:ml-[288px] transition-all duration-300`}
            >
                <Header navOpened={navOpened} setNavOpened={setNavOpened} user={user} />
                {/* min-h-[calc(100vh-48px)]  */}
                <main className="overflow-y-auto overflow-x-hidden w-full min-h-[calc(100vh-178px)] h-full bg-[#F4F5F8] font-primary  pr-3">
                    {children}
                </main>
            </div>
        </div>
    );
}