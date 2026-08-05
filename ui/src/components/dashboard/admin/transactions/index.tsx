"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
    App,
    Table,
    Button,
    Input,
    Progress,
    Modal,
    Tooltip,
    ConfigProvider,
} from "antd";
import type { ColumnsType } from "antd/es/table";
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
    AlertCircle,
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

function TransactionsContent() {
    const { message } = App.useApp();
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

    // Top Stat Cards Data
    const topStatCardsData = [
        {
            id: "total-revenue",
            title: "Total Revenue",
            value: "$1,248,390.00",
            icon: Wallet,
            iconBg: "bg-indigo-50 border-indigo-100 text-indigo-600",
            badge: "+12.5%",
            badgeIcon: TrendingUp,
            badgeClass: "text-emerald-700 bg-emerald-100 border-emerald-200",
            footer: (
                <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
                        <span>75% of monthly target achieved</span>
                    </div>
                    <Progress percent={75} showInfo={false} strokeColor="#8B5CF6" railColor="#F1F5F9" size="small" />
                </div>
            ),
        },
        {
            id: "success-rate",
            title: "Success Rate",
            value: "99.92%",
            icon: CheckCircle2,
            iconBg: "bg-emerald-50 border-emerald-100 text-emerald-600",
            badge: "Last 30 Days",
            badgeClass: "text-slate-500 bg-slate-100 border-slate-200",
            footer: (
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
            ),
        },
        {
            id: "pending-payouts",
            title: "Pending Payouts",
            value: "$42,900.50",
            icon: CreditCard,
            iconBg: "bg-emerald-50 border-emerald-100 text-emerald-600",
            badge: "4 Delayed !",
            badgeIcon: AlertCircle,
            badgeClass: "text-rose-700 bg-rose-100 border-rose-200",
            footer: (
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        Next payout: 24h
                    </span>
                    <button
                        onClick={() => message.info("Opening payout queue details...")}
                        className="font-extrabold text-indigo-600 hover:text-indigo-700 transition cursor-pointer"
                    >
                        View details &rarr;
                    </button>
                </div>
            ),
        },
    ];

    // Ant Design Table Columns Configuration
    const columns: ColumnsType<TransactionItem> = [
        {
            title: "INVOICE ID",
            dataIndex: "invoiceId",
            key: "invoiceId",
            render: (text) => (
                <span className="font-mono font-bold text-slate-900 text-xs hover:text-indigo-600 transition-colors">
                    {text}
                </span>
            ),
        },
        {
            title: "CLIENT",
            dataIndex: "clientName",
            key: "client",
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <div
                        className={`w-9 h-9 rounded-xl ${record.clientBg} text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-2xs`}
                    >
                        {record.clientInitials}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs font-extrabold text-slate-900 truncate">{record.clientName}</span>
                        <span className="text-[10px] text-slate-400 font-medium truncate">{record.clientEmail}</span>
                    </div>
                </div>
            ),
        },
        {
            title: "DATE",
            dataIndex: "date",
            key: "date",
            render: (date) => (
                <span className="text-slate-500 font-medium text-xs whitespace-nowrap">{date}</span>
            ),
        },
        {
            title: "AMOUNT",
            dataIndex: "amount",
            key: "amount",
            render: (amount) => (
                <span className="font-extrabold text-slate-900 text-sm">{amount}</span>
            ),
        },
        {
            title: "STATUS",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (status) => {
                if (status === "Paid") {
                    return (
                        <span className="inline-block px-3 py-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-full">
                            Paid
                        </span>
                    );
                }
                if (status === "Pending") {
                    return (
                        <span className="inline-block px-3 py-1 text-[10px] font-extrabold text-teal-700 bg-teal-100 border border-teal-200 rounded-full">
                            Pending
                        </span>
                    );
                }
                return (
                    <span className="inline-block px-3 py-1 text-[10px] font-extrabold text-rose-700 bg-rose-100 border border-rose-200 rounded-full">
                        Failed
                    </span>
                );
            },
        },
        {
            title: "METHOD",
            dataIndex: "method",
            key: "method",
            render: (method) => (
                <div className="flex items-center gap-2 text-slate-600 font-medium text-xs">
                    <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{method}</span>
                </div>
            ),
        },
        {
            title: "ACTION",
            key: "action",
            align: "right",
            render: (_, record) => (
                <Tooltip title="View Invoice">
                    <Button
                        type="text"
                        size="small"
                        icon={<Eye className="w-4 h-4 text-slate-500" />}
                        onClick={() => {
                            setSelectedTx(record);
                            setIsDetailModalOpen(true);
                        }}
                        className="hover:bg-slate-100 rounded-lg cursor-pointer"
                    />
                </Tooltip>
            ),
        },
    ];

    return (
        <div className="p-6">
            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pb-4 ">
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
                {topStatCardsData.map((card) => {
                    const CardIcon = card.icon;
                    const BadgeIcon = card.badgeIcon;
                    return (
                        <div key={card.id} className="card p-6 flex flex-col justify-between hover:-translate-y-1 [transition:0.3s]">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className={`p-2.5 rounded-2xl border ${card.iconBg}`}>
                                            <CardIcon className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                                            {card.title}
                                        </span>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${card.badgeClass}`}>
                                        {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5" />}
                                        {card.badge}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{card.value}</span>
                                </div>
                            </div>

                            {card.footer}
                        </div>
                    );
                })}
            </div>

            {/* --- Main Section: Recent Transactions --- */}
            <div className="card p-6 mb-8">
                {/* Header & Tabs */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Recent Transactions</h2>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        {/* Tabs */}
                        <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 shrink-0">
                            {["All", "Subscription", "Add-on"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveCategory(tab)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${activeCategory === tab
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
                <div className="overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={filteredTx}
                        rowKey="id"
                        scroll={{ x: "max-content" }}
                        pagination={{
                            pageSize: 6,
                            showSizeChanger: true,
                            pageSizeOptions: ["5", "6", "10", "20"],
                            showTotal: (total, range) => (
                                <span className="text-xs font-semibold text-slate-500">
                                    Showing <span className="text-indigo-600 font-bold">{range[0]}-{range[1]}</span> of{" "}
                                    <span className="text-slate-800 font-bold">{total}</span> transactions
                                </span>
                            ),
                            className: "pt-4 border-t border-slate-100 flex items-center justify-between",
                        }}
                        className="custom-admin-table custom-scrollbar"
                    />
                </div>
            </div>

            {/* --- Bottom Row (2 Columns) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Growth Forecast */}
                <div className="card p-6 flex items-center justify-between gap-6">
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
                <div className="card p-6 flex items-start gap-4">
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
                            className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition cursor-pointer"
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
                            <div className="card p-3">
                                <span className="text-slate-400 font-bold uppercase block text-[10px]">Client</span>
                                <span className="font-extrabold text-slate-900 block text-xs">{selectedTx.clientName}</span>
                                <span className="text-slate-400 text-[10px]">{selectedTx.clientEmail}</span>
                            </div>
                            <div className="card p-3">
                                <span className="text-slate-400 font-bold uppercase block text-[10px]">Payment Method</span>
                                <span className="font-extrabold text-slate-900 block text-xs">{selectedTx.method}</span>
                                <span className="text-slate-400 text-[10px]">{selectedTx.typeCategory}</span>
                            </div>
                        </div>

                        <div className="card p-3">
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

export default function Transactions() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#4F46E5",
                    borderRadius: 12,
                    fontFamily: "var(--font-geist-sans), 'DM Sans', sans-serif",
                },
            }}
        >
            <App>
                <TransactionsContent />
            </App>
        </ConfigProvider>
    );
}
