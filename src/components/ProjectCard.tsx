import { ExternalLink } from "lucide-react";
import type { CryptoProject } from "@/data/projects";

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface ProjectCardProps {
  project: CryptoProject;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="group flex flex-col items-center rounded-2xl border bg-card p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
      {/* Logo */}
      <div
        className="flex h-14 w-14 items-center justify-center rounded-xl text-sm font-bold mb-3"
        style={{
          background: `hsl(${project.logoColor} / 0.13)`,
          color: `hsl(${project.logoColor})`,
        }}
      >
        {project.logoLetter}
      </div>

      {/* Name */}
      <h3 className="text-sm font-semibold leading-tight text-center mb-1">{project.name}</h3>

      {/* Category */}
      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground mb-3">
        {project.category}
      </span>

      {/* Links */}
      <div className="flex flex-col items-center gap-1.5">
        <a
          href={project.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
          Сайт
        </a>
        <a
          href={project.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-foreground/70 hover:text-foreground transition-colors"
        >
          <XIcon />
          Twitter/X
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
