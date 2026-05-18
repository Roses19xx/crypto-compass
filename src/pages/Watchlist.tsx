import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import ProjectFormModal from "@/components/ProjectFormModal";

const Watchlist = () => {
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<any>(null);

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  useEffect(() => {
    const savedProjects = localStorage.getItem("myWatchlist");
    if (savedProjects) {
      setMyProjects(JSON.parse(savedProjects));
    }
  }, []);

  const handleDelete = (project: any) => {
    if (window.confirm(`Are you sure you want to delete ${project.name}?`)) {
      const updatedList = myProjects.filter(p => p.id !== project.id);
      setMyProjects(updatedList);
      localStorage.setItem("myWatchlist", JSON.stringify(updatedList));
    }
  };

  const handleEdit = (project: any) => {
    setProjectToEdit(project);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setProjectToEdit(null);
  };

  const handleSaveProject = (savedProject: any) => {
    let updatedList;
    if (projectToEdit) {
      updatedList = myProjects.map(p => p.id === savedProject.id ? savedProject : p);
    } else {
      updatedList = [savedProject, ...myProjects];
    }
    setMyProjects(updatedList);
    localStorage.setItem("myWatchlist", JSON.stringify(updatedList));
    handleCloseForm();
  };

  const handleUpdateProjectDetails = (updatedProject: any) => {
    const updatedList = myProjects.map(p => p.id === updatedProject.id ? updatedProject : p);
    setMyProjects(updatedList);
    localStorage.setItem("myWatchlist", JSON.stringify(updatedList));
    if (selectedProject?.id === updatedProject.id) {
      setSelectedProject(updatedProject);
    }
  };

  const handleDrop = (e: React.DragEvent, targetProject: any) => {
    e.preventDefault();
    setDragOverId(null);
    setDraggedId(null);

    if (!draggedId || draggedId === targetProject.id) return;

    const draggedProject = myProjects.find(p => p.id === draggedId);
    if (!draggedProject) return;

    const targetTier = targetProject.tier || "S1";
    const filteredList = myProjects.filter(p => p.id !== draggedId);
    const targetIndex = filteredList.findIndex(p => p.id === targetProject.id);
    const updatedDraggedProject = { ...draggedProject, tier: targetTier };

    filteredList.splice(targetIndex, 0, updatedDraggedProject);

    setMyProjects(filteredList);
    localStorage.setItem("myWatchlist", JSON.stringify(filteredList));
  };

  const tierPriority: Record<string, number> = {
    "S+": 1,
    "S1": 2,
    "S2": 3,
    "S4": 4
  };

  const sortedProjects = [...myProjects].sort((a, b) => {
    const tierA = a.tier || "S1";
    const tierB = b.tier || "S1";
    const diff = (tierPriority[tierA] || 99) - (tierPriority[tierB] || 99);

    if (diff !== 0) return diff;
    return myProjects.indexOf(a) - myProjects.indexOf(b);
  });

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 0%, #232328 0%, #0a0a0c 60%, #000000 100%)',
        backgroundAttachment: 'fixed',
      }}
    >
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12 flex flex-col items-center w-full px-4 text-center">
          <h1
            className="text-[32px] sm:text-[50px] lg:text-[70px] font-black uppercase text-white leading-[1.1] tracking-tighter w-full mb-8"
            style={{ fontFamily: "'Chivo', sans-serif" }}
          >
            YOUR PERSONAL{" "}
            <span className="text-white/30">
              WATCHLIST.
            </span>
          </h1>

          <button
            onClick={() => {
              setProjectToEdit(null);
              setIsFormOpen(true);
            }}
            className="px-8 py-3 bg-white/[0.03] border border-white/10 hover:bg-white hover:text-black rounded-full text-white font-semibold uppercase text-sm tracking-[0.1em] transition-all duration-300 backdrop-blur-md shadow-lg"
          >
            + ADD PROJECT
          </button>
        </div>

        {myProjects.length > 0 ? (
          <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sortedProjects.map((project) => (
              <div
                key={project.id}
                draggable
                onDragStart={() => setDraggedId(project.id)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverId(project.id);
                }}
                onDragLeave={() => setDragOverId(null)}
                onDrop={(e) => handleDrop(e, project)}
                onDragEnd={() => {
                  setDraggedId(null);
                  setDragOverId(null);
                }}
                className={`flex flex-col h-full w-full transition-all duration-300 cursor-grab active:cursor-grabbing
                  ${draggedId === project.id ? 'opacity-40 scale-95' : ''} 
                  ${dragOverId === project.id && draggedId !== project.id ? 'scale-105 z-10' : ''}
                `}
              >
                <ProjectCard
                  project={project}
                  onClick={() => setSelectedProject(project)}
                  /* ВОТ ЭТИ ДВЕ СТРОЧКИ УБИРАЮТ ОШИБКУ TS2739 */
                  onAdd={(e) => e.stopPropagation()}
                  isAdded={true}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 w-full max-w-2xl mx-auto bg-white/[0.03] border border-white/5 backdrop-blur-md rounded-[32px] p-10 sm:p-16 text-center flex flex-col items-center shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-4" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
              Looks a bit empty
            </h2>
            <p className="text-[#8E8E93] font-medium max-w-md text-sm sm:text-base">
              Hit the button above to add your very first project.
            </p>
          </div>
        )}
      </main>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onUpdate={handleUpdateProjectDetails}
      />

      {isFormOpen && (
        <ProjectFormModal
          onClose={handleCloseForm}
          onSave={handleSaveProject}
          projectToEdit={projectToEdit}
        />
      )}

    </div>
  );
};

export default Watchlist;