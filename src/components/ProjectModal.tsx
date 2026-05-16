import { useState, useEffect } from "react";
import { X, ExternalLink, Twitter, Link as LinkIcon, CheckSquare, FileText, Globe, Plus, Trash2, ChevronDown, ChevronUp, Check, Calendar, Pencil } from "lucide-react";

interface ProjectModalProps {
    project: any;
    onClose: () => void;
    onUpdate?: (project: any) => void;
}

const ProjectModal = ({ project, onClose, onUpdate }: ProjectModalProps) => {
    const [localProject, setLocalProject] = useState<any>(null);

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        links: true,
        tasks: false,
        notes: false,
    });

    const [newLinkTitle, setNewLinkTitle] = useState("");
    const [newLinkUrl, setNewLinkUrl] = useState("");
    const [newTaskText, setNewTaskText] = useState("");
    const [newTaskDeadline, setNewTaskDeadline] = useState("");
    const [isEditingEcosystem, setIsEditingEcosystem] = useState(false);
    const [ecosystemInput, setEcosystemInput] = useState("");

    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editTaskText, setEditTaskText] = useState("");
    const [editTaskDeadline, setEditTaskDeadline] = useState("");

    useEffect(() => {
        if (project) {
            setLocalProject(JSON.parse(JSON.stringify(project)));
            setEcosystemInput(project.ecosystemLink || "");
        }
    }, [project]);

    if (!project || !localProject) return null;

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleUpdate = (updatedData: any) => {
        const updatedProject = { ...localProject, ...updatedData };
        setLocalProject(updatedProject);
        if (onUpdate) onUpdate(updatedProject);
    };

    // --- Линки ---
    const handleAddLink = () => {
        if (!newLinkUrl.trim()) return;

        let urlToSave = newLinkUrl.trim();
        if (!urlToSave.startsWith('http://') && !urlToSave.startsWith('https://')) {
            urlToSave = 'https://' + urlToSave;
        }

        const currentLinks = localProject.allLinks || [];
        handleUpdate({
            allLinks: [...currentLinks, { id: Date.now().toString(), title: newLinkTitle.trim(), url: urlToSave }]
        });
        setNewLinkTitle("");
        setNewLinkUrl("");
    };

    const handleRemoveLink = (id: string) => {
        handleUpdate({ allLinks: (localProject.allLinks || []).filter((l: any) => l.id !== id) });
    };

    const getParsedLinkInfo = (link: any) => {
        let icon = <ExternalLink className="w-5 h-5 text-white/50" />;
        let displayTitle = link.title;

        try {
            const urlObj = new URL(link.url);
            const hostname = urlObj.hostname.toLowerCase();
            const pathname = urlObj.pathname;

            if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
                icon = <Twitter className="w-5 h-5 text-[#1DA1F2]" fill="currentColor" />;
                if (!displayTitle) {
                    const username = pathname.split('/')[1];
                    displayTitle = username ? `@${username}` : 'Twitter';
                }
            } else if (hostname.includes('discord.gg') || hostname.includes('discord.com')) {
                icon = (
                    <svg className="w-6 h-6 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
                    </svg>
                );
                if (!displayTitle) displayTitle = 'Discord';
            } else if (hostname.includes('t.me') || hostname.includes('telegram.org')) {
                icon = (
                    <svg className="w-6 h-6 text-[#229ED9]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z" />
                    </svg>
                );
                if (!displayTitle) {
                    const username = pathname.split('/')[1];
                    displayTitle = username ? `@${username}` : 'Telegram';
                }
            } else if (hostname.includes('github.com')) {
                icon = (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                );
                if (!displayTitle) {
                    const username = pathname.split('/')[1];
                    displayTitle = username ? `GitHub: ${username}` : 'GitHub';
                }
            }
        } catch (e) { }

        if (!displayTitle) {
            try {
                displayTitle = new URL(link.url).hostname.replace('www.', '');
            } catch {
                displayTitle = link.url;
            }
        }

        return { icon, title: displayTitle };
    };

    // --- Таски ---
    const handleAddTask = () => {
        if (!newTaskText.trim()) return;
        const currentTasks = localProject.tasks || [];
        handleUpdate({
            tasks: [...currentTasks, { id: Date.now().toString(), text: newTaskText, deadline: newTaskDeadline, done: false }]
        });
        setNewTaskText("");
        setNewTaskDeadline("");
    };

    const handleToggleTask = (id: string) => {
        const updatedTasks = (localProject.tasks || []).map((t: any) => t.id === id ? { ...t, done: !t.done } : t);
        handleUpdate({ tasks: updatedTasks });
    };

    const handleDeleteTask = (id: string) => {
        handleUpdate({ tasks: (localProject.tasks || []).filter((t: any) => t.id !== id) });
    };

    const startEditTask = (task: any) => {
        setEditingTaskId(task.id);
        setEditTaskText(task.text);
        setEditTaskDeadline(task.deadline || "");
    };

    const saveEditTask = () => {
        if (!editTaskText.trim()) return;
        const updatedTasks = (localProject.tasks || []).map((t: any) =>
            t.id === editingTaskId ? { ...t, text: editTaskText, deadline: editTaskDeadline } : t
        );
        handleUpdate({ tasks: updatedTasks });
        setEditingTaskId(null);
    };

    const saveEcosystem = () => {
        handleUpdate({ ecosystemLink: ecosystemInput });
        setIsEditingEcosystem(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-md transition-opacity duration-300">

            <div
                className="relative w-full max-w-3xl max-h-[90vh] bg-[#0a0a0c] border border-white/10 rounded-[32px] overflow-hidden flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.8)]"
                onClick={(e) => e.stopPropagation()}
            >

                <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all z-10">
                    <X className="w-4 h-4" />
                </button>

                {/* ШАПКА */}
                <div className="flex-shrink-0 px-8 pt-8 pb-6 border-b border-white/5">
                    <div className="flex items-start gap-6">
                        <div
                            className="w-20 h-20 rounded-[20px] flex items-center justify-center flex-shrink-0 overflow-hidden bg-white/5 border border-white/10"
                            style={!localProject.logo ? { backgroundColor: `hsl(${localProject.logoColor || '0 0% 15%'})` } : {}}
                        >
                            {localProject.logo ? (
                                <img src={localProject.logo} alt={localProject.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-white/80 text-2xl font-bold uppercase tracking-widest">{localProject.logoLetter || "??"}</span>
                            )}
                        </div>

                        <div className="flex flex-col justify-center pt-1 w-full">
                            <h2 className="text-3xl font-bold text-white tracking-tight mb-3">
                                {localProject.name}
                            </h2>

                            <div className="flex items-center gap-5">
                                {localProject.twitter && (
                                    <a href={localProject.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors text-xs font-medium uppercase tracking-wider">
                                        <Twitter className="w-3.5 h-3.5" /> Twitter
                                    </a>
                                )}
                                {localProject.website && (
                                    <a href={localProject.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors text-xs font-medium uppercase tracking-wider">
                                        <ExternalLink className="w-3.5 h-3.5" /> Website
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 mt-8 pt-6 border-t border-white/5">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Tier</span>
                            <select
                                value={localProject.tier || "S1"} onChange={(e) => handleUpdate({ tier: e.target.value })}
                                className="bg-transparent text-white text-sm font-semibold outline-none cursor-pointer appearance-none"
                            >
                                <option value="S+" className="bg-[#0a0a0c]">S+</option>
                                <option value="S1" className="bg-[#0a0a0c]">S1</option>
                                <option value="S2" className="bg-[#0a0a0c]">S2</option>
                                <option value="S3" className="bg-[#0a0a0c]">S3</option>
                                <option value="S4" className="bg-[#0a0a0c]">S4</option>
                            </select>
                        </div>
                        <div className="w-[1px] h-8 bg-white/5"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Costs</span>
                            <input type="text" placeholder="$0.00" value={localProject.costs || ""} onChange={(e) => handleUpdate({ costs: e.target.value })} className="bg-transparent text-white text-sm font-semibold outline-none placeholder:text-white/20 w-24" />
                        </div>
                        <div className="w-[1px] h-8 bg-white/5"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">PNL</span>
                            <input type="text" placeholder="+/- $0.00" value={localProject.pnl || ""} onChange={(e) => handleUpdate({ pnl: e.target.value })} className="bg-transparent text-[#32D74B] text-sm font-semibold outline-none placeholder:text-white/20 w-24" />
                        </div>
                    </div>
                </div>

                {/* СКРОЛЛИРУЕМАЯ ЧАСТЬ */}
                <div className="flex-grow overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar">

                    {/* КНОПКА ECOSYSTEM */}
                    <div>
                        {!localProject.ecosystemLink && !isEditingEcosystem ? (
                            <button onClick={() => setIsEditingEcosystem(true)} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-white/50 hover:text-white transition-all text-sm font-medium">
                                <Plus className="w-4 h-4" /> Add Ecosystem Link
                            </button>
                        ) : isEditingEcosystem ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text" placeholder="https://..." value={ecosystemInput} onChange={(e) => setEcosystemInput(e.target.value)} autoFocus
                                    className="flex-grow bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-white/30 transition-colors"
                                />
                                <button onClick={saveEcosystem} className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-sm font-medium transition-colors">Save</button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <a href={localProject.ecosystemLink} target="_blank" rel="noreferrer" className="flex-grow flex items-center justify-between px-5 py-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                                        <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">Ecosystem</span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white/70 transition-colors" />
                                </a>
                                <button onClick={() => setIsEditingEcosystem(true)} className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-white/30 hover:text-white transition-all">
                                    <Pencil className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-[24px] overflow-hidden flex flex-col">

                        {/* 1. ALL LINKS */}
                        <div className="border-b border-white/5 last:border-0 flex flex-col">
                            <button onClick={() => toggleSection('links')} className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors focus:outline-none">
                                <div className="flex items-center gap-3">
                                    <LinkIcon className="w-4 h-4 text-white/50" />
                                    <span className="text-sm font-semibold text-white/90">All Links</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-300 ${openSections.links ? "rotate-180" : ""}`} />
                            </button>

                            <div className={`grid transition-all duration-300 ease-in-out ${openSections.links ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                                <div className="overflow-hidden">
                                    <div className="px-5 pb-5 pt-1">
                                        <div className="space-y-3 mb-5">
                                            {(localProject.allLinks || []).map((link: any) => {
                                                const { icon, title } = getParsedLinkInfo(link);
                                                return (
                                                    <div key={link.id} className="group flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-[20px] p-3 pr-4 transition-all">
                                                        <a href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 flex-grow min-w-0">
                                                            <div className="w-12 h-12 rounded-[14px] bg-white/[0.04] flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.08] transition-colors border border-white/5">
                                                                {icon}
                                                            </div>
                                                            <div className="flex flex-col min-w-0 justify-center">
                                                                <span className="text-[15px] font-semibold text-white/90 truncate mb-0.5">{title}</span>
                                                                <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors truncate font-medium">{link.url}</span>
                                                            </div>
                                                        </a>
                                                        <button onClick={() => handleRemoveLink(link.id)} className="opacity-0 group-hover:opacity-100 p-2.5 text-white/30 hover:text-[#FF453A] transition-all flex-shrink-0 bg-white/5 rounded-full hover:bg-white/10 ml-2">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="flex items-center gap-3 bg-[#0a0a0c] border border-white/10 rounded-[16px] p-1.5 focus-within:border-white/30 transition-colors shadow-inner">
                                            <input
                                                type="text" placeholder="Name (optional)" value={newLinkTitle} onChange={(e) => setNewLinkTitle(e.target.value)}
                                                className="w-1/4 bg-transparent text-sm text-white placeholder:text-white/30 outline-none px-3 py-2 font-medium"
                                            />
                                            <div className="w-[1px] h-5 bg-white/10"></div>
                                            <input
                                                type="text" placeholder="Paste link (https://...)" value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)}
                                                className="flex-grow bg-transparent text-sm text-white placeholder:text-white/30 outline-none px-3 py-2 font-medium"
                                            />
                                            <button onClick={handleAddLink} className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-[12px] font-semibold text-sm transition-colors shadow-sm">
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. TASKS */}
                        <div className="border-b border-white/5 last:border-0 flex flex-col">
                            <button onClick={() => toggleSection('tasks')} className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors focus:outline-none">
                                <div className="flex items-center gap-3">
                                    <CheckSquare className="w-4 h-4 text-white/50" />
                                    <span className="text-sm font-semibold text-white/90">Tasks</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-300 ${openSections.tasks ? "rotate-180" : ""}`} />
                            </button>

                            <div className={`grid transition-all duration-300 ease-in-out ${openSections.tasks ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                                <div className="overflow-hidden">
                                    <div className="px-5 pb-5 pt-1">

                                        {/* Список Тасок */}
                                        <div className="space-y-3 mb-5">
                                            {(localProject.tasks || []).map((task: any) => (
                                                <div key={task.id} className="group flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-[20px] p-3 pr-4 transition-all min-h-[64px]">

                                                    {/* Редактирование */}
                                                    {editingTaskId === task.id ? (
                                                        <div className="flex items-center gap-3 w-full bg-[#0a0a0c] border border-white/10 rounded-[16px] p-1.5 shadow-inner">
                                                            <input
                                                                type="text" value={editTaskText} onChange={e => setEditTaskText(e.target.value)}
                                                                className="flex-grow bg-transparent text-sm text-white px-3 py-2 outline-none font-medium"
                                                                autoFocus
                                                            />
                                                            <div className="w-[1px] h-5 bg-white/10"></div>
                                                            <input
                                                                type="date" value={editTaskDeadline} onChange={e => setEditTaskDeadline(e.target.value)}
                                                                style={{ colorScheme: 'dark' }}
                                                                className="bg-transparent text-xs text-white/50 hover:text-white focus:text-white outline-none px-2 uppercase tracking-widest font-medium cursor-pointer transition-colors"
                                                            />
                                                            <button onClick={saveEditTask} className="bg-white/10 hover:bg-white/20 text-[#32D74B] px-4 py-2 rounded-[12px] font-semibold text-sm transition-colors shadow-sm ml-1">
                                                                Save
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        /* Просмотр */
                                                        <>
                                                            <div className="flex items-center gap-4 flex-grow min-w-0">
                                                                <button
                                                                    onClick={() => handleToggleTask(task.id)}
                                                                    className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-[6px] border border-white/20 text-transparent hover:border-white/50 transition-colors data-[done=true]:bg-[#32D74B] data-[done=true]:border-[#32D74B] data-[done=true]:text-white ml-1"
                                                                    data-done={task.done}
                                                                >
                                                                    {task.done && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                                                                </button>

                                                                <div className="flex flex-col min-w-0 flex-grow justify-center">
                                                                    <span className={`text-[15px] font-medium truncate transition-colors ${task.done ? "text-white/30 line-through" : "text-white/90"}`}>
                                                                        {task.text}
                                                                    </span>
                                                                </div>

                                                                {task.deadline && (
                                                                    <div className={`flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider flex-shrink-0 px-2.5 py-1.5 rounded-[8px] border transition-colors ${task.done ? "text-white/20 border-white/5 bg-transparent" : "text-white/50 border-white/10 bg-white/5"}`}>
                                                                        <Calendar className="w-3 h-3" /> {task.deadline}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="opacity-0 group-hover:opacity-100 flex items-center transition-all flex-shrink-0 ml-3">
                                                                <button onClick={() => startEditTask(task)} className="p-2.5 text-white/30 hover:text-white transition-all bg-white/5 rounded-full hover:bg-white/10 mr-1">
                                                                    <Pencil className="w-4 h-4" />
                                                                </button>
                                                                <button onClick={() => handleDeleteTask(task.id)} className="p-2.5 text-white/30 hover:text-[#FF453A] transition-all bg-white/5 rounded-full hover:bg-white/10">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Добавление */}
                                        <div className="flex items-center gap-3 bg-[#0a0a0c] border border-white/10 rounded-[16px] p-1.5 focus-within:border-white/30 transition-colors shadow-inner">
                                            <input
                                                type="text" placeholder="New task..." value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)}
                                                className="flex-grow bg-transparent text-sm text-white placeholder:text-white/30 outline-none px-3 py-2 font-medium"
                                            />
                                            <div className="w-[1px] h-5 bg-white/10"></div>
                                            <input
                                                type="date" value={newTaskDeadline} onChange={(e) => setNewTaskDeadline(e.target.value)}
                                                style={{ colorScheme: 'dark' }}
                                                className="bg-transparent text-xs text-white/50 hover:text-white focus:text-white outline-none px-2 uppercase tracking-widest font-medium cursor-pointer transition-colors"
                                            />
                                            <button onClick={handleAddTask} className="bg-white/10 hover:bg-white/20 text-[#32D74B] px-5 py-2.5 rounded-[12px] font-semibold text-sm transition-colors shadow-sm ml-1">
                                                Save Task
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. NOTES */}
                        <div className="last:border-0 flex flex-col">
                            <button onClick={() => toggleSection('notes')} className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors focus:outline-none">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-4 h-4 text-white/50" />
                                    <span className="text-sm font-semibold text-white/90">Notes</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-300 ${openSections.notes ? "rotate-180" : ""}`} />
                            </button>

                            <div className={`grid transition-all duration-300 ease-in-out ${openSections.notes ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                                <div className="overflow-hidden">
                                    <div className="px-5 pb-5 pt-1">
                                        <textarea
                                            className="w-full bg-transparent text-sm text-white/80 placeholder:text-white/20 outline-none min-h-[120px] resize-none leading-relaxed"
                                            placeholder="Write down your thoughts..."
                                            value={localProject.notes || ""}
                                            onChange={(e) => handleUpdate({ notes: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(255, 255, 255, 0.1); }
      `}</style>
        </div>
    );
};

export default ProjectModal;