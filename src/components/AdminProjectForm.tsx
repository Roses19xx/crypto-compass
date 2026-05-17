import { useState } from 'react';
import { supabase } from '../supabase';
import { Plus, Trash2, X, Link as LinkIcon, Layers, CheckSquare, Globe, Twitter, MessageCircle, ChevronDown, Image as ImageIcon, Check } from 'lucide-react';

export const AdminProjectForm = ({ onClose, onSuccess }: any) => {
    const [name, setName] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [showLogoInput, setShowLogoInput] = useState(false);

    const [website, setWebsite] = useState('');
    const [twitter, setTwitter] = useState('');
    const [discord, setDiscord] = useState('');

    const [allLinks, setAllLinks] = useState([{ id: '1', title: '', url: '' }]);
    const [ecosystem, setEcosystem] = useState([{ id: '1', label: '', url: '', tag: '' }]);
    const [tasks, setTasks] = useState([{ id: '1', title: '', description: '' }]);

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        links: true,
        ecosystem: true,
        tasks: true,
    });

    const [loading, setLoading] = useState(false);

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("Project Name is required!");
            return;
        }

        setLoading(true);

        const finalLinks = allLinks.filter(l => l.title || l.url);

        let webUrl = website.trim();
        if (webUrl && !webUrl.startsWith('http')) webUrl = 'https://' + webUrl;

        let twitUrl = twitter.trim();
        if (twitUrl && !twitUrl.startsWith('http')) twitUrl = 'https://' + twitUrl;

        let discUrl = discord.trim();
        if (discUrl && !discUrl.startsWith('http')) discUrl = 'https://' + discUrl;

        let finalLogo = logoUrl.trim();

        const { error } = await supabase.from('projects').insert([{
            name: name.trim(),
            logo: finalLogo,
            website: webUrl,
            twitter: twitUrl,
            discord: discUrl, // Отправляем в новую колонку Supabase
            allLinks: finalLinks,
            ecosystem: ecosystem.filter(e => e.label || e.url),
            tasks: tasks.filter(t => t.title),
            logoColor: '0 0% 15%',
            logoLetter: name.charAt(0).toUpperCase()
        }]);

        setLoading(false);
        if (error) alert('Error: ' + error.message);
        else onSuccess();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md transition-opacity duration-300">
            <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0a0a0c] border border-white/10 rounded-[32px] overflow-hidden flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.8)]">

                <button type="button" onClick={onClose} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all z-30">
                    <X className="w-4 h-4" />
                </button>

                {/* HEADER */}
                <div className="flex-shrink-0 px-8 pt-8 pb-6 border-b border-white/5 flex items-center gap-6 relative z-20">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowLogoInput(!showLogoInput)}
                            className="w-20 h-20 rounded-[20px] bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg group relative"
                        >
                            {logoUrl ? (
                                <img src={logoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="w-8 h-8 text-white/20 group-hover:text-white/40 transition-colors" />
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">{logoUrl ? 'Change' : 'Add Logo'}</span>
                            </div>
                        </button>

                        {showLogoInput && (
                            <div className="absolute top-24 left-0 w-64 bg-[#141416] border border-white/10 rounded-[16px] p-2 shadow-2xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-2">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Paste image URL here..."
                                    value={logoUrl}
                                    onChange={e => setLogoUrl(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), setShowLogoInput(false))}
                                    className="flex-grow bg-transparent text-xs text-white placeholder:text-white/30 outline-none px-2 py-1"
                                />
                                <button type="button" onClick={() => setShowLogoInput(false)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-[10px] text-white transition-colors">
                                    <Check className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col flex-grow min-w-0 pr-8">
                        <input
                            required
                            type="text"
                            placeholder="Project Name..."
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full bg-transparent text-3xl sm:text-4xl font-bold text-white placeholder:text-white/20 outline-none tracking-tight truncate"
                        />
                    </div>
                </div>

                {/* SCROLLABLE FORM */}
                <form id="add-project-form" onSubmit={handleSubmit} className="overflow-y-auto px-8 pt-6 pb-8 space-y-5 custom-scrollbar">

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5 ml-1">Website URL</span>
                            <div className="relative flex items-center">
                                <Globe className="absolute left-3.5 w-4 h-4 text-white/30" />
                                <input placeholder="https://..." value={website} onChange={e => setWebsite(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-[14px] pl-10 pr-3 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors" />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5 ml-1">Twitter (X)</span>
                            <div className="relative flex items-center">
                                <Twitter className="absolute left-3.5 w-4 h-4 text-white/30" />
                                <input placeholder="https://x.com/..." value={twitter} onChange={e => setTwitter(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-[14px] pl-10 pr-3 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors" />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5 ml-1">Discord</span>
                            <div className="relative flex items-center">
                                <MessageCircle className="absolute left-3.5 w-4 h-4 text-white/30" />
                                <input placeholder="https://discord.gg/..." value={discord} onChange={e => setDiscord(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-[14px] pl-10 pr-3 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-[20px] overflow-hidden flex flex-col">

                        {/* ALL LINKS */}
                        <div className="border-b border-white/5 last:border-0 flex flex-col">
                            <button type="button" onClick={() => toggleSection('links')} className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors focus:outline-none">
                                <div className="flex items-center gap-3">
                                    <LinkIcon className="w-4 h-4 text-white/50" />
                                    <span className="text-sm font-semibold text-white/90">All Links</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-300 ${openSections.links ? "rotate-180" : ""}`} />
                            </button>
                            <div className={`grid transition-all duration-300 ease-in-out ${openSections.links ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                                <div className="overflow-hidden px-5 pb-4 space-y-2">
                                    {allLinks.map((link, i) => (
                                        <div key={link.id} className="flex items-center gap-2 bg-[#0a0a0c] border border-white/5 rounded-[12px] p-1 shadow-inner focus-within:border-white/20 transition-colors">
                                            <input placeholder="Name (e.g. Telegram)" className="w-1/3 bg-transparent text-xs text-white placeholder:text-white/30 outline-none px-3 py-2 font-medium" value={link.title} onChange={e => {
                                                const val = [...allLinks]; val[i].title = e.target.value; setAllLinks(val);
                                            }} />
                                            <div className="w-[1px] h-4 bg-white/10"></div>
                                            <input placeholder="URL" className="flex-grow bg-transparent text-xs text-white placeholder:text-white/30 outline-none px-3 py-2 font-medium" value={link.url} onChange={e => {
                                                const val = [...allLinks]; val[i].url = e.target.value; setAllLinks(val);
                                            }} />
                                            <button type="button" onClick={() => setAllLinks(allLinks.filter((_, idx) => idx !== i))} className="p-1.5 text-white/30 hover:text-[#FF453A] transition-all rounded-[8px] hover:bg-white/5 mr-1"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => setAllLinks([...allLinks, { id: Date.now().toString(), title: '', url: '' }])} className="flex items-center gap-1.5 text-xs font-semibold text-white/30 hover:text-white transition-colors px-2 pt-1">
                                        <Plus className="w-3 h-3" /> Add Link
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ECOSYSTEM */}
                        <div className="border-b border-white/5 last:border-0 flex flex-col">
                            <button type="button" onClick={() => toggleSection('ecosystem')} className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors focus:outline-none">
                                <div className="flex items-center gap-3">
                                    <Layers className="w-4 h-4 text-white/50" />
                                    <span className="text-sm font-semibold text-white/90">Ecosystem</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-300 ${openSections.ecosystem ? "rotate-180" : ""}`} />
                            </button>
                            <div className={`grid transition-all duration-300 ease-in-out ${openSections.ecosystem ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                                <div className="overflow-hidden px-5 pb-4 space-y-2">
                                    {ecosystem.map((item, i) => (
                                        <div key={item.id} className="flex items-center gap-2 bg-[#0a0a0c] border border-white/5 rounded-[12px] p-1 shadow-inner focus-within:border-white/20 transition-colors">
                                            <input placeholder="Service" className="w-[25%] bg-transparent text-xs text-white placeholder:text-white/30 outline-none px-3 py-2 font-medium" value={item.label} onChange={e => {
                                                const val = [...ecosystem]; val[i].label = e.target.value; setEcosystem(val);
                                            }} />
                                            <div className="w-[1px] h-4 bg-white/10"></div>
                                            <input placeholder="Tag (e.g. DEX)" className="w-[20%] bg-transparent text-xs text-white placeholder:text-white/30 outline-none px-3 py-2 font-medium" value={item.tag} onChange={e => {
                                                const val = [...ecosystem]; val[i].tag = e.target.value; setEcosystem(val);
                                            }} />
                                            <div className="w-[1px] h-4 bg-white/10"></div>
                                            <input placeholder="URL" className="flex-grow bg-transparent text-xs text-white placeholder:text-white/30 outline-none px-3 py-2 font-medium" value={item.url} onChange={e => {
                                                const val = [...ecosystem]; val[i].url = e.target.value; setEcosystem(val);
                                            }} />
                                            <button type="button" onClick={() => setEcosystem(ecosystem.filter((_, idx) => idx !== i))} className="p-1.5 text-white/30 hover:text-[#FF453A] transition-all rounded-[8px] hover:bg-white/5 mr-1"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => setEcosystem([...ecosystem, { id: Date.now().toString(), label: '', url: '', tag: '' }])} className="flex items-center gap-1.5 text-xs font-semibold text-white/30 hover:text-white transition-colors px-2 pt-1">
                                        <Plus className="w-3 h-3" /> Add Ecosystem Item
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* TASKS */}
                        <div className="border-b border-white/5 last:border-0 flex flex-col">
                            <button type="button" onClick={() => toggleSection('tasks')} className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors focus:outline-none">
                                <div className="flex items-center gap-3">
                                    <CheckSquare className="w-4 h-4 text-white/50" />
                                    <span className="text-sm font-semibold text-white/90">Tasks</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-300 ${openSections.tasks ? "rotate-180" : ""}`} />
                            </button>
                            <div className={`grid transition-all duration-300 ease-in-out ${openSections.tasks ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                                <div className="overflow-hidden px-5 pb-4 space-y-3">
                                    {tasks.map((task, i) => (
                                        <div key={task.id} className="flex flex-col gap-1.5 bg-[#0a0a0c] border border-white/5 rounded-[16px] p-2 shadow-inner focus-within:border-white/20 transition-colors relative">
                                            <input placeholder="Task Title..." className="w-full bg-transparent text-sm text-white placeholder:text-white/30 outline-none px-2 py-1 font-semibold border-b border-white/5" value={task.title} onChange={e => {
                                                const val = [...tasks]; val[i].title = e.target.value; setTasks(val);
                                            }} />
                                            <textarea placeholder="Task description & steps..." className="w-full bg-transparent text-xs text-white/70 placeholder:text-white/20 outline-none px-2 py-1 resize-none h-16 custom-scrollbar" value={task.description} onChange={e => {
                                                const val = [...tasks]; val[i].description = e.target.value; setTasks(val);
                                            }} />
                                            <button type="button" onClick={() => setTasks(tasks.filter((_, idx) => idx !== i))} className="absolute top-1.5 right-1.5 p-1.5 text-white/30 hover:text-[#FF453A] transition-all bg-white/5 rounded-[8px] hover:bg-white/10"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => setTasks([...tasks, { id: Date.now().toString(), title: '', description: '' }])} className="flex items-center gap-1.5 text-xs font-semibold text-white/30 hover:text-white transition-colors px-2 pt-1">
                                        <Plus className="w-3 h-3" /> Add Task
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="pt-2">
                        <button type="submit" disabled={loading} className="w-full bg-white/10 hover:bg-white/20 text-white py-3.5 rounded-[16px] font-bold transition-colors shadow-sm text-sm">
                            {loading ? 'Publishing...' : 'Publish Project'}
                        </button>
                    </div>
                </form>
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