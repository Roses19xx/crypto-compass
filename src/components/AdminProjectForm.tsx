import { useState } from "react";
import { X, Twitter, Link as LinkIcon, Globe, Trash2, ChevronDown, Layers } from "lucide-react";
import { supabase } from "../supabase";

const CATEGORIES = ["Prediction Markets", "Perp", "Chains", "AI", "NFT", "DePIN", "SocialFi", "GameFi"];

interface AdminProjectFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

const AdminProjectForm = ({ onClose, onSuccess }: AdminProjectFormProps) => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [logo, setLogo] = useState("");
    const [showLogoInput, setShowLogoInput] = useState(false); // Стейт для красивого инпута
    const [website, setWebsite] = useState("");
    const [twitter, setTwitter] = useState("");
    const [discord, setDiscord] = useState("");
    const [allLinks, setAllLinks] = useState<any[]>([]);
    const [ecosystem, setEcosystem] = useState<any[]>([]);
    const [isPublishing, setIsPublishing] = useState(false);

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        links: true,
        ecosystem: true,
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handlePublish = async () => {
        if (!name.trim()) {
            alert("Project Name is required!");
            return;
        }

        setIsPublishing(true);

        const newProject = {
            name: name.trim(),
            category: category || null,
            logo: logo.trim() || null,
            website: website.trim(),
            twitter: twitter.trim(),
            discord: discord.trim(),
            allLinks: allLinks.filter(l => l.title || l.url),
            ecosystem: ecosystem.filter(e => e.label || e.url),
        };

        const { error } = await supabase.from('projects').insert([newProject]);

        setIsPublishing(false);

        if (error) {
            alert("Error saving: " + error.message);
        } else {
            onSuccess();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-md transition-opacity">
            <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0a0a0c] border border-white/10 rounded-[32px] overflow-hidden flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.8)]" onClick={(e) => e.stopPropagation()}>

                <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all z-10">
                    <X className="w-4 h-4" />
                </button>

                <div className="flex-shrink-0 px-8 pt-8 pb-6 border-b border-white/5">
                    <div className="flex items-start gap-6">

                        {/* КЛИКАБЕЛЬНЫЙ КВАДРАТ И СТИЛИЗОВАННЫЙ ИНПУТ */}
                        <div className="relative flex-shrink-0">
                            <div
                                onClick={() => setShowLogoInput(!showLogoInput)}
                                className="w-20 h-20 rounded-[20px] flex items-center justify-center bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all overflow-hidden group shadow-lg"
                            >
                                {logo ? (
                                    <img src={logo} alt="Logo preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white/30 text-xs font-medium group-hover:text-white/60 transition-colors">Add Logo</span>
                                )}
                            </div>

                            {/* Красивый выпадающий инпут вместо колхозного prompt */}
                            {showLogoInput && (
                                <div className="absolute top-full left-0 mt-3 z-50 w-64 bg-[#141416] border border-white/10 rounded-2xl p-2 shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
                                    <div className="flex items-center gap-2 bg-[#0a0a0c] border border-white/5 rounded-xl px-3 py-2.5 focus-within:border-white/20 transition-colors">
                                        <LinkIcon className="w-4 h-4 text-white/40 flex-shrink-0" />
                                        <input
                                            type="text"
                                            placeholder="Paste Logo URL..."
                                            value={logo}
                                            onChange={e => setLogo(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') setShowLogoInput(false); }}
                                            className="bg-transparent text-xs text-white outline-none w-full placeholder-white/30"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col justify-center pt-1 w-full">
                            <div className="flex gap-3 w-full max-w-md mb-6">
                                <input
                                    type="text"
                                    placeholder="Project Name..."
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="flex-grow bg-transparent text-2xl font-bold text-white outline-none placeholder-white/20"
                                />
                                <select
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="w-1/3 bg-[#0a0a0c] border border-white/10 rounded-xl px-2 py-1.5 text-xs font-semibold text-white/70 outline-none focus:border-white/20 cursor-pointer"
                                >
                                    <option value="">No Tag</option>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-3 gap-4 w-full">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Website URL</label>
                                    <div className="flex items-center gap-2 bg-transparent border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-white/20 transition-colors">
                                        <Globe className="w-4 h-4 text-white/40 flex-shrink-0" />
                                        <input type="text" placeholder="https://..." value={website} onChange={e => setWebsite(e.target.value)} className="bg-transparent text-xs text-white outline-none w-full placeholder-white/20" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Twitter (X)</label>
                                    <div className="flex items-center gap-2 bg-transparent border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-white/20 transition-colors">
                                        <Twitter className="w-4 h-4 text-white/40 flex-shrink-0" />
                                        <input type="text" placeholder="https://x.com/..." value={twitter} onChange={e => setTwitter(e.target.value)} className="bg-transparent text-xs text-white outline-none w-full placeholder-white/20" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Discord</label>
                                    <div className="flex items-center gap-2 bg-transparent border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-white/20 transition-colors">
                                        <svg className="w-4 h-4 text-white/40 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" /></svg>
                                        <input type="text" placeholder="https://discord.gg/..." value={discord} onChange={e => setDiscord(e.target.value)} className="bg-transparent text-xs text-white outline-none w-full placeholder-white/20" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="overflow-y-auto px-8 pt-6 pb-8 space-y-5 custom-scrollbar">
                    <div className="bg-white/[0.02] border border-white/5 rounded-[24px] overflow-hidden flex flex-col">
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
                                    {allLinks.map((link, i) => (
                                        <div key={link.id} className="flex items-center gap-2 bg-[#0a0a0c] border border-white/5 rounded-[12px] p-1">
                                            <input placeholder="Link Name" className="w-1/3 bg-transparent text-xs text-white outline-none px-2 py-1 placeholder-white/30" value={link.title} onChange={e => {
                                                const val = [...allLinks]; val[i].title = e.target.value; setAllLinks(val);
                                            }} />
                                            <input placeholder="URL" className="flex-grow bg-transparent text-xs text-white outline-none px-2 py-1 placeholder-white/30" value={link.url} onChange={e => {
                                                const val = [...allLinks]; val[i].url = e.target.value; setAllLinks(val);
                                            }} />
                                            <button type="button" onClick={() => setAllLinks(allLinks.filter(l => l.id !== link.id))} className="text-red-500/50 hover:text-red-500 p-1 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => setAllLinks([...allLinks, { id: Date.now().toString(), title: '', url: '' }])} className="text-xs text-white/40 hover:text-white flex items-center gap-1 pt-1 font-semibold transition-colors">+ Add Link</button>
                                </div>
                            </div>
                        </div>

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
                                    {ecosystem.map((eco, i) => (
                                        <div key={eco.id} className="flex items-center gap-2 bg-[#0a0a0c] border border-white/5 rounded-[12px] p-1">
                                            <input placeholder="Service" className="w-1/4 bg-transparent text-xs text-white outline-none px-2 py-1 placeholder-white/30" value={eco.label} onChange={e => {
                                                const val = [...ecosystem]; val[i].label = e.target.value; setEcosystem(val);
                                            }} />
                                            <input placeholder="Tag" className="w-1/5 bg-transparent text-xs text-white outline-none px-2 py-1 placeholder-white/30" value={eco.tag} onChange={e => {
                                                const val = [...ecosystem]; val[i].tag = e.target.value; setEcosystem(val);
                                            }} />
                                            <input placeholder="URL" className="flex-grow bg-transparent text-xs text-white outline-none px-2 py-1 placeholder-white/30" value={eco.url} onChange={e => {
                                                const val = [...ecosystem]; val[i].url = e.target.value; setEcosystem(val);
                                            }} />
                                            <button type="button" onClick={() => setEcosystem(ecosystem.filter(e => e.id !== eco.id))} className="text-red-500/50 hover:text-red-500 p-1 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => setEcosystem([...ecosystem, { id: Date.now().toString(), label: '', tag: '', url: '' }])} className="text-xs text-white/40 hover:text-white flex items-center gap-1 pt-1 font-semibold transition-colors">+ Add Ecosystem Item</button>
                                </div>
                            </div>
                        </div>

                    </div>

                    <button onClick={handlePublish} disabled={isPublishing} className="w-full bg-white/10 hover:bg-white/20 text-white py-3.5 rounded-xl font-bold text-sm transition-all border border-white/10 disabled:opacity-50 mt-4">
                        {isPublishing ? "Publishing..." : "Publish Project"}
                    </button>
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

export default AdminProjectForm;