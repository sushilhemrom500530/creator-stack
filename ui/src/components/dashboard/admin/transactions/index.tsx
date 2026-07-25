"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
    Table,
    Tag,
    Button,
    Input,
    Progress,
    Avatar,
    Modal,
    message,
    Tooltip,
    Badge,
} from "antd";
import {
    Wallet,
    CheckCircle2,
    CreditCard,
    TrendingUp,
    Filter,
    Download,
    Search,
    Sparkles,
    ShieldCheck,
    ArrowUpRight,
    Eye,
    DollarSign,
    Building2,
    Calendar,
    Globe,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export interface TransactionItem {
    id: string;
    invoiceId: string;
    clientName: string;
    clientEmail: string;
    clientLogo: string;
    clientInitials: string;
    clientBg: string;
    date: string;
    amount: string;
    rawAmount: number;
    status: "Paid" | "Pending" | "Failed";
    method: string;
    methodType: "Visa" | "Wire Transfer" | "Amex" | "Apple Pay" | "Mastercard";
    typeCategory: "Subscription" | "Add-on";
}

const INITIAL_TRANSACTIONS: TransactionItem[] = [
    {
        id: "1",
        invoiceId: "#SF-98421-AI",
        clientName: "Vortex Studio",
        clientEmail: "vortex@billing.io",
        clientLogo: "",
        clientInitials: "VS",
        clientBg: "bg-emerald-600",
        date: "Oct 24, 2023",
        amount: "$12,450.00",
        rawAmount: 12450,
        status: "Paid",
        method: "Visa •••• 4242",
        methodType: "Visa",
        typeCategory: "Subscription",
    },
    {
        id: "2",
        invoiceId: "#SF-98422-AI",
        clientName: "Nexus Corp",
        clientEmail: "finance@nexus.com",
        clientLogo: "",
        clientInitials: "NX",
        clientBg: "bg-slate-700",
        date: "Oct 23, 2023",
        amount: "$8,900.00",
        rawAmount: 8900,
        status: "Pending",
        method: "Wire Transfer",
        methodType: "Wire Transfer",
        typeCategory: "Add-on",
    },
    {
        id: "3",
        invoiceId: "#SF-98423-AI",
        clientName: "CloudLine Inc",
        clientEmail: "billing@cloudline.net",
        clientLogo: "",
        clientInitials: "CL",
        clientBg: "bg-amber-600",
        date: "Oct 22, 2023",
        amount: "$4,500.00",
        rawAmount: 4500,
        status: "Failed",
        method: "Amex •••• 1004",
        methodType: "Amex",
        typeCategory: "Subscription",
    },
    {
        id: "4",
        invoiceId: "#SF-98424-AI",
        clientName: "Quantum Tech",
        clientEmail: "pay@quantum.tech",
        clientLogo: "",
        clientInitials: "QT",
        clientBg: "bg-teal-600",
        date: "Oct 21, 2023",
        amount: "$24,000.00",
        rawAmount: 24000,
        status: "Paid",
        method: "Apple Pay",
        methodType: "Apple Pay",
        typeCategory: "Subscription",
    },
    {
        id: "5",
        invoiceId: "#SF-98425-AI",
        clientName: "Dribbble Team",
        clientEmail: "accounts@dribbble.com",
        clientLogo: "",
        clientInitials: "DR",
        clientBg: "bg-rose-500",
        date: "Oct 20, 2023",
        amount: "$6,120.50",
        rawAmount: 6120.5,
        status: "Paid",
        method: "Visa •••• 9912",
        methodType: "Visa",
        typeCategory: "Add-on",
    },
    {
        id: "6",
        invoiceId: "#SF-98426-AI",
        clientName: "Acme Global",
        clientEmail: "billing@acme.io",
        clientLogo: "",
        clientInitials: "AG",
        clientBg: "bg-indigo-600",
        date: "Oct 19, 2023",
        amount: "$15,300.00",
        rawAmount: 15300,
        status: "Paid",
        method: "Mastercard •••• 8831",
        methodType: "Mastercard",
        typeCategory: "Subscription",
    },
];

export default function Transactions() {
    const [transactions] = useState<TransactionItem[]>(INITIAL_TRANSACTIONS);
    const [activeCategory, setActiveCategory] = useState<string>("All");
    const [searchText, setSearchText] = useState<string>("");
    const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

    // Filter Logic
    const filteredTx = transactions.filter((tx) => {
        const matchesSearch =
            tx.invoiceId.toLowerCase().includes(searchText.toLowerCase()) ||
            tx.clientName.toLowerCase().includes(searchText.toLowerCase()) ||
            tx.clientEmail.toLowerCase().includes(searchText.toLowerCase());

        if (activeCategory === "Subscription") return matchesSearch && tx.typeCategory === "Subscription";
        if (activeCategory === "Add-on") return matchesSearch && tx.typeCategory === "Add-on";
        return matchesSearch;
    });

    const handleExportCSV = () => {
        message.loading({ content: "Generating Transaction Ledger CSV...", key: "tx_csv" });
        setTimeout(() => {
            message.success({ content: "Export downloaded (transaction_ledger_2023.csv)", key: "tx_csv" });
        }, 1000);
    };

    // Gauge Chart Options
    const gaugeChartOptions: ApexCharts.ApexOptions = {
        chart: {
            type: "radialBar",
            sparkline: { enabled: true },
        },
        plotOptions: {
            radialBar: {
                startAngle: -90,
                endAngle: 90,
                hollow: { size: "65%" },
                track: { background: "#F1F5F9", strokeWidth: "100%" },
                dataLabels: {
                    name: { show: false },
                    value: {
                        show: true,
                        fontSize: "18px",
                        fontWeight: 800,
                        color: "#0F172A",
                        offsetY: -2,
                        formatter: (val) => `${val}%`,
                    },
                },
            },
        },
        stroke: { lineCap: "round" },
        colors: ["#8B5CF6"],
    };

    return (
        <div className="min-h-screen font-sans p-6">
            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pb-4 border-b border-slate-200/60">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Transaction Ledger</h1>
                        <span className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                            <Sparkles className="w-3 h-3 text-indigo-500" /> AI Analytics Active
                        </span>
                    </div>
                    <p className="text-slate-500 mt-1 text-sm font-medium">
                        Monitoring global payment flows and financial performance.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        icon={<Filter className="w-4 h-4 text-slate-600" />}
                        className="bg-white border-slate-200 hover:border-slate-300 font-bold rounded-xl h-10 text-slate-700 shadow-2xs flex items-center gap-2"
                        onClick={() => message.info("Filter modal opened")}
                    >
                        Filter
                    </Button>
                    <Button
                        type="primary"
                        icon={<Download className="w-4 h-4" />}
                        onClick={handleExportCSV}
                        className="bg-indigo-600 hover:bg-indigo-700 font-extrabold rounded-xl h-10 px-5 flex items-center gap-2 shadow-sm border-none"
                    >
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* --- Top Stat Cards Grid (3 Columns) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* 1. Total Revenue */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                                    <Wallet className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Revenue</span>
                            </div>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                <TrendingUp className="w-3.5 h-3.5" /> +12.5%
                            </span>
                        </div>

                        <div className="mb-4">
                            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">$1,248,390.00</span>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
                            <span>75% of monthly target achieved</span>
                        </div>
                        <Progress percent={75} showInfo={false} strokeColor="#8B5CF6" railColor="#F1F5F9" size="small" />
                    </div>
                </div>

                {/* 2. Success Rate */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Success Rate</span>
                            </div>
                            <span className="text-[11px] font-extrabold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                                Last 30 Days
                            </span>
                        </div>

                        <div className="mb-4">
                            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">99.92%</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                            <div className="flex -space-x-1.5">
                                <div className="w-4 h-4 rounded-full bg-emerald-500 border border-white"></div>
                                <div className="w-4 h-4 rounded-full bg-indigo-500 border border-white"></div>
                                <div className="w-4 h-4 rounded-full bg-teal-500 border border-white"></div>
                            </div>
                            <span className="text-slate-600 font-bold ml-1">Top tier gateway performance</span>
                        </div>
                    </div>
                </div>

                {/* 3. Pending Payouts */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Pending Payouts</span>
                            </div>
                            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-700 bg-rose-100 border border-rose-200 px-2.5 py-0.5 rounded-full">
                                <AlertCircle className="w-3 h-3 text-rose-600" /> 4 Delayed !
                            </span>
                        </div>

                        <div className="mb-4">
                            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">$42,900.50</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                        <span className="font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                            Next payout: 24h
                        </span>
                        <button
                            onClick={() => message.info("Opening payout queue details...")}
                            className="font-extrabold text-indigo-600 hover:text-indigo-700 transition"
                        >
                            View details &rarr;
                        </button>
                    </div>
                </div>
            </div>

            {/* --- Main Section: Recent Transactions --- */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs mb-8">
                {/* Header & Tabs */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Recent Transactions</h2>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        {/* Tabs */}
                        <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
                            {["All", "Subscription", "Add-on"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveCategory(tab)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition ${
                                        activeCategory === tab
                                            ? "bg-white text-indigo-600 shadow-2xs"
                                            : "text-slate-500 hover:text-slate-800"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <Input
                            placeholder="Filter by ID, client..."
                            prefix={<Search className="w-3.5 h-3.5 text-slate-400 mr-1" />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-48 sm:w-56 rounded-xl border-slate-200 bg-slate-50 hover:border-slate-300 focus:bg-white text-xs"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                                <th className="py-3.5 px-4">Invoice ID</th>
                                <th className="py-3.5 px-4">Client</th>
                                <th className="py-3.5 px-4">Date</th>
                                <th className="py-3.5 px-4">Amount</th>
                                <th className="py-3.5 px-4 text-center">Status</th>
                                <th className="py-3.5 px-4">Method</th>
                                <th className="py-3.5 px-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                            {filteredTx.map((row) => (
                                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                                    {/* Invoice ID */}
                                    <td className="py-4 px-4 font-mono font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                        {row.invoiceId}
                                    </td>

                                    {/* Client */}
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-9 h-9 rounded-xl ${row.clientBg} text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-2xs`}
                                            >
                                                {row.clientInitials}
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-extrabold text-slate-900">{row.clientName}</h4>
                                                <span className="text-[10px] text-slate-400 font-medium">{row.clientEmail}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Date */}
                                    <td className="py-4 px-4 text-slate-500 font-medium whitespace-nowrap">
                                        {row.date}
                                    </td>

                                    {/* Amount */}
                                    <td className="py-4 px-4 font-extrabold text-slate-900 text-sm">
                                        {row.amount}
                                    </td>

                                    {/* Status */}
                                    <td className="py-4 px-4 text-center">
                                        {row.status === "Paid" && (
                                            <span className="inline-block px-3 py-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-full">
                                                Paid
                                            </span>
                                        )}
                                        {row.status === "Pending" && (
                                            <span className="inline-block px-3 py-1 text-[10px] font-extrabold text-teal-700 bg-teal-100 border border-teal-200 rounded-full">
                                                Pending
                                            </span>
                                        )}
                                        {row.status === "Failed" && (
                                            <span className="inline-block px-3 py-1 text-[10px] font-extrabold text-rose-700 bg-rose-100 border border-rose-200 rounded-full">
                                                Failed
                                            </span>
                                        )}
                                    </td>

                                    {/* Method */}
                                    <td className="py-4 px-4 text-slate-600 font-medium">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-slate-400" />
                                            <span>{row.method}</span>
                                        </div>
                                    </td>

                                    {/* Action */}
                                    <td className="py-4 px-4 text-right">
                                        <Tooltip title="View Invoice">
                                            <Button
                                                type="text"
                                                size="small"
                                                icon={<Eye className="w-4 h-4 text-slate-500" />}
                                                onClick={() => {
                                                    setSelectedTx(row);
                                                    setIsDetailModalOpen(true);
                                                }}
                                                className="hover:bg-slate-100 rounded-lg"
                                            />
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-100 mt-6 text-xs text-slate-500 font-medium">
                    <span>Showing {filteredTx.length} of 2,410 transactions</span>
                    <div className="flex items-center gap-1.5">
                        <Button size="small" className="rounded-lg text-xs font-bold border-slate-200">&lt;</Button>
                        <Button size="small" type="primary" className="rounded-lg text-xs font-bold bg-indigo-600">1</Button>
                        <Button size="small" className="rounded-lg text-xs font-bold border-slate-200">2</Button>
                        <Button size="small" className="rounded-lg text-xs font-bold border-slate-200">3</Button>
                        <span className="text-slate-400 px-1">...</span>
                        <Button size="small" className="rounded-lg text-xs font-bold border-slate-200">48</Button>
                        <Button size="small" className="rounded-lg text-xs font-bold border-slate-200">&gt;</Button>
                    </div>
                </div>
            </div>

            {/* --- Bottom Row (2 Columns) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Growth Forecast */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:shadow-md transition flex items-center justify-between gap-6">
                    <div className="w-24 h-24 shrink-0 flex items-center justify-center">
                        <ReactApexChart options={gaugeChartOptions} series={[75]} type="radialBar" height="100%" width="100%" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-extrabold text-slate-900 mb-1">Growth Forecast</h3>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed mb-4">
                            AI predicts a 22% increase in recurring revenue next quarter based on current subscription velocity.
                        </p>
                        <div className="flex items-center gap-6 text-xs">
                            <div>
                                <span className="text-[10px] text-slate-400 font-extrabold uppercase block">PROJECTED</span>
                                <span className="text-sm font-extrabold text-indigo-600">+$240k</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 font-extrabold uppercase block">CONFIDENCE</span>
                                <span className="text-sm font-extrabold text-emerald-600">High</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Fraud Protection Active */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:shadow-md transition flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 shrink-0 mt-0.5">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-extrabold text-slate-900 mb-1">Fraud Protection Active</h3>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed mb-4">
                            Your transaction shield has blocked 14 suspicious activities in the last 24 hours.
                        </p>
                        <button
                            onClick={() => message.info("Opening Fraud Safety Report...")}
                            className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition"
                        >
                            Review Safety Report <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* --- INVOICE DETAILS MODAL --- */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-indigo-600" />
                        <span className="font-extrabold text-slate-900">Invoice Details {selectedTx?.invoiceId}</span>
                    </div>
                }
                open={isDetailModalOpen}
                onCancel={() => setIsDetailModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsDetailModalOpen(false)} className="rounded-xl font-bold">
                        Close
                    </Button>,
                    <Button
                        key="print"
                        type="primary"
                        onClick={() => {
                            message.success("Invoice PDF generated");
                            setIsDetailModalOpen(false);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl border-none"
                    >
                        Download PDF
                    </Button>,
                ]}
            >
                {selectedTx && (
                    <div className="space-y-4 py-2 text-xs">
                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                            <div>
                                <span className="text-slate-400 font-bold uppercase block text-[10px]">Total Paid</span>
                                <span className="font-extrabold text-slate-900 text-xl">{selectedTx.amount}</span>
                            </div>
                            <span className="px-3 py-1 text-[10px] font-extrabold bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
                                {selectedTx.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                                <span className="text-slate-400 font-bold uppercase block text-[10px]">Client</span>
                                <span className="font-extrabold text-slate-900 block text-xs">{selectedTx.clientName}</span>
                                <span className="text-slate-400 text-[10px]">{selectedTx.clientEmail}</span>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                                <span className="text-slate-400 font-bold uppercase block text-[10px]">Payment Method</span>
                                <span className="font-extrabold text-slate-900 block text-xs">{selectedTx.method}</span>
                                <span className="text-slate-400 text-[10px]">{selectedTx.typeCategory}</span>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                            <span className="text-slate-400 font-bold uppercase block text-[10px] mb-1">Transaction Timeline</span>
                            <div className="flex justify-between text-slate-700 font-medium">
                                <span>Date Created:</span>
                                <span className="font-extrabold">{selectedTx.date}</span>
                            </div>
                            <div className="flex justify-between text-slate-700 font-medium mt-1">
                                <span>Settlement Time:</span>
                                <span className="font-extrabold text-emerald-600">Instant (&lt; 2s)</span>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
