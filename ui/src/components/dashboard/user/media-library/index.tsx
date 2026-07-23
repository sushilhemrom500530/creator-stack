"use client";

import { useState } from "react";
import { 
    Folder, 
    UploadCloud, 
    Image as ImageIcon, 
    Video, 
    FileText, 
    MoreVertical, 
    Trash2, 
    Download, 
    Search,
    HardDrive
} from "lucide-react";

export default function MediaLibraryComponent() {
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const files = [
        { id: 1, name: "hero-banner-v2.png", type: "image", size: "2.4 MB", date: "2 hours ago", color: "text-blue-500 bg-blue-50" },
        { id: 2, name: "product-demo-overview.mp4", type: "video", size: "18.6 MB", date: "Yesterday", color: "text-purple-500 bg-purple-50" },
        { id: 3, name: "brand-style-guide-2026.pdf", type: "document", size: "4.1 MB", date: "Jul 20, 2026", color: "text-amber-500 bg-amber-50" },
        { id: 4, name: "launch-thumbnail.png", type: "image", size: "1.2 MB", date: "Jul 18, 2026", color: "text-blue-500 bg-blue-50" },
        { id: 5, name: "customer-story-clip.mp4", type: "video", size: "32.0 MB", date: "Jul 15, 2026", color: "text-purple-500 bg-purple-50" },
        { id: 6, name: "press-kit-assets.zip", type: "document", size: "12.8 MB", date: "Jul 10, 2026", color: "text-emerald-500 bg-emerald-50" },
    ];

    const filteredFiles = files.filter(f => {
        const matchesTab = activeTab === "all" || f.type === activeTab;
        const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Folder className="w-7 h-7 text-primary" /> Media Assets Library
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manage, organize, and store your media files for post publishing</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition shadow-md self-start sm:self-auto">
                    <UploadCloud className="w-4 h-4" />
                    Upload Media
                </button>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80">
                {/* Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                    {[
                        { id: "all", label: "All Assets" },
                        { id: "image", label: "Images" },
                        { id: "video", label: "Videos" },
                        { id: "document", label: "Documents" },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                                activeTab === tab.id
                                    ? "bg-primary text-white shadow-xs"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search & Storage Usage */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 md:w-64">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search assets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-primary placeholder:text-slate-400"
                        />
                    </div>
                </div>
            </div>

            {/* Storage Progress */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-100 rounded-xl text-slate-700">
                        <HardDrive className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-800">Storage Usage</h4>
                        <p className="text-xs text-slate-500">71.1 MB of 5.0 GB used (1.4%)</p>
                    </div>
                </div>
                <div className="w-48 hidden sm:block bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[1.4%] rounded-full"></div>
                </div>
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {filteredFiles.map((file) => {
                    const getIcon = () => {
                        if (file.type === "image") return <ImageIcon className="w-6 h-6" />;
                        if (file.type === "video") return <Video className="w-6 h-6" />;
                        return <FileText className="w-6 h-6" />;
                    };

                    return (
                        <div key={file.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition space-y-4 group">
                            <div className="flex items-center justify-between">
                                <div className={`p-3 rounded-xl ${file.color}`}>
                                    {getIcon()}
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                    <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800 truncate" title={file.name}>
                                    {file.name}
                                </h4>
                                <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
                                    <span>{file.size}</span>
                                    <span>{file.date}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
