import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { Plus, Search } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import AdminProjectForm from "../components/AdminProjectForm";
import ProjectModal from "../components/ProjectModal";
import Navbar from "../components/Navbar";

const CATEGORIES = ["Prediction Markets", "Perp", "Chains", "AI", "NFT", "DePIN", "SocialFi", "GameFi"];
const ALL_FILTERS = ["All", ...CATEGORIES];

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
        <div
            className="min-h-screen relative overflow-hidden text-white"
            style={{
                background: 'radial-gradient(circle at 50% 0%, #232328 0%, #0a0a0c 60%, #000000 100%)',
                backgroundAttachment: 'fixed',
            }}
        >
            <Navbar />

            <div className="w-full pt-24 pb-20 px-6 sm:px-10 lg:px-16 relative z-10">
                {/* ДВУХУРОВНЕВЫЙ БЛОК УПРАВЛЕНИЯ */}
                <div className="flex flex-col gap-5 mb-10 w-full">

                    {/* 1 УРОВЕНЬ: Поиск и Кнопка */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                        <div className="relative w-full sm:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-[44px] w-full bg-[#141416] border border-white/5 rounded-xl pl-11 pr-4 text-sm font-medium text-white placeholder-[#a1a1aa] outline-none focus:border-white/20 focus:bg-[#1a1a1e] transition-all shadow-sm"
                            />
                        </div>

                        {isAdmin && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="h-[44px] bg-[#32D74B]/10 hover:bg-[#32D74B]/20 border border-[#32D74B]/30 text-[#32D74B] px-6 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 whitespace-nowrap shadow-[0_0_15px_rgba(50,215,75,0.05)]"
                            >
                                <Plus className="w-4 h-4" /> Add Project
                            </button>
                        )}
                    </div>

                    {/* 2 УРОВЕНЬ: Облако тегов (Flex Wrap) */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        {ALL_FILTERS.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${activeFilter === filter
                                    ? "bg-white text-black border-transparent shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                                    : "bg-[#141416] border-white/5 text-[#a1a1aa] hover:text-white hover:bg-white/10 hover:border-white/10"
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                </div>

                {/* СЕТКА ПРОЕКТОВ (Обновлено для адаптивности) */}
                {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
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
                    <div className="flex flex-col items-center justify-center py-20 text-center border border-white/5 rounded-[24px] bg-[#141416]/50 backdrop-blur-md">
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
            </div>
        </div>
    );
};

export default Web3Projects;