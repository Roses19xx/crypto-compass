import { ExternalLink, Twitter, Plus, Trash2, Pencil, Check } from "lucide-react";

interface ProjectCardProps {
  project: any;
  onClick: () => void;
  onEdit?: (project: any) => void;
  onDelete?: (project: any) => void;
  onAdd?: () => void;
  isAdded?: boolean;
}

const ProjectCard = ({ project, onClick, onEdit, onDelete, onAdd, isAdded }: ProjectCardProps) => {
  const isWatchlist = window.location.pathname.includes('watchlist');

  return (
    <div
      onClick={onClick}
      // ДОБАВЛЕНО flex-1 h-full w-full: заставляет карточку всегда заполнять 100% высоты
      className="group relative flex items-center h-full w-full p-4 sm:p-5 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl rounded-[20px] sm:rounded-[24px] transition-all duration-500 cursor-pointer overflow-hidden border border-white/[0.05] hover:border-white/[0.15] shadow-lg flex-1"
    >
      <div className="absolute top-0 -left-[150%] w-full h-full bg-gradient-to-r from-transparent via-white/[0.1] to-transparent transform -skew-x-12 group-hover:left-[150%] transition-all duration-[1.5s] ease-in-out pointer-events-none z-0"></div>

      {/* 1. АВАТАРКА */}
      <div
        className="relative z-10 w-12 h-12 sm:w-[60px] sm:h-[60px] rounded-[14px] flex items-center justify-center flex-shrink-0 overflow-hidden bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] transition-transform duration-500 group-hover:scale-105"
        style={!project.logo ? { backgroundColor: `hsl(${project.logoColor || '0 0% 15%'})` } : {}}
      >
        {project.logo ? (
          <img src={project.logo} alt={project.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-[#EBEBF5] text-lg sm:text-xl font-bold uppercase tracking-widest">
            {project.logoLetter || "??"}
          </span>
        )}
      </div>

      {/* 2. ИНФОРМАЦИЯ */}
      {/* ДОБАВЛЕНО min-w-0: не дает длинному тексту сломать ширину/высоту карточки */}
      <div className="relative z-10 flex flex-col justify-center ml-4 sm:ml-5 flex-grow overflow-hidden min-w-0">

        <div className="flex items-center gap-2 mb-1">
          {isWatchlist && project.tier ? (
            <span className="text-[10px] sm:text-[11px] font-medium text-[#8E8E93] uppercase tracking-wider">
              Tier {project.tier}
            </span>
          ) : project.category && (
            <span className="text-[10px] sm:text-[11px] font-medium text-[#8E8E93] uppercase tracking-wider">
              {project.category}
            </span>
          )}
        </div>

        <h3
          className="text-lg sm:text-xl font-semibold text-[#FFFFFF] tracking-tight truncate leading-tight mb-2"
          style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
        >
          {project.name}
        </h3>

        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href={project.twitter}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 text-[#8E8E93] hover:text-[#FFFFFF] transition-colors text-[11px] sm:text-xs font-medium"
          >
            <Twitter className="w-3.5 h-3.5" />
            <span>Twitter</span>
          </a>
          <a
            href={project.website}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 text-[#8E8E93] hover:text-[#FFFFFF] transition-colors text-[11px] sm:text-xs font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Website</span>
          </a>
        </div>
      </div>

      {/* 3. КНОПКИ ДЕЙСТВИЙ */}
      <div className="relative z-10 flex flex-col items-end justify-center gap-2 ml-3 flex-shrink-0">

        {!isWatchlist && (
          isAdded ? (
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-500"
              title="Added to Watchlist"
            >
              <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5px]" />
            </div>
          ) : (
            onAdd && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd();
                }}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white text-white hover:text-black transition-all duration-300 backdrop-blur-sm border border-white/10"
                title="Add to Watchlist"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2px]" />
              </button>
            )
          )
        )}

        {isWatchlist && onEdit && onDelete && (
          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(project); }}
              className="p-1.5 text-[#8E8E93] hover:text-[#FFFFFF] transition-colors"
            >
              <Pencil className="w-[16px] h-[16px]" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(project); }}
              className="p-1.5 text-[#8E8E93] hover:text-[#FF453A] transition-colors"
            >
              <Trash2 className="w-[16px] h-[16px]" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default ProjectCard;