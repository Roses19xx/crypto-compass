import { Twitter, Globe, Plus, Check } from "lucide-react";

interface ProjectCardProps {
  project: any;
  onClick: () => void;
  onAdd: (e: any) => void;
  isAdded: boolean;
}

const tierStyles: Record<string, string> = {
  "S+": "text-[#FFB800] drop-shadow-[0_0_8px_rgba(255,184,0,0.8)]",
  "1": "text-[#00FF66] drop-shadow-[0_0_8px_rgba(0,255,102,0.6)]",
  "2": "text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]",
  "3": "text-[#E4E4E7] drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]",
};

const ProjectCard = ({ project, onClick, onAdd, isAdded }: ProjectCardProps) => {
  const logoSource = project.logo_url || project.logoUrl || project.logo || project.image;
  const tier = project.tier || "3";

  return (
    <div
      onClick={onClick}
      className="
        group relative flex items-center justify-between p-5 
        bg-white/[0.02] border border-white/5 rounded-[24px] cursor-pointer 
        transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] 
        hover:-translate-y-1.5 
        hover:border-white/15 
        hover:bg-white/[0.05] 
        hover:shadow-[0_12px_40px_-10px_rgba(255,255,255,0.08)]
        overflow-hidden
      "
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* ЛОГОТИП */}
        <div
          className="w-14 h-14 rounded-[16px] flex items-center justify-center flex-shrink-0 overflow-hidden bg-white/5 border border-white/10"
          style={!logoSource ? { backgroundColor: `hsl(${project.logoColor || '0 0% 15%'})` } : {}}
        >
          {logoSource ? (
            <img src={logoSource} alt={project.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <span className="text-white/80 text-xl font-bold uppercase tracking-wider transition-transform duration-500 group-hover:scale-110">
              {project.logoLetter || project.name?.charAt(0)}
            </span>
          )}
        </div>

        {/* ИНФОРМАЦИЯ */}
        <div className="flex flex-col min-w-0 flex-1 h-14 justify-center py-0.5 gap-1.5">
          <h3 className="text-[17px] font-bold text-white truncate tracking-tight group-hover:text-white/90 transition-colors">
            {project.name}
          </h3>

          {/* ИКОНКИ ССЫЛОК */}
          <div className="flex flex-wrap items-center gap-2">
            {project.website && (
              <a href={project.website} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/40 hover:text-white transition-colors">
                <Globe className="w-3.5 h-3.5 flex-shrink-0" />
              </a>
            )}
            {project.twitter && (
              <a href={project.twitter} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/40 hover:text-white transition-colors">
                <Twitter className="w-3.5 h-3.5 flex-shrink-0" />
              </a>
            )}
            {project.discord && (
              <a href={project.discord} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/40 hover:text-white transition-colors">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" /></svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ПРАВАЯ ЧАСТЬ (Тир сверху, Кнопка снизу) */}
      {/* ИЗМЕНИЛ: items-end на items-center для идеального центрирования кнопки под тиром */}
      <div className="flex flex-col justify-between items-center h-14 flex-shrink-0 ml-4">

        {/* КИБЕР-ТИР */}
        <div className={`relative inline-flex items-center justify-center px-1.5 py-0.5 mt-[-2px] ${tierStyles[tier] || tierStyles["3"]}`}>
          <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t-[1.5px] border-l-[1.5px] border-current opacity-80" />
          <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-[1.5px] border-r-[1.5px] border-current opacity-80" />
          <span className="text-[10px] font-black tracking-widest uppercase leading-none mt-[1px]">
            {tier === "S+" ? "TIER S+" : `TIER ${tier}`}
          </span>
        </div>

        {/* КНОПКА ADD */}
        <button
          onClick={(e) => { e.stopPropagation(); onAdd(e); }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] ${isAdded ? "bg-[#32D74B]/20 text-[#32D74B]" : "bg-white/5 text-white/50 hover:bg-white/15 hover:text-white"}`}
        >
          {isAdded ? <Check className="w-4 h-4" strokeWidth={3} /> : <Plus className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;