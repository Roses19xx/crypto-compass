import { useState, useEffect } from "react";
import { Plus, Search, LayoutGrid, Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, Circle } from "lucide-react";
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Состояния для календаря
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const [currentDate, setCurrentDate] = useState(new Date());

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

  // --- ЛОГИКА КАЛЕНДАРЯ ---
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  // Собираем все задачи из всех проектов
  const allTasks = localProjects.flatMap(project =>
    (project.tasks || []).map((task: any) => ({
      ...task,
      projectName: project.name,
      projectId: project.id
    }))
  ).filter(t => t.date);

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    // ЖЕСТКО на английском
    const monthName = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    // Считаем дни (с понедельника)
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const daysArray = [];
    for (let i = 0; i < startDay; i++) daysArray.push(null);
    for (let i = 1; i <= daysInMonth; i++) daysArray.push(i);

    // Добавляем пустые ячейки в конец, чтобы сетка была ровной
    const totalCells = Math.ceil(daysArray.length / 7) * 7;
    while (daysArray.length < totalCells) daysArray.push(null);

    return (
      // ИЗМЕНЕНИЕ: Чуть более светлый фон (#161618), обводка 10% вместо 5% и более выраженная тень
      <div className="bg-[#161618] border border-white/10 rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] mt-4 animate-in fade-in zoom-in-95 duration-300">
        {/* Шапка календаря */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/[0.02]">
          {/* Шрифт в стиле Apple */}
          <h2
            className="text-2xl font-bold text-white tracking-tight"
            style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
          >
            {monthName}
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Дни недели */}
        {/* ИЗМЕНЕНИЕ: Заливка 3% и обводка 10% */}
        <div className="grid grid-cols-7 border-b border-white/10 bg-white/[0.03]">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-semibold text-white/50 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>

        {/* Сетка дней */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {daysArray.map((day, index) => {
            const dateString = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null;
            const dayTasks = dateString ? allTasks.filter(t => t.date === dateString) : [];
            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

            return (
              // ИЗМЕНЕНИЕ: Линии ячеек 10% (border-white/10), пустые ячейки bg-white/[0.02], наведение hover:bg-white/[0.05]
              <div key={index} className={`min-h-[120px] p-2 border-r border-b border-white/10 transition-colors ${!day ? 'bg-white/[0.02]' : 'hover:bg-white/[0.05]'} ${index % 7 === 6 ? 'border-r-0' : ''} ${index >= daysArray.length - 7 ? 'border-b-0' : ''}`}>
                {day && (
                  <div className="flex flex-col h-full">
                    {/* Номер дня */}
                    <div className="flex justify-end mb-2">
                      {/* ИЗМЕНЕНИЕ: Сегодняшний день светится чуть ярче */}
                      <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold ${isToday ? 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'text-white/70'}`}>
                        {day}
                      </span>
                    </div>

                    {/* Задачи на день */}
                    <div className="space-y-1.5 flex-grow">
                      {dayTasks.map((task, tIdx) => (
                        <div
                          key={tIdx}
                          // ИЗМЕНЕНИЕ: Карточки задач стали более контрастными
                          className={`group px-2 py-1.5 rounded-lg text-[11px] font-medium truncate flex items-center gap-1.5 cursor-pointer transition-all ${task.completed ? 'bg-white/5 text-white/30' : 'bg-white/10 border border-white/5 text-white hover:bg-white/20'}`}
                          onClick={() => setSelectedProject(localProjects.find(p => p.id === task.projectId))}
                        >
                          {task.completed ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 opacity-50" /> : <Circle className="w-3.5 h-3.5 shrink-0 opacity-50 group-hover:opacity-100" />}
                          <span className={`truncate ${task.completed ? 'line-through' : ''}`}>
                            <strong className="font-semibold opacity-70">{task.projectName}:</strong> {task.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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

      {/* ШИРИНА ЭКРАНА: ВЕРНУЛ ТВОЙ ОРИГИНАЛЬНЫЙ КОНТЕЙНЕР БЕЗ max-w */}
      <div className="w-full pt-24 pb-20 px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="flex flex-col gap-5 mb-6 w-full">

          {/* ВЕРХНЯЯ ПАНЕЛЬ: Переключатель рядом с поиском */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">

            {/* Группа 1: Поиск и Переключатель */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full flex-1">
              <div className="relative w-full sm:w-[320px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search my watchlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-[44px] w-full bg-[#141416] border border-white/5 rounded-xl pl-11 pr-4 text-sm font-medium text-white placeholder-[#a1a1aa] outline-none focus:border-white/20 focus:bg-[#1a1a1e] transition-all shadow-sm"
                />
              </div>

              {/* Переключатель Grid / Calendar ПРАВЕЕ ОТ ПОИСКА */}
              <div className="flex items-center bg-[#141416] p-1 rounded-xl border border-white/5 w-full sm:w-auto">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/80'}`}
                >
                  <LayoutGrid className="w-4 h-4" /> Grid
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${viewMode === 'calendar' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/80'}`}
                >
                  <CalendarIcon className="w-4 h-4" /> Calendar
                </button>
              </div>
            </div>

            {/* Группа 2: Кнопка Добавить */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="h-[44px] w-full sm:w-auto bg-[#32D74B]/10 hover:bg-[#32D74B]/20 border border-[#32D74B]/30 text-[#32D74B] px-6 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-[0_0_15px_rgba(50,215,75,0.05)]"
            >
              <Plus className="w-4 h-4" /> Add Personal Project
            </button>
          </div>

          {/* Фильтры показываем только в режиме сетки */}
          {viewMode === 'grid' && (
            <div className="flex flex-wrap items-center gap-4 animate-in fade-in duration-300">
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
          )}
        </div>

        {/* Отрисовка контента в зависимости от выбранного режима */}
        {viewMode === 'calendar' ? (
          renderCalendar()
        ) : (
          <>
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6 pt-2 animate-in fade-in duration-300">
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
              <div className="flex flex-col items-center justify-center py-20 text-center border border-white/5 rounded-[24px] bg-[#141416]/50 backdrop-blur-md animate-in fade-in duration-300">
                <h3 className="text-white/80 font-semibold mb-1">Your Watchlist is empty</h3>
                <p className="text-white/40 text-sm">Add projects from the Web3 Projects database or create your own!</p>
              </div>
            )}
          </>
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