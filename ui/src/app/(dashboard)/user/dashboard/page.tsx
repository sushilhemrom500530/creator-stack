"use client";

import { useEffect, useState } from "react";
import { User, ShieldCheck, Mail, Key } from "lucide-react";
import Overview from "@/components/dashboard/user/overview";

export default function UserDashboardPage() {
    const [userState, setUserState] = useState({
        name: "Sushil Hemrom",
        email: "sushil@gmail.com",
        token: "n/a"
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const search = window.location.search;
            const cleaned = search.replace(/^\?/, '').replace(/\?/g, '&');
            const params = new URLSearchParams(cleaned);
            const username = params.get('user');
            const token = params.get('token');

            if (username) {
                const formattedName = username.charAt(0).toUpperCase() + username.slice(1);
                setUserState({
                    name: formattedName,
                    email: `${username}@gmail.com`,
                    token: token || "n/a"
                });
            } else if (token) {
                setUserState(prev => ({
                    ...prev,
                    token: token
                }));
            }
        }
    }, []);

    return (
        <div className="p-6 space-y-6">
            {/* Header Greeting Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl transform transition duration-500 relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                    Welcome to your Dashboard, {userState.name}!
                </h1>
                <p className="mt-2 text-blue-100 max-w-xl">
                    Here you can view your profile information, manage your credentials, and review your access token.
                </p>
            </div>

            <Overview />

        </div>
    );
}
