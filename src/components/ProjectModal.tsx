import { useState, useEffect } from "react";
import { X, Twitter, Link as LinkIcon, Globe, Trash2, ChevronDown, Layers, Trash, Edit3, Save, GripVertical, Check, Calendar, Plus, ListTodo, Edit2, ArrowUpRight } from "lucide-react";
import { supabase } from "../supabase";

const CATEGORIES = ["Prediction Markets", "Perp", "Chains", "AI", "NFT", "DePIN", "SocialFi", "GameFi"];
const TIERS = ["S+", "1", "2", "3"];
const ADMIN_EMAILS = ["douxxxpsg@gmail.com"];

const tierBadgeStyles: Record<string, string> = {
    "S+": "bg-[#FFB800]/10 border-[#FFB800]/30 text-[#FFB800]",
    "1": "bg-[#00FF66]/10 border-[#00FF66]/30 text-[#00FF66]",
    "2": "bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]",
    "3": "bg-[#E4E4E7]/10 border-[#E4E4E7]/20 text-[#E4E4E7]",
};

const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    return dateString;
};

// Функция для сортировки: невыполненные наверх, выполненные вниз
const sortTasks = (tasks: any[]) => {
    return [...tasks].sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
    });
};

const SectionCard = ({ title, icon: Icon, isOpen, toggle, children }: any) => (
    <div className="bg-[#121214] border border-white/[0.08] rounded-[20px] overflow-hidden flex flex-col">
        <button onClick={toggle} className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors focus:outline-none">
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-white/40" />
                <span className="text-[15px] font-semibold text-white tracking-normal">{title}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </button>
        <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
            <div className="overflow-hidden">
                <div className="px-5 pb-5 pt-1 space-y-3">
                    {children}
                </div>
            </div>
        </div>
    </div>
);

const formatUrl = (url: string) => {
    if (!url) return "#";
    let formatted = url.trim();
    if (!/^https?:\/\//i.test(formatted)) {
        formatted = `https://${formatted}`;
    }
    return formatted;
};

interface ProjectModalProps {
    project: any;
    onClose: () => void;
    onUpdate?: (project: any) => void;
    isWatchlistMode?: boolean;
}

const ProjectModal = ({ project, onClose, onUpdate, isWatchlistMode = false }: ProjectModalProps) => {
    const [localProject, setLocalProject] = useState<any>(null);
    const [canEdit, setCanEdit] = useState(false);

    const [isEditingMetadata, setIsEditingMetadata] = useState(false);
    const [editName, setEditName] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editTier, setEditTier] = useState("3");
    const [editLogo, setEditLogo] = useState("");
    const [showLogoInput, setShowLogoInput] = useState(false);
    const [editWebsite, setEditWebsite] = useState("");
    const [editTwitter, setEditTwitter] = useState("");
    const [editDiscord, setEditDiscord] = useState("");

    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editingEcoId, setEditingEcoId] = useState<string | null>(null);
    const [editingLinkId, setEditingLinkId] = useState<string | null>(null);

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        tasks: false,
        ecosystem: false,
        links: false,
    });

    useEffect(() => {
        if (project) {
            const parsedProject = JSON.parse(JSON.stringify(project));
            // Сортируем задачи при открытии модального окна
            if (parsedProject.tasks) {
                parsedProject.tasks = sortTasks(parsedProject.tasks);
            }
            setLocalProject(parsedProject);

            supabase.auth.getSession().then(({ data: { session } }) => {
                const userEmail = session?.user?.email;
                if (isWatchlistMode) setCanEdit(!!session);
                else setCanEdit(userEmail && ADMIN_EMAILS.includes(userEmail) ? true : false);
            });
        }
    }, [project, isWatchlistMode]);

    const toggleSection = (section: string) => setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));

    const saveListsToDB = async (listsToUpdate: any) => {
        if (!canEdit || !localProject) return;
        const tableName = isWatchlistMode ? 'user_watchlist' : 'projects';
        await supabase.from(tableName).update(listsToUpdate).eq('id', project.id);
        if (onUpdate) onUpdate({ ...localProject, ...listsToUpdate });
    };

    // --- ТАСКИ ---
    const updateTask = (id: string, field: string, value: string) => {
        setLocalProject((prev: any) => ({ ...prev, tasks: (prev.tasks || []).map((t: any) => t.id === id ? { ...t, [field]: value } : t) }));
    };
    const addTask = () => {
        const newId = Date.now().toString();
        // Новая задача добавляется невыполненной, поэтому сортируем, чтобы она была наверху
        const updatedTasks = sortTasks([...(localProject.tasks || []), { id: newId, title: '', url: '', date: '', completed: false }]);
        setLocalProject((prev: any) => ({ ...prev, tasks: updatedTasks }));
        setEditingTaskId(newId);
    };
    const removeTask = (id: string) => {
        const updatedTasks = localProject.tasks.filter((t: any) => t.id !== id);
        setLocalProject((prev: any) => ({ ...prev, tasks: updatedTasks }));
        saveListsToDB({ tasks: updatedTasks });
    };
    const toggleTaskCompletion = async (taskId: string) => {
        if (!canEdit) return;
        let updatedTasks = (localProject.tasks || []).map((t: any) => t.id === taskId ? { ...t, completed: !t.completed } : t);
        // Сортируем задачи: выполненные улетают вниз
        updatedTasks = sortTasks(updatedTasks);
        setLocalProject({ ...localProject, tasks: updatedTasks });
        saveListsToDB({ tasks: updatedTasks });
    };
    const saveTask = () => {
        setEditingTaskId(null);
        saveListsToDB({ tasks: (localProject.tasks || []).filter((t: any) => t.title.trim() || t.url.trim()) });
    };

    // --- ЭКОСИСТЕМА ---
    const updateEcosystem = (id: string, field: string, value: string) => {
        setLocalProject((prev: any) => ({ ...prev, ecosystem: (prev.ecosystem || []).map((e: any) => e.id === id ? { ...e, [field]: value } : e) }));
    };
    const addEcosystem = () => {
        const newId = Date.now().toString();
        setLocalProject((prev: any) => ({ ...prev, ecosystem: [...(prev.ecosystem || []), { id: newId, label: '', tag: '', url: '' }] }));
        setEditingEcoId(newId);
    };
    const removeEcosystem = (id: string) => {
        const updatedEco = localProject.ecosystem.filter((e: any) => e.id !== id);
        setLocalProject((prev: any) => ({ ...prev, ecosystem: updatedEco }));
        saveListsToDB({ ecosystem: updatedEco });
    };
    const saveEcosystem = () => {
        setEditingEcoId(null);
        saveListsToDB({ ecosystem: (localProject.ecosystem || []).filter((e: any) => e.label.trim() || e.url.trim()) });
    };

    // --- ССЫЛКИ ---
    const updateLink = (id: string, field: string, value: string) => {
        setLocalProject((prev: any) => ({ ...prev, allLinks: (prev.allLinks || []).map((l: any) => l.id === id ? { ...l, [field]: value } : l) }));
    };
    const addLink = () => {
        const newId = Date.now().toString();
        setLocalProject((prev: any) => ({ ...prev, allLinks: [...(prev.allLinks || []), { id: newId, title: '', url: '' }] }));
        setEditingLinkId(newId);
    };
    const removeLink = (id: string) => {
        const updatedLinks = localProject.allLinks.filter((l: any) => l.id !== id);
        setLocalProject((prev: any) => ({ ...prev, allLinks: updatedLinks }));
        saveListsToDB({ allLinks: updatedLinks });
    };
    const saveLink = () => {
        setEditingLinkId(null);
        saveListsToDB({ allLinks: (localProject.allLinks || []).filter((l: any) => l.title.trim() || l.url.trim()) });
    };

    // --- МЕТАДАННЫЕ ---
    const startEditingMetadata = () => {
        setEditName(localProject.name || "");
        setEditCategory(localProject.category || "");
        setEditTier(localProject.tier || "3");
        setEditLogo(localProject.logo || "");
        setEditWebsite(localProject.website || "");
        setEditTwitter(localProject.twitter || "");
        setEditDiscord(localProject.discord || "");
        setIsEditingMetadata(true);
    };
    const cancelEditingMetadata = () => {
        setIsEditingMetadata(false);
        setShowLogoInput(false);
    }
    const handleSaveMetadata = async () => {
        if (!editName.trim()) { alert("Project Name is required!"); return; }
        const updatedData = {
            name: editName.trim(), category: editCategory || null, tier: editTier, logo: editLogo.trim() || null,
            website: editWebsite.trim(), twitter: editTwitter.trim(), discord: editDiscord.trim(),
        };
        const tableName = isWatchlistMode ? 'user_watchlist' : 'projects';
        const { error } = await supabase.from(tableName).update(updatedData).eq('id', project.id);
        if (error) {
            alert("Error saving: " + error.message);
        } else {
            setLocalProject({ ...localProject, ...updatedData });
            setIsEditingMetadata(false);
            setShowLogoInput(false);
            if (onUpdate) onUpdate({ ...localProject, ...updatedData });
        }
    };

    const handleDeleteProject = async () => {
        const message = isWatchlistMode ? "Remove this project from your Watchlist?" : "Are you sure you want to delete this project permanently?";
        if (window.confirm(message)) {
            const tableName = isWatchlistMode ? 'user_watchlist' : 'projects';
            await supabase.from(tableName).delete().eq('id', project.id);
            window.location.reload();
        }
    };

    const handleDragStart = (e: React.DragEvent, index: number, type: 'link' | 'eco' | 'task') => {
        if (type === 'link') setDraggedLinkIndex(index);
        else if (type === 'eco') setDraggedEcoIndex(index);
        else setDraggedTaskIndex(index);
    };

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };

    const handleDrop = (e: React.DragEvent, dropIndex: number, type: 'link' | 'eco' | 'task') => {
        e.preventDefault();
        if (type === 'link' && draggedLinkIndex !== null) {
            const newList = [...localProject.allLinks];
            const [draggedItem] = newList.splice(draggedLinkIndex, 1);
            newList.splice(dropIndex, 0, draggedItem);
            setLocalProject({ ...localProject, allLinks: newList });
            saveListsToDB({ allLinks: newList });
            setDraggedLinkIndex(null);
        } else if (type === 'eco' && draggedEcoIndex !== null) {
            const newList = [...localProject.ecosystem];
            const [draggedItem] = newList.splice(draggedEcoIndex, 1);
            newList.splice(dropIndex, 0, draggedItem);
            setLocalProject({ ...localProject, ecosystem: newList });
            saveListsToDB({ ecosystem: newList });
            setDraggedEcoIndex(null);
        } else if (type === 'task' && draggedTaskIndex !== null) {
            const newList = [...localProject.tasks];
            const [draggedItem] = newList.splice(draggedTaskIndex, 1);
            newList.splice(dropIndex, 0, draggedItem);
            setLocalProject({ ...localProject, tasks: newList });
            saveListsToDB({ tasks: newList });
            setDraggedTaskIndex(null);
        }
    };

    const handleDragEnd = () => {
        setDraggedLinkIndex(null);
        setDraggedEcoIndex(null);
        setDraggedTaskIndex(null);
    };

    const getParsedLinkInfo = (link: any) => {
        let icon = <Globe className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />;
        let displayTitle = link.title;
        try {
            const hostname = new URL(formatUrl(link.url)).hostname.toLowerCase();
            if (hostname.includes('twitter.com') || hostname.includes('x.com')) icon = <Twitter className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" fill="currentColor" />;
            else if (hostname.includes('discord.gg') || hostname.includes('discord.com')) icon = <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" /></svg>;
            else if (hostname.includes('t.me') || hostname.includes('telegram.org')) icon = <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12s12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z" /></svg>;
            else if (hostname.includes('github.com')) icon = <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z" /></svg>;
        } catch (e) { }
        return { icon, title: displayTitle || link.url };
    };

    if (!project || !localProject) return null;
    const currentLogo = isEditingMetadata ? editLogo : localProject.logo;
    const currentTier = localProject.tier || "3";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pt-20 sm:pt-24 pb-6 bg-black/60 backdrop-blur-xl transition-opacity duration-300">
            <div className="relative w-full max-w-2xl max-h-[85vh] h-fit bg-[#0a0a0c] border border-white/10 rounded-[32px] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>

                <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all z-10">
                    <X className="w-4 h-4" />
                </button>

                {/* ШАПКА ПРОЕКТА */}
                <div className="flex-shrink-0 px-8 pt-8 pb-6 border-b border-white/5 rounded-t-[32px]">
                    <div className="flex items-start gap-6">
                        <div className="relative flex-shrink-0">
                            <div
                                onClick={() => isEditingMetadata && setShowLogoInput(!showLogoInput)}
                                className={`w-20 h-20 rounded-[20px] flex items-center justify-center overflow-hidden bg-white/5 border border-white/10 transition-all ${isEditingMetadata ? 'cursor-pointer hover:border-white/20 hover:bg-white/10 shadow-lg' : ''}`}
                                style={!currentLogo ? { backgroundColor: `hsl(${localProject.logoColor || '0 0% 15%'})` } : {}}
                            >
                                {currentLogo ? (
                                    <img src={currentLogo} alt={localProject.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white/80 text-2xl font-bold uppercase tracking-widest">{localProject.logoLetter || localProject.name?.charAt(0) || "L"}</span>
                                )}
                            </div>
                            {isEditingMetadata && showLogoInput && (
                                <div className="absolute top-full left-0 mt-3 z-50 w-64 bg-[#141416] border border-white/10 rounded-2xl p-2 shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
                                    <div className="flex items-center gap-2 bg-[#0a0a0c] border border-white/5 rounded-xl px-3 py-2.5 focus-within:border-white/20 transition-colors">
                                        <LinkIcon className="w-4 h-4 text-white/40 flex-shrink-0" />
                                        <input type="text" placeholder="Paste new Logo URL..." value={editLogo} onChange={e => setEditLogo(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') setShowLogoInput(false); }} className="bg-transparent text-xs text-white outline-none w-full placeholder-white/30" autoFocus />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col justify-center pt-1 w-full">
                            {isEditingMetadata ? (
                                <>
                                    <div className="flex gap-3 w-full max-w-md mb-3">
                                        <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="flex-grow bg-transparent text-2xl font-bold text-white outline-none placeholder-white/20" />
                                        <select value={editCategory} onChange={e => setEditCategory(e.target.value)} className="w-1/3 bg-[#0a0a0c] border border-white/10 rounded-xl px-2 py-1.5 text-xs font-semibold text-white/70 outline-none focus:border-white/20 cursor-pointer">
                                            <option value="">No Tag</option>
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2 mb-5">
                                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mr-1">Project Tier:</span>
                                        {TIERS.map(t => (
                                            <button key={t} type="button" onClick={() => setEditTier(t)} className={`px-2.5 py-1 rounded-[8px] text-[10px] font-black tracking-wider transition-all border ${editTier === t ? "bg-white text-black border-transparent shadow-[0_0_10px_rgba(255,255,255,0.15)]" : "bg-white/5 text-white/40 border-white/10 hover:border-white/20 hover:text-white"}`}>TIER {t}</button>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 w-full">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Website URL</label>
                                            <div className="flex items-center gap-2 bg-transparent border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-white/20 transition-colors">
                                                <Globe className="w-4 h-4 text-white/40 flex-shrink-0" />
                                                <input type="text" placeholder="https://..." value={editWebsite} onChange={e => setEditWebsite(e.target.value)} className="bg-transparent text-xs text-white outline-none w-full placeholder-white/20" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Twitter (X)</label>
                                            <div className="flex items-center gap-2 bg-transparent border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-white/20 transition-colors">
                                                <Twitter className="w-4 h-4 text-white/40 flex-shrink-0" />
                                                <input type="text" placeholder="https://x.com/..." value={editTwitter} onChange={e => setEditTwitter(e.target.value)} className="bg-transparent text-xs text-white outline-none w-full placeholder-white/20" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Discord</label>
                                            <div className="flex items-center gap-2 bg-transparent border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-white/20 transition-colors">
                                                <svg className="w-4 h-4 text-white/40 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" /></svg>
                                                <input type="text" placeholder="https://discord.gg/..." value={editDiscord} onChange={e => setEditDiscord(e.target.value)} className="bg-transparent text-xs text-white outline-none w-full placeholder-white/20" />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 mb-4">
                                        <h2 className="text-3xl font-bold text-white tracking-tight">{localProject.name}</h2>
                                        {localProject.category && <span className="px-3 py-1 bg-white/10 border border-white/20 text-white text-[10px] uppercase font-bold rounded-lg tracking-wider flex-shrink-0">{localProject.category}</span>}
                                        <span className={`px-2.5 py-1 border text-[10px] font-black uppercase rounded-lg tracking-widest flex-shrink-0 ${tierBadgeStyles[currentTier] || tierBadgeStyles["3"]}`}>Tier {currentTier}</span>
                                    </div>
                                    <div className="flex items-center gap-5">
                                        {localProject.website && <a href={formatUrl(localProject.website)} target="_blank" rel="noreferrer" className="group flex items-center gap-1.5 text-white/40 hover:text-white transition-colors text-xs font-medium uppercase tracking-wider"><Globe className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" /> Website</a>}
                                        {localProject.twitter && <a href={formatUrl(localProject.twitter)} target="_blank" rel="noreferrer" className="group flex items-center gap-1.5 text-white/40 hover:text-white transition-colors text-xs font-medium uppercase tracking-wider"><Twitter className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" /> Twitter</a>}
                                        {localProject.discord && <a href={formatUrl(localProject.discord)} target="_blank" rel="noreferrer" className="group flex items-center gap-1.5 text-white/40 hover:text-white transition-colors text-xs font-medium uppercase tracking-wider"><svg className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" /></svg> Discord</a>}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* КОНТЕНТ (Скроллируемая область без черной дыры) */}
                <div className="overflow-y-auto px-6 sm:px-8 py-6 flex flex-col gap-4 custom-scrollbar h-fit max-h-full rounded-b-[32px]">

                    {/* СПИСКИ */}
                    <div className="flex flex-col gap-4">

                        {/* 1. TASKS */}
                        <SectionCard title="Tasks" icon={ListTodo} isOpen={openSections.tasks} toggle={() => toggleSection('tasks')}>
                            {(localProject.tasks || []).length === 0 && <p className="text-sm text-white/30 italic px-2">No tasks added yet.</p>}
                            {(localProject.tasks || []).map((task: any, i: number) => (
                                <div key={task.id} className="relative group">
                                    {editingTaskId === task.id ? (
                                        // РЕЖИМ РЕДАКТИРОВАНИЯ (Компактный)
                                        <div className="flex flex-col gap-3 bg-[#1a1a1c] border border-white/10 rounded-[16px] p-4 shadow-xl">
                                            <input placeholder="Task Title..." className="w-full bg-transparent text-[15px] font-semibold text-white outline-none placeholder-white/30" value={task.title} onChange={e => updateTask(task.id, 'title', e.target.value)} autoFocus />
                                            <div className="flex items-center gap-3">
                                                <LinkIcon className="w-4 h-4 text-white/30 shrink-0" />
                                                <input placeholder="URL (optional)" className="flex-1 min-w-0 bg-transparent text-[13px] text-white/60 outline-none placeholder-white/20" value={task.url || ""} onChange={e => updateTask(task.id, 'url', e.target.value)} />
                                            </div>
                                            <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-1">
                                                <div className="relative flex items-center justify-center bg-white/5 border border-white/5 rounded-lg px-3 h-8 hover:bg-white/10 transition-colors cursor-pointer group/date">
                                                    <Calendar className="w-4 h-4 text-white/50 group-hover/date:text-white/80 transition-colors" />
                                                    {task.date ? (
                                                        <span className="ml-2 text-[13px] font-medium text-white/80">{formatDate(task.date)}</span>
                                                    ) : (
                                                        <span className="ml-2 text-[13px] font-medium text-white/40">Set Date</span>
                                                    )}
                                                    <input type="date" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" value={task.date || ""} onChange={e => updateTask(task.id, 'date', e.target.value)} onClick={e => { try { if ('showPicker' in HTMLInputElement.prototype) e.currentTarget.showPicker(); } catch (err) { } }} />
                                                </div>
                                                <button onClick={saveTask} className="bg-white hover:bg-gray-200 text-black px-5 py-1.5 rounded-lg text-sm font-bold transition-colors">Save</button>
                                            </div>
                                        </div>
                                    ) : (
                                        // РЕЖИМ ПРОСМОТРА (ЕДИНАЯ ПЛАШКА: Чекбокс -> Название(Ссылка) -> Дата -> Кнопки)
                                        <div
                                            draggable={canEdit}
                                            onDragStart={(e) => handleDragStart(e, i, 'task')}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, i, 'task')}
                                            onDragEnd={handleDragEnd}
                                            className={`flex items-center justify-between gap-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-[16px] p-3.5 transition-all w-full pr-20 relative ${task.completed ? 'opacity-50' : ''}`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0 flex-grow">
                                                {/* Иконка перетаскивания */}
                                                {canEdit && <div className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white/60 transition-colors shrink-0 hidden sm:block"><GripVertical className="w-4 h-4" /></div>}

                                                {/* Чекбокс */}
                                                <button onClick={() => toggleTaskCompletion(task.id)} className={`shrink-0 flex items-center justify-center w-5 h-5 rounded-[6px] border-[1.5px] transition-colors ${task.completed ? 'bg-white border-white' : 'border-white/30 group-hover:border-white/60'}`}>
                                                    {task.completed && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                                                </button>

                                                {/* Название задачи (интерактивная ссылка) */}
                                                <div className="flex items-center gap-3 min-w-0 flex-grow">
                                                    {task.url ? (
                                                        <a href={formatUrl(task.url)} target="_blank" rel="noreferrer" className={`text-[15px] font-semibold hover:text-[#00E5FF] hover:underline truncate transition-colors flex items-center gap-1 ${task.completed ? 'text-white/50 line-through' : 'text-white/90'}`}>
                                                            {task.title}
                                                            <ArrowUpRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                                                        </a>
                                                    ) : (
                                                        <span className={`text-[15px] font-semibold truncate ${task.completed ? 'text-white/50 line-through' : 'text-white/90'}`}>{task.title}</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Дата (если есть) */}
                                            {task.date && (
                                                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md text-[12px] text-white/50 font-medium whitespace-nowrap shrink-0">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{formatDate(task.date)}</span>
                                                </div>
                                            )}

                                            {/* Кнопки редактирования и удаления (Справа, появляются при наведении) */}
                                            {canEdit && (
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-1/2 -translate-y-1/2 right-3 bg-[#121214] p-1 rounded-lg border border-white/10 shadow-md">
                                                    <button onClick={() => setEditingTaskId(task.id)} className="w-7 h-7 flex items-center justify-center rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => removeTask(task.id)} className="w-7 h-7 flex items-center justify-center rounded-md text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {canEdit && (
                                <button onClick={addTask} className="w-full py-3.5 rounded-[16px] border border-dashed border-white/10 text-white/50 hover:text-white hover:bg-white/[0.02] hover:border-white/20 transition-all flex items-center justify-center gap-2 text-sm font-medium mt-1">
                                    <Plus className="w-4 h-4" /> Add Task
                                </button>
                            )}
                        </SectionCard>

                        {/* 2. ECOSYSTEM */}
                        <SectionCard title="Ecosystem" icon={Layers} isOpen={openSections.ecosystem} toggle={() => toggleSection('ecosystem')}>
                            {(localProject.ecosystem || []).length === 0 && <p className="text-sm text-white/30 italic px-2">No ecosystem services added.</p>}
                            {(localProject.ecosystem || []).map((eco: any, i: number) => (
                                <div key={eco.id} className="relative group">
                                    {editingEcoId === eco.id ? (
                                        <div className="flex flex-col gap-3 bg-[#1a1a1c] border border-white/10 rounded-[16px] p-4 shadow-xl">
                                            <div className="flex items-center gap-3 w-full">
                                                <input placeholder="Service Name" className="flex-1 min-w-0 bg-transparent text-[15px] font-semibold text-white outline-none border-b border-white/10 focus:border-white/30 pb-1" value={eco.label} onChange={e => updateEcosystem(eco.id, 'label', e.target.value)} autoFocus />
                                                <input placeholder="TAG" className="w-20 bg-white/5 text-center text-[10px] font-bold uppercase tracking-wider text-white/50 rounded-lg px-2 py-1.5 outline-none border border-white/5 focus:border-white/20" value={eco.tag} onChange={e => updateEcosystem(eco.id, 'tag', e.target.value)} />
                                            </div>
                                            <div className="flex items-center gap-3 w-full">
                                                <LinkIcon className="w-4 h-4 text-white/30 shrink-0" />
                                                <input placeholder="URL" className="flex-1 min-w-0 bg-transparent text-[13px] text-white/60 outline-none border-b border-white/10 focus:border-white/30 pb-1" value={eco.url} onChange={e => updateEcosystem(eco.id, 'url', e.target.value)} />
                                                <button onClick={saveEcosystem} className="bg-white hover:bg-gray-200 text-black px-4 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0">Save</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            draggable={canEdit}
                                            onDragStart={(e) => handleDragStart(e, i, 'eco')}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, i, 'eco')}
                                            onDragEnd={handleDragEnd}
                                            className="flex items-center justify-between gap-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-[16px] p-3.5 transition-all w-full pr-20 relative"
                                        >
                                            <a href={formatUrl(eco.url)} target="_blank" rel="noreferrer" className="flex items-center gap-4 min-w-0 flex-grow">
                                                {canEdit && <div className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white/60 transition-colors shrink-0 hidden sm:block"><GripVertical className="w-4 h-4" /></div>}
                                                <div className="w-10 h-10 rounded-[10px] bg-white/[0.05] border border-white/5 flex items-center justify-center shrink-0"><Layers className="w-5 h-5 text-white/50 opacity-50 group-hover:opacity-100 transition-opacity" /></div>
                                                <span className="text-[15px] font-medium text-white/90 truncate hover:underline">{eco.label}</span>
                                                {eco.tag && <span className="px-3 py-1 bg-white/5 border border-white/10 text-white/50 text-[10px] uppercase font-bold rounded-lg tracking-wider shrink-0 hidden sm:block">{eco.tag}</span>}
                                            </a>
                                            {canEdit && (
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-1/2 -translate-y-1/2 right-3 bg-[#121214] p-1 rounded-lg border border-white/10 shadow-md">
                                                    <button onClick={() => setEditingEcoId(eco.id)} className="w-7 h-7 flex items-center justify-center rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => removeEcosystem(eco.id)} className="w-7 h-7 flex items-center justify-center rounded-md text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {canEdit && (
                                <button onClick={addEcosystem} className="w-full py-3.5 rounded-[16px] border border-dashed border-white/10 text-white/50 hover:text-white hover:bg-white/[0.02] hover:border-white/20 transition-all flex items-center justify-center gap-2 text-sm font-medium mt-1">
                                    <Plus className="w-4 h-4" /> Add Ecosystem Item
                                </button>
                            )}
                        </SectionCard>

                        {/* 3. ALL LINKS */}
                        <SectionCard title="All Links" icon={LinkIcon} isOpen={openSections.links} toggle={() => toggleSection('links')}>
                            {(localProject.allLinks || []).length === 0 && <p className="text-sm text-white/30 italic px-2">No additional links.</p>}
                            {(localProject.allLinks || []).map((link: any, i: number) => {
                                const { icon } = getParsedLinkInfo(link);
                                return (
                                    <div key={link.id} className="relative group">
                                        {editingLinkId === link.id ? (
                                            <div className="flex flex-col gap-3 bg-[#1a1a1c] border border-white/10 rounded-[16px] p-4 shadow-xl">
                                                <div className="flex items-center gap-3 w-full">
                                                    <input placeholder="Link Title" className="flex-1 min-w-0 bg-transparent text-[15px] font-semibold text-white outline-none border-b border-white/10 focus:border-white/30 pb-1" value={link.title} onChange={e => updateLink(link.id, 'title', e.target.value)} autoFocus />
                                                </div>
                                                <div className="flex items-center gap-3 w-full">
                                                    <LinkIcon className="w-4 h-4 text-white/30 shrink-0" />
                                                    <input placeholder="URL" className="flex-1 min-w-0 bg-transparent text-[13px] text-white/60 outline-none border-b border-white/10 focus:border-white/30 pb-1" value={link.url} onChange={e => updateLink(link.id, 'url', e.target.value)} />
                                                    <button onClick={saveLink} className="bg-[#32D74B]/10 hover:bg-[#32D74B]/20 text-[#32D74B] px-4 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0">Save</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                draggable={canEdit}
                                                onDragStart={(e) => handleDragStart(e, i, 'link')}
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => handleDrop(e, i, 'link')}
                                                onDragEnd={handleDragEnd}
                                                className="flex items-center justify-between gap-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-[16px] p-3 transition-all w-full pr-20 relative"
                                            >
                                                <a href={formatUrl(link.url)} target="_blank" rel="noreferrer" className="flex items-center gap-4 min-w-0 flex-grow">
                                                    {canEdit && <div className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white/60 transition-colors shrink-0 hidden sm:block"><GripVertical className="w-4 h-4" /></div>}
                                                    <div className="w-10 h-10 rounded-[12px] bg-white/[0.04] border border-white/5 flex items-center justify-center shrink-0">{icon}</div>
                                                    <span className="text-[15px] font-medium text-white/90 truncate hover:underline">{link.title || link.url}</span>
                                                </a>
                                                {canEdit && (
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-1/2 -translate-y-1/2 right-3 bg-[#121214] p-1 rounded-lg border border-white/10 shadow-md">
                                                        <button onClick={() => setEditingLinkId(link.id)} className="w-7 h-7 flex items-center justify-center rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                                                        <button onClick={() => removeLink(link.id)} className="w-7 h-7 flex items-center justify-center rounded-md text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            {canEdit && (
                                <button onClick={addLink} className="w-full py-3.5 rounded-[16px] border border-dashed border-white/10 text-white/50 hover:text-white hover:bg-white/[0.02] hover:border-white/20 transition-all flex items-center justify-center gap-2 text-sm font-medium mt-1">
                                    <Plus className="w-4 h-4" /> Add Link
                                </button>
                            )}
                        </SectionCard>

                    </div>

                    {/* ФУТЕР С КНОПКАМИ МЕТАДАННЫХ */}
                    {canEdit && (
                        <div className="pt-4 border-t border-white/5 mt-4">
                            {isEditingMetadata ? (
                                <div className="flex gap-3 w-full">
                                    <button onClick={handleSaveMetadata} className="flex-1 bg-white hover:bg-gray-200 text-black py-3 rounded-[14px] font-bold text-sm transition-all shadow-[0_2px_10px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"><Save size={16} /> Save Changes</button>
                                    <button onClick={cancelEditingMetadata} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 px-6 py-3 rounded-[14px] font-semibold text-sm transition-all">Cancel</button>
                                </div>
                            ) : (
                                <div className="flex justify-between w-full items-center">
                                    <button onClick={startEditingMetadata} className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-5 py-2.5 rounded-[12px] font-semibold text-sm transition-all flex items-center gap-2"><Edit3 size={16} /> Edit Project Info</button>
                                    <button onClick={handleDeleteProject} className="flex items-center gap-2 text-sm font-semibold text-red-500/60 hover:text-red-500 bg-red-500/5 hover:bg-red-500/10 px-5 py-2.5 rounded-[12px] transition-all"><Trash className="w-4 h-4" /> {isWatchlistMode ? "Remove from Watchlist" : "Delete Project"}</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(255, 255, 255, 0.2); }
            `}</style>
        </div>
    );
};

export default ProjectModal;