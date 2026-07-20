"use client";
import Image from "next/image";
// import user_icon from "../../assets/user.svg";
import logo from "@/assets/dashboard/logo.png";

import { IoMdMenu } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";

export default function Header({ navOpened, setNavOpened }: any) {
    return (
        <div className="sticky inset-y-0 left-0 z-30 w-full border-b border-b-[#E5E7EB] h-20  bg-[#FFFFFF] [transition:0.5s]">
            <header className="flex items-center justify-between p-4">
                {/* left side  */}
                <div className="flex items-center justify-between w-full">
                    <div
                        onClick={() => setNavOpened(!navOpened)}
                        className="md:hidden flex items-center justify-center cursor-pointer"
                    >
                        <IoMdMenu className=" w-10 h-10 rounded-full bg-primary/10 text-primary [transition:0.3s] hover:bg-primary hover:text-white text-center p-2" />
                    </div>

                    <div />
                    {/* <div className="hidden md:block text-black">
            <h1 className="text-base md:text-xl lg:text-3xl font-semibold ">
              Welcome,TP
            </h1>
            <p className="text-sm font-normal">Have a nice day</p>
          </div> */}
                    <div className="flex items-center justify-center gap-x-5">
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
                                Tamal
                            </h1>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}