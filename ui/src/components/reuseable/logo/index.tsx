import Image from "next/image";
import light_logo from "@/assets/dashboard/light.png";
import dark_logo from "@/assets/dashboard/light.png";
// import logo from "@/assets/dashboard/logo.svg";

export default function Logo({ className = "w-full h-14" }: { className?: string }) {
    return (
        <Image
            src={light_logo}
            alt="logo"
            width={0}
            height={0}
            className={`${className} object-contain`}
        />
    )
}