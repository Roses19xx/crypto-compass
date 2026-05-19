import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { Plus, Search, ChevronRight, ChevronLeft } from "lucide-react";
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

    // --- ЛОГИКА СТРАНИЧНОГО СЛАЙДЕРА ---
    const [page, setPage] = useState(0);
    const [direction, setDirection] = useState<"next" | "prev">("next");
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Адаптив: на ПК по 5 тегов, на планшетах 4, на мобилах 3
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setItemsPerPage(3);
            else if (window.innerWidth < 1024) setItemsPerPage(4);
            else setItemsPerPage(5);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const totalPages = Math.ceil(ALL_FILTERS.length / itemsPerPage);

    // Если при изменении размера экрана мы оказались на пустой странице - кидаем назад
    useEffect(() => {
        if (page >= totalPages) setPage(Math.max(0, totalPages - 1));
    }, [totalPages, page]);

    const handleNextPage = () => {
        setDirection("next");
        setPage(p => Math.min(totalPages - 1, p + 1));
    };

    const handlePrevPage = () => {
        setDirection("prev");
        setPage(p => Math.max(0, p - 1));
    };

    // Отрезаем ровно ту страницу (те 5 штук), которые нужно показать сейчас
    const currentTags = ALL_FILTERS.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

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

            <div className="max-w-6xl mx-auto pt-24 pb-20 px-6 sm:px-8 relative z-10">

                {/* БЛОК УПРАВЛЕНИЯ */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8 w-full">

                    {/* ЛЕВАЯ ЧАСТЬ: Страничный слайдер тегов */}
                    <div className="flex items-center gap-2 flex-shrink-0 max-w-full">

                        {page > 0 && (
                            <button
                                onClick={handlePrevPage}
                                className="h-[38px] w-[38px] flex items-center justify-center rounded-[12px] bg-[#141416] border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        )}

                        {/* Контейнер для анимации. Свойство key заставляет анимацию проигрываться заново при смене страницы */}
                        <div
                            key={page}
                            className="flex items-center gap-2"
                            style={{
                                animation: `${direction === "next" ? "slideInRight" : "slideInLeft"} 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards`
                            }}
                        >
                            {currentTags.map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-4 py-2.5 rounded-[12px] text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 border ${activeFilter === filter
                                            ? "bg-white text-black border-transparent shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                                            : "bg-[#141416] border-white/5 text-white/50 hover:text-white hover:bg-white/10"
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        {page < totalPages - 1 && (
                            <button
                                onClick={handleNextPage}
                                className="h-[38px] w-[38px] flex items-center justify-center rounded-[12px] bg-[#141416] border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* ПРАВАЯ ЧАСТЬ: Поиск и кнопка */}
                    <div className="flex items-center gap-3 flex-shrink-0 w-full lg:w-auto lg:ml-auto">
                        <div className="relative w-full lg:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#0a0a0c]/50 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium text-white placeholder-white/30 outline-none focus:border-white/20 focus:bg-white/5 transition-all backdrop-blur-sm"
                            />
                        </div>

                        {isAdmin && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-[#32D74B]/10 hover:bg-[#32D74B]/20 border border-[#32D74B]/30 text-[#32D74B] px-5 py-2.5 rounded-[12px] font-semibold text-sm transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                            >
                                <Plus className="w-4 h-4" /> Add Project
                            </button>
                        )}
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
                    <div className="flex flex-col items-center justify-center py-20 text-center border border-white/5 rounded-[24px] bg-white/[0.02] backdrop-blur-md">
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

                {/* CSS Анимации (работают идеально плавно) */}
                <style>{`
                    @keyframes slideInRight {
                        0% { opacity: 0; transform: translateX(20px); }
                        100% { opacity: 1; transform: translateX(0); }
                    }
                    @keyframes slideInLeft {
                        0% { opacity: 0; transform: translateX(-20px); }
                        100% { opacity: 1; transform: translateX(0); }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default Web3Projects;