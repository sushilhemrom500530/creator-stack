"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import NavItem from "../nav-menu";
import Image from "next/image";
// import { useAuthService } from "@/src/hooks/auth";
// import { useAuthStore } from "@/src/store/authStore";

import logo from "@/assets/dashboard/logo.png";
import logout from "@/assets/dashboard/logout.svg";
import Link from "next/link";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { adminMenuData, userMenuData } from "@/data";
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { SiSpringCreators } from "react-icons/si";
import { RiStackFill } from "react-icons/ri";
import Logo from "@/components/reuseable/logo";

const user = {
    name: "Sushil Hemrom",
    email: "sushil@gmail.com",
    role: "user",
};

export default function Sidebar({ navOpened, setNavOpened }: any) {
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    // const { logoutUser } = useAuthService();
    const pathname = usePathname();
    // const { user } = useAuthStore();

    const menuLinks = user?.role === "user"
        ? userMenuData?.linkData
        : user?.role === "admin" ? adminMenuData?.linkData : [];

    const closeAllSubmenus = (): void => {
        setOpenSubmenu(null);
    };

    const handleSubmenuToggle = (label: string): void => {
        setOpenSubmenu((prev) => (prev === label ? null : label));
    };

    const profileMenuItems: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <Link href="/dashboard" className="flex items-center gap-3 px-1 py-1 text-sm font-medium text-[#43464A] hover:text-primary transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Dashboard
                </Link>
            ),
        },
        {
            key: '2',
            label: (
                <Link href="/dashboard/settings" className="flex items-center gap-3 px-1 py-1 text-sm font-medium text-[#43464A] hover:text-primary transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                </Link>
            ),
        },
        {
            type: 'divider',
        },
        {
            key: '3',
            label: (
                <div
                    // onClick={logoutUser}
                    className="flex items-center gap-3 px-1 py-1 text-sm font-medium text-red-600 transition-colors w-full text-left"
                >
                    <Image src={logout} alt="logout" width={16} height={16} />
                    Log Out
                </div>
            ),
        },
    ];

    return (
        <>
            {/* Backdrop for mobile */}
            <div
                className={`fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity ${navOpened ? "opacity-100 block" : "opacity-0 hidden"
                    }`}
                onClick={() => setNavOpened(false)}
            ></div>

            {/* Sidebar */}
            <div
                className={`
          fixed top-0 left-0 z-30 h-screen w-[288px] flex flex-col transition-transform duration-300 border-e border-e-[#E5E7EB] bg-white
          ${navOpened ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0  
        `}
            >
                <div className="flex flex-col h-full pt-28 lg:pt-0">
                    <div className="hidden lg:block mb-6 border-b border-b-[#E5E7EB]">
                        <Link href="/dashboard" className="flex items-center gap-2 group">
                            <Logo className="h-[74px]" />

                            {/* <div className="relative text-primary transition-transform group-hover:scale-105 flex items-center justify-center">
                                <SiSpringCreators className="w-7 h-7" />
                            </div>
                            <span className="text-xl font-bold font-serif tracking-tight text-[#1A1D1F]">
                                C S
                            </span>
                            <RiStackFill className="w-7 h-7 text-orange-500" /> */}
                        </Link>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <nav>
                            {menuLinks?.map((section, sIndex) => (
                                <div key={sIndex} className="space-y-1.5 mb-2">
                                    {section?.menu?.map((item, index) => (
                                        <NavItem
                                            key={index}
                                            href={item?.href || "#"}
                                            icon={item?.icon}
                                            label={item?.label}
                                            submenu={item?.submenu}
                                            openSubmenu={openSubmenu}
                                            handleSubmenuToggle={handleSubmenuToggle}
                                            setNavOpened={setNavOpened}
                                            closeAllSubmenus={closeAllSubmenus}
                                        />
                                    ))}
                                </div>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-auto border-t border-[#E5E7EB] shrink-0 bg-white">
                        <Dropdown menu={{ items: profileMenuItems }} trigger={['click']} placement="topLeft">
                            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex flex-shrink-0 items-center justify-center text-primary font-bold text-lg">
                                        {user?.name?.charAt(0) || "U"}
                                    </div>
                                    <div className="flex flex-col items-start truncate overflow-hidden">
                                        <span className="text-sm font-semibold text-[#1A1D1F] truncate text-left block w-full">{user?.name}</span>
                                        <span className="text-xs text-[#6F767E] truncate text-left block w-full">{user?.email}</span>
                                    </div>
                                </div>
                                <svg className="w-4 h-4 flex-shrink-0 text-[#6F767E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                            </button>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </>
    );
}