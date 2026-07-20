import Image from "next/image";
import logo from "@/assets/dashboard/logo.svg";

export default function Logo({ className = "w-full h-20" }: { className?: string }) {
    return (
        <Image
            src={logo}
            alt="logo"
            width={0}
            height={0}
            className={`${className}`}
        />
    )
}