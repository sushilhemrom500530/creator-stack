"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import NavItem from "../nav-menu";
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
import { LayoutDashboard, Settings, LogOut, ChevronUp } from "lucide-react";
import Image from "next/image";

export default function Sidebar({ navOpened, setNavOpened, user: propUser }: any) {
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    // const { logoutUser } = useAuthService();
    const pathname = usePathname();
    // const { user } = useAuthStore();

    const defaultUser = {
        name: "Sushil Hemrom",
        email: "sushil@gmail.com",
        role: "user",
    };
    const user = propUser || defaultUser;

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
                <Link href={user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard"} className="flex items-center gap-3 px-1 py-1 text-sm font-medium text-[#43464A] hover:text-primary transition-colors">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                </Link>
            ),
        },
        {
            key: '2',
            label: (
                <Link href={user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard"} className="flex items-center gap-3 px-1 py-1 text-sm font-medium text-[#43464A] hover:text-primary transition-colors">
                    <Settings className="w-4 h-4" />
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
                    className="flex items-center gap-3 px-1 py-1 text-sm font-medium text-red-600 transition-colors w-full text-left cursor-pointer"
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
          fixed top-0 left-0 z-30 h-screen w-64 flex flex-col transition-transform duration-300 border-e border-e-[#E5E7EB] bg-white
          ${navOpened ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0  
        `}
            >
                <div className="flex flex-col h-full pt-28 lg:pt-0">
                    <div className="hidden lg:block mb-6 border-b border-b-[#E5E7EB]">
                        <Link href={user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard"} className="flex items-center gap-2 group">
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
                                <ChevronUp className="w-4 h-4 flex-shrink-0 text-[#6F767E]" />
                            </button>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </>
    );
}