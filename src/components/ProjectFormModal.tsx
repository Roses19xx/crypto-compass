import { X, Save, ExternalLink, Link, ImagePlus, Pencil } from "lucide-react";
import { useState, useRef, useEffect } from "react";

// ВОТ ЗДЕСЬ ПРАВИЛЬНЫЙ ИНТЕРФЕЙС, КОТОРЫЙ ИСКАЛ TYPESCRIPT
interface ProjectFormModalProps {
    onClose: () => void;
    onSave: (project: any) => void;
    projectToEdit?: any;
}

const ProjectFormModal = ({ onClose, onSave, projectToEdit }: ProjectFormModalProps) => {
    const [name, setName] = useState(projectToEdit?.name || "");
    const [website, setWebsite] = useState(projectToEdit?.website || "");
    const [twitter, setTwitter] = useState(projectToEdit?.twitter || "");
    const [logoUrl, setLogoUrl] = useState(projectToEdit?.logo || "");

    const [isUrlInputOpen, setIsUrlInputOpen] = useState(false);
    const [tempUrl, setTempUrl] = useState("");
    const urlInputRef = useRef<HTMLInputElement>(null);

    const logoLetter = name.substring(0, 2).toUpperCase() || "PR";
    const randomHue = useRef(Math.floor(Math.random() * 360));
    const logoColor = projectToEdit?.logoColor || `${randomHue.current} 85% 60%`;

    useEffect(() => {
        if (isUrlInputOpen) {
            urlInputRef.current?.focus();
        }
    }, [isUrlInputOpen]);

    const handleApplyLogoUrl = () => {
        setLogoUrl(tempUrl);
        setIsUrlInputOpen(false);
    };

    const handleSave = () => {
        if (!name.trim()) {
            alert("Пожалуйста, введите название проекта!");
            return;
        }

        const newProject: any = {
            ...projectToEdit,
            id: projectToEdit?.id || `custom-${Date.now()}`,
            name,
            website: website || "https://",
            twitter: twitter || "https://x.com/",
            category: projectToEdit?.category || "My Project",
            logoColor,
            logoLetter,
        };

        if (logoUrl) {
            newProject.logo = logoUrl;
        } else {
            delete newProject.logo;
        }

        onSave(newProject);
    };

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
            onClick={onClose}
        >
            <div
                className="w-full max-w-4xl bg-white rounded-[24px] border-[3px] border-[#03594D] shadow-[8px_8px_0px_0px_#03594D] flex flex-col relative overflow-visible mt-6 sm:mt-0"
                onClick={(e) => e.stopPropagation()}
            >

                {projectToEdit && (
                    <div
                        className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#F9B44D] border-[3px] border-[#03594D] rounded-full px-5 py-1.5 flex items-center gap-2.5 shadow-[4px_4px_0px_0px_#03594D] z-20 whitespace-nowrap"
                    >
                        <Pencil className="w-4 h-4 text-[#03594D] stroke-[3px]" />
                        <span className="font-black text-[#03594D] uppercase text-sm tracking-wider" style={{ fontFamily: "'Chivo', sans-serif" }}>
                            Edit Mode
                        </span>
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white border-[2px] border-[#03594D] rounded-full shadow-[2px_2px_0px_0px_#03594D] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all z-10"
                >
                    <X className="w-5 h-5 text-[#03594D]" />
                </button>

                <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-12 sm:pt-10">

                    <div className="relative flex-shrink-0 group">
                        <button
                            onClick={() => setIsUrlInputOpen(true)}
                            title="Click to paste image URL"
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[3px] border-[#03594D] overflow-hidden flex items-center justify-center shadow-[4px_4px_0px_0px_#03594D] transition-all hover:scale-105 relative bg-[#A3FAFF]"
                            style={!logoUrl ? { backgroundColor: `hsl(${logoColor})` } : {}}
                        >
                            {logoUrl ? (
                                <img src={logoUrl} alt="Logo preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-white text-3xl font-black font-sans uppercase">
                                    {logoLetter}
                                </span>
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ImagePlus className="w-10 h-10 text-white" />
                            </div>
                        </button>

                        {isUrlInputOpen && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-20 flex items-center gap-1.5 p-1.5 bg-white border-[3px] border-[#03594D] rounded-full shadow-[4px_4px_0px_0px_#03594D] w-64">
                                <Link className="w-5 h-5 text-gray-400 ml-2" />
                                <input
                                    ref={urlInputRef}
                                    type="text"
                                    placeholder="Paste image URL..."
                                    value={tempUrl}
                                    onChange={(e) => setTempUrl(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleApplyLogoUrl()}
                                    className="w-full bg-transparent outline-none text-xs text-black font-semibold"
                                />
                                <button
                                    onClick={handleApplyLogoUrl}
                                    className="px-3 py-1 bg-[#85E5A6] border-[2px] border-[#03594D] rounded-full text-black font-black uppercase text-[10px]"
                                >
                                    OK
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col w-full gap-4 mt-2 sm:mt-0">
                        <input
                            type="text"
                            placeholder="PROJECT NAME..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="text-3xl sm:text-4xl font-black text-[#03594D] uppercase tracking-tighter bg-transparent outline-none placeholder:text-[#03594D]/30 transition-colors w-full"
                            style={{ fontFamily: "'Chivo', sans-serif" }}
                        />

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full mt-1">
                            <div className="flex items-center gap-2 w-full sm:w-1/2">
                                <ExternalLink className="w-5 h-5 text-black flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Website URL (https://...)"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    className="w-full text-black text-sm sm:text-base font-bold bg-transparent outline-none placeholder:text-gray-400 transition-colors leading-none pt-1"
                                />
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-1/2">
                                <svg className="w-5 h-5 text-black flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.965H5.078z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Twitter URL (https://x.com/...)"
                                    value={twitter}
                                    onChange={(e) => setTwitter(e.target.value)}
                                    className="w-full text-black text-sm sm:text-base font-bold bg-transparent outline-none placeholder:text-gray-400 transition-colors leading-none pt-1"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-b-[3px] border-[#03594D] w-full"></div>

                <div className="p-6 sm:p-8 bg-white rounded-b-[20px] flex justify-end">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-8 py-4 bg-[#F9B44D] border-[3px] border-[#03594D] rounded-xl text-[#03594D] font-black uppercase text-lg tracking-wider shadow-[4px_4px_0px_0px_#03594D] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                        style={{ fontFamily: "'Chivo', sans-serif" }}
                    >
                        <Save className="w-6 h-6 stroke-[3px]" />
                        {projectToEdit ? "SAVE CHANGES" : "SAVE PROJECT"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectFormModal;