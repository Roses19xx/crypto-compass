import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

const PaginationControls = ({
  currentPage,
  totalPages,
  perPage,
  onPageChange,
  onPerPageChange,
}: PaginationControlsProps) => {
  // Создаем массив номеров страниц (1, 2, 3...)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-10 w-full">

      {/* 1. Блок "Show: 10 15 25" */}
      <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 backdrop-blur-md px-5 py-2 rounded-full shadow-lg">
        <span className="text-[11px] sm:text-xs font-medium text-[#8E8E93] uppercase tracking-widest">
          Show:
        </span>
        <div className="flex items-center gap-1">
          {[10, 15, 25].map((num) => (
            <button
              key={num}
              onClick={() => onPerPageChange(num)}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${perPage === num
                  ? "bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                  : "text-[#8E8E93] hover:text-white hover:bg-white/10"
                }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Блок навигации по страницам (Скрываем, если страница всего 1) */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/5 backdrop-blur-md px-2 py-2 rounded-full shadow-lg">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#8E8E93] hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex items-center gap-1 px-2">
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${currentPage === page
                    ? "bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                    : "text-[#8E8E93] hover:text-white hover:bg-white/10"
                  }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#8E8E93] hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      )}

    </div>
  );
};

export default PaginationControls;