import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { supabase } from "../supabase";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import AdminProjectForm from "../components/AdminProjectForm";
import Navbar from "../components/Navbar";

const CATEGORIES = ["Prediction Markets", "Perp", "Chains", "AI", "NFT", "DePIN", "SocialFi", "GameFi"];
const ALL_FILTERS = ["All", ...CATEGORIES];
const TIERS = ["All", "S+", "1", "2", "3"];

const Watchlist = () => {
  const [localProjects, setLocalProjects] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  const [activeFilter, setActiveFilter] = useState("All");
  const [activeTier, setActiveTier] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Вернули состояние для модалки

  const fetchUserWatchlist = async () => {
    const { data, error } = await supabase.from('user_watchlist').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setLocalProjects(data);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserWatchlist();
      }
    });
  }, []);

  const removeFromWatchlist = async (projectId: string) => {
    await supabase.from('user_watchlist').delete().eq('id', projectId);
    setLocalProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const handleUpdateProject = (updatedProject: any) => {
    setLocalProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
  };

  const tierPriority: Record<string, number> = { "S+": 1, "1": 2, "2": 3, "3": 4 };

  const filteredProjects = localProjects
    .filter(p => {
      const matchesCategory = activeFilter === "All" || p.category === activeFilter;
      const projectTier = p.tier || "3";
      const matchesTier = activeTier === "All" || projectTier === activeTier;
      const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesTier && matchesSearch;
    })
    .sort((a, b) => {
      const weightA = tierPriority[a.tier || "3"] || 99;
      const weightB = tierPriority[b.tier || "3"] || 99;
      return weightA - weightB;
    });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white" style={{ background: 'radial-gradient(circle at 50% 0%, #232328 0%, #0a0a0c 60%, #000000 100%)' }}>
        <Navbar />
        <div className="text-center bg-[#141416]/50 border border-white/5 p-10 rounded-[24px] backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-2">Sign in required</h2>
          <p className="text-white/40">Please sign in to view and manage your personal Watchlist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden text-white" style={{ background: 'radial-gradient(circle at 50% 0%, #232328 0%, #0a0a0c 60%, #000000 100%)', backgroundAttachment: 'fixed' }}>
      <Navbar />

      <div className="w-full pt-24 pb-20 px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="flex flex-col gap-5 mb-10 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search my watchlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-[44px] w-full bg-[#141416] border border-white/5 rounded-xl pl-11 pr-4 text-sm font-medium text-white placeholder-[#a1a1aa] outline-none focus:border-white/20 focus:bg-[#1a1a1e] transition-all shadow-sm"
              />
            </div>

            {/* ВЕРНУЛИ КНОПКУ ДОБАВЛЕНИЯ ЛИЧНОГО ПРОЕКТА */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="h-[44px] bg-[#32D74B]/10 hover:bg-[#32D74B]/20 border border-[#32D74B]/30 text-[#32D74B] px-6 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 whitespace-nowrap shadow-[0_0_15px_rgba(50,215,75,0.05)]"
            >
              <Plus className="w-4 h-4" /> Add Personal Project
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap items-center gap-2 lg:border-r lg:border-white/10 lg:pr-4">
              {ALL_FILTERS.map(filter => (
                <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${activeFilter === filter ? "bg-white text-black border-transparent shadow-[0_0_15px_rgba(255,255,255,0.15)]" : "bg-[#141416] border-white/5 text-[#a1a1aa] hover:text-white hover:bg-white/10 hover:border-white/10"}`}>
                  {filter}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1.5 bg-white/[0.02] p-1 rounded-[14px] border border-white/5">
              {TIERS.map(tier => (
                <button key={tier} onClick={() => setActiveTier(tier)} className={`px-3 py-1.5 rounded-[10px] text-[10px] font-black tracking-widest transition-all border ${activeTier === tier ? (tier === "S+" ? "bg-yellow-500 text-black border-transparent shadow-[0_0_10px_rgba(234,179,8,0.2)]" : "bg-white text-black border-transparent") : "text-white/30 border-transparent hover:text-white"}`}>
                  {tier === "All" ? "ALL TIERS" : `TIER ${tier}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6 pt-2">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
                onAdd={(e) => {
                  e.stopPropagation();
                  removeFromWatchlist(project.id);
                }}
                isAdded={true}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-white/5 rounded-[24px] bg-[#141416]/50 backdrop-blur-md">
            <h3 className="text-white/80 font-semibold mb-1">Your Watchlist is empty</h3>
            <p className="text-white/40 text-sm">Add projects from the Web3 Projects database or create your own!</p>
          </div>
        )}

        {/* ВЫЗЫВАЕМ ФОРМУ СОЗДАНИЯ С ПАРАМЕТРОМ isWatchlistMode */}
        {isAddModalOpen && (
          <AdminProjectForm
            isWatchlistMode={true}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={() => {
              setIsAddModalOpen(false);
              fetchUserWatchlist(); // Обновляем список после добавления
            }}
          />
        )}

        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            isWatchlistMode={true}
            onClose={() => setSelectedProject(null)}
            onUpdate={handleUpdateProject}
          />
        )}
      </div>
    </div>
  );
};

export default Watchlist;