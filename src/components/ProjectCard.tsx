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
    <div className="group flex overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
      {/* Logo area — 30% */}
      <div
        className="flex w-[30%] shrink-0 items-center justify-center"
        style={{ background: `hsl(${project.logoColor} / 0.08)` }}
      >
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-bold"
          style={{
            background: `hsl(${project.logoColor} / 0.15)`,
            color: `hsl(${project.logoColor})`,
          }}
        >
          {project.logoLetter}
        </div>
      </div>

      {/* Info area — 70% */}
      <div className="flex flex-1 flex-col justify-center gap-2 px-5 py-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold leading-tight">{project.name}</h3>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {project.category}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-snug">{project.description}</p>
        <div className="flex items-center gap-3 pt-1">
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
    </div>
  );
};

export default ProjectCard;
