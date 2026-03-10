import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";
import PaginationControls from "@/components/PaginationControls";
import { projects } from "@/data/projects";

const Index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const totalPages = Math.ceil(projects.length / perPage);
  const paginated = projects.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Отслеживай<br />
            <span className="text-primary">лучшие дропы</span>
          </h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Находи перспективные крипто-проекты, следи за аирдропами и ретродропами в одном месте.
          </p>
        </div>

        {/* Cards */}
        <div className="mb-8 grid gap-4">
          {paginated.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Pagination */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          perPage={perPage}
          onPageChange={setCurrentPage}
          onPerPageChange={handlePerPageChange}
        />

        {/* Bottom placeholder */}
        <div className="mt-20 rounded-2xl border border-dashed py-16 text-center">
          <p className="text-sm text-muted-foreground">Секция в разработке</p>
        </div>
      </main>
    </div>
  );
};

export default Index;
