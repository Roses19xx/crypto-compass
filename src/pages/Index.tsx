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
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ letterSpacing: '-0.03em' }}>
            <span style={{ color: '#659DBD', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>Следи за </span>
            <span
              className="inline-block"
              style={{
                color: '#bfa84f',
                textShadow: '0 0 10px rgba(191,168,79,0.3), 0 1px 2px rgba(0,0,0,0.12)',
              }}
            >
              Альфой
            </span>
            <br />
            <span style={{ color: '#659DBD', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>и будь </span>
            <span style={{ color: '#bfa84f', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>продуктивным</span>
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
