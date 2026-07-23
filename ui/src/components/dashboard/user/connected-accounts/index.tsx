"use client";

import { useState } from "react";
import {
    Share2,
    CheckCircle2,
    XCircle,
    Plus,
    RefreshCw
} from "lucide-react";
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa6";

export default function ConnectedAccountsComponent() {
    const [accounts, setAccounts] = useState([
        { id: "twitter", name: "Twitter / X", handle: "@sushilhemrom", connected: true, icon: FaTwitter, color: "text-sky-500 bg-sky-50", date: "Connected Jun 2026" },
        { id: "linkedin", name: "LinkedIn", handle: "Sushil Hemrom", connected: true, icon: FaLinkedin, color: "text-blue-600 bg-blue-50", date: "Connected May 2026" },
        { id: "facebook", name: "Facebook Page", handle: "Creator Stack Official", connected: false, icon: FaFacebook, color: "text-blue-500 bg-blue-50", date: "Not connected" },
        { id: "instagram", name: "Instagram Business", handle: "@creatorstack.ui", connected: true, icon: FaInstagram, color: "text-pink-600 bg-pink-50", date: "Connected Jul 2026" },
        { id: "youtube", name: "YouTube Channel", handle: "Creator Stack Tech", connected: false, icon: FaYoutube, color: "text-red-600 bg-red-50", date: "Not connected" },
    ]);

    const toggleConnection = (id: string) => {
        setAccounts(accounts.map(acc => {
            if (acc.id === id) {
                return {
                    ...acc,
                    connected: !acc.connected,
                    date: !acc.connected ? "Just connected" : "Not connected"
                };
            }
            return acc;
        }));
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Share2 className="w-7 h-7 text-primary" /> Connected Social Accounts
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manage platform integrations for cross-posting and analytics sync</p>
                </div>
            </div>

            {/* Accounts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {accounts.map((acc) => {
                    const Icon = acc.icon;
                    return (
                        <div key={acc.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-4 flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className={`p-3 rounded-xl ${acc.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${acc.connected ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                                        }`}>
                                        {acc.connected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                        {acc.connected ? "Active" : "Disconnected"}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-800">{acc.name}</h3>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">{acc.handle}</p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[11px] text-slate-400">{acc.date}</span>
                                <button
                                    onClick={() => toggleConnection(acc.id)}
                                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${acc.connected
                                        ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                                        : "bg-primary text-white hover:bg-primary/90 shadow-xs"
                                        }`}
                                >
                                    {acc.connected ? "Disconnect" : "Connect Account"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
