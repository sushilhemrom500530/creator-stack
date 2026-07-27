"use client";

import Image from "next/image";
import light_logo from "@/assets/dashboard/light.png";
import dark_logo from "@/assets/dashboard/dark.png";
import { useTheme } from "@/providers/mode-theme";

export default function Logo({ className = "w-full h-14" }: { className?: string }) {
    const { theme } = useTheme();



    return (
        <Image
            src={theme === "light" ? light_logo : dark_logo}
            alt="logo"
            width={0}
            height={0}
            className={`${className} object-contain`}
        />
    );
}
