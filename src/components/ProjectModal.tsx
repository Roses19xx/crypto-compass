import { useState, useEffect } from "react";
import { X, Twitter, Link as LinkIcon, CheckSquare, Globe, Trash2, ChevronDown, Layers, Trash, Edit3, Save } from "lucide-react";
import { supabase } from "../supabase";

interface ProjectModalProps {
    project: any;
    onClose: () => void;
    onUpdate?: (project: any) => void;
}

const ProjectModal = ({ project, onClose, onUpdate }: ProjectModalProps) => {
    const [localProject, setLocalProject] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Состояния для редактирования
    const [editName, setEditName] = useState("");
    const [editWebsite, setEditWebsite] = useState("");
    const [editTwitter, setEditTwitter] = useState("");
    const [editDiscord, setEditDiscord] = useState("");
    const [editAllLinks, setEditAllLinks] = useState<any[]>([]);
    const [editEcosystem, setEditEcosystem] = useState<any[]>([]);
    const [editTasks, setEditTasks] = useState<any[]>([]);

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        links: true,
        ecosystem: true,
        tasks: true,
    });

    const [openTasks, setOpenTasks] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (project) {
            setLocalProject(JSON.parse(JSON.stringify(project)));
            supabase.auth.getSession().then(({ data: { session } }) => {
                setIsAdmin(!!session);
            });
        }
    }, [project]);

    const startEditing = () => {
        setEditName(localProject.name || "");
        setEditWebsite(localProject.website || "");
        setEditTwitter(localProject.twitter || "");
        setEditDiscord(localProject.discord || "");
        setEditAllLinks(localProject.allLinks || []);
        setEditEcosystem(localProject.ecosystem || []);
        setEditTasks(localProject.tasks || []);
        setIsEditing(true);
    };

    const handleSaveChanges = async () => {
        if (!editName.trim()) {
            alert("Project Name is required!");
            return;
        }

        const updatedData = {
            name: editName.trim(),
            website: editWebsite.trim(),
            twitter: editTwitter.trim(),
            discord: editDiscord.trim(),
            allLinks: editAllLinks.filter(l => l.title || l.url),
            ecosystem: editEcosystem.filter(e => e.label || e.url),
            tasks: editTasks.filter(t => t.title)
        };

        const { error } = await supabase.from('projects').update(updatedData).eq('id', project.id);

        if (error) {
            alert("Error saving: " + error.message);
        } else {
            setLocalProject({ ...localProject, ...updatedData });
            setIsEditing(false);
            if (onUpdate) onUpdate({ ...localProject, ...updatedData });
        }
    };

    const handleDeleteProject = async () => {
        if (window.confirm("Are you sure you want to delete this project permanently?")) {
            await supabase.from('projects').delete().eq('id', project.id);
            window.location.reload();
        }
    };

    if (!project || !localProject) return null;

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const toggleTask = (taskId: string) => {
        setOpenTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
    };

    // ФУНКЦИЯ ДЛЯ ИКОНОК В ALL LINKS (Теперь по умолчанию Глобус)
    const getParsedLinkInfo = (link: any) => {
        let icon = <Globe className="w-5 h-5 text-white/50" />; // Иконка по умолчанию - Глобус
        let displayTitle = link.title;

        try {
            const urlObj = new URL(link.url);
            const hostname = urlObj.hostname.toLowerCase();

            if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
                icon = <Twitter className="w-5 h-5 text-[#1DA1F2]" fill="currentColor" />;
            } else if (hostname.includes('discord.gg') || hostname.includes('discord.com')) {
                icon = <svg className="w-5 h-5 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" /></svg>;
            } else if (hostname.includes('t.me') || hostname.includes('telegram.org')) {
                icon = <svg className="w-5 h-5 text-[#229ED9]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12s12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z" /></svg>;
            } else if (hostname.includes('github.com')) {
                icon = <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z" /></svg>;
            }
        } catch (e) { }

        return { icon, title: displayTitle || link.url };
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-md transition-opacity duration-300">
            <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0a0a0c] border border-white/10 rounded-[32px] overflow-hidden flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.8)]" onClick={(e) => e.stopPropagation()}>

                <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all z-10">
                    <X className="w-4 h-4" />
                </button>

                {/* ШАПКА КАРТОЧКИ */}
                <div className="flex-shrink-0 px-8 pt-8 pb-6 border-b border-white/5">
                    <div className="flex items-start gap-6">
                        <div className="w-20 h-20 rounded-[20px] flex items-center justify-center flex-shrink-0 overflow-hidden bg-white/5 border border-white/10" style={{ backgroundColor: `hsl(${localProject.logoColor || '0 0% 15%'})` }}>
                            {localProject.logo ? (
                                <img src={localProject.logo} alt={localProject.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-white/80 text-2xl font-bold uppercase tracking-widest">{localProject.logoLetter || localProject.name.charAt(0)}</span>
                            )}
                        </div>

                        <div className="flex flex-col justify-center pt-1 w-full">
                            {isEditing ? (
                                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-2xl font-bold text-white outline-none mb-3 focus:border-white/20 w-2/3" />
                            ) : (
                                <h2 className="text-3xl font-bold text-white tracking-tight mb-3">{localProject.name}</h2>
                            )}

                            {isEditing ? (
                                <div className="grid grid-cols-2 gap-2 max-w-md">
                                    <input type="text" placeholder="Website URL" value={editWebsite} onChange={e => setEditWebsite(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-white outline-none" />
                                    <input type="text" placeholder="Twitter URL" value={editTwitter} onChange={e => setEditTwitter(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-white outline-none" />
                                    <input type="text" placeholder="Discord URL" value={editDiscord} onChange={e => setEditDiscord(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-white outline-none col-span-2" />
                                </div>
                            ) : (
                                <div className="flex items-center gap-5">
                                    {/* ПОРЯДОК: САЙТ -> ТВИТТЕР -> ДИСКОРД */}
                                    {localProject.website && (
                                        <a href={localProject.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors text-xs font-medium uppercase tracking-wider">
                                            <Globe className="w-3.5 h-3.5" /> Website
                                        </a>
                                    )}
                                    {localProject.twitter && (
                                        <a href={localProject.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors text-xs font-medium uppercase tracking-wider">
                                            <Twitter className="w-3.5 h-3.5" /> Twitter
                                        </a>
                                    )}
                                    {localProject.discord && (
                                        <a href={localProject.discord} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors text-xs font-medium uppercase tracking-wider">
                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" /></svg> Discord
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* СКРОЛЛИРУЕМЫЙ КОНТЕНТ */}
                <div className="overflow-y-auto px-8 pt-6 pb-8 space-y-5 custom-scrollbar">
                    <div className="bg-white/[0.02] border border-white/5 rounded-[24px] overflow-hidden flex flex-col">

                        {/* 1. ALL LINKS */}
                        <div className="border-b border-white/5 last:border-0 flex flex-col">
                            <button onClick={() => toggleSection('links')} className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors focus:outline-none">
                                <div className="flex items-center gap-3">
                                    <LinkIcon className="w-4 h-4 text-white/50" />
                                    <span className="text-sm font-semibold text-white/90">All Links</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-300 ${openSections.links ? "rotate-180" : ""}`} />
                            </button>

                            <div className={`grid transition-all duration-300 ease-in-out ${openSections.links ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                                <div className="overflow-hidden px-5 pb-4 space-y-2">
                                    {isEditing ? (
                                        <>
                                            {editAllLinks.map((link, i) => (
                                                <div key={link.id} className="flex items-center gap-2 bg-[#0a0a0c] border border-white/5 rounded-[12px] p-1">
                                                    <input placeholder="Link Name" className="w-1/3 bg-transparent text-xs text-white outline-none px-2 py-1" value={link.title} onChange={e => {
                                                        const val = [...editAllLinks]; val[i].title = e.target.value; setEditAllLinks(val);
                                                    }} />
                                                    <input placeholder="URL" className="flex-grow bg-transparent text-xs text-white outline-none px-2 py-1" value={link.url} onChange={e => {
                                                        const val = [...editAllLinks]; val[i].url = e.target.value; setEditAllLinks(val);
                                                    }} />
                                                    <button type="button" onClick={() => setEditAllLinks(editAllLinks.filter(l => l.id !== link.id))} className="text-red-500 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => setEditAllLinks([...editAllLinks, { id: Date.now().toString(), title: '', url: '' }])} className="text-xs text-white/40 hover:text-white flex items-center gap-1 pt-1 font-semibold">+ Add Link</button>
                                        </>
                                    ) : (
                                        (localProject.allLinks || []).map((link: any) => {
                                            const { icon, title } = getParsedLinkInfo(link);
                                            return (
                                                <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="group flex items-center gap-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-[20px] p-3 transition-all w-full">
                                                    <div className="w-10 h-10 rounded-[12px] bg-white/[0.04] flex items-center justify-center flex-shrink-0 border border-white/5">
                                                        {icon}
                                                    </div>
                                                    <span className="text-sm font-semibold text-white/90 truncate">{title}</span>
                                                </a>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 2. ECOSYSTEM */}
                        <div className="border-b border-white/5 last:border-0 flex flex-col">
                            <button onClick={() => toggleSection('ecosystem')} className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors focus:outline-none">
                                <div className="flex items-center gap-3">
                                    <Layers className="w-4 h-4 text-white/50" />
                                    <span className="text-sm font-semibold text-white/90">Ecosystem</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-300 ${openSections.ecosystem ? "rotate-180" : ""}`} />
                            </button>

                            <div className={`grid transition-all duration-300 ease-in-out ${openSections.ecosystem ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                                <div className="overflow-hidden px-5 pb-4 space-y-2">
                                    {isEditing ? (
                                        <>
                                            {editEcosystem.map((eco, i) => (
                                                <div key={eco.id} className="flex items-center gap-2 bg-[#0a0a0c] border border-white/5 rounded-[12px] p-1">
                                                    <input placeholder="Service" className="w-1/4 bg-transparent text-xs text-white outline-none px-2 py-1" value={eco.label} onChange={e => {
                                                        const val = [...editEcosystem]; val[i].label = e.target.value; setEditEcosystem(val);
                                                    }} />
                                                    <input placeholder="Tag" className="w-1/5 bg-transparent text-xs text-white outline-none px-2 py-1" value={eco.tag} onChange={e => {
                                                        const val = [...editEcosystem]; val[i].tag = e.target.value; setEditEcosystem(val);
                                                    }} />
                                                    <input placeholder="URL" className="flex-grow bg-transparent text-xs text-white outline-none px-2 py-1" value={eco.url} onChange={e => {
                                                        const val = [...editEcosystem]; val[i].url = e.target.value; setEditEcosystem(val);
                                                    }} />
                                                    <button type="button" onClick={() => setEditEcosystem(editEcosystem.filter(e => e.id !== eco.id))} className="text-red-500 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => setEditEcosystem([...editEcosystem, { id: Date.now().toString(), label: '', tag: '', url: '' }])} className="text-xs text-white/40 hover:text-white flex items-center gap-1 pt-1 font-semibold">+ Add Ecosystem Item</button>
                                        </>
                                    ) : (
                                        (localProject.ecosystem || []).map((eco: any) => (
                                            <a key={eco.id} href={eco.url} target="_blank" rel="noreferrer" className="flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-[20px] p-4 transition-all w-full">
                                                <span className="text-sm font-semibold text-white/90 truncate">{eco.label}</span>
                                                {eco.tag && <span className="px-3 py-1 bg-white/5 border border-white/10 text-white/50 text-[10px] uppercase font-bold rounded-lg tracking-wider flex-shrink-0">{eco.tag}</span>}
                                            </a>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 3. TASKS */}
                        <div className="border-b border-white/5 last:border-0 flex flex-col">
                            <button onClick={() => toggleSection('tasks')} className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors focus:outline-none">
                                <div className="flex items-center gap-3">
                                    <CheckSquare className="w-4 h-4 text-white/50" />
                                    <span className="text-sm font-semibold text-white/90">Tasks</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-300 ${openSections.tasks ? "rotate-180" : ""}`} />
                            </button>

                            <div className={`grid transition-all duration-300 ease-in-out ${openSections.tasks ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                                <div className="overflow-hidden px-5 pb-4 space-y-3">
                                    {isEditing ? (
                                        <>
                                            {editTasks.map((task, i) => (
                                                <div key={task.id} className="flex flex-col gap-1.5 bg-[#0a0a0c] border border-white/5 rounded-[16px] p-2 relative">
                                                    <input placeholder="Task Title..." className="bg-transparent text-xs text-white font-semibold border-b border-white/5 outline-none pb-1" value={task.title} onChange={e => {
                                                        const val = [...editTasks]; val[i].title = e.target.value; setEditTasks(val);
                                                    }} />
                                                    <textarea placeholder="Task description..." className="bg-transparent text-xs text-white/70 h-12 outline-none resize-none" value={task.description} onChange={e => {
                                                        const val = [...editTasks]; val[i].description = e.target.value; setEditTasks(val);
                                                    }} />
                                                    <button type="button" onClick={() => setEditTasks(editTasks.filter(t => t.id !== task.id))} className="absolute top-2 right-2 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => setEditTasks([...editTasks, { id: Date.now().toString(), title: '', description: '' }])} className="text-xs text-white/40 hover:text-white flex items-center gap-1 pt-1 font-semibold">+ Add Task</button>
                                        </>
                                    ) : (
                                        (localProject.tasks || []).map((task: any) => (
                                            <div key={task.id} className="bg-white/[0.03] border border-white/5 rounded-[20px] overflow-hidden transition-all">
                                                <button onClick={() => toggleTask(task.id)} className="w-full flex items-center justify-between p-4 text-left focus:outline-none">
                                                    <span className="text-sm font-medium text-white/90">{task.title}</span>
                                                    <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-300 ${openTasks[task.id] ? "rotate-180" : ""}`} />
                                                </button>
                                                <div className={`grid transition-all duration-300 ease-in-out ${openTasks[task.id] ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                                                    <div className="overflow-hidden px-4 pb-4">
                                                        <div className="p-4 bg-black/20 rounded-[14px] border border-white/5">
                                                            <p className="text-xs text-white/60 leading-relaxed whitespace-pre-wrap">{task.description || "No description provided."}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* КНОПКИ АДМИНА */}
                    {isAdmin && (
                        <div className="flex justify-between items-center pt-4">
                            {isEditing ? (
                                <div className="flex gap-2 w-full">
                                    <button onClick={handleSaveChanges} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-white/10">
                                        <Save size={14} /> Save Changes
                                    </button>
                                    <button onClick={() => setIsEditing(false)} className="bg-white/5 hover:bg-white/10 text-white/50 px-4 rounded-xl font-medium text-xs transition-all">
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="flex justify-between w-full items-center">
                                    <button onClick={startEditing} className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-5 py-2.5 rounded-[12px] font-bold text-xs transition-all flex items-center gap-1.5">
                                        <Edit3 size={14} /> Edit Project
                                    </button>
                                    <button onClick={handleDeleteProject} className="flex items-center gap-1.5 text-xs font-bold text-red-500/50 hover:text-red-500 bg-red-500/5 hover:bg-red-500/10 px-5 py-2.5 rounded-[12px] transition-all">
                                        <Trash className="w-4 h-4" /> Delete Project
                                    </button>
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