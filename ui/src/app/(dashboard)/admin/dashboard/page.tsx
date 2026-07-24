"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Calendar, Users, Key } from "lucide-react";
import AdminOverview from "@/components/dashboard/admin/overview";

export default function AdminDashboardPage() {
    const [userState, setUserState] = useState({
        name: "Apurbo Hemrom",
        email: "apurbo@gmail.com",
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
            <div className="bg-gradient-to-r from-purple-800 to-indigo-950 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute left-1/3 bottom-0 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>

                <div className="flex items-center gap-2 mb-2 bg-purple-650/40 border border-purple-500/30 uppercase text-xs tracking-wider px-3 py-1 rounded-full w-fit">
                    <ShieldCheck size={14} className="text-purple-300" />
                    Admin Control Center
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight">
                    Welcome, Admin {userState.name}!
                </h1>
                <p className="mt-2 text-purple-200 max-w-xl text-sm">
                    Access inventory management, view sales telemetry, custom export journeys, and review active secure keys.
                </p>
            </div>
            {/* overview  */}
            <AdminOverview />
        </div>
    );
}
