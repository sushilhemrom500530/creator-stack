"use client";
import Image from "next/image";
import logo from "@/assets/dashboard/logo.png";
import { IoMdMenu } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/mode-theme";

export default function Header({ navOpened, setNavOpened, user }: any) {
    const { theme, toggleTheme } = useTheme();
    const isLight = theme === "light";
    return (
        <div className="sticky inset-y-0 left-0 z-10 w-full border-b border-b-[#E5E7EB] h-[66px] bg-[#FFFFFF] [transition:0.5s]">
            <header className="flex items-center justify-between px-4">
                {/* left side  */}
                <div className="flex items-center justify-between w-full">
                    <div
                        onClick={() => setNavOpened((prev: boolean) => !prev)}
                        className="lg:hidden flex items-center justify-center cursor-pointer"
                    >
                        <IoMdMenu className=" w-10 h-10 rounded-full bg-primary/10 text-primary [transition:0.3s] hover:bg-primary hover:text-white text-center p-2" />
                    </div>
                    <div />

                    <div className="flex items-center justify-center gap-x-5">
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle Light and Dark Mode"
                            className={`cursor-pointer flex items-center justify-center`}
                        >
                            {isLight ? (
                                <Moon size={22} className="text-slate-800 transition-transform duration-300 hover:rotate-12 " />
                            ) : (
                                <Sun size={22} className="text-amber-300 transition-transform duration-300 hover:rotate-45" />
                            )}
                        </button>
                        <div
                            onClick={() => setNavOpened(!navOpened)}
                            className="hidden lg:hidden md:flex items-center justify-center cursor-pointer"
                        >
                            <IoMdMenu className=" w-10 h-10 rounded-full bg-yellow-50 [transition:0.3s] hover:bg-yellow-100 text-center p-1" />
                        </div>
                        <div className="flex items-center justify-center cursor-pointer relative">
                            <h3 className="absolute -top-4 -right-3 bg-[#10B981] rounded-full w-5 h-5 flex items-center justify-center text-xs text-white">
                                2
                            </h3>
                            <FiShoppingCart size={22} color="#000" />
                        </div>
                        <div className="flex w-10 md:w-14 xl:w-auto flex-1 items-center gap-2 cursor-pointer">
                            <Image
                                src={logo}
                                alt="logo"
                                width={36}
                                height={36}
                                className="w-9 h-9 rounded-full "
                            />
                            <h1 className="text-lg text-black font-medium hidden xl:block">
                                {user?.name || "Tamal"}
                            </h1>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}