import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    ArrowDownToLine,
    Plus,
    Trash2,
    Calendar,
    FileSpreadsheet,
    File as FileIcon,
    X,
    Upload,
    FileCheck
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";

interface DownloadDoc {
    _id: string;
    title: string;
    category: "import" | "export";
    fileName: string;
    fileUrl: string;
    fileType: string;
    createdAt: string;
}

const DownloadCenter: React.FC = () => {
    const { category } = useParams<{ category: "import" | "export" }>();
    const { isAuthenticated, user } = useAuth();
    const isAdmin = isAuthenticated && user?.role === "admin";

    const [docs, setDocs] = useState<DownloadDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Upload form state
    const [newDocTitle, setNewDocTitle] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchDocs();
    }, [category]);

    const fetchDocs = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/download-docs/category/${category}`);
            if (res.data.success) {
                setDocs(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching documents:", err);
            toast.error("Failed to load documents");
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDocTitle || !selectedFile) {
            toast.error("Please provide a title and select a file");
            return;
        }

        const formData = new FormData();
        formData.append("title", newDocTitle);
        formData.append("category", category || "import");
        formData.append("file", selectedFile);

        try {
            setUploading(true);
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/download-docs`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );

            if (res.data.success) {
                toast.success("Document uploaded successfully");
                setNewDocTitle("");
                setSelectedFile(null);
                setIsUploadModalOpen(false);
                fetchDocs();
            }
        } catch (err) {
            console.error("Upload error:", err);
            toast.error("Failed to upload document");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this document?")) return;

        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/download-docs/${id}`);
            toast.success("Document deleted");
            fetchDocs();
        } catch (err) {
            console.error("Delete error:", err);
            toast.error("Failed to delete document");
        }
    };

    const getFileIcon = (type: string) => {
        if (type.includes("pdf")) return <FileText className="w-6 h-6 text-red-500" />;
        if (type.includes("sheet") || type.includes("excel") || type.includes("csv"))
            return <FileSpreadsheet className="w-6 h-6 text-emerald-500" />;
        if (type.includes("word") || type.includes("officedocument.wordprocessingml"))
            return <FileText className="w-6 h-6 text-blue-500" />;
        return <FileIcon className="w-6 h-6 text-slate-400" />;
    };

    const getFriendlyFileType = (type: string) => {
        if (type.includes("pdf")) return "PDF Document";
        if (type.includes("sheet") || type.includes("excel") || type.includes("csv")) return "Excel Spreadsheet";
        if (type.includes("word") || type.includes("officedocument.wordprocessingml")) return "Word Document";
        return "Internal Document";
    };

    const categoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) : "";

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24">
            {/* Hero Banner */}
            <div className="relative h-[400px] overflow-hidden">
                <img
                    src="/images/downloads_hero.png"
                    alt="Downloads Hero"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-blue-950/80 via-blue-950/60 to-transparent flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-3xl"
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-100 text-xs font-bold rounded-full mb-6 tracking-widest uppercase">
                                <FileCheck className="w-3.5 h-3.5" />
                                Official Repository
                            </span>
                            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
                                {categoryTitle} <span className="text-blue-400">Hub</span>
                            </h1>
                            <p className="text-blue-100/80 text-lg md:text-xl font-medium max-w-xl mx-auto md:mx-0 leading-relaxed">
                                Access authenticated {category} documentation and administrative forms directly from Baksh Group Gateway.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 -mt-12 mb-16 relative z-20">
                    <div className="flex items-center gap-4 bg-white/80 backdrop-blur-xl p-2 rounded-2xl shadow-sm border border-white/50">
                        <div className="h-10 w-2 bg-blue-600 rounded-full" />
                        <h2 className="text-xl font-bold text-slate-800 pr-6">Document Library</h2>
                    </div>

                    {isAdmin && (
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="group flex items-center gap-3 bg-slate-900 border border-slate-800 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl shadow-slate-900/10 transition-all hover:bg-slate-800 hover:-translate-y-1 active:scale-[0.98]"
                        >
                            <Plus className="w-5 h-5 text-blue-400 group-hover:rotate-90 transition-transform duration-300" />
                            Upload to {categoryTitle}
                        </button>
                    )}
                </div>

                {/* Documents Grid */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-40">
                        <div className="relative h-16 w-16">
                            <div className="absolute inset-0 border-4 border-slate-200 rounded-full" />
                            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                        <p className="mt-6 text-slate-400 font-semibold tracking-wide uppercase text-xs">Accessing Archives...</p>
                    </div>
                ) : docs.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm"
                    >
                        <div className="bg-slate-50 p-8 rounded-[2rem] w-28 h-28 flex items-center justify-center mx-auto mb-8">
                            <FileIcon className="w-12 h-12 text-slate-300" />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Empty Repository</h3>
                        <p className="text-slate-500 text-lg max-w-sm mx-auto leading-relaxed">
                            No {category} documents have been published to the hub at this time.
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <AnimatePresence mode="popLayout">
                            {docs.map((doc, index) => (
                                <motion.div
                                    key={doc._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="group relative bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:-translate-y-2 hover:border-blue-100"
                                >
                                    {/* Sidebar Design Accent */}
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-50 group-hover:bg-blue-500 transition-colors duration-500" />

                                    <div className="p-10 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3.5 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors duration-500">
                                                    {getFileIcon(doc.fileType)}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] font-black tracking-widest text-slate-300 uppercase">Format</p>
                                                    <p className="text-xs font-bold text-slate-600">{getFriendlyFileType(doc.fileType)}</p>
                                                </div>
                                            </div>

                                            {isAdmin && (
                                                <button
                                                    onClick={() => handleDelete(doc._id)}
                                                    className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>

                                        <h3 className="text-2xl font-bold text-slate-900 mb-6 line-clamp-2 min-h-[4.5rem] leading-[1.2] group-hover:text-blue-600 transition-colors duration-300">
                                            {doc.title}
                                        </h3>

                                        <div className="flex items-center gap-4 mt-auto">
                                            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider bg-slate-50 py-1.5 px-3 rounded-lg">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(doc.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-10 pb-10">
                                        <a
                                            href={doc.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-between px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl transition-all duration-300 group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:text-white"
                                        >
                                            <span className="font-bold text-slate-700 tracking-wide group-hover:text-white">ACCESS FILE</span>
                                            <ArrowDownToLine className="w-5 h-5 text-slate-400 group-hover:text-white transition-transform group-hover:translate-y-0.5" />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Styled Upload Modal */}
                <AnimatePresence>
                    {isUploadModalOpen && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsUploadModalOpen(false)}
                                className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20"
                            >
                                <div className="p-12">
                                    <div className="flex items-center justify-between mb-12">
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Upload Entry</h2>
                                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Baksh Group Archive System</p>
                                        </div>
                                        <button
                                            onClick={() => setIsUploadModalOpen(false)}
                                            className="p-3 text-slate-400 hover:text-slate-900 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                                        >
                                            <X className="w-7 h-7" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleUpload} className="space-y-10">
                                        <div className="space-y-3">
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Document Index Title</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-900"
                                                placeholder="Enter professional title..."
                                                value={newDocTitle}
                                                onChange={(e) => setNewDocTitle(e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Archive File</label>
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="border-4 border-dashed border-slate-50 rounded-[2.5rem] p-12 text-center hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer group relative overflow-hidden"
                                            >
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            setSelectedFile(e.target.files[0]);
                                                        } else {
                                                            setSelectedFile(null);
                                                        }
                                                    }}
                                                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                                                />
                                                <div className="bg-slate-900 text-white p-5 rounded-3xl w-16 h-16 flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110 shadow-xl shadow-slate-200">
                                                    <Upload className="w-8 h-8 text-blue-400" />
                                                </div>
                                                <p className="text-slate-900 font-black text-xl mb-2">
                                                    {selectedFile ? selectedFile.name : "Select Document"}
                                                </p>
                                                <p className="text-slate-400 font-bold text-[10px] tracking-[0.15em] uppercase">
                                                    PDF, Word, or Excel • Limited to 10MB
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={uploading}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-3xl font-black text-lg shadow-2xl shadow-blue-500/20 transition-all disabled:opacity-50 hover:-translate-y-1 active:scale-[0.99]"
                                        >
                                            {uploading ? (
                                                <div className="flex items-center justify-center gap-3">
                                                    <div className="w-6 h-6 border-4 border-white/20 border-t-white animate-spin rounded-full" />
                                                    SYNCHRONIZING...
                                                </div>
                                            ) : "PUBLISH TO ARCHIVE"}
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DownloadCenter;
