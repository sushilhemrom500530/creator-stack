"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Calendar, Users, Key } from "lucide-react";

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
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Header Greeting Card */}
            <div className="bg-gradient-to-r from-purple-800 to-indigo-950 rounded-2xl p-8 text-white shadow-xl transform transition duration-500 hover:scale-[1.01] relative overflow-hidden">
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

            {/* Profile Information Block */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-purple-50 text-purple-650 rounded-xl">
                                <ShieldCheck size={24} className="text-purple-700" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Admin Identity</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-slate-650">
                                <span className="font-semibold text-slate-500 w-24">Username:</span>
                                <span className="text-slate-800 font-medium">{userState.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-650">
                                <span className="font-semibold text-slate-500 w-24">Email:</span>
                                <span className="text-slate-805 text-sm">{userState.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-650">
                                <span className="font-semibold text-slate-500 w-24">Privileges:</span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700">
                                    Root Admin
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secure Key Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-indigo-50 text-indigo-650 rounded-xl">
                                <Key size={24} className="text-indigo-700" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Root JWT Token</h2>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-500 block mb-1">Active Authentication Token:</label>
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-205/60 font-mono text-xs text-slate-600 break-all select-all select-none">
                                {userState.token}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
