import ProjectModal from "@/components/ProjectModal";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";
import PaginationControls from "@/components/PaginationControls";
import { supabase } from "../supabase"; // Подключаем базу
import { AdminProjectForm } from "../components/AdminProjectForm";

const Web3Projects = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(15);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [addedProjectIds, setAddedProjectIds] = useState<string[]>([]);

    // --- НОВЫЕ СОСТОЯНИЯ ДЛЯ БАЗЫ И АДМИНА ---
    const [dbProjects, setDbProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    // Функция загрузки проектов из базы
    const fetchProjects = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false }); // Новые сверху

        if (error) {
            console.error("Ошибка загрузки:", error);
        } else {
            setDbProjects(data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        // 1. Проверяем Watchlist
        const savedProjects = localStorage.getItem("myWatchlist");
        if (savedProjects) {
            const parsed = JSON.parse(savedProjects);
            setAddedProjectIds(parsed.map((p: any) => p.id));
        }

        // 2. Проверяем, админ ли это
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsAdmin(!!session);
        });

        // 3. Загружаем проектов из базы
        fetchProjects();
    }, []);

    // --- ОБНОВЛЕННАЯ ЛОГИКА ПАГИНАЦИИ ---
    // Используем dbProjects вместо жестко заданного projects
    const totalPages = Math.ceil(dbProjects.length / perPage);
    const paginated = dbProjects.slice((currentPage - 1) * perPage, currentPage * perPage);

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        setCurrentPage(1);
    };

    const handleAddToWatchlist = (project: any) => {
        const savedProjects = localStorage.getItem("myWatchlist");
        const currentWatchlist = savedProjects ? JSON.parse(savedProjects) : [];
        const isAlreadyAdded = currentWatchlist.some((p: any) => p.id === project.id);

        if (isAlreadyAdded) {
            alert(`Проект ${project.name} уже есть в вашем Watchlist!`);
            return;
        }

        const updatedWatchlist = [...currentWatchlist, project];
        localStorage.setItem("myWatchlist", JSON.stringify(updatedWatchlist));
        setAddedProjectIds((prev) => [...prev, project.id]);
        alert(`Супер! ${project.name} добавлен в ваш Watchlist.`);
    };

    return (
        <div
            className="min-h-screen relative"
            style={{
                background: 'radial-gradient(circle at 50% 0%, #232328 0%, #0a0a0c 60%, #000000 100%)',
                backgroundAttachment: 'fixed',
            }}
        >
            <Navbar />
            <main className="mx-auto max-w-7xl px-6 py-12">
                {/* КНОПКА АДМИНА */}
                {isAdmin && (
                    <div className="mb-8 flex justify-end">
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="bg-[#32D74B]/10 border border-[#32D74B]/30 hover:bg-[#32D74B]/20 text-[#32D74B] px-6 py-2.5 rounded-[14px] font-semibold transition-all flex items-center gap-2"
                        >
                            + Add Project
                        </button>
                    </div>
                )}

                {isLoading ? (
                    <div className="text-white/50 text-center py-20 text-lg font-medium animate-pulse">
                        Loading projects...
                    </div>
                ) : dbProjects.length === 0 ? (
                    <div className="text-white/30 text-center py-20 text-lg font-medium">
                        No projects added yet. Click "+ Add Project" to start!
                    </div>
                ) : (
                    <>
                        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {paginated.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    isAdded={addedProjectIds.includes(project.id)}
                                    onClick={() => setSelectedProject(project)}
                                    onAdd={() => handleAddToWatchlist(project)}
                                />
                            ))}
                        </div>

                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            perPage={perPage}
                            onPageChange={setCurrentPage}
                            onPerPageChange={handlePerPageChange}
                        />
                    </>
                )}
            </main>

            {/* Модалка для просмотра проекта */}
            <ProjectModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
                onUpdate={fetchProjects} // Обновляем список после редактирования/удаления
            />

            {/* ФОРМА АДМИНА */}
            {showAddForm && (
                <AdminProjectForm
                    onClose={() => setShowAddForm(false)}
                    onSuccess={() => {
                        setShowAddForm(false);
                        fetchProjects();
                    }}
                />
            )}
        </div>
    );
};

export default Web3Projects;