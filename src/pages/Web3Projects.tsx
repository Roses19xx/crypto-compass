import ProjectModal from "@/components/ProjectModal";
import { useState, useEffect } from "react"; // <-- Добавили useEffect
import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";
import PaginationControls from "@/components/PaginationControls";
import { projects } from "@/data/projects";

const Web3Projects = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(15);
    const [selectedProject, setSelectedProject] = useState<any>(null);

    // Состояние, в котором мы храним ID добавленных проектов
    const [addedProjectIds, setAddedProjectIds] = useState<string[]>([]);

    // При загрузке страницы проверяем, что уже есть в Watchlist
    useEffect(() => {
        const savedProjects = localStorage.getItem("myWatchlist");
        if (savedProjects) {
            const parsed = JSON.parse(savedProjects);
            // Сохраняем только ID проектов, чтобы легко их проверять
            setAddedProjectIds(parsed.map((p: any) => p.id));
        }
    }, []);

    const totalPages = Math.ceil(projects.length / perPage);
    const paginated = projects.slice((currentPage - 1) * perPage, currentPage * perPage);

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

        // Мгновенно обновляем стейт, чтобы вместо плюсика появилась галочка
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
                <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {paginated.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            // Передаем пропс isAdded в карточку, если ID проекта есть в нашем списке
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
            </main>

            <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        </div>
    );
};

export default Web3Projects;