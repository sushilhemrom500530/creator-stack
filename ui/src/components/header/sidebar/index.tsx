"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import NavItem from "../nav-menu";
import Image from "next/image";
// import { useAuthService } from "@/src/hooks/auth";
// import { useAuthStore } from "@/src/store/authStore";

import logout from "@/assets/dashboard/logout.svg";
import Link from "next/link";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { adminMenuData, userMenuData } from "@/data";

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

    // const activeClass = "bg-primary text-white";
    // const inactiveClass = "text-[#43464A] hover:text-primary hover:bg-primary/10";

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
                    <div className="px-2 flex items-center justify-center hidden lg:block mb-5">
                        <Image src={""} alt="icon" width={170} height={120} />
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <nav>
                            {menuLinks?.map((section, sIndex) => (
                                <div key={sIndex} className="space-y-4 mb-4">
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
                        <button
                            // onClick={logoutUser}
                            className="w-full text-xl font-medium flex items-center gap-3 my-4 px-6 text-[#43464A] cursor-pointer text-red-600 hover:text-red-600/90 transition"
                        >
                            <Image src={logout} alt="icon" width={20} height={20} />
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}