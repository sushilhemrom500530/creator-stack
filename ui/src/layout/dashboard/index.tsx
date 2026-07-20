"use client";
import Header from "@/components/header";
import Sidebar from "@/components/header/sidebar";
import { IDashboardLayoutProps } from "@/types";
import { ReactNode, useState } from "react";


export default function DashboardLayout({ children }: IDashboardLayoutProps) {
    const [navOpened, setNavOpened] = useState<boolean>(false);
    return (
        <div className="flex min-h-screen h-full">
            {/* side bar  */}
            <Sidebar navOpened={navOpened} setNavOpened={setNavOpened} />

            {/* top and children content  */}
            <div
                className={`flex flex-col flex-1 min-w-0 lg:ml-[288px] transition-all duration-300`}
            >
                <Header navOpened={navOpened} setNavOpened={setNavOpened} />
                {/* min-h-[calc(100vh-48px)]  */}
                <main className="overflow-y-auto overflow-x-hidden w-full min-h-[calc(100vh-178px)] h-full bg-[#F4F5F8] font-primary  pr-3">
                    {children}
                </main>
            </div>
        </div>
    );
}