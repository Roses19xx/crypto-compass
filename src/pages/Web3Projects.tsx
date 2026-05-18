import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { Plus, Search } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import AdminProjectForm from "../components/AdminProjectForm";
import ProjectModal from "../components/ProjectModal";
import Navbar from "../components/Navbar";

const CATEGORIES = ["Prediction Markets", "Perp", "Chains", "AI", "NFT", "DePIN", "SocialFi", "GameFi"];

const Web3Projects = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [activeFilter, setActiveFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [watchlist, setWatchlist] = useState<Set<string>>(new Set());

    const fetchProjects = async () => {
        const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (!error && data) setProjects(data);
    };

    useEffect(() => {
        fetchProjects();
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsAdmin(!!session);
        });
    }, []);

    const toggleWatchlist = (projectId: string) => {
        setWatchlist(prev => {
            const newSet = new Set(prev);
            if (newSet.has(projectId)) {
                newSet.delete(projectId);
            } else {
                newSet.add(projectId);
                alert("Project added to your Watchlist!");
            }
            return newSet;
        });
    };

    const filteredProjects = projects.filter(p => {
        const matchesCategory = activeFilter === "All" || p.category === activeFilter;
        const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        /* ТОТ САМЫЙ ОРИГИНАЛЬНЫЙ ФОН ИЗ WATCHLIST.TSX */
        <div
            className="min-h-screen relative overflow-hidden text-white"
            style={{
                background: 'radial-gradient(circle at 50% 0%, #232328 0%, #0a0a0c 60%, #000000 100%)',
                backgroundAttachment: 'fixed',
            }}
        >
            <Navbar />

            <div className="max-w-6xl mx-auto pt-32 pb-20 px-6 sm:px-8 relative z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Web3 Projects</h1>
                        <p className="text-white/50 text-sm">Explore, manage and track the best projects in the ecosystem.</p>
                    </div>

                    {isAdmin && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-[#32D74B]/10 hover:bg-[#32D74B]/20 border border-[#32D74B]/30 text-[#32D74B] px-5 py-2.5 rounded-[12px] font-semibold text-sm transition-all flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add Project
                        </button>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 custom-scrollbar">
                        <button
                            onClick={() => setActiveFilter("All")}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeFilter === "All"
                                    ? "bg-white/10 text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                                    : "bg-white/5 text-white/40 hover:text-white hover:bg-white/5 border border-white/5"
                                }`}
                        >
                            All
                        </button>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeFilter === cat
                                        ? "bg-white/10 text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                                        : "bg-white/5 text-white/40 hover:text-white hover:bg-white/5 border border-white/5"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full lg:w-72 flex-shrink-0">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium text-white placeholder-white/30 outline-none focus:border-white/20 focus:bg-white/10 transition-all"
                        />
                    </div>
                </div>

                {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onClick={() => setSelectedProject(project)}
                                onAdd={(e) => {
                                    e.stopPropagation();
                                    toggleWatchlist(project.id);
                                }}
                                isAdded={watchlist.has(project.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center border border-white/5 rounded-[24px] bg-white/[0.01]">
                        <Search className="w-8 h-8 text-white/20 mb-3" />
                        <h3 className="text-white/80 font-semibold mb-1">No projects found</h3>
                        <p className="text-white/40 text-sm">Try adjusting your filters or search query.</p>
                    </div>
                )}

                {isAddModalOpen && (
                    <AdminProjectForm
                        onClose={() => setIsAddModalOpen(false)}
                        onSuccess={() => {
                            setIsAddModalOpen(false);
                            fetchProjects();
                        }}
                    />
                )}

                {selectedProject && (
                    <ProjectModal
                        project={selectedProject}
                        onClose={() => setSelectedProject(null)}
                        onUpdate={(updatedProject) => {
                            setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
                            setSelectedProject(updatedProject);
                        }}
                    />
                )}

                <style>{`
                    .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.1); border-radius: 10px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(255, 255, 255, 0.2); }
                `}</style>
            </div>
        </div>
    );
};

export default Web3Projects;