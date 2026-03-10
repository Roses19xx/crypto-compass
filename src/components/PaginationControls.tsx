import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

const perPageOptions = [10, 15, 25];

const PaginationControls = ({
  currentPage,
  totalPages,
  perPage,
  onPageChange,
  onPerPageChange,
}: PaginationControlsProps) => {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      {/* Per page */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Показывать:</span>
        {perPageOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => onPerPageChange(opt)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              perPage === opt
                ? "bg-foreground text-background"
                : "bg-secondary hover:bg-border"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Pages */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-full p-2 transition-colors hover:bg-secondary disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`h-8 w-8 rounded-full text-xs font-medium transition-colors ${
              currentPage === page
                ? "bg-foreground text-background"
                : "hover:bg-secondary"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-full p-2 transition-colors hover:bg-secondary disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
